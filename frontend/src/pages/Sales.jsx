import { useEffect, useState } from "react";

function Sales() {

    const [products, setProducts] = useState([]);
    const [sales, setSales] = useState([]);

    const [form, setForm] = useState({
        product: "",
        color: "",
        size: "39",
        quantity: 1,
        paymentMethod: "Cash",
    });

    const [message, setMessage] = useState("");

    const loadData = async () => {
        try {
            const [productsRes, salesRes] = await Promise.all([
                fetch("http://localhost:5000/api/products"),
                fetch("http://localhost:5000/api/sales")
            ]);

            const productsData = await productsRes.json();
            const salesData = await salesRes.json();

            setProducts(productsData);
            setSales(salesData);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
    const fetchData = async () => {
        await loadData();
    };

    fetchData();
}, []);
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "product") {
        setForm({
            ...form,
            product: value,
            color: "",
            size: "39"
        });
        return;
    }

    if (name === "color") {
        setForm({
            ...form,
            color: value,
            size: "39"
        });
        return;
    }

    setForm({
        ...form,
        [name]: value
    });
};

    const selectedProduct = products.find(
        (product) => product._id === form.product
    );

  const sellingPrice = selectedProduct
    ? Number(selectedProduct.sellingPrice)
    : 0;

const discount = selectedProduct
    ? Number(selectedProduct.discount || 0)
    : 0;

const finalPrice =
    sellingPrice -
    (sellingPrice * discount / 100);

const totalAmount =
    finalPrice * Number(form.quantity);
    const addSale = async (e) => {

        e.preventDefault();

        setMessage("Saving sale...");

        try {

            const response = await fetch(
                "http://localhost:5000/api/sales",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        product: form.product,
                        color: form.color,
                        size: form.size,
                        quantity: Number(form.quantity),
                        sellingPrice: finalPrice,
                        totalAmount,
                        paymentMethod: form.paymentMethod,
                        
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to add sale"
                );
            }

            setMessage("✅ Sale recorded successfully!");

           setForm({
    product: "",
    color: "",
    size: "39",
    quantity: 1,
    paymentMethod: "Cash"
});

            loadData();

        } catch (error) {

            console.error(error);

            setMessage(
                `❌ ${error.message}`
            );
        }
    };
const handleDeleteSale = async (id) => {
    const confirmed = window.confirm(
        "Are you sure you want to delete this sale?"
    );

    if (!confirmed) return;

    try {
        const response = await fetch(
            `http://localhost:5000/api/sales/${id}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to delete sale"
            );
        }

        setMessage("✅ Sale deleted and stock restored!");

        loadData();

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
                    <h1>Sales</h1>
                    <p>Record shoe sales.</p>
                </div>

            </div>


            <div className="form-card">

                <h2>New Sale</h2>

                <form onSubmit={addSale}>

                    <div className="form-grid">

                        <div className="form-group">

                            <label>Product</label>

                            <select
                                name="product"
                                value={form.product}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select Product
                                </option>

                                {products.map((product) => (
                                    <option
                                        key={product._id}
                                        value={product._id}
                                    >
                                        {product.name} - {product.brand}
                                    </option>
                                ))}

                            </select>

                        </div>

<div className="form-group">
    <label>Colour</label>

    <select
        name="color"
        value={form.color}
        onChange={handleChange}
        required
        disabled={!selectedProduct}
    >
        <option value="">Select Colour</option>

        {selectedProduct?.variants?.map((variant) => (
            <option
                key={variant.color}
                value={variant.color}
            >
                {variant.color}
            </option>
        ))}
    </select>
</div>
                       <div className="form-group">
    <label>Size</label>

    <select
        name="size"
        value={form.size}
        onChange={handleChange}
        required
        disabled={!form.color}
    >
        <option value="">Select Size</option>

        {selectedProduct?.variants
            ?.find(
                (variant) =>
                    variant.color === form.color
            )
            ?.sizes &&
            Object.keys(
                selectedProduct.variants.find(
                    (variant) =>
                        variant.color === form.color
                ).sizes
            ).map((size) => (
                <option
                    key={size}
                    value={size}
                >
                    Size {size}
                </option>
            ))}
    </select>
</div>


                        <div className="form-group">

                            <label>Quantity</label>

                            <input
                                type="number"
                                name="quantity"
                                min="1"
                                value={form.quantity}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">
    <label>Final Price / Pair</label>

    <input
        type="number"
        value={finalPrice}
        readOnly
    />
</div>


                        


                        <div className="form-group">

                            <label>Total Amount</label>

                            <input
                                type="number"
                                value={totalAmount}
                                readOnly
                            />

                        </div>


                        <div className="form-group">

                            <label>Payment Method</label>

                            <select
                                name="paymentMethod"
                                value={form.paymentMethod}
                                onChange={handleChange}
                            >
                                <option>Cash</option>
                                <option>Bank</option>
                                <option>Online</option>
                            </select>

                        </div>

                    </div>



                    {message && (
                        <p style={{ marginTop: "15px" }}>
                            {message}
                        </p>
                    )}


                    <button
                        type="submit"
                        className="primary-btn"
                    >
                        Record Sale
                    </button>

                </form>

            </div>


            <div className="purchase-card">

                <div className="table-header">
                    <h2>Sales History</h2>
                </div>

                {sales.length === 0 ? (

                    <p>No sales recorded yet.</p>

                ) : (

                    <table>

                        <thead>

                            <tr>
                                <th>Product</th>
                                <th>Size</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th>Payment</th>
                                <th>Action</th>
                            </tr>

                        </thead>

                        <tbody>

                            {sales.map((sale) => (

                                <tr key={sale._id}>

                                    <td>
                                        {sale.product?.name || "-"}
                                    </td>

                                    <td>
                                        {sale.size}
                                    </td>

                                    <td>
                                        {sale.quantity}
                                    </td>

                                    <td>
                                        Rs.{" "}
                                        {sale.totalAmount.toLocaleString()}
                                    </td>

                                    <td>
                                        {sale.paymentMethod}
                                    </td>
<td>
    <button
        className="secondary-btn"
        onClick={() => handleDeleteSale(sale._id)}
    >
        Delete
    </button>
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

export default Sales;