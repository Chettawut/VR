import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from "../pages/Home";
import Items from "../pages/Items";
import SR from "../pages/SR";
import Unit from "../pages/Unit";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import PageNotFound from "../pages/404";
import User from "../pages/User";
import Customer from "../pages/Customer";
import Supplier from "../pages/Supplier";
import PrivateRoute from "../components/auth/PrivateRoutes"; 
import { FileControl } from "../pages/file-control/file-control";
import { SampleRequest, SampleRequestIndex, SampleRequestForm, SampleRequestView } from "../pages/sr/sample-request";
import { SamplePreparation, SamplePreparationIndex, SamplePreparationForm, SamplePreparationView } from "../pages/sp/sample-preparation";
import { PilotScale, PilotScaleAccess, PilotScaleManage, PilotScaleView } from "../pages/pilot-scale";
import { DeliveryNote, DeliveryNoteAccess, DeliveryNoteManage } from "../pages/delivery-note";
import { Bom, BomAccess, BomManage } from "../pages/bom";
import { Packaging, PackagingAccess, PackagingManage } from "../pages/packaging";
import { PackingSet, PackingSetAccess, PackingSetManage } from "../pages/packing-set";
import { Estimation, EstimationAccess, EstimationManage } from "../pages/estimation";
import { Quotation, QuotationAccess, QuotationManage } from "../pages/quotation";
import { ShippingType, ShippingTypeAccess, ShippingTypeManage } from "../pages/shipping-type";

import { Customers, CustomersAccess, CustomersManage } from "../pages/customers";
import { Suppliers, SuppliersAccess, SuppliersManage } from "../pages/suppliers";

import { DashBoard } from "../pages/dashboard"

import { 
  CoaPrintPreview, 
  LoiPrintPreview, 
  DlnPrintPreview, 
  QuoPrintPreview,
  SptPrintPreview,
  EstPrintPreview,
} from "../components/print";
import { ROLES, LAYOUT } from "../constant/constant";

const Router = () => {
  return (

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate replace to="/login" />} />
            <Route path="/login" element={<Login />} />

            <Route  element={<PrivateRoute allowdRole={[ROLES.ADMIN, ROLES.USER]} />} >

              <Route path="/dashboard" element={<DashBoard />} />
              <Route path="/items" element={<Items />} />
              <Route path="/sr" element={<SR />} />
              <Route path="/unit" element={<Unit />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/customer" element={<Customer/>} /> 
              <Route path="/supplier" element={<Supplier/>} />

              <Route path="/file-control" element={<FileControl />} />       
                       
              <Route path="/sample-request/"  exact element={<SampleRequest />} >
                <Route index element={<SampleRequestIndex />} />
                <Route path="manage/:action" element={<SampleRequestForm />} /> 
                <Route path="view" element={<SampleRequestView />} />
              </Route>

              <Route path="/sample-preparation/"  exact element={<SamplePreparation />} >
                <Route index element={<SamplePreparationIndex />} />
                <Route path="manage/:action" element={<SamplePreparationForm />} />
                <Route path="view" element={<SamplePreparationView />} />
              </Route>

              <Route path="/pilot-scale/"  exact element={<PilotScale />} >
                <Route index element={<PilotScaleAccess />} />
                <Route path="manage/:action" element={<PilotScaleManage />} />
                <Route path="view" element={<PilotScaleView />} />
              </Route>

              <Route path="/delivery-note/"  exact element={<DeliveryNote />} >
                <Route index element={<DeliveryNoteAccess />} />
                <Route path="manage/:action" element={<DeliveryNoteManage />} />
                {/* <Route path="view" element={<PilotScaleView />} /> */}
              </Route>

              <Route path="/estimation/"  exact element={<Estimation />} >
                <Route index element={<EstimationAccess />} />
                <Route path="manage/:action" element={<EstimationManage />} />
                {/* <Route path="view" element={<PilotScaleView />} /> */}
              </Route>

              <Route path="/bom/"  exact element={<Bom />} >
                <Route index element={<BomAccess />} />
                <Route path="manage/:action" element={<BomManage />} />
                {/* <Route path="view" element={<PilotScaleView />} /> */}
              </Route>

              <Route path="/packaging/"  exact element={<Packaging />} >
                <Route index element={<PackagingAccess />} />
                <Route path="manage/:action" element={<PackagingManage />} />
                {/* <Route path="view" element={<PilotScaleView />} /> */}
              </Route>

              <Route path="/packing-set/"  exact element={<PackingSet />} >
                <Route index element={<PackingSetAccess />} />
                <Route path="manage/:action" element={<PackingSetManage />} />
                {/* <Route path="view" element={<PilotScaleView />} /> */}
              </Route>

              <Route path="/customers/"  exact element={<Customers />} >
                <Route index element={<CustomersAccess />} />
                <Route path="manage/:action" element={<CustomersManage />} />
                {/* <Route path="view" element={<PilotScaleView />} /> */}
              </Route>

              <Route path="/suppliers/"  exact element={<Suppliers />} >
                <Route index element={<SuppliersAccess />} />
                <Route path="manage/:action" element={<SuppliersManage />} />
                {/* <Route path="view" element={<PilotScaleView />} /> */}
              </Route>

              <Route path="/quotation/"  exact element={<Quotation />} >
                <Route index element={<QuotationAccess />} />
                <Route path="manage/:action" element={<QuotationManage />} />
                {/* <Route path="view" element={<PilotScaleView />} /> */}
              </Route>

              <Route path="/shipping-type/"  exact element={<ShippingType />} >
                <Route index element={<ShippingTypeAccess />} />
                <Route path="manage/:action" element={<ShippingTypeManage />} />
                {/* <Route path="view" element={<PilotScaleView />} /> */}
              </Route>

            </Route>

            <Route element={<PrivateRoute allowdRole={[ROLES.ADMIN]} />}>
              <Route path="/user" element={<User/>} />
            </Route>

            <Route element={<PrivateRoute allowdRole={[ROLES.ADMIN, ROLES.USER]} layout={LAYOUT.ALOND} />}>
              <Route path="/coa-print/:code/:print?" element={<CoaPrintPreview />} />
              <Route path="/loi-print/:code/:print?" element={<LoiPrintPreview />} />
              <Route path="/dln-print/:code/:print?" element={<DlnPrintPreview />} />
              <Route path="/quo-print/:code/:print?" element={<QuoPrintPreview />} />
              <Route path="/spt-print/:code/:print?" element={<SptPrintPreview />} />
              <Route path="/est-print/:code/:print?" element={<EstPrintPreview />} />
            </Route>

            <Route path="/*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>  
  );
};
 
export default Router;
