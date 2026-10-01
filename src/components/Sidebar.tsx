import { useContext } from "react";
import { SidebarContext } from "../layouts/AdminPage";
import { Boxes, ChartBar, CreditCard, PanelLeftClose, X } from "lucide-react";
import logo from "../assets/skansaba.dev.webp";

export default function Sidebar() {
  const { isExpanded, setIsExpanded } = useContext(SidebarContext);

  const menus = [
    { icon: ChartBar, label: "Dashboard", href: "/admin/dashboard" },
    { icon: Boxes, label: "Barang", href: "/admin/items" },
    { icon: CreditCard, label: "Transaksi", href: "/admin/transactions" },
  ];
  return (
    <>
      <aside
        className={`${!isExpanded && "right-full"} fixed z-900 top-0 md:relative! md:right-0! min-h-full w-80 bg-white text-slate-700 border-r border-slate-200`}
      >
        <div className="sticky h-screen top-0">
          <div className="w-full h-20 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <img src={logo} className="w-6 h-6" />
              <div className="space-y-1">
                <div className="leading-none text-blue-400 text-lg font-bold">RPL Jaya</div>
              </div>
            </div>
            {/* <div className="text-blue-500 text-2xl font-black">RPL.J</div> */}
            <button onClick={() => setIsExpanded((prev) => !prev)}>
              <PanelLeftClose className="text-slate-600 md:hidden" size={24} />
            </button>
          </div>
          <ul className="space-y-1 font-medium">
            {menus.map((m) => (
              <li key={m.href} className="px-6 relative z-1 group">
                <div className="absolute justify-self-center -z-1 w-0 h-full opacity-0 bg-slate-50 group-hover:w-full group-hover:opacity-100 duration-300"></div>
                <a
                  href={m.href}
                  className="py-4 flex items-center gap-2 active:text-blue-500 duration-300"
                >
                  <m.icon className="group-hover:text-blue-500" size={18} />
                  <span>{m.label}</span>
                </a>
              </li>
            ))}
          </ul>
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
