import { useEffect, useState } from "react";

function Settings() {

    const [form, setForm] = useState({
        shopName: "",
        phone: "",
        address: "",
        currency: "PKR",
        defaultDiscount: 0,
        lowStockAlert: 10
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);


    // Load settings
    useEffect(() => {

        const loadSettings = async () => {

            try {

                const response = await fetch(
                    "http://localhost:5000/api/settings"
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to load settings"
                    );
                }

                setForm({
                    shopName: data.shopName || "",
                    phone: data.phone || "",
                    address: data.address || "",
                    currency: data.currency || "PKR",
                    defaultDiscount:
                        data.defaultDiscount || 0,
                    lowStockAlert:
                        data.lowStockAlert || 10
                });

            } catch (error) {

                console.error(
                    "Failed to load settings:",
                    error
                );

                setMessage(
                    "❌ Failed to load settings."
                );

            } finally {

                setLoading(false);

            }

        };

        loadSettings();

    }, []);


    // Handle input changes
    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value
        });

    };


    // Save shop information
    const saveShopInformation = async (e) => {

        e.preventDefault();

        setMessage("Saving shop information...");

        try {

            const response = await fetch(
                "http://localhost:5000/api/settings",
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(form)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to save settings"
                );
            }

            setForm({
                shopName: data.shopName || "",
                phone: data.phone || "",
                address: data.address || "",
                currency: data.currency || "PKR",
                defaultDiscount:
                    data.defaultDiscount || 0,
                lowStockAlert:
                    data.lowStockAlert || 10
            });

            setMessage(
                "✅ Shop information saved successfully!"
            );

        } catch (error) {

            console.error(error);

            setMessage(
                "❌ Failed to save shop information."
            );

        }

    };


    // Save system settings
    const saveSystemSettings = async (e) => {

        e.preventDefault();

        setMessage("Saving system settings...");

        try {

            const response = await fetch(
                "http://localhost:5000/api/settings",
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(form)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to save settings"
                );
            }

            setForm({
                shopName: data.shopName || "",
                phone: data.phone || "",
                address: data.address || "",
                currency: data.currency || "PKR",
                defaultDiscount:
                    data.defaultDiscount || 0,
                lowStockAlert:
                    data.lowStockAlert || 10
            });

            setMessage(
                "✅ System settings saved successfully!"
            );

        } catch (error) {

            console.error(error);

            setMessage(
                "❌ Failed to save system settings."
            );

        }

    };


    if (loading) {

        return (
            <div>

                <div className="page-header">

                    <div>

                        <h1>Settings</h1>

                        <p>
                            Loading settings...
                        </p>

                    </div>

                </div>

            </div>
        );

    }


    return (
        <div>

            <div className="page-header">

                <div>

                    <h1>Settings</h1>

                    <p>
                        Manage your shop system settings.
                    </p>

                </div>

            </div>


            {message && (

                <p
                    style={{
                        marginBottom: "20px"
                    }}
                >
                    {message}
                </p>

            )}


            <div className="settings-grid">


                {/* SHOP INFORMATION */}

                <div className="settings-card">

                    <h2>
                        Shop Information
                    </h2>


                    <form
                        onSubmit={
                            saveShopInformation
                        }
                    >

                        <div className="form-group">

                            <label>
                                Shop Name
                            </label>

                            <input
                                type="text"
                                name="shopName"
                                value={
                                    form.shopName
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Shoe Shop"
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Phone Number
                            </label>

                            <input
                                type="text"
                                name="phone"
                                value={
                                    form.phone
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="03XX-XXXXXXX"
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Shop Address
                            </label>

                            <input
                                type="text"
                                name="address"
                                value={
                                    form.address
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Shop address"
                            />

                        </div>


                        <button
                            type="submit"
                            className="primary-btn"
                        >
                            Save Changes
                        </button>

                    </form>

                </div>


                {/* SYSTEM SETTINGS */}

                <div className="settings-card">

                    <h2>
                        System Settings
                    </h2>


                    <form
                        onSubmit={
                            saveSystemSettings
                        }
                    >

                        <div className="form-group">

                            <label>
                                Currency
                            </label>

                            <select
                                name="currency"
                                value={
                                    form.currency
                                }
                                onChange={
                                    handleChange
                                }
                            >

                                <option value="PKR">
                                    PKR (Rs.)
                                </option>

                                <option value="USD">
                                    USD ($)
                                </option>

                            </select>

                        </div>


                        <div className="form-group">

                            <label>
                                Low Stock Alert
                            </label>

                            <input
                                type="number"
                                name="lowStockAlert"
                                min="0"
                                value={
                                    form.lowStockAlert
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="10"
                            />

                        </div>


                        <button
                            type="submit"
                            className="primary-btn"
                        >
                            Save Settings
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default Settings;