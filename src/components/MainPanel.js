import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SU_MainApp from '../pages/sauda_upload/SU_MainApp';
//import Page2 from '../pages/Page2';
import MF_MainApp from '../pages/master_file_upload/mf_mainapp';
import TB_MainApp from '../pages/trial_balance/tb_mainapp';
import L_MainApp from '../pages/ledger/l_mainapp';
import PDF_FILE from '../pages/pdfGenerate/SettlementReport';
import CNP_MainApp from '../pages/cash_net_position/cnp_mainapp';
import SR_MainApp from '../pages/sauda_report/sr_mainapp';
import PAYMENT_VOUCHARApp from '../pages/payment_vouchar/Payment_voucharApp';
import JOURNALApp from '../pages/journal_vouchar/JournalApp';
import DRCRNOTEApp from '../pages/dr_cr_note/drcrnotesApp';
import CONTRAENTERYApp from '../pages/Contra_Entry/contraenteryApp';
import BANKRECOApp from '../pages/Bank_Reco/bankRecoApp';
import OPENINGBALANCEApp from '../pages/openingBalance/openingbalanceApp';
import CASHBANK_MASTER from '../pages/cashbank_master/CashBank_MasterApp';
import ACCOUNT_MASTER from '../pages/account_master/Account_MasterApp';
import BOOKTYPE_MASTER from '../pages/booktype_master/Book_Type_MasterApp';
import SETTLEJVAPP from '../pages/settle_jv/SettleJvApp';
import CLIENT_MASTER from '../pages/Client_Master/client_masterApp';
import BROK_SLAB from '../pages/brok_slab/Brok_slab_masterApp'
import CLIENT_LINK_SLAB from '../pages/client_link_slab/Client_link_slab_masterApp';
import DOC_MAPP_MASTER from '../pages/doc_mapp_master/Doc_Mapp_Master_MasterApp';
import FAMILY_GRP from '../pages/family_grp/FamGrp_MasterApp';
import CLIENT_GRP from '../pages/client_grp/ClientGrp_MasterApp';
import MII_MASTER from '../pages/mii_master/MII_MasterApp';
import DAY_BOOKAPP from '../pages/day_book/daybookapp';
import VENDOR_MASTERAPP from '../pages/vendor_master/Vendor_MasterApp';
import ACTIVITY_MASTER_APP from '../pages/activity_master/Activity_MasterApp';
import SEGMENT_MASTERAPP from '../pages/segment_master/Segment_MasterApp';
import DEALER_SUB_DEALERAPP from '../pages/dealer_sub_dealer/Dealer_Sub_DealerApp';
import DEALER_SLAB_MASTERAPP from '../pages/dealer_slab_master/Dealer_Slab_MasterApp';

function MainPanel() {
  
  return (
    <div className="d-flex flex-column ">
      <Routes>
        <Route path="sauda_upload/SU_MainApp" element={<SU_MainApp />}/>
        <Route path="main_file_upload/mf_mainapp" element={<MF_MainApp />}/>
        <Route path="trial_balance/tb_mainapp" element={<TB_MainApp />}/>
        <Route path="ledger/l_mainapp" element={<L_MainApp />}/>
        <Route path="pdfGenerate/SettlementReport" element={<PDF_FILE />}/>
        <Route path="cash_net_position/cnp_mainapp" element={<CNP_MainApp />}/>
        <Route path="sauda_report/sr_mainapp" element={<SR_MainApp />}/>
        <Route path="payment_vouchar/Payment_voucharApp" element={<PAYMENT_VOUCHARApp />}/>
        <Route path="journal_vouchar/JournalApp" element={<JOURNALApp />}/>
        <Route path="dr_cr_note/drcrnotesApp" element={<DRCRNOTEApp />}/>
        <Route path="Contra_Entry/contraenteryApp" element={<CONTRAENTERYApp  />}/>
        <Route path="Bank_Reco/bankRecoApp" element={<BANKRECOApp />}/>
        <Route path="openingBalance/openingbalanceApp" element={<OPENINGBALANCEApp />}/>
        <Route path="booktype_master/Book_Type_MasterApp" element={<BOOKTYPE_MASTER />}/>
        <Route path="cashbank_master/CashBank_MasterApp" element={<CASHBANK_MASTER />}/>
        <Route path="account_master/Account_MasterApp" element={<ACCOUNT_MASTER />}/>
        <Route path="settle_jv/SettleJvApp" element={<SETTLEJVAPP />}/>
        <Route path="Client_Master/client_masterApp" element={<CLIENT_MASTER/>}/>
        <Route path="brok_slab/Brok_slab_masterApp" element={<BROK_SLAB/>}/>
        <Route path="client_link_slab/Client_link_slab_masterApp" element={<CLIENT_LINK_SLAB/>}/>
        <Route path="doc_mapp_master/Doc_Mapp_Master_MasterApp" element={<DOC_MAPP_MASTER/>}/>
        <Route path="family_grp/FamGrp_MasterApp" element={<FAMILY_GRP/>}/>
        <Route path="client_grp/ClientGrp_MasterApp" element={<CLIENT_GRP/>}/>
        <Route path="mii_master/MII_MasterApp" element={<MII_MASTER/>}/>
        <Route path="day_book/daybookapp" element={<DAY_BOOKAPP/>}/>
        <Route path="vendor_master/Vendor_MasterApp" element={<VENDOR_MASTERAPP />}/>
        <Route path="activity_master/Activity_MasterApp" element={<ACTIVITY_MASTER_APP />}/>
        <Route path="segment_master/Segment_MasterApp" element={<SEGMENT_MASTERAPP />}/>
        <Route path="dealer_sub_dealer/Dealer_Sub_DealerApp" element={<DEALER_SUB_DEALERAPP />}/>
        <Route path="dealer_slab_master/Dealer_Slab_MasterApp" element={<DEALER_SLAB_MASTERAPP />}/>
        {/* <Route path="page2" element={<Page2 />} /> */}
      </Routes>
    </div>
  );
}

export default MainPanel;
