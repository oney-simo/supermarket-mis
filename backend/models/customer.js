const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true,
        minlength: [2, 'Customer name must be at least 2 characters']
    },

    phone: {
        type: String,
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

    customerType: {
        type: String,
        enum: [
            'Regular',
            'Wholesale'
        ],
        default: 'Regular'
    },

    status: {
        type: String,
        enum: [
            'Active',
            'Inactive'
        ],
        default: 'Active'
    }

},
{
    timestamps: true
}
);


module.exports = mongoose.model('Customer', customerSchema);