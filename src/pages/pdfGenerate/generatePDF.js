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
        fontSize: 7,
        marginBottom: 2,
        textAlign: 'center',
    },
    leftText: {
        fontSize: 5,
        textAlign: 'left',
        marginBottom: 2,
    },
    righttext: {
        fontSize: 5,
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
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        paddingBottom: 3,
        marginBottom: 5,
    },
    tableHeaderText: {
        fontSize: 6,
        fontWeight: 'bold',
        marginRight: 5,
        width: '16.6%',
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        marginBottom: 3,
    },
    tableCell: {
        fontSize: 5,
        marginRight: 5,
        width: '16.6%',
        textAlign: 'center',
    },
    contentContainer: {
        marginTop: 10,
        padding: 5,
    },
});

const MyPDFDocument = ({ tableData, companyDetails, excDetails,contractNotes }) => (
    <Document>
        {contractNotes.map((note, index) => (
            <Page key={index} style={styles.page} size="A4" orientation="portrait">
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

                {/* Displaying each note's details */}
                <View style={styles.contentContainer}>
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
                

                 {/* Table Section */}
             <View style={styles.tableContainer}>
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
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>{excDetails.exc_name || "N/A"}</Text>
                        <Text style={styles.tableCell}>{excDetails.segment || "N/A"}</Text>
                        <Text style={styles.tableCell}>{excDetails.clearing_no || "N/A"}</Text>
                        <Text style={styles.tableCell}>{excDetails.sebi_reg || "N/A"}</Text>
                        <Text style={styles.tableCell}>{excDetails.trading_no || "N/A"}</Text>
                        <Text style={styles.tableCell}>{excDetails.cmbp_id || "N/A"}</Text>
                    </View>
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
