const Product = require('../models/Product');
const Supplier = require('../models/supplier');
const Sale = require('../models/sales');
const Purchase = require('../models/purchase');
const Inventory = require('../models/inventory');
const SaleItem = require('../models/salesItems');


const getStartOfDay = (date = new Date()) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
};

const getEndOfDay = (date = new Date()) => {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
};

exports.getDashboardSummary = async (req, res) => {
  try {
    const [productCount] = await Product.aggregate([
      {
        $count: 'count'
      }
    ]);

    const [supplierCount] = await Supplier.aggregate([
      {
        $count: 'count'
      }
    ]);

    const [customerCount] = await Sale.aggregate([
      {
        $match: {
          customerName: {
            $ne: 'Walk-in Customer'
          }
        }
      },
      {
        $group: {
          _id: '$customerName'
        }
      },
      {
        $count: 'count'
      }
    ]);

    const today = new Date();

    const [salesSummary] = await Sale.aggregate([
      {
        $match: {
          createdAt: {
            $gte: getStartOfDay(today),
            $lte: getEndOfDay(today)
          }
        }
      },
      {
        $group: {
          _id: null,
          salesCount: { $sum: 1 },
          revenue: { $sum: '$grandTotal' }
        }
      }
    ]);

    const stockSummary = await Product.aggregate([
      {
        $lookup: {
          from: 'inventories',
          let: { productId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$product', '$$productId'] },
                    { $eq: ['$status', 'Available'] }
                  ]
                }
              }
            },
            {
              $group: {
                _id: null,
                totalQuantity: { $sum: '$quantity' }
              }
            }
          ],
          as: 'inventorySummary'
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          sku: 1,
          reorderLevel: 1,
          stockQuantity: {
            $ifNull: [{ $arrayElemAt: ['$inventorySummary.totalQuantity', 0] }, 0]
          }
        }
      }
    ]);

    const lowStockProducts = stockSummary.filter((product) => {
      const reorderLevel = product.reorderLevel ?? 0;
      return product.stockQuantity > 0 && product.stockQuantity <= reorderLevel;
    });

    const outOfStockProducts = stockSummary.filter((product) => product.stockQuantity === 0);

    res.status(200).json({
      totalProducts: productCount?.count ?? 0,
      totalSuppliers: supplierCount?.count ?? 0,
      totalCustomers: customerCount?.count ?? 0,
      todaySalesCount: salesSummary?.salesCount ?? 0,
      todayRevenue: salesSummary?.revenue ?? 0,
      lowStockProducts,
      outOfStockProducts
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getRecentSales = async (req, res) => {
  try {
    const recentSales = await Sale.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select(
        '-_id receiptNumber customerName grandTotal paymentMethod paymentStatus createdAt'
);
      

    res.status(200).json({
      success: true,
      message: 'Recent sales retrieved successfully',
      data: recentSales
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve recent sales',
      error: error.message
    });
  }
};
exports.getRecentPurchases = async (req, res) => {
  try {
    const recentPurchases = await Purchase.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('supplier', 'name -_id')
      .select(
        '-_id invoiceNumber supplier totalAmount status paymentStatus purchaseDate createdAt'
      );

    res.status(200).json({
      success: true,
      message: 'Recent purchases retrieved successfully',
      data: recentPurchases
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve recent purchases',
      error: error.message
    });
  }
};
exports.getDashboardAlerts = async (req, res) => {
  try {
    const stockSummary = await Product.aggregate([
      {
        $lookup: {
          from: 'inventories',
          let: { productId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$product', '$$productId'] },
                    { $eq: ['$status', 'Available'] }
                  ]
                }
              }
            },
            {
              $group: {
                _id: null,
                totalQuantity: { $sum: '$quantity' }
              }
            }
          ],
          as: 'inventorySummary'
        }
      },
      {
        $project: {
          _id: 0,
          name: 1,
          sku: 1,
          reorderLevel: 1,
          stockQuantity: {
            $ifNull: [
              { $arrayElemAt: ['$inventorySummary.totalQuantity', 0] },
              0
            ]
          }
        }
      }
    ]);

    const lowStockProducts = stockSummary.filter((product) => {
      return (
        product.stockQuantity > 0 &&
        product.stockQuantity <= product.reorderLevel
      );
    });

    const outOfStockProducts = stockSummary.filter((product) => {
      return product.stockQuantity === 0;
    });

    res.status(200).json({
      success: true,
      message: 'Dashboard alerts retrieved successfully',
      data: {
        lowStockProducts,
        outOfStockProducts
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard alerts',
      error: error.message
    });
  }
};

exports.getSalesChart = async (req, res) => {
  try {
    const salesChart = await Sale.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          sales: {
  $sum: 1
},
revenue: {
  $sum: '$grandTotal'
}
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      }
    ]);

    const formattedData = salesChart.map((item) => {
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ];

      return {
        month: months[item._id.month - 1],
        sales: item.sales,
        revenue: item.revenue
      };
    });

    res.status(200).json({
      success: true,
      message: 'Sales chart data retrieved successfully',
      data: formattedData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve sales chart data',
      error: error.message
    });
  }
};

exports.getTopProducts = async (req, res) => {
  try {
    const topProducts = await SaleItem.aggregate([
      {
        $group: {
          _id: '$product',
          totalSold: {
            $sum: '$quantity'
          },
          revenue: {
            $sum: '$subtotal'
          }
        }
      },
      {
        $sort: {
          totalSold: -1
        }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: '$product'
      },
      {
        $project: {
          _id: 0,
          product: '$product.name',
          sku: '$product.sku',
          totalSold: 1,
          revenue: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      message: 'Top products retrieved successfully',
      data: topProducts
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve top products',
      error: error.message
    });
  }
};

exports.getPaymentSummary = async (req, res) => {
  try {
    const paymentSummary = await Sale.aggregate([
      {
        $group: {
          _id: '$paymentMethod',
          totalSales: {
            $sum: 1
          },
          revenue: {
            $sum: '$grandTotal'
          }
        }
      },
      {
        $project: {
          _id: 0,
          paymentMethod: '$_id',
          totalSales: 1,
          revenue: 1
        }
      },
      {
        $sort: {
          revenue: -1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      message: 'Payment summary retrieved successfully',
      data: paymentSummary
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve payment summary',
      error: error.message
    });
  }
};

exports.getSalesPerformance = async (req, res) => {
  try {

    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );


    const [todaySales] = await Sale.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfToday
          }
        }
      },
      {
        $group: {
          _id: null,
          sales: {
            $sum: 1
          },
          revenue: {
            $sum: '$grandTotal'
          }
        }
      }
    ]);


    const [weekSales] = await Sale.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfWeek
          }
        }
      },
      {
        $group: {
          _id: null,
          sales: {
            $sum: 1
          },
          revenue: {
            $sum: '$grandTotal'
          }
        }
      }
    ]);


    const [monthSales] = await Sale.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth
          }
        }
      },
      {
        $group: {
          _id: null,
          sales: {
            $sum: 1
          },
          revenue: {
            $sum: '$grandTotal'
          }
        }
      }
    ]);


    res.status(200).json({
      success: true,
      message: 'Sales performance retrieved successfully',
    data: {
  today: {
    sales: todaySales?.sales || 0,
    revenue: todaySales?.revenue || 0
  },

  thisWeek: {
    sales: weekSales?.sales || 0,
    revenue: weekSales?.revenue || 0
  },

  thisMonth: {
    sales: monthSales?.sales || 0,
    revenue: monthSales?.revenue || 0
  }
    }});


  } catch (error) {

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve sales performance',
      error: error.message
    });

  }
};

