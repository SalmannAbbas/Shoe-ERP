import { useState } from "react";

function AddProduct() {
    const [product, setProduct] = useState({
        name: "",
        brand: "",
        category: "Running",
        purchasePrice: "",
        sellingPrice: "",
        discount: 0,
    
    });

    const [variants, setVariants] = useState([
        {
            color: "",
            sizes: {
                39: 0,
                40: 0,
                41: 0,
                42: 0,
                43: 0
            }
        }
    ]);

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });
    };

    const updateColor = (index, color) => {
        const updated = [...variants];

        updated[index].color = color;

        setVariants(updated);
    };

    const updateSize = (variantIndex, size, value) => {
        const updated = [...variants];

        updated[variantIndex].sizes[size] = Number(value);

        setVariants(updated);
    };

    const addColor = () => {
        setVariants([
            ...variants,
            {
                color: "",
                sizes: {
                    39: 0,
                    40: 0,
                    41: 0,
                    42: 0,
                    43: 0
                }
            }
        ]);
    };

    const removeColor = (index) => {
        if (variants.length === 1) return;

        setVariants(
            variants.filter((_, i) => i !== index)
        );
    };

    const totalStock = variants.reduce(
        (total, variant) =>
            total +
            Object.values(variant.sizes).reduce(
                (sum, quantity) =>
                    sum + Number(quantity),
                0
            ),
        0
    );

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("Saving product...");

        try {
            const response = await fetch(
                "http://localhost:5000/api/products",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        ...product,
                        purchasePrice: Number(
                            product.purchasePrice
                        ),
                        sellingPrice: Number(
                            product.sellingPrice
                        ),
                        discount: Number(
                            product.discount
                        ),
                        variants
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to add product"
                );
            }

            setMessage(
                "✅ Product added successfully!"
            );

            setProduct({
                name: "",
                brand: "",
                category: "Running",
                purchasePrice: "",
                sellingPrice: "",
                discount: 0,
            
            });

            setVariants([
                {
                    color: "",
                    sizes: {
                        39: 0,
                        40: 0,
                        41: 0,
                        42: 0,
                        43: 0
                    }
                }
            ]);

        } catch (error) {
            console.error(error);

            setMessage(
                `❌ ${error.message}`
            );
        }
    };

    return (
        <div>

            <div className="page-header">
                <div>
                    <h1>Add Product</h1>
                    <p>
                        Add a shoe with multiple colours
                        and sizes.
                    </p>
                </div>
            </div>

            <form
                className="form-card"
                onSubmit={handleSubmit}
            >

                <div className="form-grid">

                    <div className="form-group">
                        <label>Product Name</label>

                        <input
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            placeholder="e.g. Nike Air Max"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Brand</label>

                        <input
                            name="brand"
                            value={product.brand}
                            onChange={handleChange}
                            placeholder="e.g. Nike"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>

                        <select
                            name="category"
                            value={product.category}
                            onChange={handleChange}
                        >
                            <option>Running</option>
                            <option>Casual</option>
                            <option>Formal</option>
                            <option>Sports</option>
                            <option>Sandals</option>
                            <option>Boots</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Purchase Price</label>

                        <input
                            name="purchasePrice"
                            type="number"
                            value={product.purchasePrice}
                            onChange={handleChange}
                            placeholder="Rs."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Selling Price</label>

                        <input
                            name="sellingPrice"
                            type="number"
                            value={product.sellingPrice}
                            onChange={handleChange}
                            placeholder="Rs."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Discount (%)</label>

                        <input
                            name="discount"
                            type="number"
                            min="0"
                            max="100"
                            value={product.discount}
                            onChange={handleChange}
                        />
                    </div>

                    

                </div>


                <div className="size-section">

                    <h2>Colours & Sizes</h2>

                    {variants.map(
                        (variant, variantIndex) => (

                            <div
                                key={variantIndex}
                                style={{
                                    marginBottom: "25px",
                                    padding: "20px",
                                    border: "1px solid #ddd",
                                    borderRadius: "10px"
                                }}
                            >

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent:
                                            "space-between",
                                        alignItems:
                                            "center"
                                    }}
                                >

                                    <div className="form-group">

                                        <label>
                                            Colour
                                        </label>

                                        <select
                                            value={
                                                variant.color
                                            }
                                            onChange={(e) =>
                                                updateColor(
                                                    variantIndex,
                                                    e.target.value
                                                )
                                            }
                                            required
                                        >

                                            <option value="">
                                                Select Colour
                                            </option>

                                            <option>
                                                Black
                                            </option>

                                            <option>
                                                White
                                            </option>

                                            <option>
                                                Red
                                            </option>

                                            <option>
                                                Blue
                                            </option>

                                            <option>
                                                Grey
                                            </option>

                                            <option>
                                                Brown
                                            </option>

                                            <option>
                                                Green
                                            </option>

                                            <option>
                                                Yellow
                                            </option>

                                        </select>

                                    </div>

                                    {variants.length > 1 && (
                                        <button
                                            type="button"
                                            className="secondary-btn"
                                            onClick={() =>
                                                removeColor(
                                                    variantIndex
                                                )
                                            }
                                        >
                                            Remove
                                        </button>
                                    )}

                                </div>


                                <div className="size-grid">

                                    {Object.keys(
                                        variant.sizes
                                    ).map((size) => (

                                        <div
                                            className="size-box"
                                            key={size}
                                        >

                                            <label>
                                                Size {size}
                                            </label>

                                            <input
                                                type="number"
                                                min="0"
                                                value={
                                                    variant
                                                        .sizes[
                                                        size
                                                    ]
                                                }
                                                onChange={(e) =>
                                                    updateSize(
                                                        variantIndex,
                                                        size,
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </div>

                                    ))}

                                </div>

                            </div>

                        )
                    )}

                    <button
                        type="button"
                        className="secondary-btn"
                        onClick={addColor}
                    >
                        + Add Another Colour
                    </button>

                    <p className="stock-total">
                        Total Stock:{" "}
                        <strong>
                            {totalStock} pairs
                        </strong>
                    </p>

                </div>


                {message && (
                    <p style={{ marginTop: "20px" }}>
                        {message}
                    </p>
                )}


                <div className="form-actions">

                    <button
                        type="button"
                        className="secondary-btn"
                        onClick={() =>
                            window.location.href =
                                "/inventory"
                        }
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="primary-btn"
                    >
                        Add Product
                    </button>

                </div>

            </form>

        </div>
    );
}

export default AddProduct;