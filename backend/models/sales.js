const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema(
  {
    receiptNumber: {
      type: String,
      required: [true, 'Receipt number is required'],
      unique: true,
      trim: true,
      uppercase: true
    },
    customerName: {
      type: String,
      trim: true,
      default: 'Walk-in Customer'
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative']
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative']
    },
    tax: {
      type: Number,
      default: 0,
      min: [0, 'Tax cannot be negative']
    },
    grandTotal: {
      type: Number,
      required: [true, 'Grand total is required'],
      min: [0, 'Grand total cannot be negative']
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ['Cash', 'Card', 'Mobile Money'],
        message: '{VALUE} is not a valid payment method'
      },
      default: 'Cash'
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Cancelled'],
      default: 'Paid'
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Sale', saleSchema);