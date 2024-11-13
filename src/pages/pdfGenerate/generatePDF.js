import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';


// PDF styles
const styles = StyleSheet.create({
    page: {
        padding: 13,
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        fontSize: 8,
        marginBottom: 2,
        textAlign: 'center',
    },
    leftText: {
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom: 2,
        marginTop: 6,
    },
    righttext: {
        fontSize: 7,
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
    tableContainer: {
        width: '50%',
        marginLeft: 'auto',
        marginBottom: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'black',
    },
    tableHeaderText: {
        fontSize: 6,
        fontWeight: 'bold',
        borderWidth: 1,
        borderColor: 'black',
        padding: 5,
        textAlign: 'center',
        flex: 1, // Equal column width
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableCell: {
        fontSize: 5,
        borderWidth: 1,
        borderColor: 'black',
        padding: 3,
        textAlign: 'center',
        flex: 1, // Equal column width
    },
});

const MyPDFDocument = ({ tableData, companyDetails, excDetails, contractNotes }) => (
    <Document>
        {contractNotes.map((note, index) => (
            <Page key={index} style={styles.page} size={{  width: 800, height: 610.28 }}  orientation="portrait">
                {/* Header Section */}
                <View fixed style={styles.row}>
                    <View style={{ width: '30%' }}>
                        <Image src={`${window.location.origin}/image.png`} style={styles.logo} />
                    </View>
                    <View style={{ width: '90%', alignItems: 'center' }}>
                        <Text style={styles.header}>CONTRACT NOTE CUM TAX INVOICE</Text>
                        <Text style={styles.header}>(TAX INVOICE UNDER SECTION 31 OF GST ACT)</Text>
                        <Text style={{ fontSize: 11, textAlign: 'center' }}>
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
                        <Text style={styles.righttext}>304, Samarpan, New Link Road,</Text>
                        <Text style={styles.righttext}>Chakala, Andheri East,</Text>
                        <Text style={styles.righttext}>Mumbai - 400 099.</Text>
                    </View>
                </View>

                <View style={styles.line} />


                {/* Displaying each note's details and table data side by side */}
                <View style={[styles.row, { alignItems: 'flex-start' }]}>
                    {/* Left side - Note details */}
                    <View style={{ width: '50%', paddingRight: 10 }}>
                        <Text style={styles.leftText}>Client Code: {note.client_cd}</Text>
                        <Text style={styles.leftText}>Client Name: {note.client_name}</Text>
                        <Text style={styles.leftText}>Contract Note No: {note.cont_note_no}</Text>
                        <Text style={styles.leftText}>Address Line 1: {note.corres_addr_1}</Text>
                        <Text style={styles.leftText}>Address Line 2: {note.corres_addr_2}</Text>
                        <Text style={styles.leftText}>Address Line 3: {note.corres_addr_3}</Text>
                        <Text style={styles.leftText}>City: {note.corres_city}</Text>
                        <Text style={styles.leftText}>Market Type: {note.int_mkt_type}</Text>
                        <Text style={styles.leftText}>PAN Number: {note.pan_no}</Text>
                        <Text style={styles.leftText}>Trade Date: {note.trade_date}</Text>
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
                            <Text style={styles.tableHeaderText}>Exchange Name</Text>
                            <Text style={styles.tableHeaderText}>Segment</Text>
                            <Text style={styles.tableHeaderText}>Clearing No</Text>
                            <Text style={styles.tableHeaderText}>SEBI Reg</Text>
                            <Text style={styles.tableHeaderText}>Trading No</Text>
                            <Text style={styles.tableHeaderText}>CM BP ID</Text>
                        </View>

                        {/* Table Rows - Display excDetails */}
                        {excDetails ? (
                            excDetails.map((item, index) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={styles.tableCell}>{item.exc_name || 'N/A'}</Text>
                                    <Text style={styles.tableCell}>{item.segment || 'N/A'}</Text>
                                    <Text style={styles.tableCell}>{item.clearing_no || 'N/A'}</Text>
                                    <Text style={styles.tableCell}>{item.sebi_reg || 'N/A'}</Text>
                                    <Text style={styles.tableCell}>{item.trading_no || 'N/A'}</Text>
                                    <Text style={styles.tableCell}>{item.cmbp_id || 'N/A'}</Text>
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
                <View style={{ marginTop: 10 }}>
                    <Text style={{ fontSize: 8, marginBottom: 5 }}>Security Summary: </Text>
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableHeaderText}>ISIN</Text>
                        <Text style={styles.tableHeaderText}>Brok Per Share</Text>
                        <Text style={styles.tableHeaderText}> Buy Qty</Text>
                        <Text style={styles.tableHeaderText}>Buy Wap</Text>
                        <Text style={styles.tableHeaderText}>Buy WAP Aft Brok</Text>
                        <Text style={styles.tableHeaderText}>Net Oblig</Text>
                        <Text style={styles.tableHeaderText}>Net Qty</Text>
                        <Text style={styles.tableHeaderText}>sale_brok_per_share</Text>
                        <Text style={styles.tableHeaderText}>Sale Qty</Text>
                        <Text style={styles.tableHeaderText}>Sale Wap Aft Brok</Text>
                        <Text style={styles.tableHeaderText}>series</Text>
                        <Text style={styles.tableHeaderText}>tot_buy_aft_brok</Text>
                        <Text style={styles.tableHeaderText}>tot_sale_aft_brok</Text>
                    </View>
                    {note.security_summary?.map((summary, summaryIndex) => (
                        <View key={summaryIndex} style={styles.tableRow}>
                            <Text style={styles.tableCell}>{summary.isin || 'N/A'}</Text>
                            <Text style={styles.tableCell}>{summary.buy_brok_per_share || 'N/A'}</Text>
                            <Text style={styles.tableCell}>{summary.buy_qty || 'N/A'}</Text>
                            <Text style={styles.tableCell}>{summary.buy_wap || '0.000'}</Text>
                            <Text style={styles.tableCell}>{summary.buy_wap_aft_brok || '0.000'}</Text>
                            <Text style={styles.tableCell}>{summary.net_oblig || '0.000'}</Text>
                            <Text style={styles.tableCell}>{summary.net_qty || '0.000'}</Text>
                            <Text style={styles.tableCell}>{summary.sale_brok_per_share || '0.000'}</Text>
                            <Text style={styles.tableCell}>{summary.sale_qty || '0.000'}</Text>
                            <Text style={styles.tableCell}>{summary.sale_wap || '0.000'}</Text>
                            <Text style={styles.tableCell}>{summary.sale_wap_aft_brok || '0.000'}</Text>
                            <Text style={styles.tableCell}>{summary.series || '0.000'}</Text>
                            <Text style={styles.tableCell}>{summary.tot_buy_aft_brok || '0.000'}</Text>
                            <Text style={styles.tableCell}>{summary.tot_sale_aft_brok || '0.000'}</Text>
                        </View>
                    ))}
                </View>
                {/* New Table for GST */}
                <View style={{ marginTop: 10 }}>
                    <Text style={{ fontSize: 8, marginBottom: 5 }}>GST Summary: </Text>
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableHeaderText}>Brok CGST</Text>
                        <Text style={styles.tableHeaderText}>Brok IGST</Text>
                        <Text style={styles.tableHeaderText}>Brok SGST</Text>
                        <Text style={styles.tableHeaderText}>ISIN</Text>
                        <Text style={styles.tableHeaderText}>Net Oblig</Text>
                        <Text style={styles.tableHeaderText}>Other Charge</Text>
                        <Text style={styles.tableHeaderText}>Script CD</Text>
                        <Text style={styles.tableHeaderText}>SEBI Turnover</Text>
                        <Text style={styles.tableHeaderText}>Series</Text>
                        <Text style={styles.tableHeaderText}>STT Charg</Text>
                        <Text style={styles.tableHeaderText}>Taxable Val</Text>
                    </View>
                    {note.GST_summary?.map((summary, summaryIndex) => (
                        <View key={summaryIndex} style={styles.tableRow}>
                            <Text style={styles.tableCell}>{summary.brok_cgst || 'N/A'}</Text>
                            <Text style={styles.tableCell}>{summary.brok_igst || 'N/A'}</Text>
                            <Text style={styles.tableCell}>{summary.brok_sgst || 'N/A'}</Text>
                            <Text style={styles.tableCell}>{summary.isin || '0.000'}</Text>
                            <Text style={styles.tableCell}>{summary.net_oblig || '0.000'}</Text>
                            <Text style={styles.tableCell}>{summary.other_chrg || '0.000'}</Text>
                            <Text style={styles.tableCell}>{summary.scrip_cd || '0.000'}</Text>
                            <Text style={styles.tableCell}>{summary.sebi_turnover || '0.000'}</Text>
                            <Text style={styles.tableCell}>{summary.series || '0.000'}</Text>
                            <Text style={styles.tableCell}>{summary.stamp_duty || '0.000'}</Text>
                            <Text style={styles.tableCell}>{summary.stt_chrg || '0.000'}</Text>
                            <Text style={styles.tableCell}>{summary.taxable_val || '0.000'}</Text>
                        </View>
                    ))}
                </View>
                {/* New Table for Detailed */}
                <View style={{ marginTop: 10 }}>
                    <Text style={{ fontSize: 8, marginBottom: 5 }}>Detailed: </Text>
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableHeaderText}>Brok Per Unit</Text>
                        <Text style={styles.tableHeaderText}>Buy Sell</Text>
                        <Text style={styles.tableHeaderText}>Gross Rate</Text>
                        <Text style={styles.tableHeaderText}>ISIN</Text>
                        <Text style={styles.tableHeaderText}>Net Raye</Text>
                        <Text style={styles.tableHeaderText}>Order Time</Text>
                        <Text style={styles.tableHeaderText}>Trade Time</Text>
                        <Text style={styles.tableHeaderText}>Trd No</Text>
                        <Text style={styles.tableHeaderText}>Trd Qty</Text>
                        <Text style={styles.tableHeaderText}>Trd Sec CD</Text>
                        <Text style={styles.tableHeaderText}>Trd Series</Text>
                        <Text style={styles.tableHeaderText}>Ord No</Text>
                    </View>
                    {note.Detailed?.map((summary, summaryIndex) => (
                        <View key={summaryIndex} style={styles.tableRow}>
                            <Text style={styles.tableCell}>{summary.brok_per_unit || 'N/A'}</Text>
                            <Text style={styles.tableCell}>{summary.buy_sell || 'N/A'}</Text>
                            <Text style={styles.tableCell}>{summary.gross_rate || 'N/A'}</Text>
                            <Text style={styles.tableCell}>{summary.isin || '0.000'}</Text>
                            <Text style={styles.tableCell}>{summary.net_rate || '0.000'}</Text>
                            <Text style={styles.tableCell}>{summary.order_time || '0.000'}</Text>
                            <Text style={styles.tableCell}>{summary.trade_time || '0.000'}</Text>
                            <Text style={styles.tableCell}>{summary.trd_no || '0.000'}</Text>
                            <Text style={styles.tableCell}>{summary.trd_qty || '0.000'}</Text>
                            <Text style={styles.tableCell}>{summary.trd_sec_cd || '0.000'}</Text>
                            <Text style={styles.tableCell}>{summary.trd_series || '0.000'}</Text>
                            <Text style={styles.tableCell}>{summary.ord_no || '0.000'}</Text>
                        </View>
                    ))}
                </View>

                {/* Footer Section */}
                <View style={styles.line} />
                <View style={styles.row}>
                    <Text style={styles.leftText}>Date: 18 Oct, 2024. Place: Mumbai</Text>
                    <Text style={styles.leftText}>Authorized Signatory</Text>
                </View>
            </Page>
        ))}
    </Document>
);

export default MyPDFDocument;
