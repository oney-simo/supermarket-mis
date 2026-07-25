const mongoose = require('mongoose');

const stockReceivingSchema = new mongoose.Schema(
{
    purchase: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Purchase',
        required: true
    },

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },

    quantityReceived: {
        type: Number,
        required: [true, 'Quantity received is required'],
        min: [1, 'Quantity must be at least 1']
    },

    batchNumber: {
        type: String,
        required: [true, 'Batch number is required'],
        trim: true
    },

    manufacturingDate: {
        type: Date
    },

    expiryDate: {
        type: Date
    },

    receivedDate: {
        type: Date,
        default: Date.now
    },

    condition: {
        type: String,
        enum: [
            'Good',
            'Damaged'
        ],
        default: 'Good'
    }

},
{
    timestamps: true
}
);


module.exports = mongoose.model('StockReceiving', stockReceivingSchema);