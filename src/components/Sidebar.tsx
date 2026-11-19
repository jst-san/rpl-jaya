import { useContext, useEffect, useState } from "react";
import { SidebarContext } from "../layouts/AppLayout";
import {
  ArrowRightLeft,
  Boxes,
  ChartBar,
  CloudUpload,
  CreditCard,
  Edit2,
  LogOut,
  PanelLeftClose,
  Rotate3D,
  RotateCcw,
  RotateCw,
  Upload,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import logo from "../assets/skansaba.dev.webp";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../layouts/RootLayout";
import { Api } from "../lib/api";
import { getAccessToken } from "../lib/cookies";
import type { User } from "../types/models";

export default function Sidebar({
  nav,
}: {
  nav: { icon: LucideIcon; label: string; href: string }[];
}) {
  const { user, setUser } = useContext(UserContext);
  const { isExpanded, setIsExpanded } = useContext(SidebarContext);
  const [openProfileMenus, setOpenProfileMenus] = useState(true);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const api = new Api();
  const navigate = useNavigate();

  useEffect(() => {
    setIsExpanded(false);
  }, [window.location.pathname]);

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

  const toggle = (state: Record<string, boolean>) => {
    setOpen({ ...open, ...state });
  };

  return (
    <>
      <aside
        className={`${!isExpanded && "right-full"} fixed z-900 top-0 md:relative! md:right-0! min-h-full w-64 bg-white text-slate-700 border-r border-slate-200`}
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
          <ul className="space-y-1 font-medium px-3">
            {nav.map((n) => {
              const isActive = window.location.pathname === n.href;

              return (
                <Link
                  to={n.href}
                  key={n.href}
                  className={`${isActive && "border-slate-100!"} block px-3 relative z-1 rounded-md overflow-hidden group border-b-2 border-r-2 border-transparent duration-300`}
                >
                  <div
                    className={`${isActive && "opacity-100 w-full"} absolute justify-self-center -z-1 w-0 h-full opacity-0 bg-slate-50 group-hover:w-full group-hover:opacity-100 group-active:w-full group-active:opacity-100 duration-300`}
                  ></div>
                  <div
                    className={`${isActive && "text-blue-500"} py-3 flex items-center gap-2 text-xs active:text-blue-500 duration-300`}
                  >
                    <n.icon className="group-hover:text-blue-500" size={14} />
                    <span>{n.label}</span>
                  </div>
                </Link>
              );
            })}
          </ul>

          <div className="mt-auto w-full p-3 pt-0">
            <div className="relative">
              {openProfileMenus && (
                <div className="absolute bottom-full left-0 -translate-y-1 w-full p-1 bg-white border border-slate-200 rounded-md">
                  <button
                    className="px-3 py-2 w-full relative group rounded overflow-hidden"
                    onClick={() => toggle({ uploadPic: true })}
                  >
                    <div className="absolute justify-self-center top-0 -z-1 w-0 h-full opacity-0 bg-slate-50 group-hover:w-full group-hover:opacity-100 group-active:w-full group-active:opacity-100 duration-300"></div>
                    <div className="flex gap-2 items-center">
                      <ArrowRightLeft size={14} />
                      <span className="text-xs">Ganti Foto</span>
                    </div>
                  </button>
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
                {user?.picture ? (
                  <img
                    src={user.picture}
                    className="w-8 h-8 aspect-square object-cover object-center rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-500 rounded-full grid place-content-center uppercase text-white text-xs">
                    {user?.name.slice(0, 2)}
                  </div>
                )}
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

      {open.uploadPic && (
        <UploadPicModal
          close={() => toggle({ uploadPic: false })}
          setUser={setUser}
        />
      )}
    </>
  );
}

function UploadPicModal({
  close,
  setUser,
}: {
  close: () => void;
  setUser: (user: User | null | undefined) => void;
}) {
  const [file, setFile] = useState<File | null>();

  const submit = async () => {
    if (!file) return;

    const api = new Api();

    const token = await getAccessToken();

    if (!token) return window.location.reload();

    const formData = new FormData();

    formData.append("picture", file);
    try {
      const res = await api.post("/api/user/update-picture", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const { data, errors } = await res.json();

      if (!res.ok || errors) return;

      setUser(data);
      close();
    } catch (err) {}
  };

  return (
    <>
      <div
        onClick={close}
        className="fixed z-998 w-screen h-screen inset-0 bg-black/50"
      ></div>
      <div className="fixed z-999 left-1/2 top-1/2 -translate-1/2 w-full max-w-sm bg-white rounded-md shadow border border-slate-200">
        <div className="p-6 flex flex-col gap-6">
          <div className="flex justify-between">
            <div>Upload Foto</div>
            <button className="" onClick={close}>
              <X />
            </button>
          </div>
          <div className="w-full aspect-square bg-slate-50 border border-slate-100 flex items-center justify-center">
            {file ? (
              <img
                className="w-full aspect-square object-cover object-center"
                src={URL.createObjectURL(file)}
              />
            ) : (
              <div className="flex flex-col gap-3 items-center">
                <div className="bg-blue-500 p-2 rounded-full text-white">
                  <CloudUpload />
                </div>
                <label
                  className="py-2 px-4 bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-600 transition-colors rounded text-sm"
                  htmlFor="picture-upload"
                >
                  Browse
                </label>
              </div>
            )}
          </div>
          {file && (
            <div className="flex gap-2 justify-end">
              <label
                className="py-2 px-4 bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 active:bg-slate-50  transition-colors rounded text-sm"
                htmlFor="picture-upload"
              >
                Ubah
              </label>
              <button
                className="py-2 px-4 bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-600 transition-colors rounded text-sm"
                onClick={submit}
              >
                Kirim
              </button>
            </div>
          )}
          <input
            id="picture-upload"
            type="file"
            accept=".png,.jpg,.jpeg,.webp"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            hidden
          />
        </div>
      </div>
    </>
  );
}
