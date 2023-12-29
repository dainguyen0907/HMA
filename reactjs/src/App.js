import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './views/login_page';
import { useCookies } from 'react-cookie';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from "./components/proteced_route";
import SideBar from './components/sideBar';
import 'react-toastify/dist/ReactToastify.css';



function App() {
  const [cookie,setCookie]=useCookies(['loginCode']);
  return (
    <BrowserRouter>
    {cookie.loginCode?
    <SideBar/>
    :""}
    <Routes>
      <Route path='/' 
      element={<ProtectedRoute isAllowed={cookie.loginCode}>
      </ProtectedRoute>}
      />
      <Route path='/login' 
      element={<ProtectedRoute isAllowed={!cookie.loginCode} redirectTo={'/'}>
        <Login cookie={cookie} setCookie={setCookie}/>
      </ProtectedRoute>}/>
    </Routes>
    <ToastContainer position="top-center"
    autoClose={3000}
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
