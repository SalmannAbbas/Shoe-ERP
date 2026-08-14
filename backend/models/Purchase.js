const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier",
        required: true
    },
invoiceNumber: {
    type: String,
    default: ""
},
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
color: {
    type: String,
    required: true
},
            size: {
                type: String,
                required: true
            },

            quantity: {
                type: Number,
                required: true
            },

            purchasePrice: {
                type: Number,
                required: true
            }
        }
    ],

    totalAmount: {
        type: Number,
        required: true
    },

    amountPaid: {
        type: Number,
        default: 0
    },

    paymentMethod: {
        type: String,
        enum: ["Cash", "Bank", "Online", "Cheque"],
        default: "Cash"
    },

    remainingAmount: {
        type: Number,
        default: 0
    },

    purchaseDate: {
        type: Date,
        default: Date.now
    },

    notes: {
        type: String
    }
});

module.exports = mongoose.model("Purchase", purchaseSchema);