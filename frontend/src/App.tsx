import { Route, Routes } from "react-router-dom";
import Home from './pages/Home/Home'
import SignUp from './pages/SignUp/SignUp'
import SignIn from './pages/SignIn/SignIn'
import ProtectedRoute from './utils/ProtectedRoute'
import Profile from "./components/Profile/Profile";
import VipDashBoard from "./pages/VIP/VipDashBoard";
import Vip from "./pages/VIP/Vip";
import { initializeForm } from "../redux/reducers/formExtraReducers";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faLocationDot, faBuilding, faPaperPlane, faRightFromBracket, faUser, faXmark, faPenToSquare, faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { useEffect } from "react";
import { useAppDispatch } from "../redux/hooks";
import Account from "./pages/Account/Account";
import Verify from "./pages/Verify/Verify";
import Landing from "./pages/Landing/Landing";
library.add(faLocationDot, faBuilding, faPaperPlane, faRightFromBracket, faUser, faXmark, faPenToSquare, faCircleNotch)

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeForm());
  }
    , [dispatch]);

  return (
    <>
      <Routes>
        {/* Redirect unauthenticated users to login */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/landing" element={<Landing />} />

        {/* Protected Route */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route path="/vip" element={<ProtectedRoute><VipDashBoard /></ProtectedRoute>} />
        <Route path="/vip/:id" element={<ProtectedRoute><Vip /></ProtectedRoute>} />
        <Route path="/user/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>}></Route>
        <Route path="/verified" element={<Verify />}/>
      </Routes>
    </>
  )
}

export default App
