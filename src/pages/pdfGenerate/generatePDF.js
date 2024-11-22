import jsPDF from "jspdf";
import "jspdf-autotable";

/**
 * Loads an image as a Base64 string.
 * @param {string} url - The URL of the image to load.
 * @returns {Promise<string>} - A promise that resolves with the Base64 string of the image.
 */
const loadImageAsBase64 = (url) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous"; // Handle CORS
        img.src = url;

        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL("image/png"));
        };

        img.onerror = (err) => {
            reject(new Error("Failed to load image: " + url));
        };
    });
};

/**
 * Generates a single PDF document with a fixed custom header.
 * @param {Object} companyDetails - Details of the company.
 * @param {Array} excDetails - Exchange details array.
 * @param {Object} note - Contract note details.
 * @returns {Promise<Blob>} - PDF Blob.
 */
export const generateSinglePDF = async (companyDetails, excDetails, note) => {
    console.log("Generating PDF with Company Details:", companyDetails);
    console.log("Exchange Details:", excDetails);
    console.log("Contract Note:", note);

    // Create a new jsPDF instance
    const pdfDoc = new jsPDF({
        orientation: "portrait", // "portrait" or "landscape"
        unit: "mm", // Units: "mm", "pt", "cm", "in"
        format: [397, 460], // Custom dimensions: Width x Height in mm (e.g., A3 size: 297mm x 420mm)
    });

    const safeText = (value) => (value ? String(value) : "N/A");

    const pageWidth = pdfDoc.internal.pageSize.getWidth();
    const margin = 10; // Margin from the edge

    // Load image and add it to the top-left corner
    try {
        const imageUrl = `${window.location.origin}/image.png`;
        const imageBase64 = await loadImageAsBase64(imageUrl);
        pdfDoc.addImage(imageBase64, "PNG", margin, margin, 30, 30); // X, Y, Width, Height
    } catch (error) {
        console.error("Image loading error:", error);
    }

    // Title and Centered Company Information

    pdfDoc.setFontSize(10);
    pdfDoc.text("CONTRACT NOTE CUM TAX INVOICE", pageWidth / 2, margin + 8, {
        align: "center",
    });

    pdfDoc.setFont("helvetica", "normal");
    pdfDoc.setFontSize(10);
    pdfDoc.text("(TAX INVOICE UNDER SECTION 31 OF GST ACT)", pageWidth / 2, margin + 15, {
        align: "center",
    });
    pdfDoc.setFont("helvetica", "bold");
    pdfDoc.setFontSize(16);
    pdfDoc.text(`${safeText(companyDetails?.comp_name)}`, pageWidth / 2, margin + 22, {
        align: "center",
    });

    pdfDoc.setFontSize(10);
    pdfDoc.text(
        "MEMBER: NATIONAL STOCK EXCHANGE OF INDIA LTD",
        pageWidth / 2, margin + 27,
        { align: "center" }
    );
    pdfDoc.text(
        "SEBI REGN. NO. INZ000242534 • TRADING CODE NO: 23/10245 • CM BP ID: IN554382",
        pageWidth / 2, margin + 32,
        { align: "center" }
    );
    pdfDoc.text(
        "CIN: U67120MH1997PLC108674 • GSTIN: 27AABCS • PAN NO AABCS9766K",
        pageWidth / 2, margin + 38,
        { align: "center" }
    );
    pdfDoc.text(
        `Compliance Officer: Anil Sodhani • Phone: ${safeText(companyDetails?.phone)} • Email: ${safeText(companyDetails?.email)}`,
        pageWidth / 2, margin + 42,
        { align: "center" }
    );

    // Company Address in the Top-Right Corner
    const rightX = pageWidth - margin;
    pdfDoc.setFont("helvetica", "normal");
    pdfDoc.setFontSize(10);
    let addressY = margin + 10; // Starting position for the address
    pdfDoc.text(`${safeText(companyDetails?.addr1)}`, rightX, addressY, { align: "right" });
    pdfDoc.text(`${safeText(companyDetails?.addr2)}`, rightX, addressY + 5, { align: "right" });
    pdfDoc.text(`${safeText(companyDetails?.addr3)}`, rightX, addressY + 10, { align: "right" });
    pdfDoc.text(`${safeText(companyDetails?.city)}`, rightX, addressY + 15, { align: "right" });

    // Add Exchange Details section
    pdfDoc.setFont("helvetica", "bold");
    pdfDoc.setFontSize(14);
    pdfDoc.text("Exchange Details", 10, 70);

    pdfDoc.autoTable({
        startY: 75,
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

// Specify the keys to display
const fieldsToDisplay = [
    "client_cd",
    "client_name",
    "cont_note_no",
    "corres_addr_1",
    "corres_addr_2",
    "corres_addr_3",
    "corres_city",
    "int_mkt_type",
    "pan_no",
];

// Filter and map the response
const contractNoteDetails = fieldsToDisplay.map((key) => [
    key.replace(/_/g, " ").toUpperCase(), // Convert keys to uppercase with spaces
    safeText(note[key]), // Get the corresponding value
]);

pdfDoc.autoTable({
    startY: pdfDoc.autoTable.previous.finalY + 20,
    head: [["Field", "Value"]],
    body: contractNoteDetails, // Use the filtered and formatted data
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
