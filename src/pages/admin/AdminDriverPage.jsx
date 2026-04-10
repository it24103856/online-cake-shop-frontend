import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2, ChevronDown, AlertCircle, CheckCircle } from "lucide-react";

export default function AdminDriverPage() {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingDriver, setEditingDriver] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        vehicleNumber: "",
        address: "",
        licenseNumber: "",
        password: "",
        confirmPassword: "",
    });

    // Fetch all drivers
    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            setLoading(true);
            setError("");
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/drivers/all`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (response.data.success) {
                setDrivers(response.data.data);
            }
        } catch (err) {
            setError("Failed to fetch drivers: " + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        // Validate password for new drivers
        if (!editingDriver && !formData.password) {
            setError("Password is required for new drivers");
            return;
        }

        // Validate password confirmation
        if (formData.password && formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            
            // Prepare data to send
            const dataToSend = {
                name: formData.name,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                vehicleNumber: formData.vehicleNumber,
                address: formData.address,
                licenseNumber: formData.licenseNumber,
                role: "Driver",
            };

            // Only add password if it's provided
            if (formData.password) {
                dataToSend.password = formData.password;
            }

            if (editingDriver) {
                // Update existing driver
                const response = await axios.put(
                    `${import.meta.env.VITE_BACKEND_URL}/drivers/update/${editingDriver._id}`,
                    dataToSend,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (response.data.success) {
                    setSuccessMessage("Driver updated successfully!");
                    fetchDrivers();
                    resetForm();
                }
            } else {
                // Add new driver
                const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/drivers/add`,
                    dataToSend,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (response.data.success) {
                    setSuccessMessage("Driver added successfully!");
                    fetchDrivers();
                    resetForm();
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save driver");
        }
    };

    const handleEdit = (driver) => {
        setEditingDriver(driver);
        setFormData({
            name: driver.name,
            email: driver.email,
            phoneNumber: driver.phoneNumber,
            vehicleNumber: driver.vehicleNumber,
            address: driver.address,
            licenseNumber: driver.licenseNumber,
            password: "",
            confirmPassword: "",
        });
        setShowModal(true);
    };

    const handleDelete = async (driverId) => {
        if (window.confirm("Are you sure you want to delete this driver?")) {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.delete(
                    `${import.meta.env.VITE_BACKEND_URL}/drivers/delete/${driverId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (response.data.success) {
                    setSuccessMessage("Driver deleted successfully!");
                    fetchDrivers();
                }
            } catch (err) {
                setError(err.response?.data?.message || "Failed to delete driver");
            }
        }
    };

    const toggleDriverStatus = async (driverId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.patch(
                `${import.meta.env.VITE_BACKEND_URL}/drivers/toggle-status/${driverId}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (response.data.success) {
                setSuccessMessage(response.data.message);
                fetchDrivers();
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update driver status");
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            phoneNumber: "",
            vehicleNumber: "",
            address: "",
            licenseNumber: "",
            password: "",
            confirmPassword: "",
        });
        setEditingDriver(null);
        setShowModal(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Driver Management</h1>
                    <p className="text-gray-600">Manage delivery drivers for your bakery service</p>
                </div>

                {/* Alert Messages */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3">
                        <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-start gap-3">
                        <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                        <p className="text-green-700">{successMessage}</p>
                    </div>
                )}

                {/* Add Driver Button */}
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="mb-8 inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md"
                >
                    <Plus size={20} />
                    Add New Driver
                </button>

                {/* Loading State */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        <p className="text-gray-600 mt-4">Loading drivers...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Form Section */}
                        {showModal && (
                            <div className="bg-white rounded-lg shadow-lg p-6 h-fit lg:col-span-1">
                                {/* Form Header */}
                                <div className="mb-6 pb-4 border-b border-gray-200 flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {editingDriver ? "Edit Driver" : "Add New Driver"}
                                    </h2>
                                    <button
                                        onClick={resetForm}
                                        className="text-gray-500 hover:text-gray-700 text-2xl"
                                    >
                                        ×
                                    </button>
                                </div>

                                {/* Form Body */}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                            disabled={editingDriver}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Vehicle Number *
                                        </label>
                                        <input
                                            type="text"
                                            name="vehicleNumber"
                                            value={formData.vehicleNumber}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                            placeholder="e.g., ABC-1234"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            License Number
                                        </label>
                                        <input
                                            type="text"
                                            name="licenseNumber"
                                            value={formData.licenseNumber}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Password {!editingDriver && "*"}
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required={!editingDriver}
                                            placeholder={editingDriver ? "Leave blank to keep current password" : "Enter password"}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Confirm Password {!editingDriver && "*"}
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required={!editingDriver}
                                            placeholder={editingDriver ? "Leave blank to keep current password" : "Confirm password"}
                                        />
                                    </div>

                                    {/* Form Footer */}
                                    <div className="flex gap-4 pt-6 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                                        >
                                            {editingDriver ? "Update Driver" : "Add Driver"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Table Section */}
                        <div className={showModal ? "lg:col-span-2" : "lg:col-span-3"}>
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            {drivers.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <p>No drivers added yet. Click "Add New Driver" to get started.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-200">
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                                    Name
                                                </th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                                    Email
                                                </th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                                    Phone
                                                </th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                                    Vehicle Number
                                                </th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                                    Status
                                                </th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {drivers.map((driver) => (
                                                <tr
                                                    key={driver._id}
                                                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                                >
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                        {driver.name}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {driver.email}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {driver.phoneNumber}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {driver.vehicleNumber}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <button
                                                            onClick={() => toggleDriverStatus(driver._id)}
                                                            className={`px-4 py-2 rounded-full font-semibold text-white transition-colors ${
                                                                driver.isActive
                                                                    ? "bg-green-500 hover:bg-green-600"
                                                                    : "bg-gray-500 hover:bg-gray-600"
                                                            }`}
                                                        >
                                                            {driver.isActive ? "Active" : "Inactive"}
                                                        </button>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleEdit(driver)}
                                                                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                                            >
                                                                <Edit2 size={16} />
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(driver._id)}
                                                                className="inline-flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                                            >
                                                                <Trash2 size={16} />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
