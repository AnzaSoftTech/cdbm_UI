import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SU_MainApp from '../pages/sauda_upload/SU_MainApp';
//import Page2 from '../pages/Page2';
import MF_MainApp from '../pages/master_file_upload/mf_mainapp';
import TB_MainApp from '../pages/trial_balance/tb_mainapp';
import L_MainApp from '../pages/ledger/l_mainapp';
import PDF_FILE from '../pages/pdfGenerate/pdfFile';
import CNP_MainApp from '../pages/cash_net_position/cnp_mainapp';
import SR_MainApp from '../pages/sauda_report/sr_mainapp';
import PAYMENT_VOUCHARApp from '../pages/payment_vouchar/Payment_voucharApp';
import JOURNALApp from '../pages/journal_vouchar/JournalApp';
import DRCRNOTEApp from '../pages/dr_cr_note/drcrnotesApp';
import CONTRAENTERYApp from '../pages/Contra_Entry/contraenteryApp';
import BANKRECOApp from '../pages/Bank_Reco/bankRecoApp';
import OPENINGBALANCEApp from '../pages/openingBalance/openingbalanceApp';
import CashBankMasterApp from '../pages/Cash_Bank_Master/Cash_Bank_MasterApp';


function MainPanel() {
  
  return (
    <div className="d-flex flex-column ">
      <Routes>
        <Route path="sauda_upload/SU_MainApp" element={<SU_MainApp />}/>
        <Route path="main_file_upload/mf_mainapp" element={<MF_MainApp />}/>
        <Route path="trial_balance/tb_mainapp" element={<TB_MainApp />}/>
        <Route path="ledger/l_mainapp" element={<L_MainApp />}/>
        <Route path="pdfGenerate/pdfFile" element={<PDF_FILE />}/>
        <Route path="cash_net_position/cnp_mainapp" element={<CNP_MainApp />}/>
        <Route path="sauda_report/sr_mainapp" element={<SR_MainApp />}/>
        <Route path="payment_vouchar/Payment_voucharApp" element={<PAYMENT_VOUCHARApp />}/>
        <Route path="journal_vouchar/JournalApp" element={<JOURNALApp />}/>
        <Route path="dr_cr_note/drcrnotesApp" element={<DRCRNOTEApp />}/>
        <Route path="Contra_Entry/contraenteryApp" element={<CONTRAENTERYApp  />}/>
        <Route path="Bank_Reco/bankRecoApp" element={<BANKRECOApp />}/>
        <Route path="openingBalance/openingbalanceApp" element={<OPENINGBALANCEApp />}/>
        <Route path="Cash_Bank_Master/Cash_Bank_MasterApp" element={<CashBankMasterApp />}/>
        {/* <Route path="page2" element={<Page2 />} /> */}
      </Routes>
    </div>
  );
}

export default MainPanel;
