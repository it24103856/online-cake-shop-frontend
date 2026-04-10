import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, AlertCircle } from "lucide-react";

export default function DriverSelect({ selectedDriverId, onDriverSelect }) {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        fetchActiveDrivers();
    }, []);

    const fetchActiveDrivers = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/drivers/active`
            );
            if (response.data.success) {
                setDrivers(response.data.data);
            }
        } catch (err) {
            setError("Failed to load drivers");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const selectedDriver = drivers.find((d) => d._id === selectedDriverId);

    return (
        <div className="w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Driver *
            </label>

            {error && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}

            <div className="relative">
                {/* Dropdown Button */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    disabled={loading || drivers.length === 0}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                >
                    <span className={selectedDriver ? "text-gray-900" : "text-gray-500"}>
                        {loading ? "Loading drivers..." : selectedDriver ? (
                            <div>
                                <p className="font-semibold">{selectedDriver.name}</p>
                                <p className="text-xs text-gray-500">{selectedDriver.vehicleNumber} • {selectedDriver.phoneNumber}</p>
                            </div>
                        ) : (
                            "Choose a driver"
                        )}
                    </span>
                    <ChevronDown
                        size={20}
                        className={`text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                </button>

                {/* Dropdown Menu */}
                {isOpen && drivers.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                        {drivers.map((driver) => (
                            <button
                                key={driver._id}
                                type="button"
                                onClick={() => {
                                    onDriverSelect(driver._id);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-4 py-3 text-left hover:bg-indigo-50 focus:outline-none transition-colors border-b last:border-b-0 ${
                                    selectedDriverId === driver._id ? "bg-indigo-100" : ""
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-semibold text-gray-900">{driver.name}</p>
                                        <p className="text-sm text-gray-600">{driver.email}</p>
                                        <div className="flex gap-4 mt-1 text-xs text-gray-500">
                                            <span>📱 {driver.phoneNumber}</span>
                                            <span>🚗 {driver.vehicleNumber}</span>
                                        </div>
                                    </div>
                                    {selectedDriverId === driver._id && (
                                        <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* No Drivers State */}
                {!loading && drivers.length === 0 && !error && (
                    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
                        No active drivers available. Please add drivers from the admin panel.
                    </div>
                )}
            </div>
        </div>
    );
}
