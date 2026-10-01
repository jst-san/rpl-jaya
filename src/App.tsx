import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import DashboardPage from "./pages/admin/DashboardPage";
import ItemsPage from "./pages/admin/ItemsPage";
import AdminLayout from "./layouts/AdminPage";
import TransactionsPage from "./pages/admin/TransactionsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/admin/" element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path="/admin/items" element={<ItemsPage />} />
          <Route path="/admin/transactions" element={<TransactionsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
