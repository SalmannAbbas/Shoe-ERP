import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function MainLayout({ children }) {

    return (
        <div className="app-layout">

            <Sidebar />

            <div className="main-section">

                <Topbar />

                <main className="content">
                    {children}
                </main>

            </div>

        </div>
    );
}

export default MainLayout;