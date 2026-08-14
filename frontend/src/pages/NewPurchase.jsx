import { useState } from "react";

function NewPurchase() {

    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(0);
    const [paid, setPaid] = useState(0);

    const total = quantity * price;
    const due = total - paid;

    return (
        <div>

            <div className="page-header">
                <div>
                    <h1>New Purchase</h1>
                    <p>Record stock received from a supplier.</p>
                </div>
            </div>

            <div className="form-card">

                <div className="form-grid">

                    <div className="form-group">
                        <label>Supplier</label>

                        <select>
                            <option>Select Supplier</option>
                            <option>ABC Shoes</option>
                            <option>XYZ Footwear</option>
                            <option>City Shoes</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Product</label>

                        <select>
                            <option>Select Product</option>
                            <option>Nike Air Max</option>
                            <option>Bata Classic</option>
                            <option>Servis Runner</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Quantity</label>

                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) =>
                                setQuantity(Number(e.target.value))
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>Purchase Price Per Pair</label>

                        <input
                            type="number"
                            placeholder="Rs."
                            value={price}
                            onChange={(e) =>
                                setPrice(Number(e.target.value))
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>Amount Paid</label>

                        <input
                            type="number"
                            placeholder="Rs."
                            value={paid}
                            onChange={(e) =>
                                setPaid(Number(e.target.value))
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>Payment Method</label>

                        <select>
                            <option>Cash</option>
                            <option>Bank</option>
                            <option>Cheque</option>
                            <option>Other</option>
                        </select>
                    </div>

                </div>

                <div className="sale-total">

                    <div>
                        <span>Total Purchase</span>
                        <strong>
                            Rs. {total.toLocaleString()}
                        </strong>
                    </div>

                    <div>
                        <span>Amount Paid</span>
                        <strong>
                            Rs. {paid.toLocaleString()}
                        </strong>
                    </div>

                    <div className="final-total">
                        <span>Amount Due</span>
                        <strong>
                            Rs. {due.toLocaleString()}
                        </strong>
                    </div>

                </div>

                <div className="form-actions">

                    <button
                        className="secondary-btn"
                        onClick={() =>
                            window.location.href = "/purchases"
                        }
                    >
                        Cancel
                    </button>

                    <button className="primary-btn">
                        Complete Purchase
                    </button>

                </div>

            </div>

        </div>
    );
}

export default NewPurchase;