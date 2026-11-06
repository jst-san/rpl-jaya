import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import HomePage from "./pages/Home";
import DashboardPage from "./pages/app/DashboardPage";
import ItemsPage from "./pages/app/ItemsPage";
import AppLayout from "./layouts/AppLayout";
import TransactionsPage from "./pages/app/TransactionsPage";
import TransactionDetailsPage from "./pages/app/TransactionDetailsPage";
import RootLayout from "./layouts/RootLayout";
import LoginPage from "./pages/LoginPage";
import UsersPage from "./pages/app/UsersPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route
            index
            element={<Navigate to={"/app/dashboard"} replace />}
          />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/app/" element={<AppLayout />}>
            <Route path="/app/dashboard" element={<DashboardPage />} />
            <Route path="/app/items" element={<ItemsPage />} />
            <Route path="/app/transactions" element={<TransactionsPage />} />
            <Route
              path="/app/transactions/:id"
              element={<TransactionDetailsPage />}
            />
            <Route path="/app/users" element={<UsersPage />} />
          </Route>

          <Route
            path="*"
            element={<Navigate to={"/app/dashboard"} replace />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
