import { useState } from "react";

function AddExpense() {

    const [form, setForm] = useState({
        Name: "",
        amount: "",
        category: "Shop",
        paymentMethod: "Cash",
        expenseDate: "",
    
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const addExpense = async (e) => {
        e.preventDefault();

        setMessage("Saving expense...");

        try {

            const response = await fetch(
                "http://localhost:5000/api/expenses",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        Name: form.Name,
                        amount: Number(form.amount),
                        category: form.category,
                        paymentMethod: form.paymentMethod,
                        expenseDate: form.expenseDate
                            ? new Date(form.expenseDate)
                            : new Date(),
                       
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to add expense"
                );
            }

            setMessage("✅ Expense added successfully!");

            setForm({
                Name: "",
                amount: "",
                category: "Shop",
                paymentMethod: "Cash",
                expenseDate: "",
              
            });

        } catch (error) {

            console.error(error);

            setMessage(
                "❌ Failed to add expense: " +
                error.message
            );
        }
    };

    return (
        <div>

            <div className="page-header">
                <div>
                    <h1>Add Expense</h1>
                    <p>Record money spent by the shop.</p>
                </div>
            </div>

            <div className="form-card">

                <form onSubmit={addExpense}>

                    <div className="form-grid">

                        <div className="form-group">
                            <label>Name</label>

                            <input
                                type="text"
                                name="Name"
                                value={form.Name}
                                onChange={handleChange}
                                placeholder="e.g. Name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Amount</label>

                            <input
                                type="number"
                                name="amount"
                                value={form.amount}
                                onChange={handleChange}
                                placeholder="Rs."
                                min="0"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Category</label>

                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                            >
                                <option>Shop</option>
                                <option>Transport</option>
                                <option>Refreshments</option>
                                <option>Personal</option>
                                <option>Utilities</option>
                                <option>Other</option>
                            </select>
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
                                <option>Cheque</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Date</label>

                            <input
                                type="date"
                                name="expenseDate"
                                value={form.expenseDate}
                                onChange={handleChange}
                            />
                        </div>

                       

                    </div>

                    {message && (
                        <p style={{ marginTop: "15px" }}>
                            {message}
                        </p>
                    )}

                    <div className="form-actions">

                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={() =>
                                window.location.href = "/expenses"
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-btn"
                        >
                            Add Expense
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default AddExpense;