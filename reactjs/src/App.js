import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './views/login_page';
import { useCookies } from 'react-cookie';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from "./components/customize_components/proteced_route";
import MasterPage from './views/master_page';
import 'react-toastify/dist/ReactToastify.css';
import AreaSetting from "./views/sub_pages/motel_area_setting";
import ServiceSetting from "./views/sub_pages/service_setting";
import CustomerSetting from "./views/sub_pages/customer_setting";
import BedTypeSetting from './views/sub_pages/bed_type_setting';
import PriceSetting from './views/sub_pages/price_setting';
import PageNotFound from "./views/404_page";
import RoomDiagramSetting from './views/sub_pages/room_diagram_setting';
import InvoiceSetting from './views/sub_pages/invoice_setting';
import HomePage from './views/home_page';
import AccountSetting from './views/sub_pages/account_setting';
import HistorySetting from './views/sub_pages/history_setting';
import RevenueSetting from './views/sub_pages/revenue_setting';
import CompanySetting from './views/sub_pages/company_setting';
import CourseSetting from './views/sub_pages/course_setting';
import FormExportSetting from './views/sub_pages/form_export_setting';


function App() {
  const [cookie, setCookie, removeCookie] = useCookies(['loginCode']);
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/'
          element={
            <ProtectedRoute isAllowed={cookie.loginCode}>
              <MasterPage cookie={cookie} removeCookie={removeCookie}>
                <HomePage/>
              </MasterPage>
            </ProtectedRoute>}
        />
        <Route path='/login'
          element={
            <ProtectedRoute isAllowed={!cookie.loginCode} redirectTo={'/'}>
              <Login cookie={cookie} setCookie={setCookie} />
            </ProtectedRoute>
          } />
        <Route path='/motel/floor'
         element={
          <ProtectedRoute isAllowed={cookie.loginCode}>
            <MasterPage cookie={cookie} removeCookie={removeCookie}>
              <AreaSetting/>
            </MasterPage>
          </ProtectedRoute>}
        />
        <Route path='/motel/service'
         element={
          <ProtectedRoute isAllowed={cookie.loginCode}>
            <MasterPage cookie={cookie} removeCookie={removeCookie}>
              <ServiceSetting/>
            </MasterPage>
          </ProtectedRoute>}
        />
        <Route path='/motel/customer'
         element={
          <ProtectedRoute isAllowed={cookie.loginCode}>
            <MasterPage cookie={cookie} removeCookie={removeCookie}>
              <CustomerSetting/>
            </MasterPage>
          </ProtectedRoute>}
        />
        <Route path='/motel/bed'
         element={
          <ProtectedRoute isAllowed={cookie.loginCode}>
            <MasterPage cookie={cookie} removeCookie={removeCookie}>
              <BedTypeSetting/>
            </MasterPage>
          </ProtectedRoute>}
        />
        <Route path='/motel/price'
         element={
          <ProtectedRoute isAllowed={cookie.loginCode}>
            <MasterPage cookie={cookie} removeCookie={removeCookie}>
              <PriceSetting/>
            </MasterPage>
          </ProtectedRoute>}
        />
        <Route path='/motel/room'
         element={
          <ProtectedRoute isAllowed={cookie.loginCode}>
            <MasterPage cookie={cookie} removeCookie={removeCookie}>
              <RoomDiagramSetting/>
            </MasterPage>
          </ProtectedRoute>}
        />
        <Route path='/motel/invoice'
         element={
          <ProtectedRoute isAllowed={cookie.loginCode}>
            <MasterPage cookie={cookie} removeCookie={removeCookie}>
              <InvoiceSetting/>
            </MasterPage>
          </ProtectedRoute>}
        />
        <Route path='/motel/admin/account'
         element={
          <ProtectedRoute isAllowed={cookie.loginCode}>
            <MasterPage cookie={cookie} removeCookie={removeCookie}>
              <AccountSetting/>
            </MasterPage>
          </ProtectedRoute>}
        />
        <Route path='/motel/history'
         element={
          <ProtectedRoute isAllowed={cookie.loginCode}>
            <MasterPage cookie={cookie} removeCookie={removeCookie}>
              <HistorySetting/>
            </MasterPage>
          </ProtectedRoute>}
        />
        <Route path='/motel/revenue'
         element={
          <ProtectedRoute isAllowed={cookie.loginCode}>
            <MasterPage cookie={cookie} removeCookie={removeCookie}>
              <RevenueSetting/>
            </MasterPage>
          </ProtectedRoute>}
        />
        <Route path='/motel/company'
         element={
          <ProtectedRoute isAllowed={cookie.loginCode}>
            <MasterPage cookie={cookie} removeCookie={removeCookie}>
              <CompanySetting/>
            </MasterPage>
          </ProtectedRoute>}
        />
        <Route path='/motel/course'
         element={
          <ProtectedRoute isAllowed={cookie.loginCode}>
            <MasterPage cookie={cookie} removeCookie={removeCookie}>
              <CourseSetting/>
            </MasterPage>
          </ProtectedRoute>}
        />
        <Route path='/*'
         element={
          <ProtectedRoute isAllowed={cookie.loginCode}>
            <MasterPage cookie={cookie} removeCookie={removeCookie}>
              <PageNotFound/>
            </MasterPage>
          </ProtectedRoute>}
        />
      </Routes>
      <ToastContainer position="top-center"
        autoClose={1200}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        limit={3}
        pauseOnFocusLoss
        draggable
        theme="light" />
    </BrowserRouter>

  );
}

export default App;
