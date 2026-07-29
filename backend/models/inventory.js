const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
{
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },

    batchNumber: {
        type: String,
        required: [true, 'Batch number is required'],
        trim: true
    },

    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0, 'Quantity cannot be negative'],
        default: 0
    },

    manufacturingDate: {
        type: Date
    },

    expiryDate: {
        type: Date,
        validate: {
            validator: function(value) {
                if (!value) return true;
                return !this.manufacturingDate || value > this.manufacturingDate;
            },
            message: 'Expiry date must be after manufacturing date'
        }
    },

    receivedDate: {
        type: Date,
        default: Date.now
    },

    status: {
        type: String,
        enum: [
            'Available',
            'Expired',
            'Damaged',
            'Removed',
            'Reserved'
        ],
        default: 'Available'
    }

},
{
    timestamps: true
}
);


module.exports = mongoose.model('Inventory', inventorySchema);