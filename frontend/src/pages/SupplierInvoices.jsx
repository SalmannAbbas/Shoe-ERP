import { useEffect, useState } from "react";

function SupplierInvoices() {

    const [supplier, setSupplier] = useState(null);
    const [invoices, setInvoices] = useState([]);
    const [message, setMessage] = useState("");

    const supplierId =
        window.location.pathname.split("/").pop();


    useEffect(() => {

        const loadInvoices = async () => {

            try {

                const response = await fetch(
                    `http://localhost:5000/api/suppliers/${supplierId}/invoices`
                );

                const data = await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to load invoices"
                    );

                }


                setInvoices(data);


                if (data.length > 0) {

                    setSupplier(
                        data[0].supplier
                    );

                }

            } catch (error) {

                console.error(error);

                setMessage(
                    "❌ Failed to load supplier invoices."
                );

            }
        };


        loadInvoices();

    }, [supplierId]);


    return (
        <div>

            <div className="page-header">

                <div>

                    <h1>
                        Supplier Invoices
                    </h1>

                    <p>
                        {supplier
                            ? `Purchase history from ${supplier.name}`
                            : "Purchase history"}
                    </p>

                </div>


                <button
                    className="secondary-btn"
                    onClick={() =>
                        window.location.href =
                            "/suppliers"
                    }
                >
                    ← Back to Suppliers
                </button>

            </div>


            {message && (
                <p>
                    {message}
                </p>
            )}


            {invoices.length === 0 ? (

                <div className="purchase-card">

                    <h2>
                        No invoices found
                    </h2>

                    <p>
                        No purchases have been
                        recorded for this supplier yet.
                    </p>

                </div>

            ) : (

                invoices.map((invoice) => (

                    <div
                        className="purchase-card"
                        key={invoice._id}
                    >

                        <div
                            className="table-header"
                        >

                            <div>

                                <h2>
                                    Invoice{" "}
                                    {invoice.invoiceNumber ||
                                        "No Invoice Number"}
                                </h2>

                                <p>

                                    Date:{" "}
                                    {new Date(
                                        invoice.purchaseDate
                                    ).toLocaleDateString(
                                        "en-GB"
                                    )}

                                </p>

                            </div>

                        </div>


                        <div className="expense-summary">

                            <div className="stat-card">

                                <h3>
                                    Total
                                </h3>

                                <h2>
                                    Rs.{" "}
                                    {Number(
                                        invoice.totalAmount ||
                                        0
                                    ).toLocaleString()}
                                </h2>

                            </div>


                            <div className="stat-card">

                                <h3>
                                    Paid
                                </h3>

                                <h2>
                                    Rs.{" "}
                                    {Number(
                                        invoice.amountPaid ||
                                        0
                                    ).toLocaleString()}
                                </h2>

                            </div>


                            <div className="stat-card">

                                <h3>
                                    Remaining
                                </h3>

                                <h2>
                                    Rs.{" "}
                                    {Number(
                                        invoice.remainingAmount ||
                                        0
                                    ).toLocaleString()}
                                </h2>

                            </div>


                            <div className="stat-card">

                                <h3>
                                    Payment
                                </h3>

                                <h2>
                                    {invoice.paymentMethod}
                                </h2>

                            </div>

                        </div>


                        <h3>
                            Products Received
                        </h3>


                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        Product
                                    </th>

                                    <th>
                                        Brand
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
                                        Price / Pair
                                    </th>

                                    <th>
                                        Total
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {invoice.items.map(
                                    (item, index) => (

                                        <tr
                                            key={index}
                                        >

                                            <td>
                                                {
                                                    item
                                                        .product
                                                        ?.name ||
                                                    "Product"
                                                }
                                            </td>

                                            <td>
                                                {
                                                    item
                                                        .product
                                                        ?.brand ||
                                                    "-"
                                                }
                                            </td>

                                            <td>
                                                {
                                                    item.color
                                                }
                                            </td>

                                            <td>
                                                Size{" "}
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
                                                        item.quantity ||
                                                        0
                                                    ) *
                                                    Number(
                                                        item.purchasePrice ||
                                                        0
                                                    )
                                                ).toLocaleString()}
                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                ))

            )}

        </div>
    );
}

export default SupplierInvoices;