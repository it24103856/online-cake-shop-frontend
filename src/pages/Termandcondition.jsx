import React from "react";
import { FileText, AlertTriangle, CreditCard } from "lucide-react";
import Footer from "../components/Footer";

export default function Termandcondition() {
    return (
        <main className="w-full min-h-screen bg-[#FDF8F0]">
            <section
                className="relative h-[55vh] flex items-center justify-center bg-fixed bg-center bg-cover"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1535141192574-5d4897c12636?q=80&w=1976&auto=format&fit=crop')",
                }}
            >
                <div className="absolute inset-0 bg-black/45"></div>
                <div className="relative z-10 text-center text-white px-4 max-w-7xl mx-auto">
                    <p className="uppercase text-[11px] tracking-[0.4em] font-semibold text-white/70 mb-4">
                        Policy Notice
                    </p>
                    <h1
                        className="text-5xl md:text-7xl font-bold tracking-tight"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Terms & Conditions
                    </h1>
                    <p className="mt-4 text-lg md:text-xl font-light max-w-2xl mx-auto text-white/90">
                        Please read these terms before placing your order.
                    </p>
                </div>
            </section>

            <section className="max-w-6xl mx-auto py-20 px-4">
                <div className="bg-white rounded-[2.5rem] shadow-xl border border-rose-100 p-8 md:p-12">
                    <div className="flex items-center gap-3 mb-8">
                        <FileText className="text-rose-500" size={28} />
                        <h2
                            className="text-3xl md:text-4xl font-bold text-gray-900"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Order Policy
                        </h2>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-3xl border border-rose-100 bg-rose-50/40 p-6">
                            <div className="flex items-start gap-3">
                                <CreditCard className="text-rose-500 mt-1" size={22} />
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">1. Cancellation After Payment</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        After payment is completed, the order cannot be cancelled.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-rose-100 bg-rose-50/40 p-6">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="text-rose-500 mt-1" size={22} />
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">2. Cancellation Charge</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        If a cancellation is approved, an additional LKR 3,000 cancellation charge will be applied.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}