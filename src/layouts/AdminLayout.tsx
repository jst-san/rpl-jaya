import React, {
  createContext,
  useState,
} from "react";
import type { Dispatch, SetStateAction } from "react";
import Wrapper from "../components/Wrapper";
import { PanelLeftOpen } from "lucide-react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";


export default function AdminLayout() {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <SidebarContext.Provider value={{ isExpanded, setIsExpanded }}>
      <div className="min-h-screen flex">
        <Sidebar />
        <div className="flex-1 w-full">
          <div className="sticky z-[800] top-0 w-full h-16 bg-white border-b border-slate-200 px-6 flex items-center">
            <button
              className="md:hidden relative z-1 group p-2 flex items-center justify-center"
              onClick={() => setIsExpanded((prev) => !prev)}
            >
              <PanelLeftOpen className="text-slate-600" size={18} />
              <div className="absolute -z-1 bg-slate-50 rounded-full w-full h-full scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 group-active:scale-100 group-active:opacity-100 transition-all"></div>
            </button>
          </div>
          <Wrapper>
            <Outlet />
          </Wrapper>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}

export const SidebarContext = createContext<{
  isExpanded: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
}>({
  isExpanded: false,
  setIsExpanded: () => {},
});
