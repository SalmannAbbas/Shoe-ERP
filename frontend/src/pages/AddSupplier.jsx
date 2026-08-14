function AddSupplier() {
    return (
        <div>

            <div className="page-header">
                <h1>Add Supplier</h1>
                <p>Add a new supplier to your shoe shop.</p>
            </div>

            <div className="form-card">

                <div className="form-grid">

                    <div className="form-group">
                        <label>Supplier Name</label>
                        <input type="text" placeholder="e.g. ABC Shoes" />
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>
                        <input type="text" placeholder="03XX-XXXXXXX" />
                    </div>

                    <div className="form-group">
                        <label>Company / Shop Name</label>
                        <input type="text" placeholder="Supplier company" />
                    </div>

                    <div className="form-group">
                        <label>Payment Method</label>

                        <select>
                            <option>Bank Transfer</option>
                            <option>Cash</option>
                            <option>Cheque</option>
                            <option>Other</option>
                        </select>
                    </div>

                </div>

                <div className="form-actions">

                    <button className="secondary-btn">
                        Cancel
                    </button>

                    <button className="primary-btn">
                        Add Supplier
                    </button>

                </div>

            </div>

        </div>
    );
}

export default AddSupplier;