const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
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

    sellingPrice: {
        type: Number,
        required: true
    },
purchasePrice: {
    type: Number,
    required: true
},
    discount: {
        type: Number,
        default: 0
    },

    totalAmount: {
        type: Number,
        required: true
    },

    paymentMethod: {
        type: String,
        enum: ["Cash", "Bank", "Online"],
        default: "Cash"
    },

    saleDate: {
        type: Date,
        default: Date.now
    },

    notes: {
        type: String
    }
});

module.exports = mongoose.model("Sale", saleSchema);