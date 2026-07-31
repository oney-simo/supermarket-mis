const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    // 1. Business Information
    businessName: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
      minlength: [2, 'Business name must be at least 2 characters']
    },
    logo: {
      type: String,
      trim: true,
      default: ''
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
    },
    address: {
      type: String,
      required: [true, 'Business address is required'],
      trim: true,
      minlength: [5, 'Business address must be at least 5 characters']
    },

    // 2. Receipt Settings
    receiptHeader: {
      type: String,
      trim: true,
      default: ''
    },
    receiptFooter: {
      type: String,
      trim: true,
      default: ''
    },

    // 3. Tax & Currency
    currencySymbol: {
      type: String,
      trim: true,
      default: 'TZS'
    },
    taxRate: {
      type: Number,
      default: 0
    },

    // 4. Inventory Settings
    lowStockThreshold: {
      type: Number,
      default: 5
    },
    allowNegativeStock: {
      type: Boolean,
      default: false
    },

    // 5. Sales Settings
    enableDiscount: {
      type: Boolean,
      default: true
    },
    maxDiscountPercent: {
      type: Number,
      default: 100
    },

    // 6. User & Security
    sessionTimeoutMinutes: {
      type: Number,
      default: 60
    },
    requireAdminForVoid: {
      type: Boolean,
      default: true
    },

    // 7. Backup & Restore
    autoBackupFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'disabled'],
      default: 'disabled'
    },

    // 8. Notifications
    enableEmailAlerts: {
      type: Boolean,
      default: false
    },
    notificationEmail: {
      type: String,
      trim: true,
      default: ''
    },

    // 9. Activity Log Settings
    logRetentionDays: {
      type: Number,
      default: 30
    },

    // 10. Appearance
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'light'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Settings', settingsSchema);