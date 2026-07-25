const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [2, 'Product name must be at least 2 characters long']
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      trim: true,
      uppercase: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    buyingPrice: {
      type: Number,
      required: [true, 'Buying price is required'],
      min: [0, 'Buying price cannot be negative']
    },
    sellingPrice: {
      type: Number,
      required: [true, 'Selling price is required'],
      min: [0, 'Selling price cannot be negative'],
      validate: {
        validator: function (value) {
          return value >= (this.buyingPrice ?? 0);
        },
        message: 'Selling price must be greater than or equal to buying price'
      }
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100']
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    stockQuantity: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock quantity cannot be negative'],
      default: 0
    },
    reorderLevel: {
      type: Number,
      default: 10,
      min: [0, 'Reorder level cannot be negative']
    },
    manufacturingDate: {
      type: Date,
      validate: {
        validator: function (value) {
          if (!value) return true;
          return !this.expiryDate || value < this.expiryDate;
        },
        message: 'Manufacturing date must be before expiry date'
      }
    },
    expiryDate: {
      type: Date,
      validate: {
        validator: function (value) {
          if (!value) return true;
          return !this.manufacturingDate || value > this.manufacturingDate;
        },
        message: 'Expiry date must be after manufacturing date'
      }
    },
    status: {
      type: String,
      enum: {
        values: ['Active', 'Inactive', 'Discontinued'],
        message: '{VALUE} is not a valid status'
      },
      default: 'Active'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);
