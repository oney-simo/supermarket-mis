const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });

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

    console.log(JSON.stringify(stockSummary, null, 2));
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
