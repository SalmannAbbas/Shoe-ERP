function Invoices() {
    return (
        <div>

            <div className="page-header">

                <div>
                    <h1>Invoices & Receipts</h1>
                    <p>View and manage sales invoices.</p>
                </div>

            </div>

            <div className="invoice-card">

                <div className="table-header">

                    <h2>Recent Invoices</h2>

                    <input
                        type="text"
                        placeholder="Search invoices..."
                    />

                </div>

                <table>

                    <thead>
                        <tr>
                            <th>Invoice #</th>
                            <th>Date</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Payment</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>

                        <tr>
                            <td>INV-001</td>
                            <td>11 Aug 2026</td>
                            <td>2</td>
                            <td>Rs. 13,600</td>
                            <td>Cash</td>
                            <td>
                                <button className="secondary-btn">
                                    View
                                </button>
                            </td>
                        </tr>

                        <tr>
                            <td>INV-002</td>
                            <td>11 Aug 2026</td>
                            <td>1</td>
                            <td>Rs. 5,000</td>
                            <td>Bank</td>
                            <td>
                                <button className="secondary-btn">
                                    View
                                </button>
                            </td>
                        </tr>

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default Invoices;