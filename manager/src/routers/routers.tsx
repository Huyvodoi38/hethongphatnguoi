import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import ViolationManagement from "../pages/ViolationManagement";
import RefutationManagement from "../pages/RefutationManagement";
import AddViolation from "../pages/AddViolation";
import ViolationDetail from "../pages/ViolationDetail";
import RefutationDetail from "../pages/RefutationDetail";
import PrivateRoute from "../components/PrivateRoute";
import Login from "../pages/Login";
import VehicleManagement from "../pages/VehicleManagement";
import VehicleDetail from "../pages/VehicleDetail";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/qlvipham" element={<ViolationManagement />} />
        <Route path="/qlvipham/add" element={<AddViolation />} />
        <Route path="/qlvipham/detail/:id" element={<ViolationDetail />} />
        <Route path="/qlkhieunai" element={<RefutationManagement />} />
        <Route path="/qlkhieunai/detail/:id" element={<RefutationDetail />} />
        <Route path="/qlphuongtien" element={<VehicleManagement />} />
        <Route path="/qlphuongtien/detail/:id" element={<VehicleDetail />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
