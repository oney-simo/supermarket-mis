const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Supplier name is required'],
      trim: true,
      minlength: [2, 'Supplier name must be at least 2 characters']
    },

    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },

    email: {
      type: String,
      trim: true,
      lowercase: true
    },

    address: {
      type: String,
      trim: true,
      default: ''
    },

    companyName: {
      type: String,
      trim: true
    },

    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Supplier', supplierSchema);