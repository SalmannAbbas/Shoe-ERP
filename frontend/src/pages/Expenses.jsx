import { useEffect, useState } from "react";

function Expenses() {

    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadExpenses = async () => {

            try {

                const response = await fetch(
                    "http://localhost:5000/api/expenses"
                );

                const data = await response.json();

                if (response.ok) {
                    setExpenses(data);
                }

                setLoading(false);

            } catch (error) {

                console.error(
                    "Failed to load expenses:",
                    error
                );

                setLoading(false);
            }
        };

        loadExpenses();

    }, []);
const handleDelete = async (id) => {

    const confirmed = window.confirm(
        "Are you sure you want to delete this expense?"
    );

    if (!confirmed) return;

    try {

        const response = await fetch(
            `http://localhost:5000/api/expenses/${id}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to delete expense"
            );
        }

        setExpenses((prevExpenses) =>
            prevExpenses.filter(
                (expense) => expense._id !== id
            )
        );

    } catch (error) {

        console.error(error);

        alert(
            "Failed to delete expense: " +
            error.message
        );
    }
};

    const today = new Date();


    const isToday = (date) => {

        const d = new Date(date);

        return (
            d.getDate() === today.getDate() &&
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear()
        );
    };


    const isThisMonth = (date) => {

        const d = new Date(date);

        return (
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear()
        );
    };


    const todaysExpenses = expenses.filter(
        (expense) =>
            isToday(expense.expenseDate)
    );


    const monthlyExpenses = expenses.filter(
        (expense) =>
            isThisMonth(expense.expenseDate)
    );


    const todaysTotal = todaysExpenses.reduce(
        (total, expense) =>
            total + Number(expense.amount || 0),
        0
    );


    const monthlyTotal = monthlyExpenses.reduce(
        (total, expense) =>
            total + Number(expense.amount || 0),
        0
    );


    const shopTotal = monthlyExpenses
        .filter(
            (expense) =>
                expense.category === "Shop"
        )
        .reduce(
            (total, expense) =>
                total + Number(expense.amount || 0),
            0
        );


    const otherTotal =
        monthlyTotal - shopTotal;


    if (loading) {
        return <h2>Loading expenses...</h2>;
    }


    return (
        <div>

            <div className="page-header">

                <div>

                    <h1>Expenses</h1>

                    <p>
                        Track daily and monthly expenses.
                    </p>

                </div>


                <button
                    className="primary-btn"
                    onClick={() =>
                        window.location.href =
                            "/add-expense"
                    }
                >
                    + Add Expense
                </button>

            </div>


            <div className="expense-summary">


                <div className="stat-card">

                    <h3>
                        Today's Expenses
                    </h3>

                    <h2>
                        Rs.{" "}
                        {todaysTotal.toLocaleString()}
                    </h2>

                </div>


                <div className="stat-card">

                    <h3>
                        This Month
                    </h3>

                    <h2>
                        Rs.{" "}
                        {monthlyTotal.toLocaleString()}
                    </h2>

                </div>


                <div className="stat-card">

                    <h3>
                        Shop Expenses
                    </h3>

                    <h2>
                        Rs.{" "}
                        {shopTotal.toLocaleString()}
                    </h2>

                </div>


                <div className="stat-card">

                    <h3>
                        Other Expenses
                    </h3>

                    <h2>
                        Rs.{" "}
                        {otherTotal.toLocaleString()}
                    </h2>

                </div>


            </div>


            <div className="expense-card">


                <div className="table-header">

                    <h2>
                        Recent Expenses
                    </h2>

                    <input
                        type="text"
                        placeholder="Search expenses..."
                    />

                </div>


                <table>


                    <thead>

                        <tr>

                            <th>Date</th>

                            <th>Description</th>

                            <th>Category</th>

                            <th>Payment Method</th>

                            <th>Amount</th>
<th>Action</th>
                        </tr>

                    </thead>


                    <tbody>


                        {expenses.length === 0 ? (

                            <tr>

                                <td colSpan="6">
                                    No expenses recorded yet.
                                </td>

                            </tr>

                        ) : (

                            expenses.map(
                                (expense) => (

                                    <tr
                                        key={
                                            expense._id
                                        }
                                    >

                                        <td>
    {new Date(expense.expenseDate).toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    )}
</td>


                                        <td>

                                            {
                                                expense.description
                                            }

                                        </td>


                                        <td>

                                            {
                                                expense.category
                                            }

                                        </td>


                                        <td>

                                            {
                                                expense.paymentMethod
                                            }

                                        </td>


                                        <td>

                                            Rs.{" "}

                                            {Number(
                                                expense.amount
                                            ).toLocaleString()}

                                        </td>

<td>
    <button
        className="secondary-btn"
        onClick={() =>
            handleDelete(expense._id)
        }
    >
        Delete
    </button>
</td>
                                    </tr>

                                )
                            )

                        )}


                    </tbody>


                </table>


            </div>


        </div>
    );
}


export default Expenses;