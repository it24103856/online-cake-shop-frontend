import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Download, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function DownloadReportButton() {
    const [isLoading, setIsLoading] = useState(false);

    const generatePDF = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/reports/full-report`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (!response.data.success) {
                throw new Error("Failed to fetch report data");
            }

            const report = response.data.data;
            const pdf = new jsPDF();
            let yPosition = 10;
            const pageHeight = pdf.internal.pageSize.height;
            const pageWidth = pdf.internal.pageSize.width;
            const margin = 10;
            const today = new Date().toLocaleDateString("en-US");
            const adminName = localStorage.getItem("adminName") || "Admin";

            // Header
            pdf.setFontSize(24);
            pdf.setTextColor(40, 40, 40);
            pdf.text("Business Performance Report", pageWidth / 2, yPosition + 5, { align: "center" });

            yPosition += 12;
            pdf.setFontSize(10);
            pdf.setTextColor(100, 100, 100);
            pdf.text(`Generated: ${today}`, margin, yPosition);
            pdf.text(`Admin: ${adminName}`, pageWidth - margin, yPosition, { align: "right" });

            yPosition += 8;
            pdf.setDrawColor(200, 200, 200);
            pdf.line(margin, yPosition, pageWidth - margin, yPosition);

            yPosition += 8;

            // Helper function to check and add new page
            const checkNewPage = (requiredHeight) => {
                if (yPosition + requiredHeight > pageHeight - 10) {
                    pdf.addPage();
                    yPosition = 10;
                }
            };

            // Section 1: User Accounts
            checkNewPage(40);
            pdf.setFontSize(14);
            pdf.setTextColor(40, 40, 40);
            pdf.text("User Accounts", margin, yPosition);
            yPosition += 6;

            const userTableData = report.users.map(u => [
                u.name,
                u.email,
                u.registrationDate
            ]);

            autoTable(pdf, {
                startY: yPosition,
                head: [["Name", "Email", "Registration Date"]],
                body: userTableData,
                theme: "grid",
                headStyles: {
                    fillColor: [60, 60, 60],
                    textColor: [255, 255, 255],
                    fontStyle: "bold"
                },
                bodyStyles: {
                    textColor: [80, 80, 80]
                },
                alternateRowStyles: {
                    fillColor: [240, 240, 240]
                },
                margin: margin
            });

            yPosition = (pdf.lastAutoTable?.finalY || yPosition) + 8;

            // Section 2: Cakes & Accessories
            checkNewPage(40);
            pdf.setFontSize(14);
            pdf.setTextColor(40, 40, 40);
            pdf.text("Cakes & Accessories", margin, yPosition);
            yPosition += 6;

            const productTableData = report.products.map(p => [
                p.name,
                p.category,
                p.type,
                `LKR ${p.price.toFixed(2)}`,
                p.stock.toString()
            ]);

            autoTable(pdf, {
                startY: yPosition,
                head: [["Item Name", "Category", "Type", "Price", "Stock"]],
                body: productTableData,
                theme: "grid",
                headStyles: {
                    fillColor: [60, 60, 60],
                    textColor: [255, 255, 255],
                    fontStyle: "bold"
                },
                bodyStyles: {
                    textColor: [80, 80, 80]
                },
                alternateRowStyles: {
                    fillColor: [240, 240, 240]
                },
                margin: margin
            });

            yPosition = (pdf.lastAutoTable?.finalY || yPosition) + 8;

            // Section 3: Order Summary
            checkNewPage(40);
            pdf.setFontSize(14);
            pdf.setTextColor(40, 40, 40);
            pdf.text("Order Summary", margin, yPosition);
            yPosition += 6;

            const orderTableData = report.orders.map(o => [
                o.orderID,
                o.customerName,
                o.items.substring(0, 30),
                o.orderDate,
                `LKR ${o.totalPrice.toFixed(2)}`
            ]);

            autoTable(pdf, {
                startY: yPosition,
                head: [["Order ID", "Customer", "Items", "Date", "Total"]],
                body: orderTableData,
                theme: "grid",
                headStyles: {
                    fillColor: [60, 60, 60],
                    textColor: [255, 255, 255],
                    fontStyle: "bold"
                },
                bodyStyles: {
                    textColor: [80, 80, 80]
                },
                alternateRowStyles: {
                    fillColor: [240, 240, 240]
                },
                margin: margin
            });

            yPosition = (pdf.lastAutoTable?.finalY || yPosition) + 8;

            // Section 4: Payment Details
            checkNewPage(40);
            pdf.setFontSize(14);
            pdf.setTextColor(40, 40, 40);
            pdf.text("Payment Details", margin, yPosition);
            yPosition += 6;

            const paymentTableData = report.payments.map(p => [
                p.transactionID,
                p.amount,
                p.method,
                p.status,
                p.date
            ]);

            autoTable(pdf, {
                startY: yPosition,
                head: [["Transaction ID", "Amount", "Method", "Status", "Date"]],
                body: paymentTableData,
                theme: "grid",
                headStyles: {
                    fillColor: [60, 60, 60],
                    textColor: [255, 255, 255],
                    fontStyle: "bold"
                },
                bodyStyles: {
                    textColor: [80, 80, 80]
                },
                alternateRowStyles: {
                    fillColor: [240, 240, 240]
                },
                margin: margin
            });

            yPosition = (pdf.lastAutoTable?.finalY || yPosition) + 8;

            // Section 5: Delivery Status
            checkNewPage(40);
            pdf.setFontSize(14);
            pdf.setTextColor(40, 40, 40);
            pdf.text("Delivery Status", margin, yPosition);
            yPosition += 6;

            const deliveryTableData = report.deliveries.map(d => [
                d.deliveryID,
                d.orderID,
                d.rider,
                d.status,
                d.date
            ]);

            autoTable(pdf, {
                startY: yPosition,
                head: [["Delivery ID", "Order ID", "Assigned Rider", "Status", "Date"]],
                body: deliveryTableData,
                theme: "grid",
                headStyles: {
                    fillColor: [60, 60, 60],
                    textColor: [255, 255, 255],
                    fontStyle: "bold"
                },
                bodyStyles: {
                    textColor: [80, 80, 80]
                },
                alternateRowStyles: {
                    fillColor: [240, 240, 240]
                },
                margin: margin
            });

            const totalPages = pdf.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.setFontSize(9);
                pdf.setTextColor(150, 150, 150);
                pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 5, { align: "center" });
            }

            // Download PDF
            pdf.save(`Business_Report_${today.replace(/\//g, "-")}.pdf`);
            toast.success("Report downloaded successfully!");
        } catch (error) {
            console.error("PDF generation error:", error);
            toast.error("Failed to generate report");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={generatePDF}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-gray-900 to-black text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-xs"
        >
            {isLoading ? (
                <>
                    <Loader2 className="animate-spin" size={18} />
                    Generating...
                </>
            ) : (
                <>
                    <Download size={18} />
                    Download Full Report
                </>
            )}
        </button>
    );
}
