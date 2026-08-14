const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Product = require("./models/Product");
const Supplier = require("./models/Supplier");
const Purchase = require("./models/Purchase");
const Sale = require("./models/Sale");
const Expense = require("./models/Expense");
const Setting = require("./models/Setting");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });


// Home
app.get("/", (req, res) => {
    res.json({
        message: "Shoe ERP Backend is running!"
    });
});


// Add Product
app.post("/api/products", async (req, res) => {
    try {
        console.log("PRODUCT DATA RECEIVED:", req.body);

        const product = new Product({
            name: req.body.name,
            brand: req.body.brand,
            category: req.body.category,
            purchasePrice: Number(req.body.purchasePrice),
            sellingPrice: Number(req.body.sellingPrice),
            discount: Number(req.body.discount),
            supplier: req.body.supplier,
            variants: req.body.variants
        });

        const savedProduct = await product.save();

        res.status(201).json(savedProduct);

    } catch (error) {
        console.error("Product error:", error);

        res.status(500).json({
            message: "Failed to add product",
            error: error.message
        });
    }
});
app.delete("/api/products/:id", async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(
            req.params.id
        );

        if (!deletedProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json({
            message: "Product deleted successfully"
        });

    } catch (error) {
        console.error("Delete product error:", error);

        res.status(500).json({
            message: "Failed to delete product",
            error: error.message
        });
    }
});

// Get Products
app.get("/api/products", async (req, res) => {
    try {

        const products = await Product.find();

        res.json(products);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch products",
            error: error.message
        });

    }
});
app.put("/api/products/:id/discount", async (req, res) => {
    try {
        const { discount } = req.body;

        const product = await Product.findById(
            req.params.id
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        product.discount = Math.min(
            100,
            Math.max(0, Number(discount))
        );

        await product.save();

        res.json(product);

    } catch (error) {

        console.error(
            "Update discount error:",
            error
        );

        res.status(500).json({
            message: "Failed to update discount",
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 5000;
// Add Supplier
app.post("/api/suppliers", async (req, res) => {
    try {
        const supplier = new Supplier(req.body);

        const savedSupplier = await supplier.save();

        res.status(201).json(savedSupplier);

    } catch (error) {
        res.status(500).json({
            message: "Failed to add supplier",
            error: error.message
        });
    }
});


// Get Suppliers
app.get("/api/suppliers", async (req, res) => {
    try {
        const suppliers = await Supplier.find();

        res.json(suppliers);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch suppliers",
            error: error.message
        });
    }
});
// Update Supplier
app.put("/api/suppliers/:id", async (req, res) => {
    try {

        const supplier = await Supplier.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!supplier) {
            return res.status(404).json({
                message: "Supplier not found"
            });
        }

        res.json(supplier);

    } catch (error) {

        console.error("Update supplier error:", error);

        res.status(500).json({
            message: "Failed to update supplier",
            error: error.message
        });
    }
});


// Delete Supplier
app.delete("/api/suppliers/:id", async (req, res) => {
    try {

        const supplier = await Supplier.findByIdAndDelete(
            req.params.id
        );

        if (!supplier) {
            return res.status(404).json({
                message: "Supplier not found"
            });
        }

        res.json({
            message: "Supplier deleted successfully"
        });

    } catch (error) {

        console.error("Delete supplier error:", error);

        res.status(500).json({
            message: "Failed to delete supplier",
            error: error.message
        });
    }
});
app.get("/api/suppliers/summary", async (req, res) => {
    try {

        const suppliers = await Supplier.find();

        const purchases = await Purchase.find();

        const summary = suppliers.map((supplier) => {

            const supplierPurchases = purchases.filter(
                (purchase) =>
                    purchase.supplier?.toString() ===
                    supplier._id.toString()
            );

            const totalPurchases =
                supplierPurchases.reduce(
                    (total, purchase) =>
                        total +
                        Number(purchase.totalAmount || 0),
                    0
                );

            const totalPaid =
                supplierPurchases.reduce(
                    (total, purchase) =>
                        total +
                        Number(purchase.amountPaid || 0),
                    0
                );

            const remaining =
                supplierPurchases.reduce(
                    (total, purchase) =>
                        total +
                        Number(purchase.remainingAmount || 0),
                    0
                );

            return {
                ...supplier.toObject(),
                totalPurchases,
                totalPaid,
                remaining
            };
        });

        res.json(summary);

    } catch (error) {

        console.error(
            "Supplier summary error:",
            error
        );

        res.status(500).json({
            message: "Failed to load supplier summary",
            error: error.message
        });
    }
});
// Get all purchases/invoices for one supplier
app.get("/api/suppliers/:id/invoices", async (req, res) => {
    try {

        const purchases = await Purchase
            .find({
                supplier: req.params.id
            })
            .populate("supplier")
            .populate("items.product")
            .sort({ purchaseDate: -1 });

        res.json(purchases);

    } catch (error) {

        console.error(
            "Supplier invoices error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch supplier invoices",
            error: error.message
        });
    }
});
// Add Purchase
app.post("/api/purchases", async (req, res) => {
    try {
        const { supplier, items } = req.body;

        if (!supplier) {
            return res.status(400).json({
                message: "Supplier is required"
            });
        }

        if (!items || items.length === 0) {
            return res.status(400).json({
                message: "Purchase must contain at least one item"
            });
        }

        // Update inventory for every purchased item
        for (const item of items) {

            const product = await Product.findById(
                item.product
            );

            if (!product) {
                return res.status(404).json({
                    message:
                        "Product not found"
                });
            }

            // Find the correct colour
            const variant = product.variants.find(
                (variant) =>
                    variant.color === item.color
            );

            if (!variant) {
                return res.status(400).json({
                    message:
                        `Colour "${item.color}" does not exist for ${product.name}`
                });
            }

            // Make sure the size exists
            if (
                variant.sizes[item.size] === undefined
            ) {
                return res.status(400).json({
                    message:
                        `Size ${item.size} does not exist for ${item.color}`
                });
            }

            // Increase stock
            variant.sizes[item.size] =
                Number(variant.sizes[item.size]) +
                Number(item.quantity);
product.purchasePrice = Number(item.purchasePrice);
product.sellingPrice = Number(item.sellingPrice);
product.markModified("variants");
            await product.save();
        }

        // Save the purchase record
        const purchase = new Purchase(req.body);

        const savedPurchase =
            await purchase.save();

        res.status(201).json(savedPurchase);

    } catch (error) {

        console.error(
            "Purchase error:",
            error
        );

        res.status(500).json({
            message: "Failed to add purchase",
            error: error.message
        });
    }
});
app.delete("/api/purchases/:id", async (req, res) => {
    try {
        // Find the purchase
        const purchase = await Purchase.findById(
            req.params.id
        );

        if (!purchase) {
            return res.status(404).json({
                message: "Purchase not found"
            });
        }

        // Reverse the inventory changes
        for (const item of purchase.items) {

            const product = await Product.findById(
                item.product
            );

            if (product) {

            const variant = product.variants.find(
    (variant) =>
        variant.color.toLowerCase() ===
        item.color.toLowerCase()
);
                if (variant) {

                    const currentStock =
                        Number(
                            variant.sizes[item.size] || 0
                        );

                    const newStock =
                        currentStock -
                        Number(item.quantity);

                    // Don't allow negative stock
                    variant.sizes[item.size] =
                        Math.max(0, newStock);

                    product.markModified(
                        "variants"
                    );

                    await product.save();
                }
            }
        }

        // Delete the purchase history record
        await Purchase.findByIdAndDelete(
            req.params.id
        );

        res.json({
            message:
                "Purchase deleted and inventory updated"
        });

    } catch (error) {

        console.error(
            "Delete purchase error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to delete purchase",
            error: error.message
        });
    }
});
// Get Purchases
app.get("/api/purchases", async (req, res) => {
    try {
        const purchases = await Purchase
            .find()
            .populate("supplier")
            .populate("items.product");

        res.json(purchases);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch purchases",
            error: error.message
        });
    }
});
// Add Sale
app.post("/api/sales", async (req, res) => {
    try {

        const product = await Product.findById(req.body.product);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

      const variant = product.variants.find(
    (variant) =>
        variant.color.toLowerCase() ===
        req.body.color.toLowerCase()
);

if (!variant) {
    return res.status(400).json({
        message: "Colour not found"
    });
}

const currentStock =
    Number(variant.sizes[req.body.size] || 0);

if (currentStock < Number(req.body.quantity)) {
    return res.status(400).json({
        message: "Not enough stock"
    });
}

variant.sizes[req.body.size] =
    currentStock - Number(req.body.quantity);

product.markModified("variants");

await product.save();
        // Save the purchase price at the time of sale
        req.body.purchasePrice =
            Number(product.purchasePrice);

        // Create the sale AFTER setting purchasePrice
        const sale = new Sale(req.body);

        const savedSale = await sale.save();

        res.status(201).json(savedSale);

    } catch (error) {

        console.error("Add sale error:", error);

        res.status(500).json({
            message: "Failed to add sale",
            error: error.message
        });

    }
});

// Get Sales
app.get("/api/sales", async (req, res) => {
    try {

        const sales = await Sale
            .find()
            .populate("product");

        res.json(sales);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch sales",
            error: error.message
        });

    }
});
app.delete("/api/sales/:id", async (req, res) => {
    try {

        const sale = await Sale.findById(req.params.id);

        if (!sale) {
            return res.status(404).json({
                message: "Sale not found"
            });
        }

        const product = await Product.findById(sale.product);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const variant = product.variants.find(
            (variant) =>
                variant.color.toLowerCase() ===
                sale.color.toLowerCase()
        );

        if (!variant) {
            return res.status(400).json({
                message: "Colour not found in product"
            });
        }

        const currentStock =
            Number(variant.sizes[sale.size] || 0);

        variant.sizes[sale.size] =
            currentStock + Number(sale.quantity);

        product.markModified("variants");

        await product.save();

        await Sale.findByIdAndDelete(req.params.id);

        res.json({
            message: "Sale deleted and stock restored"
        });

    } catch (error) {

        console.error("Delete sale error:", error);

        res.status(500).json({
            message: "Failed to delete sale",
            error: error.message
        });

    }
});
// Get Expenses
app.get("/api/expenses", async (req, res) => {
    try {

        const expenses = await Expense
            .find()
            .sort({ expenseDate: -1 });

        res.json(expenses);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch expenses",
            error: error.message
        });

    }
});


// Add Expense
app.post("/api/expenses", async (req, res) => {
    try {

        const expense = new Expense(req.body);

        const savedExpense = await expense.save();

        res.status(201).json(savedExpense);

    } catch (error) {

        console.error("Add expense error:", error);

        res.status(500).json({
            message: "Failed to add expense",
            error: error.message
        });

    }
});
// Delete Expense
app.delete("/api/expenses/:id", async (req, res) => {
    try {

        const deletedExpense =
            await Expense.findByIdAndDelete(
                req.params.id
            );

        if (!deletedExpense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.json({
            message: "Expense deleted successfully"
        });

    } catch (error) {

        console.error(
            "Delete expense error:",
            error
        );

        res.status(500).json({
            message: "Failed to delete expense",
            error: error.message
        });

    }
});
// Get Settings
app.get("/api/settings", async (req, res) => {
    try {

        let settings = await Setting.findOne();

        if (!settings) {
            settings = await Setting.create({});
        }

        res.json(settings);

    } catch (error) {

        console.error("Get settings error:", error);

        res.status(500).json({
            message: "Failed to load settings",
            error: error.message
        });

    }
});


// Update Settings
app.put("/api/settings", async (req, res) => {
    try {

        let settings = await Setting.findOne();

        if (!settings) {
            settings = new Setting();
        }

        settings.shopName =
            req.body.shopName;

        settings.phone =
            req.body.phone;

        settings.address =
            req.body.address;

        settings.currency =
            req.body.currency;

        settings.defaultDiscount =
            Number(req.body.defaultDiscount || 0);

        settings.lowStockAlert =
            Number(req.body.lowStockAlert || 0);

        await settings.save();

        res.json(settings);

    } catch (error) {

        console.error("Update settings error:", error);

        res.status(500).json({
            message: "Failed to save settings",
            error: error.message
        });

    }
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});