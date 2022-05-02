import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Signin from "./pages/Signin";
import ForgotPassword from "./pages/ForgotPassword";
import Items from "./pages/Items";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ChangeItem from "./pages/ChangeItem";
import "./index.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forgot-pass" element={<ForgotPassword />} />
          <Route path="/items" element={<Items />} />
          <Route path="/update/:id" element={<EditProfile />} />
          <Route path="/item/:id" element={<ChangeItem />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
