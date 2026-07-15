import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import SofasPage from "./pages/SofasPage";
import ChairsPage from "./pages/ChairsPage";
import TablesPage from "./pages/TablesPage";
import EmployeesPage from "./pages/EmployeesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sofas" element={<SofasPage />} />
        <Route path="/chairs" element={<ChairsPage />} />
        <Route path="/tables" element={<TablesPage />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
        </Route>
        

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;