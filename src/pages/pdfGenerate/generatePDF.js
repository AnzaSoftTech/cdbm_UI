// generatePDF.js

import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

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
});

// Custom PDF document
const MyPDFDocument = ({ tableData }) => (
    <Document>
        <Page style={styles.page} size="A4" orientation="landscape">
            <View fixed style={styles.row}>
                <View style={{ width: '40%' }}>
                    <Text style={styles.leftText}>Regd. Office: 304, Samarpan, New Link Road,</Text>
                    <Text style={styles.leftText}>Chakala, Andheri East, Mumbai - 400 099.</Text>
                    <Text style={styles.leftText}>Tel: 022-28316600, Fax: 022 2831 6605,</Text>
                    <Text style={styles.leftText}>Email: sodhani.vt@gmail.com</Text>
                    <Text style={styles.leftText}>Grievance Email: sodhani.relations@gmail.com</Text>
                    <Text style={styles.leftText}>Director: Anil Sodhani / Anand Sodhani</Text>
                    <Text style={styles.leftText}>Auth. Sign: Aditya Sodhani / Roopam Sodhani</Text>
                </View>
                <View style={{ width: '90%', alignItems: 'center' }}>
                    <Text style={styles.header}>CONTRACT NOTE CUM TAX INVOICE</Text>
                    <Text style={styles.header}>(TAX INVOICE UNDER SECTION 31 OF GST ACT)</Text>
                    <Text style={{ fontSize: 11, textAlign: 'center' }}>SODHANI SECURITIES LTD</Text>
                    <Text style={styles.header}>MEMBER: NATIONAL STOCK EXCHANGE OF INDIA LTD</Text>
                    <Text style={styles.header}>SEBI REGN. NO. INZ000242534 • TRADING CODE NO: 23/10245 • CM BP ID: IN554382</Text>
                    <Text style={styles.header}>CIN: U67120MH1997PLC108674 • GSTIN: 27AABCS • PAN NO AABCS9766K</Text>
                    <Text style={styles.header}>Compliance Officer: Anil Sodhani • Phone: 022-2831 6600 • Email: sodhani.anil@gmail.com</Text>
                </View>
                <View style={{ width: '40%', alignItems: 'right' }}>
                    <Text style={styles.righttext}>Revised / Supplementary</Text>
                    <Text style={styles.righttext}>Original for Recipient / Duplicate for Supplier</Text>
                    <Text style={styles.righttext}>Dealing Office Address:</Text>
                    <Text style={styles.righttext}>304, Samarpan, New Link Road,</Text>
                    <Text style={styles.righttext}>Chakala, Andheri East,</Text>
                    <Text style={styles.righttext}>Mumbai - 400 099.</Text>
                </View>
            </View>

            <View style={styles.line} />

            <View style={{ width: '20%' }}>
                <Text style={styles.leftText}>To,</Text>
                <Text style={styles.leftText}>KISHORI GUPTA (HUF) (1K009)</Text>
                <Text style={styles.leftText}>50 VAISHNO DEVI, 40 VITHAL NAGAR</Text>
                <Text style={styles.leftText}>J V P D VILEPARLE W</Text>
                <Text style={styles.leftText}>MUMBAI 400049</Text>
            </View>
            <View style={{ width: '20%' }}>
                <Text style={styles.leftText}>Sir/Madam,</Text>
                <Text style={styles.leftText}>We have this day done by your order and on your account the following transaction: </Text>
            </View>

            <View style={{ width: '100%', position: 'absolute', bottom: 10 }} />
            <View style={{ width: '70%', position: 'absolute', bottom: 10, left: 10 }}>
            <Text style={styles.leftText}>OTHER LEVIES, IF ANY:</Text>
            <Text style={styles.leftText}>
                Description of Service: Brokerage & related Securities & Commodity services. Accounting Code: 997152.
                SSL is collecting Stamp Duty & Securities Transaction Tax (STT) as a pure agent of the investor and hence the same is not considered in taxable value of supply for charging GST.
                Transactions mentioned in this contract note cum bill shall be governed and subject to the Rules, Bye-laws, Regulations and Circulars of the respective Exchanges on which trades have been executed and Securities and Exchange Board of India issued from time to time. It shall also be subject to the relevant Acts, Rules, Regulations, Directives, Notifications, Guidelines (including GST Laws) & Circulars issued by SEBI / Government of India / State Governments
                and Union Territory Governments issued from time to time. The Exchanges provide Complaint Resolution, Arbitration and Appellate arbitration facilities at the Regional Arbitration Centres (RAC). The client may approach its nearest centre, details of which are available on respective Exchange's website. Please visit www.nseindia.com for NSE, www.bseindia.com for BSE and www.msei.in for MSEI.
            </Text>
            <Text style={styles.leftText}>Date: 18 Oct, 2024. Place: Mumbai</Text>
            </View>

            <View style={{ width: '70%', position: 'absolute', bottom: 60, right: 10 }}>
                <Text style={styles.righttext}>Your Faithfully, for Sodhani Securities Ltd.:</Text>
            </View>
            <View style={{ width: '70%', position: 'absolute', bottom: 7, right: 10 }}>
                <Text style={styles.righttext}>Director/Authorised Signatory</Text>
                <Text style={styles.righttext}>Member: National Stock Exchange of India Ltd</Text>
            </View>

            {tableData.map((row, index) => (
                <View key={index} style={{ flexDirection: 'row', width: '100%', marginBottom: 3 }}>
                    {Object.values(row).map((cell, cellIndex) => (
                        <Text key={cellIndex} style={{ marginRight: 5 }}>{cell}</Text>
                    ))}
                </View>
            ))}
        </Page>
    </Document>
);

export default MyPDFDocument;
