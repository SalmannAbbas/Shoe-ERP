import { useEffect, useState } from "react";

function CheckBalance() {

    const [sales, setSales] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [expenses, setExpenses] = useState([]);

    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const loadData = async () => {

            try {

                const [
                    salesResponse,
                    purchasesResponse,
                    expensesResponse
                ] = await Promise.all([

                    fetch(
                        "http://localhost:5000/api/sales"
                    ),

                    fetch(
                        "http://localhost:5000/api/purchases"
                    ),

                    fetch(
                        "http://localhost:5000/api/expenses"
                    )

                ]);


                const salesData =
                    await salesResponse.json();

                const purchasesData =
                    await purchasesResponse.json();

                const expensesData =
                    await expensesResponse.json();


                if (salesResponse.ok) {
                    setSales(salesData);
                }

                if (purchasesResponse.ok) {
                    setPurchases(purchasesData);
                }

                if (expensesResponse.ok) {
                    setExpenses(expensesData);
                }


            } catch (error) {

                console.error(
                    "Failed to load balance data:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };


        loadData();

    }, []);


    const totalSales = sales.reduce(
        (total, sale) =>
            total +
            Number(sale.totalAmount || 0),
        0
    );


    const totalPurchases = purchases.reduce(
        (total, purchase) =>
            total +
            Number(purchase.totalAmount || 0),
        0
    );


    const totalPaidToSuppliers =
        purchases.reduce(
            (total, purchase) =>
                total +
                Number(
                    purchase.amountPaid || 0
                ),
            0
        );


    const totalSupplierRemaining =
        purchases.reduce(
            (total, purchase) =>
                total +
                Number(
                    purchase.remainingAmount || 0
                ),
            0
        );


    const totalExpenses = expenses.reduce(
        (total, expense) =>
            total +
            Number(expense.amount || 0),
        0
    );


    const estimatedProfit =
        totalSales -
        totalPurchases -
        totalExpenses;


    if (loading) {

        return (
            <div>
                <div className="page-header">
                    <h1>Check & Balance</h1>
                    <p>
                        Loading financial information...
                    </p>
                </div>
            </div>
        );

    }


    return (
        <div>

            <div className="page-header">

                <div>

                    <h1>
                        Check & Balance
                    </h1>

                    <p>
                        Overview of your shop's
                        financial position.
                    </p>

                </div>

            </div>


            <div className="stats-grid">


                <div className="stat-card">

                    <h3>
                        Total Sales
                    </h3>

                    <h2>
                        Rs.{" "}
                        {totalSales.toLocaleString()}
                    </h2>

                    <p>
                        Money received from sales
                    </p>

                </div>


                <div className="stat-card">

                    <h3>
                        Total Purchases
                    </h3>

                    <h2>
                        Rs.{" "}
                        {totalPurchases.toLocaleString()}
                    </h2>

                    <p>
                        Total stock purchased
                    </p>

                </div>


                <div className="stat-card">

                    <h3>
                        Supplier Payments
                    </h3>

                    <h2>
                        Rs.{" "}
                        {totalPaidToSuppliers.toLocaleString()}
                    </h2>

                    <p>
                        Amount paid to suppliers
                    </p>

                </div>


                <div className="stat-card">

                    <h3>
                        Supplier Balance
                    </h3>

                    <h2>
                        Rs.{" "}
                        {totalSupplierRemaining.toLocaleString()}
                    </h2>

                    <p>
                        Still owed to suppliers
                    </p>

                </div>


            </div>


            <div className="stats-grid">


                <div className="stat-card">

                    <h3>
                        Total Expenses
                    </h3>

                    <h2>
                        Rs.{" "}
                        {totalExpenses.toLocaleString()}
                    </h2>

                    <p>
                        Shop expenses
                    </p>

                </div>


                <div className="stat-card">

                    <h3>
                        Estimated Profit
                    </h3>

                    <h2>
                        Rs.{" "}
                        {estimatedProfit.toLocaleString()}
                    </h2>

                    <p>
                        Sales - Purchases - Expenses
                    </p>

                </div>


            </div>


            <div className="dashboard-grid">


                <div className="dashboard-card">

                    <h2>
                        Financial Summary
                    </h2>


                    <div className="stock-item">

                        <span>
                            Total Sales
                        </span>

                        <strong>
                            Rs.{" "}
                            {totalSales.toLocaleString()}
                        </strong>

                    </div>


                    <div className="stock-item">

                        <span>
                            Total Purchases
                        </span>

                        <strong>
                            Rs.{" "}
                            {totalPurchases.toLocaleString()}
                        </strong>

                    </div>


                    <div className="stock-item">

                        <span>
                            Expenses
                        </span>

                        <strong>
                            Rs.{" "}
                            {totalExpenses.toLocaleString()}
                        </strong>

                    </div>


                    <div className="stock-item">

                        <span>
                            Supplier Balance
                        </span>

                        <strong>
                            Rs.{" "}
                            {totalSupplierRemaining.toLocaleString()}
                        </strong>

                    </div>


                    <div className="stock-item">

                        <span>
                            Estimated Profit
                        </span>

                        <strong>
                            Rs.{" "}
                            {estimatedProfit.toLocaleString()}
                        </strong>

                    </div>

                </div>


                <div className="dashboard-card">

                    <h2>
                        Records
                    </h2>


                    <div className="stock-item">

                        <span>
                            Sales Records
                        </span>

                        <strong>
                            {sales.length}
                        </strong>

                    </div>


                    <div className="stock-item">

                        <span>
                            Purchase Records
                        </span>

                        <strong>
                            {purchases.length}
                        </strong>

                    </div>


                    <div className="stock-item">

                        <span>
                            Expense Records
                        </span>

                        <strong>
                            {expenses.length}
                        </strong>

                    </div>

                </div>


            </div>

        </div>
    );
}

export default CheckBalance;