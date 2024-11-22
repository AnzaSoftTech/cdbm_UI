import jsPDF from "jspdf";
import "jspdf-autotable";

/**
 * Generates a single PDF document with custom page dimensions.
 * @param {Object} companyDetails - Details of the company.
 * @param {Array} excDetails - Exchange details array.
 * @param {Object} note - Contract note details.
 * @returns {Blob} - PDF Blob.
 */
export const generateSinglePDF = (companyDetails, excDetails, note) => {
    console.log("Generating PDF with Company Details:", companyDetails);
    console.log("Exchange Details:", excDetails);
    console.log("Contract Note:", note);

    // Create a new jsPDF instance with custom page dimensions
    const pdfDoc = new jsPDF({
        orientation: "portrait", // "portrait" or "landscape"
        unit: "mm", // Units: "mm", "pt", "cm", "in"
        format: [397, 460], // Custom dimensions: Width x Height in mm (e.g., A3 size: 297mm x 420mm)
    });

    const safeText = (value) => (value ? String(value) : "N/A");

    // Add company details
    pdfDoc.setFontSize(14);
    pdfDoc.text("Company Details", 10, 10);
    pdfDoc.setFontSize(12);
    pdfDoc.text(`Name: ${safeText(companyDetails?.name)}`, 10, 20);
    pdfDoc.text(`Address: ${safeText(companyDetails?.address)}`, 10, 30);

    // Add exchange details
    pdfDoc.setFontSize(14);
    pdfDoc.text("Exchange Details", 10, 50);
    pdfDoc.autoTable({
        startY: 60,
        head: [["Exchange Name", "Segment", "Clearing No", "Trading No", "CMBP ID", "SEBI Reg"]],
        body: excDetails.map((exc) => [
            safeText(exc.exc_name),
            safeText(exc.segment),
            safeText(exc.clearing_no),
            safeText(exc.trading_no),
            safeText(exc.cmbp_id),
            safeText(exc.sebi_reg),
        ]),
        styles: {
            lineWidth: 0.1,
            lineColor: [0, 0, 0],
            fontSize: 10,
            minCellHeight: 10,
            cellPadding: 4,
        },
        tableLineColor: [0, 0, 0],
        tableLineWidth: 0.2,
    });

    // Add contract note details
    pdfDoc.setFontSize(14);
    pdfDoc.text("Contract Note Details", 10, pdfDoc.autoTable.previous.finalY + 10);
    pdfDoc.autoTable({
        startY: pdfDoc.autoTable.previous.finalY + 20,
        head: [["Field", "Value"]],
        body: Object.entries(note).map(([key, value]) => [key, safeText(value)]),
        styles: {
            fontSize: 10,
            minCellHeight: 10,
            cellPadding: 4,
        },
    });

    // Add security summary
    if (note.security_summary && note.security_summary.length > 0) {
        pdfDoc.setFontSize(14);
        pdfDoc.text("Security Summary", 10, pdfDoc.autoTable.previous.finalY + 10);
        pdfDoc.autoTable({
            startY: pdfDoc.autoTable.previous.finalY + 20,
            head: [
                [
                    "ISIN",
                    "Scrip Code",
                    "Series",
                    "Buy Qty",
                    "Buy WAP",
                    "Buy WAP After Brokerage",
                    "Sale Qty",
                    "Sale WAP",
                    "Sale WAP After Brokerage",
                    "Net Qty",
                    "Net Obligation",
                ],
            ],
            body: note.security_summary.map((security) => [
                safeText(security.isin),
                safeText(security.scrip_cd),
                safeText(security.series),
                safeText(security.buy_qty),
                safeText(security.buy_wap),
                safeText(security.buy_wap_aft_brok),
                safeText(security.sale_qty),
                safeText(security.sale_wap),
                safeText(security.sale_wap_aft_brok),
                safeText(security.net_qty),
                safeText(security.net_oblig),
            ]),
            styles: {
                lineWidth: 0.1,
                lineColor: [0, 0, 0],
                fontSize: 10,
                minCellHeight: 10,
                cellPadding: 4,
            },
            tableLineColor: [0, 0, 0],
            tableLineWidth: 0.2,
        });
    } else {
        pdfDoc.setFontSize(12);
        pdfDoc.text("No security summary available.", 10, pdfDoc.autoTable.previous.finalY + 10);
    }
    // Add GST summary
    if (note.GST_summary && note.GST_summary.length > 0) {
        pdfDoc.setFontSize(14);
        pdfDoc.text("GST Summary", 10, pdfDoc.autoTable.previous.finalY + 10);
        pdfDoc.autoTable({
            startY: pdfDoc.autoTable.previous.finalY + 20,
            head: [
                [
                    "brok_cgst",
                    "brok_igst",
                    "brok_sgst",
                    "isin",
                    "net_oblig",
                    "other_chrg",
                    "scrip_cd",
                    "sebi_turnover",
                    "series",
                    "stamp_duty",
                    "stt_chrg",
                    "taxable_val",
                ],
            ],
            body: note.GST_summary.map((security) => [
                safeText(security.brok_cgst),
                safeText(security.brok_igst),
                safeText(security.brok_sgst),
                safeText(security.isin),
                safeText(security.net_oblig),
                safeText(security.other_chrg),
                safeText(security.scrip_cd),
                safeText(security.sebi_turnover),
                safeText(security.series),
                safeText(security.stamp_duty),
                safeText(security.stt_chrg),
                safeText(security.taxable_val),
            ]),
            styles: {
                lineWidth: 0.1,
                lineColor: [0, 0, 0],
                fontSize: 10,
                minCellHeight: 10,
                cellPadding: 4,
            },
            tableLineColor: [0, 0, 0],
            tableLineWidth: 0.2,
        });
    } else {
        pdfDoc.setFontSize(12);
        pdfDoc.text("No GST summary available.", 10, pdfDoc.autoTable.previous.finalY + 10);
    }
    // Add DETAILD summary
    if (note.Detailed && note.Detailed.length > 0) {
        pdfDoc.setFontSize(14);
        pdfDoc.text("Details Summary", 10, pdfDoc.autoTable.previous.finalY + 10);
        pdfDoc.autoTable({
            startY: pdfDoc.autoTable.previous.finalY + 20,
            head: [
                [
                    "brok_per_unit",
                    "buy_sell",
                    "gross_rate",
                    "isin",
                    "net_rate",
                    "ord_no",
                    "order_time",
                    "trade_time",
                    "trd_no",
                    "trd_qty",
                    "trd_sec_cd",
                    "trd_series",
                ],
            ],
            body: note.Detailed.map((security) => [
                safeText(security.brok_per_unit),
                safeText(security.buy_sell),
                safeText(security.gross_rate),
                safeText(security.isin),
                safeText(security.net_rate),
                safeText(security.ord_no),
                safeText(security.order_time),
                safeText(security.trade_time),
                safeText(security.trd_no),
                safeText(security.trd_qty),
                safeText(security.trd_sec_cd),
                safeText(security.trd_series),
            ]),
            styles: {
                lineWidth: 0.1,
                lineColor: [0, 0, 0],
                fontSize: 10,
                minCellHeight: 10,
                cellPadding: 4,
            },
            tableLineColor: [0, 0, 0],
            tableLineWidth: 0.2,
        });
    } else {
        pdfDoc.setFontSize(12);
        pdfDoc.text("No Details summary available.", 10, pdfDoc.autoTable.previous.finalY + 10);
    }

    return pdfDoc.output("blob");
};




/**
 * Generates multiple PDFs and returns them in a ZIP file.
 * @param {Array} contractNotes - List of contract notes.
 * @param {Object} companyDetails - Company details.
 * @param {Array} excDetails - Exchange details array.
 * @returns {Promise<Blob>} - ZIP Blob.
 */
export const generateAllPDFsAsZIP = async (contractNotes, companyDetails, excDetails) => {
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();

    for (let note of contractNotes) {
        const pdfBlob = generateSinglePDF(companyDetails, excDetails, note);
        const pdfFileName = `Contract_Note_${note.cont_note_no}_${note.client_cd}_${note.trd_settle_no}.pdf`;
        zip.file(pdfFileName, pdfBlob);
    }

    return zip.generateAsync({ type: "blob" });
};
