const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
    shopName: {
        type: String,
        default: "Shoe Shop"
    },

    phone: {
        type: String,
        default: ""
    },

    address: {
        type: String,
        default: ""
    },

    currency: {
        type: String,
        default: "PKR"
    },

    defaultDiscount: {
        type: Number,
        default: 0
    },

    lowStockAlert: {
        type: Number,
        default: 10
    }
});

module.exports = mongoose.model("Setting", settingSchema);