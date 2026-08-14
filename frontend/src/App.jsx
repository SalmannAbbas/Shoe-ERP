import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import AddProduct from "./pages/AddProduct";
import Sales from "./pages/Sales";
import NewSale from "./pages/NewSale";
import Suppliers from "./pages/Suppliers";
import AddSupplier from "./pages/AddSupplier";
import Expenses from "./pages/Expenses";
import AddExpense from "./pages/AddExpense";
import CheckBalance from "./pages/CheckBalance";
import Invoices from "./pages/Invoices";
import Purchases from "./pages/Purchases";
import NewPurchase from "./pages/NewPurchase";
import Settings from "./pages/Settings";
import SupplierInvoices from "./pages/SupplierInvoices";
function App() {
    return (
        <BrowserRouter>

            <div className="app-layout">

                <Sidebar />

                <div className="main-section">

                    <Topbar />

                    <main className="content">

                        <Routes>

                            <Route path="/" element={<Dashboard />} />

                            <Route path="/inventory" element={<Inventory />} />

                            <Route path="/add-product" element={<AddProduct />} />

                            <Route path="/sales" element={<Sales />} />

                            <Route path="/new-sale" element={<NewSale />} />

                            <Route path="/suppliers" element={<Suppliers />} />

                          <Route
    path="/supplier-invoices/:id"
    element={<SupplierInvoices />}
/>

                            <Route path="/add-supplier" element={<AddSupplier />} />

                            <Route path="/expenses" element={<Expenses />} />

                            <Route path="/add-expense" element={<AddExpense />} />

                            <Route path="/check-balance" element={<CheckBalance />} />

                            <Route path="/invoices" element={<Invoices />} />

                            <Route path="/purchases" element={<Purchases />} />

                            <Route path="/new-purchase" element={<NewPurchase />} />

                            <Route path="/settings" element={<Settings />} />

                    
                        </Routes>

                    </main>

                </div>

            </div>

        </BrowserRouter>
    );
}

export default App;