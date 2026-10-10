import { useContext, useState } from "react";
import { SidebarContext } from "../layouts/AdminLayout";
import {
  Boxes,
  ChartBar,
  CreditCard,
  LogOut,
  PanelLeftClose,
  X,
} from "lucide-react";
import logo from "../assets/skansaba.dev.webp";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../layouts/RootLayout";
import { Api } from "../lib/api";

export default function Sidebar() {
  const { user, setUser } = useContext(UserContext);
  const { isExpanded, setIsExpanded } = useContext(SidebarContext);
  const [openProfileMenus, setOpenProfileMenus] = useState(false);
  const api = new Api();
  const navigate = useNavigate();

  const menus = [
    { icon: ChartBar, label: "Dashboard", href: "/admin/dashboard" },
    { icon: Boxes, label: "Barang", href: "/admin/items" },
    { icon: CreditCard, label: "Transaksi", href: "/admin/transactions" },
  ];

  const handleLogOut = async () => {
    const access_token = await cookieStore.get("access_token");

    if (!access_token) {
      setUser(null);
      return navigate("/login");
    }
    const res = await api.post("/api/logout", {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${access_token.value}`,
      },
    });

    if (res.ok) {
      setUser(null);
      await cookieStore.delete("access_token");

      return navigate("/login");
    }
  };
  return (
    <>
      <aside
        className={`${!isExpanded && "right-full"} fixed z-900 top-0 md:relative! md:right-0! min-h-full w-80 bg-white text-slate-700 border-r border-slate-200`}
      >
        <div className="sticky h-screen top-0 flex flex-col">
          <div className="w-full h-16 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <img src={logo} className="w-6 h-6" />
              <div className="space-y-1">
                <div className="leading-none text-blue-400 text-lg font-bold">
                  RPL Jaya
                </div>
              </div>
            </div>
            <button
              className="md:hidden relative z-1 group p-2 flex items-center justify-center"
              onClick={() => setIsExpanded((prev) => !prev)}
            >
              <PanelLeftClose className="text-slate-600" size={18} />

              <div className="absolute -z-1 bg-slate-50 rounded-full w-full h-full scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 group-active:scale-100 group-active:opacity-100 transition-all"></div>
            </button>
          </div>
          <ul className="space-y-1 font-medium">
            {menus.map((m) => (
              <li key={m.href} className="px-6 relative z-1 group">
                <div className="absolute justify-self-center -z-1 w-0 h-full opacity-0 bg-slate-50 group-hover:w-full group-hover:opacity-100 group-active:w-full group-active:opacity-100 duration-300"></div>
                <Link
                  to={m.href}
                  className="py-3 flex items-center gap-2 text-sm active:text-blue-500 duration-300"
                >
                  <m.icon className="group-hover:text-blue-500" size={14} />
                  <span>{m.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto w-full p-3 pt-0">
            <div className="relative">
              {openProfileMenus && (
                <div className="absolute bottom-full left-0 -translate-y-1 w-full p-1 bg-white border border-slate-200 rounded-md">
                  <button
                    className="px-3 py-2 w-full relative group rounded overflow-hidden"
                    onClick={handleLogOut}
                  >
                    <div className="absolute justify-self-center top-0 -z-1 w-0 h-full opacity-0 bg-red-50 group-hover:w-full group-hover:opacity-100 group-active:w-full group-active:opacity-100 duration-300"></div>
                    <div className="flex gap-2 items-center text-red-500">
                      <LogOut size={14} />
                      <span className="text-xs">Logout</span>
                    </div>
                  </button>
                </div>
              )}
              <button
                className="bg-white w-full border border-slate-200 p-1 rounded-full overflow-hidden flex gap-1 items-center relative z-1 group"
                onClick={() => setOpenProfileMenus((prev) => !prev)}
              >
                <div className="absolute justify-self-center top-0 -z-1 w-0 h-full opacity-0 bg-slate-50 group-hover:w-full group-hover:opacity-100 group-active:w-full group-active:opacity-100 duration-300"></div>

                <div className="w-8 h-8 bg-blue-500 rounded-full grid place-content-center uppercase text-white text-xs">
                  {user?.name.slice(0, 2)}
                </div>
                <div className="text-left">
                  <div className="text-xs text-slate-900">{user?.name}</div>
                  <div className="text-[0.5rem]">{user?.email}</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </aside>
      <div
        className="md:hidden fixed z-899 inset-0 w-full h-full"
        hidden={!isExpanded}
        onClick={() => setIsExpanded(false)}
      ></div>
    </>
  );
}
