import jsPDF from "jspdf";
import type { BookingOrder } from "@/components/screens/BookingsScreen";
import type { WiringGuideData } from "@/data/wiringGuides";
import type { Product } from "@/types";

/**
 * Generates and downloads a real, official Accele Electronics Wholesale Invoice PDF
 */
export function generateInvoicePdf(order: BookingOrder) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Top Accent Banner
  doc.setFillColor(245, 37, 56); // #f52538 (Accele Red)
  doc.rect(0, 0, pageWidth, 5, "F");

  // Header Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // #0f172a
  doc.text("ACCELE", 15, 20);

  doc.setTextColor(245, 37, 56);
  doc.text("PRO", 50, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text("COMMERCIAL 12V AUTOMOTIVE HARDWARE", 15, 25);
  doc.text("Accele Electronics, Inc. • 1-800-998-8090 • orders@accele.com", 15, 29);

  // Invoice Tag (Top Right)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text("WHOLESALE INVOICE", pageWidth - 15, 20, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(245, 37, 56);
  doc.text(`INVOICE: ${order.id}`, pageWidth - 15, 26, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`DATE: ${order.date || new Date().toLocaleDateString()}`, pageWidth - 15, 30, { align: "right" });
  doc.text(`TERMS: NET 30 WHOLESALE`, pageWidth - 15, 34, { align: "right" });

  // Divider Line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(15, 38, pageWidth - 15, 38);

  // Bill To & Account Details Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, 42, pageWidth - 30, 28, 2, 2, "F");
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, 42, pageWidth - 30, 28, 2, 2, "D");

  // Left column: Bill To
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(245, 37, 56);
  doc.text("BILLED ACCOUNT:", 20, 48);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("Apex 12V Autoworks (Tier 1 Certified Bay)", 20, 54);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text("Attention: Marcus Vance (Lead Bay Technician)", 20, 59);
  doc.text("Tax ID: AZ-9948210-W • Acct: ACC-8910-US", 20, 64);

  // Right column: PO & Dispatch
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(245, 37, 56);
  doc.text("PURCHASE ORDER & DISPATCH:", 115, 48);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`PO Number: ${order.poNumber}`, 115, 54);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Tracking Number: ${order.trackingNumber}`, 115, 59);
  doc.text(`Carrier: ${order.carrier || "FedEx Ground"} (ETA: ${order.eta})`, 115, 64);

  // Table Header
  const startY = 76;
  doc.setFillColor(15, 23, 42);
  doc.rect(15, startY, pageWidth - 30, 8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text("ITEM / HARDWARE DESCRIPTION", 20, startY + 5.5);
  doc.text("QTY", 125, startY + 5.5, { align: "center" });
  doc.text("UNIT (TIER 1)", 155, startY + 5.5, { align: "right" });
  doc.text("TOTAL AMOUNT", pageWidth - 20, startY + 5.5, { align: "right" });

  // Table Rows
  let curY = startY + 8;
  order.items.forEach((item, index) => {
    const isEven = index % 2 === 0;
    if (isEven) {
      doc.setFillColor(255, 255, 255);
    } else {
      doc.setFillColor(248, 250, 252);
    }
    doc.rect(15, curY, pageWidth - 30, 10, "F");
    doc.setDrawColor(241, 245, 249);
    doc.line(15, curY + 10, pageWidth - 15, curY + 10);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);

    const productName = item.product.name.length > 52 
      ? item.product.name.substring(0, 50) + "..." 
      : item.product.name;
    doc.text(productName, 20, curY + 4.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`SKU: ${item.product.sku} • Category: ${item.product.category.toUpperCase()}`, 20, curY + 8.5);

    // Qty
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(String(item.quantity), 125, curY + 6.5, { align: "center" });

    // Unit Price
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(`$${item.product.price.toFixed(2)}`, 155, curY + 6.5, { align: "right" });

    // Total Line
    const lineTotal = item.quantity * item.product.price;
    doc.setFont("helvetica", "bold");
    doc.text(`$${lineTotal.toFixed(2)}`, pageWidth - 20, curY + 6.5, { align: "right" });

    curY += 10;
  });

  // Totals Area
  curY += 6;
  const totalsX = pageWidth - 80;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("Subtotal:", totalsX, curY);
  doc.setTextColor(15, 23, 42);
  doc.text(`$${order.total.toFixed(2)}`, pageWidth - 20, curY, { align: "right" });

  curY += 5.5;
  doc.setTextColor(100, 116, 139);
  doc.text("Dealer Tier 1 Discount (Applied):", totalsX, curY);
  doc.setTextColor(16, 185, 129); // emerald
  doc.text("INCLUDED", pageWidth - 20, curY, { align: "right" });

  curY += 5.5;
  doc.setTextColor(100, 116, 139);
  doc.text("Commercial Freight (Ground):", totalsX, curY);
  doc.setTextColor(15, 23, 42);
  doc.text("$0.00 (Prepaid)", pageWidth - 20, curY, { align: "right" });

  curY += 6;
  doc.setDrawColor(226, 232, 240);
  doc.line(totalsX - 5, curY, pageWidth - 15, curY);

  curY += 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("TOTAL DUE (NET 30):", totalsX, curY);

  doc.setTextColor(245, 37, 56);
  doc.setFontSize(14);
  doc.text(`$${order.total.toFixed(2)}`, pageWidth - 20, curY, { align: "right" });

  // Remittance & Terms Note Box (Bottom Left)
  const remY = curY - 14;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, remY, 95, 28, 2, 2, "F");
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, remY, 95, 28, 2, 2, "D");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("PAYMENT REMITTANCE INSTRUCTIONS:", 19, remY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Bank: Chase Commercial Treasury Services", 19, remY + 11);
  doc.text("Routing (ACH): 122000496 • Acct: 8901429910", 19, remY + 16);
  doc.text("Remit Email: receivables@accele.com", 19, remY + 21);
  doc.text("Reference Invoice Number on all wire transfers.", 19, remY + 25);

  // Footer & Guarantee
  const footerY = pageHeight - 16;
  doc.setDrawColor(226, 232, 240);
  doc.line(15, footerY - 5, pageWidth - 15, footerY - 5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("ACCELE ELECTRONICS, INC. • COMMERCIAL FLEET DIVISION", 15, footerY);

  doc.setFont("helvetica", "normal");
  doc.text("ISO 9001:2015 Registered • All hardware backed by 3-Year Bay Advance Swap Warranty.", 15, footerY + 4);

  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 15, footerY + 4, { align: "right" });

  // Trigger Save / Direct Download
  doc.save(`Accele_Invoice_${order.id}.pdf`);
}

/**
 * Generates and downloads an official Accele Technical Bay Installation Manual PDF
 */
export function generateBayGuidePdf(guide: WiringGuideData, product?: Product) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const sku = product?.sku || "AC-BAY-SPEC";
  const productName = product?.name || guide.title;

  // Header Banner
  doc.setFillColor(245, 37, 56);
  doc.rect(0, 0, pageWidth, 5, "F");

  // Logo & Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42);
  doc.text("ACCELE", 15, 20);

  doc.setTextColor(245, 37, 56);
  doc.text("PRO", 47, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text("12V AUTOMOTIVE ENGINEERING BAY GUIDE", 15, 25);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(guide.docNumber, pageWidth - 15, 18, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("ISO 9001:2015 / SAE J1113 CERTIFIED", pageWidth - 15, 23, { align: "right" });

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.line(15, 30, pageWidth - 15, 30);

  // Hardware Details Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, 34, pageWidth - 30, 22, 2, 2, "F");
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, 34, pageWidth - 30, 22, 2, 2, "D");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(245, 37, 56);
  doc.text(`MODEL SKU: ${sku}`, 20, 41);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(productName, 20, 47);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`${guide.title} — ${guide.subtitle}`, 20, 52);

  // Pinout Table
  const tableY = 62;
  doc.setFillColor(15, 23, 42);
  doc.rect(15, tableY, pageWidth - 30, 8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text("PIN / WIRE LEAD", 20, tableY + 5.5);
  doc.text("CIRCUIT DESIGNATION & FUNCTION", 75, tableY + 5.5);
  doc.text("OPERATIONAL VOLTAGE / RANGE", pageWidth - 20, tableY + 5.5, { align: "right" });

  let rowY = tableY + 8;
  guide.pins.forEach((pin, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(255, 255, 255);
    } else {
      doc.setFillColor(248, 250, 252);
    }
    doc.rect(15, rowY, pageWidth - 30, 9, "F");
    doc.setDrawColor(241, 245, 249);
    doc.line(15, rowY + 9, pageWidth - 15, rowY + 9);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(pin.label, 20, rowY + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(pin.desc, 75, rowY + 6);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text(pin.voltage, pageWidth - 20, rowY + 6, { align: "right" });

    rowY += 9;
  });

  // Critical Note Box
  rowY += 6;
  doc.setFillColor(254, 243, 199); // Amber-100
  doc.roundedRect(15, rowY, pageWidth - 30, 20, 2, 2, "F");
  doc.setDrawColor(245, 158, 11); // Amber-500
  doc.roundedRect(15, rowY, pageWidth - 30, 20, 2, 2, "D");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(180, 83, 9); // Amber-700
  doc.text("CRITICAL BAY ADVISORY / LOOP CONFIGURATION:", 20, rowY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(146, 64, 14); // Amber-800
  const splitNote = doc.splitTextToSize(guide.note, pageWidth - 40);
  doc.text(splitNote, 20, rowY + 11);

  // Installation Protocol
  rowY += 26;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("STANDARD INSTALLATION PROTOCOL:", 15, rowY);

  rowY += 5;
  guide.instructions.forEach((step, idx) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(245, 37, 56);
    doc.text(`${idx + 1}.`, 18, rowY + 4);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    const splitStep = doc.splitTextToSize(step, pageWidth - 45);
    doc.text(splitStep, 25, rowY + 4);
    rowY += 7 * splitStep.length;
  });

  // Footer
  const footerY = pageHeight - 16;
  doc.setDrawColor(226, 232, 240);
  doc.line(15, footerY - 5, pageWidth - 15, footerY - 5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Accele Electronics, Inc. • Technical Operations Bay Support", 15, footerY);
  doc.text("Toll-Free Bay Hotline: 1-800-998-8090 • www.accele.com", 15, footerY + 4);

  doc.text(`Printed: ${new Date().toLocaleString()}`, pageWidth - 15, footerY + 4, { align: "right" });

  doc.save(`Accele_Bay_Guide_${sku}.pdf`);
}
