import { useCallback, useEffect, useState } from "react";

function Suppliers() {

    const [suppliers, setSuppliers] = useState([]);
    const [search, setSearch] = useState("");

    const [form, setForm] = useState({
        name: "",
        phone: "",
        address: "",
        notes: ""
    });

    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");


    const loadSuppliers = useCallback(async () => {

        try {

            const response = await fetch(
                "http://localhost:5000/api/suppliers/summary"
            );

            const data = await response.json();

            if (response.ok) {
                setSuppliers(data);
            }

        } catch (error) {

            console.error(
                "Failed to load suppliers:",
                error
            );

        }

    }, []);


   useEffect(() => {

    const fetchSuppliers = async () => {
        await loadSuppliers();
    };

    fetchSuppliers();

}, [loadSuppliers]);


    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value
        });

    };


    const saveSupplier = async (e) => {

        e.preventDefault();

        setMessage(
            editingId
                ? "Updating supplier..."
                : "Adding supplier..."
        );


        try {

            const url = editingId
                ? `http://localhost:5000/api/suppliers/${editingId}`
                : "http://localhost:5000/api/suppliers";


            const method = editingId
                ? "PUT"
                : "POST";


            const response = await fetch(
                url,
                {
                    method,

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
                    "Failed to save supplier"
                );

            }


            setMessage(
                editingId
                    ? "✅ Supplier updated successfully!"
                    : "✅ Supplier added successfully!"
            );


            setForm({
                name: "",
                phone: "",
                address: "",
                notes: ""
            });


            setEditingId(null);


            await loadSuppliers();


        } catch (error) {

            console.error(error);

            setMessage(
                "❌ Failed to save supplier."
            );

        }

    };


    const editSupplier = (supplier) => {

        setEditingId(supplier._id);

        setForm({
            name: supplier.name || "",
            phone: supplier.phone || "",
            address: supplier.address || "",
            notes: supplier.notes || ""
        });

        setMessage("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    const cancelEdit = () => {

        setEditingId(null);

        setForm({
            name: "",
            phone: "",
            address: "",
            notes: ""
        });

        setMessage("");

    };


    const deleteSupplier = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this supplier?"
        );

        if (!confirmed) return;


        try {

            const response = await fetch(
                `http://localhost:5000/api/suppliers/${id}`,
                {
                    method: "DELETE"
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to delete supplier"
                );

            }


            setSuppliers((prevSuppliers) =>
                prevSuppliers.filter(
                    (supplier) =>
                        supplier._id !== id
                )
            );


            setMessage(
                "✅ Supplier deleted successfully!"
            );


        } catch (error) {

            console.error(error);

            setMessage(
                "❌ Failed to delete supplier."
            );

        }

    };


    const filteredSuppliers =
        suppliers.filter((supplier) => {

            const searchText =
                search.toLowerCase();

            return (
                supplier.name
                    ?.toLowerCase()
                    .includes(searchText) ||

                supplier.phone
                    ?.toLowerCase()
                    .includes(searchText) ||

                supplier.address
                    ?.toLowerCase()
                    .includes(searchText)
            );

        });


    return (
        <div>

            <div className="page-header">

                <div>

                    <h1>Suppliers</h1>

                    <p>
                        Manage your shoe suppliers.
                    </p>

                </div>

            </div>


            <div className="form-card">

                <h2>
                    {editingId
                        ? "Edit Supplier"
                        : "Add Supplier"}
                </h2>


                <form onSubmit={saveSupplier}>

                    <div className="form-grid">

                        <div className="form-group">

                            <label>
                                Supplier Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Supplier name"
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Phone
                            </label>

                            <input
                                type="text"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="Phone number"
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Address
                            </label>

                            <input
                                type="text"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="Supplier address"
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Notes
                            </label>

                            <input
                                type="text"
                                name="notes"
                                value={form.notes}
                                onChange={handleChange}
                                placeholder="Optional notes"
                            />

                        </div>

                    </div>


                    {message && (

                        <p
                            style={{
                                marginTop: "15px"
                            }}
                        >
                            {message}
                        </p>

                    )}


                    <div className="form-actions">

                        {editingId && (

                            <button
                                type="button"
                                className="secondary-btn"
                                onClick={cancelEdit}
                            >
                                Cancel
                            </button>

                        )}


                        <button
                            type="submit"
                            className="primary-btn"
                        >
                            {editingId
                                ? "Update Supplier"
                                : "Add Supplier"}
                        </button>

                    </div>

                </form>

            </div>


            <div className="purchase-card">

                <div className="table-header">

                    <h2>
                        Supplier List
                    </h2>


                    <input
                        type="text"
                        placeholder="Search suppliers..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>


                {filteredSuppliers.length === 0 ? (

                    <p>
                        No suppliers found.
                    </p>

                ) : (

                    <table>

                        <thead>

                            <tr>

                                <th>Name</th>

                                <th>Phone</th>

                                <th>Total Purchases</th>

                                <th>Total Paid</th>

                                <th>Remaining</th>

                                <th>Action</th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredSuppliers.map(
                                (supplier) => (

                                    <tr
                                        key={
                                            supplier._id
                                        }
                                    >

                                        <td>
                                            <strong>
                                                {
                                                    supplier.name
                                                }
                                            </strong>
                                        </td>


                                        <td>
                                            {
                                                supplier.phone ||
                                                "-"
                                            }
                                        </td>


                                        <td>
                                            Rs.{" "}
                                            {Number(
                                                supplier.totalPurchases ||
                                                0
                                            ).toLocaleString()}
                                        </td>


                                        <td>
                                            Rs.{" "}
                                            {Number(
                                                supplier.totalPaid ||
                                                0
                                            ).toLocaleString()}
                                        </td>


                                        <td>
                                            Rs.{" "}
                                            {Number(
                                                supplier.remaining ||
                                                0
                                            ).toLocaleString()}
                                        </td>


                                        <td>
<button
    className="primary-btn"
    onClick={() =>
        window.location.href =
            `/supplier-invoices/${supplier._id}`
    }
>
    Invoices
</button>

{" "}
                                            <button
                                                className="secondary-btn"
                                                onClick={() =>
                                                    editSupplier(
                                                        supplier
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>


                                            {" "}


                                            <button
                                                className="secondary-btn"
                                                onClick={() =>
                                                    deleteSupplier(
                                                        supplier._id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                )}

            </div>

        </div>
    );
}

export default Suppliers;