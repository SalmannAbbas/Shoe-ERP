const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        brand: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true
        },

        purchasePrice: {
            type: Number,
            required: true
        },

        sellingPrice: {
            type: Number,
            required: true
        },

        discount: {
            type: Number,
            default: 0
        },

        supplier: {
            type: String
        },

        variants: [
            {
                color: {
                    type: String,
                    required: true
                },

                sizes: {
                    type: Object,
                    default: {}
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Product", productSchema);