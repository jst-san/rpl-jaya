import React, { createContext, useContext, useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import Wrapper from "../components/Wrapper";
import {
  Boxes,
  ChartBar,
  ChevronsUpDown,
  Circle,
  CreditCard,
  Dot,
  PanelLeftOpen,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { UserContext } from "./RootLayout";

export default function AdminLayout() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [active, setActive] = useState<{
    icon: LucideIcon;
    label: string;
    href: string;
  }>();
  const location = useLocation();
  const { user } = useContext(UserContext);

  const nav = [
    { icon: ChartBar, label: "Dashboard", href: "/admin/dashboard" },
    { icon: Boxes, label: "Barang", href: "/admin/items" },
    { icon: CreditCard, label: "Transaksi", href: "/admin/transactions" },
    { icon: Users, label: "User", href: "/admin/users" },
  ];

  useEffect(() => {
    setActive(nav.find((n) => n.href === location.pathname) ?? undefined);
  }, [location]);

  const toggle = (state: Record<string, boolean>) => {
    setOpen({ ...open, ...state });
  };

  return (
    user !== undefined &&
    (Boolean(user) ? (
      <SidebarContext.Provider value={{ isExpanded, setIsExpanded }}>
        <div className="min-h-screen flex">
          <Sidebar />
          <div className="flex-1 w-full">
            <div className="sticky z-[800] top-0 w-full h-16 bg-white border-b border-slate-200 px-6 flex gap-3 items-center">
              <button
                className="md:hidden relative z-1 group p-2 flex items-center justify-center"
                onClick={() => setIsExpanded((prev) => !prev)}
              >
                <PanelLeftOpen className="text-slate-600" size={18} />
                <div className="absolute -z-1 bg-slate-50 rounded-full w-full h-full scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 group-active:scale-100 group-active:opacity-100 transition-all"></div>
              </button>
              {active && (
                <div className="relative text-xs">
                  <button
                    className={`${open.nav && "text-blue-500! bg-slate-50"} text-slate-600 duration-300 w-24 px-2 py-4 flex gap-1 items-center justify-between rounded transition-colors`}
                    onClick={() => toggle({ nav: !open.nav })}
                  >
                    {active.label}
                    <ChevronsUpDown size={12} />
                  </button>
                  <div
                    className={`${!open.nav && "opacity-0 pointer-events-none -translate-y-2"} duration-300 absolute left-0 top-full bg-white text-slate-600 flex flex-col gap-1 p-2 translate-y-2 rounded-md border border-slate-200`}
                  >
                    {nav.map((n) => (
                      <Link
                        className="w-32 rounded overflow-hidden relative group"
                        to={n.href}
                      >
                        <div
                          className={`${active.href === n.href && "opacity-100 w-full"} absolute justify-self-center -z-1 w-0 h-full opacity-0 bg-slate-50 group-hover:w-full group-hover:opacity-100 group-active:w-full group-active:opacity-100 duration-300`}
                        ></div>

                        <div className="p-2 flex items-center justify-between">
                          {n.label}
                          {active.href === n.href && (
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div>
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Wrapper>
              <Outlet />
            </Wrapper>
          </div>
        </div>
      </SidebarContext.Provider>
    ) : (
      <Navigate to="/login" />
    ))
  );
}

export const SidebarContext = createContext<{
  isExpanded: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
}>({
  isExpanded: false,
  setIsExpanded: () => {},
});
