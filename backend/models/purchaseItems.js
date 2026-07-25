const mongoose = require('mongoose');

const purchaseItemSchema = new mongoose.Schema(
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

    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1']
    },

    buyingPrice: {
        type: Number,
        required: [true, 'Buying price is required'],
        min: [0, 'Buying price cannot be negative']
    },

    subtotal: {
        type: Number,
        required: true
    }

},
{
    timestamps: true
}
);


module.exports = mongoose.model('PurchaseItem', purchaseItemSchema);