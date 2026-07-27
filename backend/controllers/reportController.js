const Sale = require('../models/sales');
const SaleItem = require('../models/salesItems');
const Inventory = require('../models/inventory');

const formatDateValue = (value) => {
  if (!value) {
    return null;
  }

  const candidate = new Date(value);
  if (Number.isNaN(candidate.getTime())) {
    return value;
  }

  const year = candidate.getFullYear();
  const month = `${candidate.getMonth() + 1}`.padStart(2, '0');
  const day = `${candidate.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const parseDateValue = (value) => {
  if (!value) {
    return null;
  }

  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const candidate = new Date(value);
  return Number.isNaN(candidate.getTime()) ? null : candidate;
};

const normalizeDateRange = (startDateValue, endDateValue) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  if (startDateValue) {
    const parsedStart = parseDateValue(startDateValue);
    if (parsedStart) {
      parsedStart.setHours(0, 0, 0, 0);
      start.setTime(parsedStart.getTime());
    }
  }

  if (endDateValue) {
    const parsedEnd = parseDateValue(endDateValue);
    if (parsedEnd) {
      parsedEnd.setHours(23, 59, 59, 999);
      end.setTime(parsedEnd.getTime());
    }
  }

  return {
    start,
    end
  };
};

exports.getSalesSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const { start, end } = normalizeDateRange(startDate, endDate);

    const [summary] = await Sale.aggregate([
      {
        $match: {
          createdAt: {
            $gte: start,
            $lte: end
          }
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: '$grandTotal' },
          totalTax: { $sum: '$tax' },
          totalDiscount: { $sum: '$discount' }
        }
      }
    ]);

    res.status(200).json({
      totalSales: summary?.totalSales ?? 0,
      totalRevenue: summary?.totalRevenue ?? 0,
      totalTax: summary?.totalTax ?? 0,
      totalDiscount: summary?.totalDiscount ?? 0,
      period: {
        startDate: formatDateValue(start),
        endDate: formatDateValue(end)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTopSellingProducts = async (req, res) => {
  try {
    const products = await SaleItem.aggregate([
      {
        $group: {
          _id: '$product',
          quantity: { $sum: '$quantity' },
          revenue: { $sum: '$subtotal' }
        }
      },
      {
        $sort: {
          quantity: -1,
          revenue: -1
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      {
        $unwind: '$productDetails'
      },
      {
        $project: {
          _id: 0,
          product: '$_id',
          name: '$productDetails.name',
          sku: '$productDetails.sku',
          unit: '$productDetails.unit',
          quantity: 1,
          revenue: 1
        }
      }
    ]);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getInventoryValuation = async (req, res) => {
  try {
    const [valuation] = await Inventory.aggregate([
      {
        $match: {
          status: 'Available'
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      {
        $unwind: '$productDetails'
      },
      {
        $group: {
          _id: null,
          totalUnits: { $sum: '$quantity' },
          totalAssetCost: {
            $sum: {
              $multiply: ['$quantity', '$productDetails.buyingPrice']
            }
          },
          totalRetailValue: {
            $sum: {
              $multiply: ['$quantity', '$productDetails.sellingPrice']
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalUnits: 1,
          totalAssetCost: 1,
          totalRetailValue: 1
        }
      }
    ]);

    res.status(200).json({
      totalUnits: valuation?.totalUnits ?? 0,
      totalAssetCost: valuation?.totalAssetCost ?? 0,
      totalRetailValue: valuation?.totalRetailValue ?? 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getDailySalesChart = async (req, res) => {
  try {
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const start = new Date(end);
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const chartData = await Sale.aggregate([
      {
        $match: {
          createdAt: {
            $gte: start,
            $lte: end
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          revenue: { $sum: '$grandTotal' },
          transactions: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          revenue: 1,
          transactions: 1
        }
      },
      {
        $sort: {
          date: 1
        }
      }
    ]);

    const byDate = new Map(chartData.map((entry) => [entry.date, entry]));
    const results = [];

    for (let index = 0; index < 7; index += 1) {
      const cursor = new Date(start);
      cursor.setDate(start.getDate() + index);
      const dateKey = `${cursor.getFullYear()}-${`${cursor.getMonth() + 1}`.padStart(2, '0')}-${`${cursor.getDate()}`.padStart(2, '0')}`;
      const existing = byDate.get(dateKey) || { revenue: 0, transactions: 0 };

      results.push({
        date: dateKey,
        revenue: existing.revenue,
        transactions: existing.transactions
      });
    }

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
