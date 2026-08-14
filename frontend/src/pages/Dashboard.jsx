import { useEffect, useState } from "react";

function Dashboard() {
    const [products, setProducts] = useState([]);
    const [sales, setSales] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [lowStockAlert, setLowStockAlert] = useState(5);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const [
                    productsResponse,
                    salesResponse,
                    purchasesResponse,
                    expensesResponse,
                    settingsResponse
                ] = await Promise.all([
                    fetch("http://localhost:5000/api/products"),
                    fetch("http://localhost:5000/api/sales"),
                    fetch("http://localhost:5000/api/purchases"),
                    fetch("http://localhost:5000/api/expenses"),
                    fetch("http://localhost:5000/api/settings")
                ]);

                const productsData =
                    await productsResponse.json();

                const salesData =
                    await salesResponse.json();

                const purchasesData =
                    await purchasesResponse.json();

                const expensesData =
                    await expensesResponse.json();

                const settingsData =
                    await settingsResponse.json();

                if (productsResponse.ok) {
                    setProducts(productsData);
                }

                if (salesResponse.ok) {
                    setSales(salesData);
                }

                if (purchasesResponse.ok) {
                    setPurchases(purchasesData);
                }

                if (expensesResponse.ok) {
                    setExpenses(expensesData);
                }

                if (settingsResponse.ok) {
                    setLowStockAlert(
                        Number(
                            settingsData.lowStockAlert || 5
                        )
                    );
                }

            } catch (error) {
                console.error(
                    "Failed to load dashboard data:",
                    error
                );
            }
        };

        loadDashboardData();
    }, []);


    // Today's date
    const today = new Date();


    const isToday = (date) => {
        const d = new Date(date);

        return (
            d.getDate() === today.getDate() &&
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear()
        );
    };


    // Today's sales
    const todaysSales = sales.filter((sale) =>
        isToday(sale.saleDate)
    );


    // Today's purchases
    const todaysPurchases = purchases.filter((purchase) =>
        isToday(purchase.createdAt)
    );


    // Today's other expenses
    const todaysExpenses = expenses.filter((expense) =>
        isToday(expense.expenseDate)
    );


    // Today's sales amount
    const todaysSalesAmount = todaysSales.reduce(
        (total, sale) =>
            total + Number(sale.totalAmount || 0),
        0
    );


    // Money actually paid for purchases today
    const todaysPurchasePayments = todaysPurchases.reduce(
        (total, purchase) =>
            total + Number(purchase.amountPaid || 0),
        0
    );


    // Other shop expenses today
    const todaysOtherExpenses = todaysExpenses.reduce(
        (total, expense) =>
            total + Number(expense.amount || 0),
        0
    );


    // Total expenses today
    const todaysExpensesTotal =
        todaysPurchasePayments +
        todaysOtherExpenses;


    // Today's gross profit from sales
    const todaysGrossProfit = todaysSales.reduce(
        (total, sale) => {

            const purchasePrice =
                Number(
                    sale.product?.purchasePrice || 0
                );

            const salePrice =
                Number(
                    sale.sellingPrice || 0
                );

            const quantity =
                Number(
                    sale.quantity || 0
                );

            return total + (
                (salePrice - purchasePrice) *
                quantity
            );
        },
        0
    );


    // Today's final profit after other expenses
    const todaysProfit =
        todaysGrossProfit -
        todaysOtherExpenses;


    // Calculate total stock
    const totalStock = products.reduce(
        (total, product) =>
            total +
            (product.variants || []).reduce(
                (variantTotal, variant) =>
                    variantTotal +
                    Object.values(
                        variant.sizes || {}
                    ).reduce(
                        (sizeTotal, quantity) =>
                            sizeTotal +
                            Number(quantity),
                        0
                    ),
                0
            ),
        0
    );

// Calculate total stock value
const stockValue = products.reduce(
    (total, product) => {

        const productStock =
            (product.variants || []).reduce(
                (variantTotal, variant) =>
                    variantTotal +
                    Object.values(
                        variant.sizes || {}
                    ).reduce(
                        (sizeTotal, quantity) =>
                            sizeTotal +
                            Number(quantity),
                        0
                    ),
                0
            );

        return total +
            (productStock *
                Number(product.purchasePrice || 0));

    },
    0
);
    // Low stock products
    const lowStockProducts = products
        .map((product) => {

            const stock =
                (product.variants || []).reduce(
                    (total, variant) =>
                        total +
                        Object.values(
                            variant.sizes || {}
                        ).reduce(
                            (sum, quantity) =>
                                sum +
                                Number(quantity),
                            0
                        ),
                    0
                );

            return {
                ...product,
                totalStock: stock
            };
        })
        .filter(
            (product) =>
                product.totalStock <= lowStockAlert
        );


    return (
        <div className="dashboard">

            <div className="page-header">

                <h1>Dashboard</h1>

                <p>
                    Here's what's happening in your
                    shoe shop today.
                </p>

            </div>


            <div className="stats-grid">


                <div className="stat-card">

                    <h3>
                        Today's Sales
                    </h3>

                    <h2>
                        Rs.{" "}
                        {todaysSalesAmount.toLocaleString()}
                    </h2>

                    <p>
                        {todaysSales.length} sales today
                    </p>

                </div>


                <div className="stat-card">

                    <h3>
                        Today's Expenses
                    </h3>

                    <h2>
                        Rs.{" "}
                        {todaysExpensesTotal.toLocaleString()}
                    </h2>

                    <p>
                        {todaysPurchases.length} purchases +{" "}
                        {todaysExpenses.length} other expenses
                    </p>

                </div>


                <div className="stat-card">

                    <h3>
                        Today's Profit
                    </h3>

                    <h2>
                        Rs.{" "}
                        {todaysProfit.toLocaleString()}
                    </h2>

                    <p>
                        After other expenses
                    </p>

                </div>


                <div className="stat-card">

                    <h3>
                        Total Stock
                    </h3>

                    <h2>
                        {totalStock.toLocaleString()}
                    </h2>

                    <p>
                        pairs in stock
                    </p>

                </div>
<div className="stat-card">

    <h3>
        Stock Value
    </h3>

    <h2>
        Rs.{" "}
        {stockValue.toLocaleString()}
    </h2>

    <p>
        value at purchase price
    </p>

</div>

            </div>


            <div className="dashboard-grid">


                <div className="dashboard-card">

                    <h2>
                        Low Stock
                    </h2>

                    <p>
                        Alert below {lowStockAlert} pairs
                    </p>


                    {lowStockProducts.length === 0 ? (

                        <p>
                            No low-stock products 🎉
                        </p>

                    ) : (

                        lowStockProducts
                            .slice(0, 5)
                            .map((product) => (

                                <div
                                    className="stock-item"
                                    key={product._id}
                                >

                                    <span>
                                        {product.name}
                                    </span>

                                    <strong>
                                        {product.totalStock} pairs
                                    </strong>

                                </div>

                            ))

                    )}

                </div>


                <div className="dashboard-card">

                    <h2>
                        Recent Sales
                    </h2>


                    {sales.length === 0 ? (

                        <p>
                            No sales recorded yet.
                        </p>

                    ) : (

                        sales
                            .slice(-5)
                            .reverse()
                            .map((sale) => (

                                <div
                                    className="sale-item"
                                    key={sale._id}
                                >

                                    <span>

                                        <strong>
                                            {sale.product?.name ||
                                                "Product"}
                                        </strong>

                                        <br />

                                        <small>
                                            {sale.color} • Size{" "}
                                            {sale.size} •{" "}
                                            {sale.quantity} pairs
                                        </small>

                                    </span>


                                    <strong>
                                        Rs.{" "}
                                        {Number(
                                            sale.totalAmount || 0
                                        ).toLocaleString()}
                                    </strong>

                                </div>

                            ))

                    )}

                </div>


            </div>

        </div>
    );
}

export default Dashboard;