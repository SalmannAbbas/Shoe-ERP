import { useEffect, useState } from "react";

function Purchases() {

    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [selectedPurchase, setSelectedPurchase] = useState(null);

    const [form, setForm] = useState({
        supplier: "",
        invoiceNumber: "",
        product: "",
        color: "",
        size: "39",
        quantity: 1,
        purchasePrice: "",
        sellingPrice: "",
        amountPaid: 0,
        paymentMethod: "Cash"
    });

    const [message, setMessage] = useState("");


    const loadSuppliers = async () => {
        const response = await fetch(
            "http://localhost:5000/api/suppliers"
        );

        const data = await response.json();
        setSuppliers(data);
    };


    const loadProducts = async () => {
        const response = await fetch(
            "http://localhost:5000/api/products"
        );

        const data = await response.json();
        setProducts(data);
    };


    const loadPurchases = async () => {
        const response = await fetch(
            "http://localhost:5000/api/purchases"
        );

        const data = await response.json();
        setPurchases(data);
    };


    const handleChange = (e) => {

        const { name, value } = e.target;

        if (name === "product") {

            setForm({
                ...form,
                product: value,
                color: "",
                size: ""
            });

            return;
        }


        if (name === "color") {

            setForm({
                ...form,
                color: value,
                size: ""
            });

            return;
        }


        setForm({
            ...form,
            [name]: value
        });
    };


    useEffect(() => {

        const loadData = async () => {
            await loadSuppliers();
            await loadProducts();
            await loadPurchases();
        };

        loadData();

    }, []);


    const totalAmount =
        Number(form.quantity) *
        Number(form.purchasePrice);


    const remainingAmount =
        totalAmount -
        Number(form.amountPaid);


    const deletePurchase = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this purchase? The stock added by this purchase will also be removed."
        );

        if (!confirmed) return;


        try {

            const response = await fetch(
                `http://localhost:5000/api/purchases/${id}`,
                {
                    method: "DELETE"
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to delete purchase"
                );

            }


            setPurchases((prevPurchases) =>
                prevPurchases.filter(
                    (purchase) =>
                        purchase._id !== id
                )
            );


            await loadProducts();


            setMessage(
                "✅ Purchase deleted and stock updated!"
            );


        } catch (error) {

            console.error(error);

            setMessage(
                "❌ Failed to delete purchase."
            );
        }
    };


    const addPurchase = async (e) => {

        e.preventDefault();

        setMessage("Saving purchase...");


        try {

            const response = await fetch(
                "http://localhost:5000/api/purchases",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        supplier: form.supplier,

                        invoiceNumber:
                            form.invoiceNumber,

                        items: [
                            {
                                product: form.product,
                                color: form.color,
                                size: form.size,
                                quantity:
                                    Number(form.quantity),
                                purchasePrice:
                                    Number(
                                        form.purchasePrice
                                    ),
                                sellingPrice:
                                    Number(
                                        form.sellingPrice
                                    )
                            }
                        ],

                        totalAmount,

                        amountPaid:
                            Number(form.amountPaid),

                        paymentMethod:
                            form.paymentMethod,

                        remainingAmount

                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to add purchase"
                );

            }


            setMessage(
                "✅ Purchase added successfully!"
            );


            setForm({
                supplier: "",
                invoiceNumber: "",
                product: "",
                color: "",
                size: "39",
                quantity: 1,
                purchasePrice: "",
                sellingPrice: "",
                amountPaid: 0,
                paymentMethod: "Cash"
            });


            loadPurchases();


        } catch (error) {

            console.error(error);

            setMessage(
                "❌ Failed to add purchase."
            );
        }
    };


    return (
        <div>


            <div className="page-header">

                <div>

                    <h1>Purchases</h1>

                    <p>
                        Record purchases from suppliers.
                    </p>

                </div>

            </div>


            <div className="form-card">

                <h2>New Purchase</h2>


                <form onSubmit={addPurchase}>


                    <div className="form-grid">


                        <div className="form-group">

                            <label>
                                Supplier
                            </label>


                            <select
                                name="supplier"
                                value={form.supplier}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select Supplier
                                </option>


                                {suppliers.map(
                                    (supplier) => (

                                        <option
                                            key={
                                                supplier._id
                                            }
                                            value={
                                                supplier._id
                                            }
                                        >
                                            {supplier.name}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        <div className="form-group">

                            <label>
                                Supplier Invoice Number
                            </label>


                            <input
                                type="text"
                                name="invoiceNumber"
                                value={
                                    form.invoiceNumber
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="e.g. INV-1025"
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Product
                            </label>


                            <select
                                name="product"
                                value={form.product}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select Product
                                </option>


                                {products.map(
                                    (product) => (

                                        <option
                                            key={
                                                product._id
                                            }
                                            value={
                                                product._id
                                            }
                                        >
                                            {product.name} -{" "}
                                            {product.brand}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        <div className="form-group">

                            <label>
                                Colour
                            </label>


                            <select
                                name="color"
                                value={form.color}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select Colour
                                </option>


                                {products
                                    .find(
                                        (product) =>
                                            product._id ===
                                            form.product
                                    )
                                    ?.variants
                                    ?.map(
                                        (variant) => (

                                            <option
                                                key={
                                                    variant.color
                                                }
                                                value={
                                                    variant.color
                                                }
                                            >
                                                {
                                                    variant.color
                                                }
                                            </option>

                                        )
                                    )}

                            </select>

                        </div>


                        <div className="form-group">

                            <label>
                                Size
                            </label>


                            <select
                                name="size"
                                value={form.size}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select Size
                                </option>


                                {products
                                    .find(
                                        (product) =>
                                            product._id ===
                                            form.product
                                    )
                                    ?.variants
                                    ?.find(
                                        (variant) =>
                                            variant.color ===
                                            form.color
                                    )
                                    ?.sizes &&

                                    Object.keys(
                                        products
                                            .find(
                                                (product) =>
                                                    product._id ===
                                                    form.product
                                            )
                                            ?.variants
                                            ?.find(
                                                (variant) =>
                                                    variant.color ===
                                                    form.color
                                            )
                                            ?.sizes || {}
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

                            <label>
                                Quantity
                            </label>


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

                            <label>
                                Purchase Price / Pair
                            </label>


                            <input
                                type="number"
                                name="purchasePrice"
                                min="0"
                                value={
                                    form.purchasePrice
                                }
                                onChange={handleChange}
                                placeholder="Rs."
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Selling Price / Pair
                            </label>


                            <input
                                type="number"
                                name="sellingPrice"
                                min="0"
                                value={
                                    form.sellingPrice
                                }
                                onChange={handleChange}
                                placeholder="Rs."
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Total Amount
                            </label>


                            <input
                                type="number"
                                value={totalAmount}
                                readOnly
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Amount Paid
                            </label>


                            <input
                                type="number"
                                name="amountPaid"
                                min="0"
                                value={
                                    form.amountPaid
                                }
                                onChange={handleChange}
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Payment Method
                            </label>


                            <select
                                name="paymentMethod"
                                value={
                                    form.paymentMethod
                                }
                                onChange={handleChange}
                            >

                                <option>
                                    Cash
                                </option>

                                <option>
                                    Bank
                                </option>

                                <option>
                                    Online
                                </option>

                                <option>
                                    Cheque
                                </option>

                            </select>

                        </div>


                        <div className="form-group">

                            <label>
                                Remaining
                            </label>


                            <input
                                type="number"
                                value={
                                    remainingAmount
                                }
                                readOnly
                            />

                        </div>


                    </div>


                    {message && (

                        <p
                            style={{
                                marginTop: "15px"
                            }}
                        >
                            {message}
                        </p>

                    )}


                    <button
                        type="submit"
                        className="primary-btn"
                    >
                        Save Purchase
                    </button>


                </form>

            </div>


            <div className="purchase-card">


                <div className="table-header">

                    <h2>
                        Purchase History
                    </h2>

                </div>


                {purchases.length === 0 ? (

                    <p>
                        No purchases recorded yet.
                    </p>

                ) : (

                    <table>


                        <thead>

                            <tr>

                                <th>
                                    Supplier
                                </th>

                                <th>
                                    Invoice No.
                                </th>

                                <th>
                                    Total
                                </th>

                                <th>
                                    Paid
                                </th>

                                <th>
                                    Remaining
                                </th>

                                <th>
                                    Payment
                                </th>

                                <th>
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>


                            {purchases.map(
                                (purchase) => (

                                    <tr
                                        key={
                                            purchase._id
                                        }
                                    >

                                        <td>
                                            {
                                                purchase
                                                    .supplier
                                                    ?.name ||
                                                "-"
                                            }
                                        </td>


                                        <td>
                                            {
                                                purchase
                                                    .invoiceNumber ||
                                                "-"
                                            }
                                        </td>


                                        <td>
                                            Rs.{" "}
                                            {Number(
                                                purchase.totalAmount ||
                                                0
                                            ).toLocaleString()}
                                        </td>


                                        <td>
                                            Rs.{" "}
                                            {Number(
                                                purchase.amountPaid ||
                                                0
                                            ).toLocaleString()}
                                        </td>


                                        <td>
                                            Rs.{" "}
                                            {Number(
                                                purchase.remainingAmount ||
                                                0
                                            ).toLocaleString()}
                                        </td>


                                        <td>
                                            {
                                                purchase.paymentMethod
                                            }
                                        </td>


                                        <td>

                                            <button
                                                className="secondary-btn"
                                                onClick={() =>
                                                    setSelectedPurchase(
                                                        purchase
                                                    )
                                                }
                                            >
                                                View Invoice
                                            </button>

                                            {" "}

                                            <button
                                                className="secondary-btn"
                                                onClick={() =>
                                                    deletePurchase(
                                                        purchase._id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                )
                            )}


                        </tbody>

                    </table>

                )}

            </div>


            {selectedPurchase && (

                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(0,0,0,0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000
                    }}
                >

                    <div
                        style={{
                            background: "white",
                            padding: "30px",
                            borderRadius: "10px",
                            width: "700px",
                            maxWidth: "90%",
                            maxHeight: "90vh",
                            overflowY: "auto"
                        }}
                    >

                        <h1>
                            Supplier Invoice
                        </h1>

                        <hr />

                        <p>
                            <strong>
                                Supplier:
                            </strong>{" "}
                            {selectedPurchase
                                .supplier?.name || "-"}
                        </p>

                        <p>
                            <strong>
                                Invoice Number:
                            </strong>{" "}
                            {selectedPurchase
                                .invoiceNumber || "-"}
                        </p>

                        <p>
                            <strong>
                                Date:
                            </strong>{" "}
                            {selectedPurchase.purchaseDate
                                ? new Date(
                                    selectedPurchase.purchaseDate
                                ).toLocaleDateString()
                                : "-"}
                        </p>

                        <hr />

                        <table
                            style={{
                                width: "100%"
                            }}
                        >

                            <thead>

                                <tr>

                                    <th>
                                        Product
                                    </th>

                                    <th>
                                        Colour
                                    </th>

                                    <th>
                                        Size
                                    </th>

                                    <th>
                                        Quantity
                                    </th>

                                    <th>
                                        Price
                                    </th>

                                    <th>
                                        Total
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {selectedPurchase.items?.map(
                                    (item, index) => (

                                        <tr
                                            key={index}
                                        >

                                            <td>
                                                {
                                                    item.product
                                                        ?.name ||
                                                    "Product"
                                                }
                                            </td>

                                            <td>
                                                {
                                                    item.color
                                                }
                                            </td>

                                            <td>
                                                {
                                                    item.size
                                                }
                                            </td>

                                            <td>
                                                {
                                                    item.quantity
                                                }
                                            </td>

                                            <td>
                                                Rs.{" "}
                                                {Number(
                                                    item.purchasePrice ||
                                                    0
                                                ).toLocaleString()}
                                            </td>

                                            <td>
                                                Rs.{" "}
                                                {(
                                                    Number(
                                                        item.quantity
                                                    ) *
                                                    Number(
                                                        item.purchasePrice
                                                    )
                                                ).toLocaleString()}
                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                        <hr />

                        <h3>
                            Total: Rs.{" "}
                            {Number(
                                selectedPurchase.totalAmount ||
                                0
                            ).toLocaleString()}
                        </h3>

                        <p>
                            <strong>
                                Amount Paid:
                            </strong>{" "}
                            Rs.{" "}
                            {Number(
                                selectedPurchase.amountPaid ||
                                0
                            ).toLocaleString()}
                        </p>

                        <p>
                            <strong>
                                Remaining:
                            </strong>{" "}
                            Rs.{" "}
                            {Number(
                                selectedPurchase.remainingAmount ||
                                0
                            ).toLocaleString()}
                        </p>

                        <p>
                            <strong>
                                Payment Method:
                            </strong>{" "}
                            {selectedPurchase.paymentMethod}
                        </p>

                        <div
                            style={{
                                display: "flex",
                                gap: "10px",
                                marginTop: "20px"
                            }}
                        >

                            <button
                                className="primary-btn"
                                onClick={() =>
                                    window.print()
                                }
                            >
                                Print Invoice
                            </button>

                            <button
                                className="secondary-btn"
                                onClick={() =>
                                    setSelectedPurchase(
                                        null
                                    )
                                }
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Purchases;