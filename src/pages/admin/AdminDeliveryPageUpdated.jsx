import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import DriverSelect from "../components/DriverSelect";

export default function AdminDeliveryPage() {
    const [orders, setOrders] = useState([]);
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [selectedOrderId, setSelectedOrderId] = useState("");
    const [selectedDriverId, setSelectedDriverId] = useState("");
    const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState("");

    // Fetch orders and deliveries
    useEffect(() => {
        fetchOrders();
        fetchDeliveries();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/orders/all`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (response.data.success) {
                // Filter orders that don't have deliveries assigned
                setOrders(response.data.data);
            }
        } catch (err) {
            console.error("Error fetching orders:", err);
        }
    };

    const fetchDeliveries = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/deliveries/all`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (response.data.success) {
                setDeliveries(response.data.data);
            }
        } catch (err) {
            console.error("Error fetching deliveries:", err);
        }
    };

    const handleAssignDelivery = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (!selectedOrderId || !selectedDriverId) {
            setError("Please select both an order and a driver");
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/deliveries/assign`,
                {
                    orderID: selectedOrderId,
                    driverId: selectedDriverId,
                    estimatedDeliveryTime: estimatedDeliveryTime || "",
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data.success) {
                setSuccessMessage("Delivery assigned successfully!");
                resetForm();
                fetchDeliveries();
                fetchOrders();
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to assign delivery");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setSelectedOrderId("");
        setSelectedDriverId("");
        setEstimatedDeliveryTime("");
    };

    // Get unassigned orders
    const unassignedOrders = orders.filter(
        (order) => !deliveries.some((d) => d.orderID?._id === order._id)
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Delivery Management</h1>
                    <p className="text-gray-600">Assign drivers to orders and track delivery status</p>
                </div>

                {/* Assign Delivery Section */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Assign Driver to Order</h2>

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

                    <form onSubmit={handleAssignDelivery} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Select Order */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Select Order *
                                </label>
                                <select
                                    value={selectedOrderId}
                                    onChange={(e) => setSelectedOrderId(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                >
                                    <option value="">Choose an order</option>
                                    {unassignedOrders.map((order) => (
                                        <option key={order._id} value={order._id}>
                                            Order #{order._id.slice(-6)} - {order.customer || "Unknown"} - LKR.{order.totalPrice}
                                        </option>
                                    ))}
                                </select>
                                {unassignedOrders.length === 0 && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        All orders have drivers assigned.
                                    </p>
                                )}
                            </div>

                            {/* Select Driver - Using DriverSelect Component */}
                            <div>
                                <DriverSelect
                                    selectedDriverId={selectedDriverId}
                                    onDriverSelect={setSelectedDriverId}
                                />
                            </div>
                        </div>

                        {/* Estimated Delivery Time */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Estimated Delivery Time
                            </label>
                            <input
                                type="datetime-local"
                                value={estimatedDeliveryTime}
                                onChange={(e) => setEstimatedDeliveryTime(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || unassignedOrders.length === 0}
                            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 size={20} className="animate-spin" />}
                            {loading ? "Assigning..." : "Assign Driver"}
                        </button>
                    </form>
                </div>

                {/* Active Deliveries Section */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Active Deliveries</h2>

                    {deliveries.length === 0 ? (
                        <p className="text-center py-8 text-gray-500">No deliveries assigned yet</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Order ID
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Driver
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Vehicle
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Est. Delivery Time
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {deliveries.map((delivery) => (
                                        <tr
                                            key={delivery._id}
                                            className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                #{delivery.orderID?._id?.slice(-6) || "N/A"}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {delivery.deliveryPerson?.name || "Unknown"}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {delivery.vehicleNumber || "N/A"}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
                                                        delivery.deliveryStatus === "Delivered"
                                                            ? "bg-green-500"
                                                            : delivery.deliveryStatus === "Out for Delivery"
                                                            ? "bg-blue-500"
                                                            : delivery.deliveryStatus === "Cancelled"
                                                            ? "bg-red-500"
                                                            : "bg-gray-500"
                                                    }`}
                                                >
                                                    {delivery.deliveryStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {delivery.estimatedDeliveryTime || "Not set"}
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
    );
}
