import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Truck,
    Wallet,
    FileText,
    Settings
} from "lucide-react";

function Sidebar() {
    return (
        <aside className="sidebar">

            <div className="logo">
                👟 SHOP
            </div>

            <nav>

                <button onClick={() => window.location.href = "/"}>
                    <LayoutDashboard size={20} />
                    Dashboard
                </button>

                <button onClick={() => window.location.href = "/inventory"}>
                    <Package size={20} />
                    Inventory
                </button>

                <button onClick={() => window.location.href = "/purchases"}>
                    <Package size={20} />
                    Purchases
                </button>

                <button onClick={() => window.location.href = "/sales"}>
                    <ShoppingCart size={20} />
                    Sales
                </button>

                <button onClick={() => window.location.href = "/suppliers"}>
                    <Truck size={20} />
                    Suppliers
                </button>

                <button onClick={() => window.location.href = "/expenses"}>
                    <Wallet size={20} />
                    Expenses
                </button>

                <button onClick={() => window.location.href = "/check-balance"}>
                    <FileText size={20} />
                    Check & Balance
                </button>

                <button onClick={() => window.location.href = "/settings"}>
                    <Settings size={20} />
                    Settings
                </button>

            </nav>

        </aside>
    );
}

export default Sidebar;