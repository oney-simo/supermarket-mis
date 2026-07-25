const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema(
{
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
    },

    invoiceNumber: {
        type: String,
        required: [true, 'Invoice number is required'],
        unique: true,
        trim: true
    },

    purchaseDate: {
        type: Date,
        default: Date.now
    },

    totalAmount: {
        type: Number,
        required: [true, 'Total amount is required'],
        min: [0, 'Amount cannot be negative']
    },

    status: {
        type: String,
        enum: [
            'Pending',
            'Received',
            'Completed',
            'Cancelled'
        ],
        default: 'Pending'
    },

    paymentStatus: {
        type: String,
        enum: [
            'Paid',
            'Partial',
            'Unpaid'
        ],
        default: 'Unpaid'
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

module.exports = mongoose.model('Purchase', purchaseSchema);