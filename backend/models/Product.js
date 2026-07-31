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
barcode: {
  type: String,
  unique: true,
  sparse: true,
  trim: true,
  default: undefined
},
    category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
},

unit: {
  type: String,
  enum: [
    'Piece',
    'Bottle',
    'Packet',
    'Can',
    'Box',
    'Carton',
    'Kg',
    'Gram',
    'Litre',
    'Millilitre',
    'Dozen'
  ],
  default: 'Piece'
},

supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
},

    description: {
      type: String,
      trim: true,
      default: ''
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
    
    
    reorderLevel: {
      type: Number,
      default: 10,
      min: [0, 'Reorder level cannot be negative']
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: [0, 'Low stock threshold cannot be negative']
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
