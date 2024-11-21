import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';


// PDF styles
const styles = StyleSheet.create({
    page: {
        padding: 13,
        flexDirection: 'column',
    },
    header: {
        fontSize: 11,
        marginBottom: 2,
        textAlign: 'center',
    },
    leftText: {
        fontSize: 11,
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom: 2,
        marginTop: 6,
    },
    righttext: {
        fontSize: 11,
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
        backgroundColor: '#E1D2D2',
        padding: 8,
        borderBottomWidth: 1,
        borderColor: 'black',
    },
    newHeaderColumn1: {
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 12,
    },
    newHeaderColumn2: {
        flex: 3,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 12,
    },
    newHeaderColumn3: {
        flex: 3,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 12,
    },
    newHeaderColumn4: {
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 12,
    },
    borderRight: {
        borderRightWidth: 1,
        borderRightColor: 'black',
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
        fontSize: 12,
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
        fontSize: 12,
        borderRightWidth: 1,
        borderRightColor: 'black',
        padding: 5,
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
                    size={{ width: 1600, height: 850.28 }}
                    orientation="portrait"
                >
                    {/* Header Section */}
                    <View fixed style={styles.row}>
                        <View style={{ width: '15%' }}>
                            <Image src={`${window.location.origin}/image.png`} style={styles.logo} />
                        </View>
                        <View style={{ width: '90%', alignItems: 'center' }}>
                            <Text style={styles.header}>CONTRACT NOTE CUM TAX INVOICE</Text>
                            <Text style={styles.header}>(TAX INVOICE UNDER SECTION 31 OF GST ACT)</Text>
                            <Text style={{ fontSize: 13, textAlign: 'center' }}>
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
                        <View style={{ width: '50%', paddingRight: 10 }}>
                            <Text style={styles.leftText}>Client Code: {note.client_cd}</Text>
                            <Text style={styles.leftText}>Client Name: {note.client_name}</Text>
                            {/* <Text style={styles.leftText}><b>Contract Note No: </b>{note.cont_note_no}</Text> */}
                            <Text style={styles.leftText}>{note.corres_addr_1}</Text>
                            <Text style={styles.leftText}>{note.corres_addr_2}</Text>
                            <Text style={styles.leftText}>{note.corres_addr_3} . {note.corres_city}</Text>
                            {/* <Text style={styles.leftText}>{note.corres_city}</Text> */}
                            <Text style={styles.leftText}>Market Type: {note.int_mkt_type}</Text>
                            <Text style={styles.leftText}>PAN Number: {note.pan_no}</Text>
                            {/* <Text style={styles.leftText}>Trade Date: {note.trade_date}</Text> */}
                            <Text style={styles.leftText}>Settlement No: {note.trd_settle_no}</Text>
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
                    </View>

                    {/* Detailed Table with Chunking */}
                    <View break style={{ marginTop: 20 }}>
                        <Text fixed style={{ fontSize: 11, marginBottom: 5 }}>Detailed: </Text>
                        <View style={styles.tableHeader} fixed>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Security Code</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Brok Per Unit</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Buy Sell</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Gross Rate</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>ISIN</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Net Raye</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Order Time</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Trade Time</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Trd No</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Trd Qty</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Trd Sec CD</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Trd Series</Text>
                            <Text style={[styles.tableHeaderText, styles.borderRight]}>Ord No</Text>
                        </View>
                        {chunks.map((chunk, chunkIndex) => (
                            <View key={chunkIndex}>
                                {chunk.map((summary, summaryIndex) => (
                                    <View key={summaryIndex} style={styles.tableRow}>
                                        <Text style={[styles.tableCell, styles.borderRight]}>{summary.trd_sec_cd || '0.000'}</Text>
                                        <Text style={[styles.tableCell, styles.borderRight]}>{summary.brok_per_unit || 'N/A'}</Text>
                                        <Text style={[styles.tableCell, styles.borderRight]}>{summary.buy_sell || 'N/A'}</Text>
                                        <Text style={[styles.tableCell, styles.borderRight]}>{summary.gross_rate || 'N/A'}</Text>
                                        <Text style={[styles.tableCell, styles.borderRight]}>{summary.isin || '0.000'}</Text>
                                        <Text style={[styles.tableCell, styles.borderRight]}>{summary.net_rate || '0.000'}</Text>
                                        <Text style={[styles.tableCell, styles.borderRight]}>{summary.order_time || '0.000'}</Text>
                                        <Text style={[styles.tableCell, styles.borderRight]}>{summary.trade_time || '0.000'}</Text>
                                        <Text style={[styles.tableCell, styles.borderRight]}>{summary.trd_no || '0.000'}</Text>
                                        <Text style={[styles.tableCell, styles.borderRight]}>{summary.trd_qty || '0.000'}</Text>
                                        <Text style={[styles.tableCell, styles.borderRight]}>{summary.trd_sec_cd || '0.000'}</Text>
                                        <Text style={[styles.tableCell, styles.borderRight]}>{summary.trd_series || '0.000'}</Text>
                                        <Text style={[styles.tableCell, styles.borderRight]}>{summary.ord_no || '0.000'}</Text>
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
                                    <Text style={styles.leftText}>OTHER LEVIES, IF ANY:</Text>
                                    <Text style={styles.leftText}>Note: Buy : 'B'/'+', Sell: 'S'/'-', Debit: '+', Credit: '-'
                                        CGST: Central GST, SGST: State GST, IGST: Integrated GST, UTT: Union Terittory Tax.
                                        Details of Tradewise levies shall be provided on request.</Text>
                                    <Text style={styles.leftText}>Description of Service: Brokerage & related Securities & Commodity services. Accounting Code: 997152.
                                        SSL is collecting Stamp Duty & Securities Transaction Tax (STT) as a pure agent of the investor and hence the same is not considered in taxable value of supply for charging GST.
                                        Transactions mentioned in this contract note cum bill shall be governed and subject to the Rules, Bye-laws, Regulations and Circulars of the respective Exchanges on which trades have been executed and Securities and Exchange Board of India issued from time to time. It shall also be subject to the relevant Acts, Rules, Regulations, Directives, Notifications, Guidelines (including GST Laws) & Circulars issued by SEBI / Government of India / State Governments
                                        and Union Territory Governments issued from time to time. The Exchanges provide Complaint Resolution, Arbitration and Appellate arbitration facilities at the Regional Arbitration Centres (RAC). The client may approach its nearest centre, details of which are available on respective Exchange's website. Please visit www.nseindia.com for NSE, www.bseindia.com for BSE and www.msei.in for MSEI.
                                    </Text>
                                    <Text style={styles.leftText}>Date: {note.trade_date} , place : Mumbai</Text>

                                </View>
                            </View>
                            <View fixed style={{ width: '40%', alignItems: 'right' }}>
                                <Text style={styles.righttext}>Yours Faithfully,
                                    For Sodhani Securities Ltd</Text>
                                <Text style={styles.righttext}>Director/Authorized Signatory</Text>
                                <Text style={styles.righttext}>Member: National Stock Exchange of India Ltd.</Text>
                            </View>
                        </View>
                    </View>
                </Page>
            );
        })}
    </Document>
);

export default MyPDFDocument;



