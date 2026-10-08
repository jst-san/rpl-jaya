import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import HomePage from "./pages/Home";
import DashboardPage from "./pages/admin/DashboardPage";
import ItemsPage from "./pages/admin/ItemsPage";
import AdminLayout from "./layouts/AdminLayout";
import TransactionsPage from "./pages/admin/TransactionsPage";
import TransactionDetailsPage from "./pages/admin/TransactionDetailsPage";
import RootLayout from "./layouts/RootLayout";
import LoginPage from "./pages/LoginPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route
            index
            element={<Navigate to={"/admin/dashboard"} replace />}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/" element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<DashboardPage />} />
            <Route path="/admin/items" element={<ItemsPage />} />
            <Route path="/admin/transactions" element={<TransactionsPage />} />
            <Route
              path="/admin/transactions/:id"
              element={<TransactionDetailsPage />}
            />
          </Route>
          <Route
            path="*"
            element={<Navigate to={"/admin/dashboard"} replace />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
