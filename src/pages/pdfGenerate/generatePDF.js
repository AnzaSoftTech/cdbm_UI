import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';


// PDF styles
const styles = StyleSheet.create({
    page: {
        padding: 13,
        flexDirection: 'column',
    },
    header: {
        fontSize: 18,
        marginBottom: 4,
        marginLeft: 34,
        textAlign: 'center',
    },
    comp_name: {
        fontSize: 26,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    leftText: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom: 2,
        marginTop: 6,
        paddingTop: 22,
    },
    footerleftText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom: 2,
        marginTop: 6,
    },
    footerRight: {
        fontSize: 16,
        textAlign: 'right',
        paddingTop: 100,
    },
    righttext: {
        fontSize: 16,
        textAlign: 'right',
        marginBottom: 2,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: '100%',
        marginBottom: 10,
    },
    line: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        marginVertical: 2,
        width: '100%',
    },
    newHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#A0A0A0',
        padding: 8,
        borderBottomWidth: 1,
        borderColor: 'black',
    },
    newHeaderColumn1: {
        flex: 1.3,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
    },
    newHeaderColumn2: {
        flex: 3.1,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
    },
    newHeaderColumn3: {
        flex: 3.1,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
    },
    newHeaderColumn4: {
        flex: 1.2,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
    },
    borderRight: {
        borderRightWidth: 1.5,
        borderRightColor: '#C0C0C0',
    },
    tableContainer: {
        flex: 1, // Take up remaining space between header and footer
        marginTop: 10,
        flexGrow: 1,
        marginBottom: 30,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#DFDEDE',
        padding: 8,
        fontWeight: 'bold',
        borderBottomWidth: 1,
        borderColor: 'black',
    },
    tableHeaderText: {
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 22,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: 'black',
        padding: 5,
    },
    tableCell: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        borderRightWidth: 1,
        borderRightColor: 'black',
        padding: 9,
    },
    footer: {
        marginTop: 'auto', // Push the footer to the bottom
        padding: 10,
        marginBottom: 9,
        textAlign: 'center',
        fontSize: 8,
        borderTopWidth: 1,
        borderColor: 'black',
    },
});

const MyPDFDocument = ({ tableData, companyDetails, excDetails, contractNotes }) => (
    <Document>
        {contractNotes.map((note, index) => {
            // Calculate totals for both columns
            const totalBuyAfterBrok = note.security_summary?.reduce(
                (total, summary) => total + (parseFloat(summary.tot_buy_aft_brok) || 0),
                0
            );

            const totalSaleAfterBrok = note.security_summary?.reduce(
                (total, summary) => total + (parseFloat(summary.tot_sale_aft_brok) || 0),
                0
            );

            // GST Summary totals calculation
            const gstTotals = {
                net_olig: 0,
                net_oblig: 0,
                stt_chrg: 0,
                stamp_duty: 0,
                sebi_turnover: 0,
                other_chrg: 0,
                taxable_val: 0,
                brok_igst: 0,
                brok_cgst: 0,
                brok_sgst: 0
            };

            // Accumulate totals from the GST_summary
            note.GST_summary?.forEach(summary => {
                gstTotals.net_olig += parseFloat(summary.net_olig || 0);
                gstTotals.net_oblig += parseFloat(summary.net_oblig || 0);
                gstTotals.stt_chrg += parseFloat(summary.stt_chrg || 0);
                gstTotals.stamp_duty += parseFloat(summary.stamp_duty || 0);
                gstTotals.sebi_turnover += parseFloat(summary.sebi_turnover || 0);
                gstTotals.other_chrg += parseFloat(summary.other_chrg || 0);
                gstTotals.taxable_val += parseFloat(summary.taxable_val || 0);
                gstTotals.brok_igst += parseFloat(summary.brok_igst || 0);
                gstTotals.brok_cgst += parseFloat(summary.brok_cgst || 0);
                gstTotals.brok_sgst += parseFloat(summary.brok_sgst || 0);
            });

            const chunkArray = (array, chunkSize) => {
                const chunks = [];
                for (let i = 0; i < 3; i += chunkSize) {
                    chunks.push(array.slice(i, i + chunkSize));
                }
                return chunks;
            };

            const chunkSize = 1110; // Number of items per chunk
            const chunks = chunkArray(note.Detailed || [], chunkSize);

            console.log("chunks", chunks)

            return (
                <Page
                    key={index}
                    style={styles.page}
                    size={{ width: 2100, height: 1600 }}
                    orientation="portrait"
                >
                    {/* Header Section */}
                    <View fixed style={styles.row}>
                        <View style={{ width: '35%' }}>
                            <Image src={`${window.location.origin}/image.png`}/>
                        </View>
                        <View style={{ width: '200%', alignItems: 'center' }}>
                            <Text style={styles.header}>CONTRACT NOTE CUM TAX INVOICE</Text>
                            <Text style={styles.header}>(TAX INVOICE UNDER SECTION 31 OF GST ACT)</Text>
                            <Text style={styles.comp_name}>
                                {companyDetails?.comp_name || "Company Name"}
                            </Text>
                            <Text style={styles.header}>MEMBER: NATIONAL STOCK EXCHANGE OF INDIA LTD</Text>
                            <Text style={styles.header}>SEBI REGN. NO. INZ000242534 • TRADING CODE NO: 23/10245 • CM BP ID: IN554382</Text>
                            <Text style={styles.header}>CIN: U67120MH1997PLC108674 • GSTIN: 27AABCS • PAN NO AABCS9766K</Text>
                            <Text style={styles.header}>Compliance Officer: Anil Sodhani • Phone: {companyDetails?.phone} • Email: {companyDetails?.email}</Text>
                        </View>
                        <View style={{ width: '40%', alignItems: 'right' }}>
                            <Text style={styles.righttext}>{companyDetails?.addr1}</Text>
                            <Text style={styles.righttext}>{companyDetails?.addr2}</Text>
                            <Text style={styles.righttext}>{companyDetails?.addr3}</Text>
                            {/* <Text style={styles.righttext}>304, Samarpan, New Link Road,</Text>
                            <Text style={styles.righttext}>Chakala, Andheri East,</Text>
                            <Text style={styles.righttext}>Mumbai - 400 099.</Text> */}
                        </View>
                    </View>

                    <View style={styles.line} />


                    {/* Displaying each note's details and table data side by side */}
                    <View style={[styles.row, { alignItems: 'flex-start' }]}>
                        {/* Left side - Note details */}
                        <View style={{ width: '35%', paddingRight: 10 }}>
                            <View style={{
                                borderWidth: 2,
                                borderColor: '#000',
                                padding: 18,
                                marginBottom: 15,
                            }}>
                                {/* Row 1 */}
                                <View style={{ flexDirection: 'row', marginBottom: 11, borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 8 }}>
                                    <Text style={{ width: '30%', fontSize: 23 }}>Client Code:</Text>
                                    <Text style={{ width: '70%', fontSize: 23 }}>{note.client_cd}</Text>
                                </View>

                                {/* Row 2 */}
                                <View style={{ flexDirection: 'row', marginBottom: 11, borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 8 }}>
                                    <Text style={{ width: '30%', fontSize: 23 }}>Client Name:</Text>
                                    <Text style={{ width: '70%', fontSize: 23 }}>{note.client_name}</Text>
                                </View>

                                {/* Row 3 */}
                                <View style={{ flexDirection: 'row', marginBottom: 11, borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 8 }}>
                                    <Text style={{ width: '30%', fontSize: 23 }}>Address 1:</Text>
                                    <Text style={{ width: '70%', fontSize: 23 }}>{note.corres_addr_1}</Text>
                                </View>

                                {/* Row 4 */}
                                <View style={{ flexDirection: 'row', marginBottom: 11, borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 8 }}>
                                    <Text style={{ width: '30%', fontSize: 23 }}>Address 2:</Text>
                                    <Text style={{ width: '70%', fontSize: 23 }}>{note.corres_addr_2}</Text>
                                </View>

                                {/* Row 8 */}
                                <View style={{ flexDirection: 'row', marginBottom: 11, borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 8 }}>
                                    <Text style={{ width: '30%', fontSize: 23 }}>Address 3:</Text>
                                    <Text style={{ width: '70%', fontSize: 23 }}>{note.corres_addr_3} {note.corres_city}</Text>
                                </View>

                                {/* Row 6 */}
                                <View style={{ flexDirection: 'row', marginBottom: 11, borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 8 }}>
                                    <Text style={{ width: '30%', fontSize: 23 }}>Market Type:</Text>
                                    <Text style={{ width: '70%', fontSize: 23 }}>{note.int_mkt_type}</Text>
                                </View>

                                {/* Row 7 */}
                                <View style={{ flexDirection: 'row', marginBottom: 11, borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 8 }}>
                                    <Text style={{ width: '30%', fontSize: 23 }}>PAN Number:</Text>
                                    <Text style={{ width: '70%', fontSize: 23 }}>{note.pan_no}</Text>
                                </View>

                                {/* Row 8 */}
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ width: '30%', fontSize: 23 }}>Settlement No:</Text>
                                    <Text style={{ width: '70%', fontSize: 23 }}>{note.trd_settle_no}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Right side - Table data */}
                        <View style={{ width: '50%' }}>

                            <View style={{ width: '50%', paddingRight: 10 }}>
                                <Text style={styles.leftText}>Contract Note No: {note.cont_note_no}</Text>
                            </View>
                            <View style={{ width: '50%', paddingRight: 10 }}>
                                <Text style={styles.leftText}>Trade Date: {note.trade_date}</Text>
                            </View>


                            {/* Table Headers */}
                            <View style={styles.tableHeader}>
                                <Text style={[styles.tableHeaderText, styles.borderRight]}>Exchange Name</Text>
                                <Text style={[styles.tableHeaderText, styles.borderRight]}>Segment</Text>
                                <Text style={[styles.tableHeaderText, styles.borderRight]}>Clearing No</Text>
                                <Text style={[styles.tableHeaderText, styles.borderRight]}>Trading No</Text>
                                <Text style={[styles.tableHeaderText, styles.borderRight]}>CMBP ID</Text>
                                <Text style={[styles.tableHeaderText, styles.borderRight]}>SEBI Reg No</Text>
                            </View>

                            {/* Table Rows - Display excDetails */}
                            {excDetails ? (
                                excDetails.map((item, index) => (
                                    <View key={index} style={styles.tableRow}>
                                        <Text style={[styles.tableCell, styles.borderRight]}>{item.exc_name || 'N/A'}</Text>
                                        <Text style={[styles.tableCell, styles.borderRight]}>{item.segment || 'N/A'}</Text>
                                        <Text style={[styles.tableCell, styles.borderRight]}>{item.clearing_no || 'N/A'}</Text>
                                        <Text style={[styles.tableCell, styles.borderRight]}>{item.trading_no || 'N/A'}</Text>
                                        <Text style={[styles.tableCell, styles.borderRight]}>{item.cmbp_id || 'N/A'}</Text>
                                        <Text style={[styles.tableCell, styles.borderRight]}>{item.sebi_reg || 'N/A'}</Text>
                                    </View>
                                ))
                            ) : (
                                <Text style={styles.leftText}>No data available</Text>
                            )}

                            {/* Table Data */}
                            {tableData.map((row, index) => (
                                <View key={index} style={styles.tableRow}>
                                    {Object.values(row).map((cell, cellIndex) => (
                                        <Text key={cellIndex} style={styles.tableCell}>{cell}</Text>
                                    ))}
                                </View>
                            ))}
                        </View>
                    </View>


                    {/* New Table for security_summary */}

                    {/* Security Summary Table */}
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 8, marginBottom: 5 }}>Security Summary:</Text>

                        {/* New Header Row */}
                        <View style={styles.newHeaderRow}>
                            <Text style={[styles.newHeaderColumn1, styles.borderRight]}>Security Description</Text>
                            <Text style={[styles.newHeaderColumn2, styles.borderRight]}>Buy</Text>
                            <Text style={[styles.newHeaderColumn3, styles.borderRight]}>Sell</Text>
                            <Text style={[styles.newHeaderColumn4, styles.borderRight]}>Net Obligation</Text>
                        </View>

                        {/* Subheaders */}
                        <View style={styles.tableHeader}>
                            {/* Headers for each column */}
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>ISIN</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Security Name/ Symbol</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Buy Qty</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Wap (Mrk Rate)</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Brok Per Share</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Buy WAP Aft Brok</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Tot Buy Aft Brok</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Sale Qty</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Wap (Mrk Rate)</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Sale Brok Per Share</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Sale Wap Aft Brok</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Tot Sale Aft Brok</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Net Quantity</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Net Obligation</Text>
                        </View>

                        {/* Table Rows */}
                        {note.security_summary?.map((summary, summaryIndex) => (
                            <View key={summaryIndex} style={styles.tableRow}>
                                {/* Security Description */}
                                <Text style={[styles.tableCell, styles.borderRight]}>{summary.isin || 'N/A'}</Text>
                                <Text style={[styles.tableCell, styles.borderRight]}>{summary.scrip_cd || '0.000'}</Text>
                                {/* Buy */}
                                <Text style={[styles.tableCell, styles.borderRight]}>{summary.buy_qty || 'N/A'}</Text>
                                <Text style={[styles.tableCell, styles.borderRight]}>{summary.buy_wap || '0.000'}</Text>
                                <Text style={[styles.tableCell, styles.borderRight]}>{summary.buy_brok_per_share || 'N/A'}</Text>
                                <Text style={[styles.tableCell, styles.borderRight]}>{summary.buy_wap_aft_brok || '0.000'}</Text>
                                <Text style={[styles.tableCell, styles.borderRight]}>{summary.tot_buy_aft_brok || '0.000'}</Text>
                                {/* Sell */}
                                <Text style={[styles.tableCell, styles.borderRight]}>{summary.sale_qty || '0.000'}</Text>
                                <Text style={[styles.tableCell, styles.borderRight]}>{summary.sale_wap || '0.000'}</Text>
                                <Text style={[styles.tableCell, styles.borderRight]}>{summary.sale_brok_per_share || '0.000'}</Text>
                                <Text style={[styles.tableCell, styles.borderRight]}>{summary.sale_wap_aft_brok || '0.000'}</Text>
                                <Text style={[styles.tableCell, styles.borderRight]}>{summary.tot_sale_aft_brok || '0.000'}</Text>
                                {/* Net Obligation */}
                                <Text style={[styles.tableCell, styles.borderRight]}>{summary.net_qty || '0.000'}</Text>
                                <Text style={[styles.tableCell, styles.borderRight]}>{summary.net_oblig || '0.000'}</Text>
                            </View>
                        ))}

                        {/* Total Row */}
                        <View style={[styles.tableRow, { backgroundColor: '#DCDCDC' }]}>
                            <Text style={[styles.tableCell, styles.borderRight, { fontWeight: 'bold' }]} colSpan={6}>
                                Total
                            </Text>
                            {/* Empty cells for columns 1-6 */}
                            {Array(5)
                                .fill(null)
                                .map((_, i) => (
                                    <Text key={i} style={[styles.tableCell, styles.borderRight]}></Text>
                                ))}
                            {/* Total cell for the 7th column (Tot Buy Aft Brok) */}
                            <Text style={[styles.tableCell, styles.borderRight, { fontWeight: 'bold' }]}>{totalBuyAfterBrok.toFixed(2)}</Text>
                            {/* Empty cells for columns 8-11 */}
                            {Array(4)
                                .fill(null)
                                .map((_, i) => (
                                    <Text key={i} style={[styles.tableCell, styles.borderRight]}></Text>
                                ))}
                            {/* Total cell for the 12th column (Tot Sale Aft Brok) */}
                            <Text style={[styles.tableCell, styles.borderRight, { fontWeight: 'bold' }]}>{totalSaleAfterBrok.toFixed(2)}</Text>
                            {/* Empty cells for columns 13-14 */}
                            {Array(2)
                                .fill(null)
                                .map((_, i) => (
                                    <Text key={i} style={[styles.tableCell, styles.borderRight]}></Text>
                                ))}
                        </View>
                    </View>

                    {/* GST Summary Table */}
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 8, marginBottom: 5 }}>GST Summary: </Text>
                        <View style={styles.tableHeader} fixed>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>ISIN</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Symbol/Series</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Net Obligation</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>STT Charges</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Stamp Duty</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>SEBI Turnover</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Other Charges</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Tax Value</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>IGST</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>CGST</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>SGST</Text>
                        </View>
                        {note.GST_summary?.map((summary, summaryIndex) => (
                            <View key={summaryIndex} style={styles.tableRow}>
                                <Text style={[styles.tableCell, styles.borderRight]}>{summary.isin || 'N/A'}</Text>
                                <Text style={[styles.tableCell, styles.borderRight]}>{summary.series || 'N/A'}</Text>
                                <Text style={[styles.tableCell, styles.borderRight]}>{summary.net_oblig || 'N/A'}</Text>
                                <Text style={[styles.tableCell, styles.borderRight]}>{summary.stt_chrg || '0.000'}</Text>
                                <Text style={[styles.tableCell, styles.borderRight]}>{summary.stamp_duty || '0.000'}</Text>
                                <Text style={[styles.tableCell, styles.borderRight]}>{summary.sebi_turnover || '0.000'}</Text>
                                <Text style={[styles.tableCell, styles.borderRight]}>{summary.other_chrg || '0.000'}</Text>
                                <Text style={[styles.tableCell, styles.borderRight]}>{summary.taxable_val || '0.000'}</Text>
                                <Text style={[styles.tableCell, styles.borderRight]}>{summary.brok_igst || '0.000'}</Text>
                                <Text style={[styles.tableCell, styles.borderRight]}>{summary.brok_cgst || '0.000'}</Text>
                                <Text style={[styles.tableCell, styles.borderRight]}>{summary.brok_sgst || '0.000'}</Text>
                            </View>
                        ))}
                        {/* Total Row for GST Summary */}
                        <View style={[styles.tableRow, { backgroundColor: '#DCDCDC' }]}>
                            <Text style={[styles.tableCell, styles.borderRight, { fontWeight: 'bold' }]} colSpan={2}>
                                Total
                            </Text>
                            <Text style={[styles.tableCell, styles.borderRight, { fontWeight: 'bold' }]}>
                                {isNaN(gstTotals.net_olig) || gstTotals.net_olig === 0 ? '' : gstTotals.net_olig.toFixed(2)}
                            </Text>                            
                            <Text style={[styles.tableCell, styles.borderRight, { fontWeight: 'bold' }]}>{gstTotals.net_oblig.toFixed(2)}</Text>
                            <Text style={[styles.tableCell, styles.borderRight, { fontWeight: 'bold' }]}>{gstTotals.stt_chrg.toFixed(2)}</Text>
                            <Text style={[styles.tableCell, styles.borderRight, { fontWeight: 'bold' }]}>{gstTotals.stamp_duty.toFixed(2)}</Text>
                            <Text style={[styles.tableCell, styles.borderRight, { fontWeight: 'bold' }]}>{gstTotals.sebi_turnover.toFixed(2)}</Text>
                            <Text style={[styles.tableCell, styles.borderRight, { fontWeight: 'bold' }]}>{gstTotals.other_chrg.toFixed(2)}</Text>
                            <Text style={[styles.tableCell, styles.borderRight, { fontWeight: 'bold' }]}>{gstTotals.taxable_val.toFixed(2)}</Text>
                            <Text style={[styles.tableCell, styles.borderRight, { fontWeight: 'bold' }]}>{gstTotals.brok_igst.toFixed(2)}</Text>
                            <Text style={[styles.tableCell, styles.borderRight, { fontWeight: 'bold' }]}>{gstTotals.brok_cgst.toFixed(2)}</Text>
                            <Text style={[styles.tableCell, styles.borderRight, { fontWeight: 'bold' }]}>{gstTotals.brok_sgst.toFixed(2)}</Text>
                        </View>
                    </View>

                    {/* Detailed Table with Chunking */}
                    <View break style={{ marginTop: 24 }}>
                        <Text fixed style={{ fontSize: 15, marginBottom: 5 }}>Detailed: </Text>

                        {/* Original Table Header */}
                        <View style={[styles.tableHeader, { borderBottomWidth: 1, borderColor: 'black' }]} fixed>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Ord No</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Order Time</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Trd No</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Trade Time</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Security/Contract Des</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>B / S</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Trd Qty</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Gross Rate/Trade Prc Per Unit(Rs)</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Brok Per Unit(Rs)</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Net Rate Per Unit(RS)</Text>
                        </View>

                        {/* Data Rows with ISIN Summary Header */}
                        {chunks.map((chunk, chunkIndex) => (
                            <View key={chunkIndex}>
                                {/* New ISIN Summary Header for each chunk */}
                                <View style={[styles.tableHeader, { borderBottomWidth: 1, borderTopWidth: 1, borderColor: 'black', marginVertical: 5 }]} fixed>
                                    <Text style={[styles.tableHeaderText, styles.borderRight, { flex: 12 }]}>
                                        ISIN Summary: {chunk[0]?.isin || '0.000'} SEPC-EQ: {chunk[0]?.trd_series || '0.000'}
                                    </Text>
                                </View>

                                {/* Data Rows */}
                                {chunk.map((summary, summaryIndex) => (
                                    <View key={summaryIndex} style={styles.tableRow}>
                                        <Text style={[styles.tableCell, styles.borderRight]}>{summary.ord_no || '0.000'}</Text>
                                        <Text style={[styles.tableCell, styles.borderRight]}>{summary.order_time || '0.000'}</Text>
                                        <Text style={[styles.tableCell, styles.borderRight]}>{summary.trd_no || '0.000'}</Text>
                                        <Text style={[styles.tableCell, styles.borderRight]}>{summary.trade_time || '0.000'}</Text>
                                        <Text style={[styles.tableCell, styles.borderRight]}>{summary.trd_sec_cd || '0.000'}</Text>
                                        <Text style={[styles.tableCell, styles.borderRight]}>{summary.buy_sell || 'N/A'}</Text>
                                        <Text style={[styles.tableCell, styles.borderRight]}>{summary.trd_qty || '0.000'}</Text>
                                        <Text style={[styles.tableCell, styles.borderRight]}>{summary.gross_rate || 'N/A'}</Text>
                                        <Text style={[styles.tableCell, styles.borderRight]}>{summary.brok_per_unit || 'N/A'}</Text>
                                        <Text style={[styles.tableCell, styles.borderRight]}>{summary.net_rate || '0.000'}</Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>




                    {/* Footer Section */}
                    {/* <View fixed style={styles.line} /> */}
                    <View fixed style={styles.footer}>
                        <View fixed style={styles.row}>
                            <View fixed style={{ width: '80%', alignItems: 'left' }}>
                                <View fixed>
                                    <Text style={styles.footerleftText}>OTHER LEVIES, IF ANY:</Text>
                                    <Text style={styles.footerleftText}>Note: Buy : 'B'/'+', Sell: 'S'/'-', Debit: '+', Credit: '-'
                                        CGST: Central GST, SGST: State GST, IGST: Integrated GST, UTT: Union Terittory Tax.
                                        Details of Tradewise levies shall be provided on request.</Text>
                                    <Text style={styles.footerleftText}>Description of Service: Brokerage & related Securities & Commodity services. Accounting Code: 997152.
                                        SSL is collecting Stamp Duty & Securities Transaction Tax (STT) as a pure agent of the investor and hence the same is not considered in taxable value of supply for charging GST.
                                        Transactions mentioned in this contract note cum bill shall be governed and subject to the Rules, Bye-laws, Regulations and Circulars of the respective Exchanges on which trades have been executed and Securities and Exchange Board of India issued from time to time. It shall also be subject to the relevant Acts, Rules, Regulations, Directives, Notifications, Guidelines (including GST Laws) & Circulars issued by SEBI / Government of India / State Governments
                                        and Union Territory Governments issued from time to time. The Exchanges provide Complaint Resolution, Arbitration and Appellate arbitration facilities at the Regional Arbitration Centres (RAC). The client may approach its nearest centre, details of which are available on respective Exchange's website. Please visit www.nseindia.com for NSE, www.bseindia.com for BSE and www.msei.in for MSEI.
                                    </Text>
                                    <Text style={styles.footerleftText}>Date: {note.trade_date} , place : Mumbai</Text>

                                </View>
                            </View>
                            <View fixed style={{ width: '40%', alignItems: 'right' }}>
                                <Text style={styles.righttext}>Yours Faithfully,
                                    For Sodhani Securities Ltd</Text>
                                <View style={styles.footerRight}>
                                    <Text>Director/Authorized Signatory</Text>
                                    <Text>Member: National Stock Exchange of India Ltd.</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </Page>
            );
        })}
    </Document>
);

export default MyPDFDocument;


