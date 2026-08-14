import { useState } from "react";

function NewSale() {

    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [discount, setDiscount] = useState(0);

    const subtotal = price * quantity;
    const discountAmount = subtotal * (discount / 100);
    const total = subtotal - discountAmount;

    return (
        <div>

            <div className="page-header">
                <div>
                    <h1>New Sale</h1>
                    <p>Record a new shoe sale.</p>
                </div>
            </div>

            <div className="form-card">

                <div className="form-grid">

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
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        />
                    </div>

                    <div className="form-group">
                        <label>Price Per Pair</label>

                        <input
                            type="number"
                            placeholder="Rs."
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                        />
                    </div>

                    <div className="form-group">
                        <label>Discount (%)</label>

                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={discount}
                            onChange={(e) => setDiscount(Number(e.target.value))}
                        />
                    </div>

                </div>

                <div className="sale-total">

                    <div>
                        <span>Subtotal</span>
                        <strong>Rs. {subtotal.toLocaleString()}</strong>
                    </div>

                    <div>
                        <span>Discount</span>
                        <strong>
                            - Rs. {discountAmount.toLocaleString()}
                        </strong>
                    </div>

                    <div className="final-total">
                        <span>Total</span>
                        <strong>
                            Rs. {total.toLocaleString()}
                        </strong>
                    </div>

                </div>

                <div className="form-actions">

                    <button className="secondary-btn">
                        Cancel
                    </button>

                    <button className="primary-btn">
                        Complete Sale
                    </button>

                </div>

            </div>

        </div>
    );
}

export default NewSale;