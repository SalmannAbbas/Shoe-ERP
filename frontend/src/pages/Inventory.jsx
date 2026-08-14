import { useEffect, useState } from "react";

function Inventory() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
const [discounts, setDiscounts] = useState({});
    useEffect(() => {
        fetch("http://localhost:5000/api/products")
            .then((response) => response.json())
            .then((data) => {
                setProducts(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, []);
const handleDelete = async (id) => {

    const confirmed = window.confirm(
        "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {

        const response = await fetch(
            `http://localhost:5000/api/products/${id}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to delete product"
            );
        }

        // Remove it from the current page immediately
        setProducts((prevProducts) =>
            prevProducts.filter(
                (product) => product._id !== id
            )
        );

    } catch (error) {

        console.error(error);

        alert(
            "Failed to delete product: " +
            error.message
        );
    }
};

const updateDiscount = async (id, value) => {
    const discount = Math.min(
        100,
        Math.max(0, Number(value))
    );

    setDiscounts((prev) => ({
        ...prev,
        [id]: discount
    }));

    try {
        const response = await fetch(
            `http://localhost:5000/api/products/${id}/discount`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    discount
                })
            }
        );

        if (!response.ok) {
            throw new Error(
                "Failed to save discount"
            );
        }

    } catch (error) {
        console.error(error);

        alert(
            "Discount changed on screen but failed to save."
        );
    }
};
    if (loading) {
        return <h2>Loading inventory...</h2>;
    }

    return (
        <div>

            <div className="page-header">

                <div>
                    <h1>Inventory</h1>
                    <p>Manage your shoe stock.</p>
                </div>

                <button
                    className="primary-btn"
                    onClick={() =>
                        window.location.href = "/add-product"
                    }
                >
                    + Add Product
                </button>

            </div>


            <div className="purchase-card">

                <div className="table-header">
                    <h2>Products</h2>
                </div>

                {products.length === 0 ? (

                    <p>No products in inventory yet.</p>

                ) : (

                    <table>

                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Brand</th>
                                <th>Category</th>
                            
                                <th>Purchase Price</th>
                                <th>Selling Price</th>
                                <th>Discount</th>
                                <th>Final Price</th>
                                <th>Colour / Size / Stock</th>
                            </tr>
                        </thead>

                        <tbody>

                            {products.map((product) => (

                                <tr key={product._id}>

                                    <td>{product.name}</td>

                                    <td>{product.brand}</td>

                                    <td>{product.category}</td>

                                

                                    <td>
                                        Rs.{" "}
                                        {product.purchasePrice.toLocaleString()}
                                    </td>

                                    <td>
                                        Rs.{" "}
                                        {product.sellingPrice.toLocaleString()}
                                    </td>

                                   <td>
    <input
        type="number"
        min="0"
        max="100"
        value={
            discounts[product._id] ??
            product.discount ??
            0
        }
        onChange={(e) =>
            updateDiscount(
                product._id,
                e.target.value
            )
        }
        style={{
            width: "70px"
        }}
    />

    <span style={{ marginLeft: "5px" }}>
        %
    </span>

</td>
<td>
    Rs.{" "}
    {(
        Number(product.sellingPrice) *
        (
            1 -
            (
                Number(
                    discounts[product._id] ??
                    product.discount ??
                    0
                ) / 100
            )
        )
    ).toLocaleString()}
</td>
                               <td>
    <strong>
        {product.variants?.reduce(
            (total, variant) =>
                total +
                Object.values(variant.sizes || {}).reduce(
                    (sum, quantity) =>
                        sum + Number(quantity),
                    0
                ),
            0
        )} pairs
    </strong>
<div style={{ marginLeft: "200px" }}>
    <button
        className="secondary-btn"
        onClick={() => handleDelete(product._id)}
    >
        Delete
    </button>
</div>
    <div style={{ marginTop: "10px" }}>

        {product.variants?.map((variant, index) => (

            <div
                key={index}
                style={{ marginBottom: "10px" }}
            >

                <strong>
                    {variant.color}
                </strong>

                {Object.entries(
                    variant.sizes || {}
                ).map(([size, quantity]) => (

                    <div key={size}>
                        Size {size}: {quantity}
                    </div>

                ))}

            </div>

        ))}

    </div>
</td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                )}

            </div>

        </div>
    );
    
}

export default Inventory;