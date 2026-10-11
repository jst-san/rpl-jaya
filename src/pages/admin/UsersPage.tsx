import { useEffect, useState } from "react";
import { Api } from "../../lib/api";
import { getAccessToken } from "../../lib/cookies";
import type { User, UserFillable } from "../../types/models";
import { ChevronDown, ChevronLeft, ChevronRight, Edit, Eye, EyeClosed, Plus, RefreshCw, Trash, X } from "lucide-react";
import SkelTable from "../../components/SkelTable";
import dayjs from "dayjs";
import type { PaginationMetadata } from "../../types/data";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [metadata, setMetadata] = useState<PaginationMetadata>({
    currentPage: 1,
    perPage: 10,
    total: 0,
    from: 0,
    to: 0,
    lastPage: 0,
  });
  const [open, setOpen] = useState<Record<string, boolean>>({ perPage: false });
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [action, setAction] = useState<"add" | "edit">("add");
  const [formData, setFormData] = useState<UserFillable>({
    name: "",
    email: "",
    password: "",
  });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const api = new Api();
  const cols = ["ID", "Nama", "Email", "Diverifikasi", "Dibuat", "Diperbarui"];

  useEffect(() => {
    (async () => {
      await getUsers();
    })();
  }, []);

  const getUsers = async (params: PaginationMetadata = metadata) => {
    setIsLoading(true);

    const token = await getAccessToken();

    const res = await api.get(`/api/users?page=${params.currentPage}&per_page=${params.perPage}`, [], {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = await res.json();

    if (!res.ok) {
      setIsLoading(false);
      return setErrors({
        init: {
          code: res.statusText,
          message: "Terjadi kesalahan saat memuat data",
        },
      });
    }

    setUsers(payload.data);
    setMetadata({
      currentPage: payload.current_page,
      perPage: payload.per_page,
      from: payload.from,
      to: payload.to,
      lastPage: payload.last_page,
      total: payload.total,
    });
    setIsLoading(false);
  };

  const updateFormData = (data: Partial<UserFillable>) => {
    setFormData({ ...formData, ...data });
  };

  const updateMetadata = (data: Partial<PaginationMetadata>) => {
    setMetadata({ ...metadata, ...data });
  };

  const previousPage = () => {
    if (metadata.currentPage <= 1) return;

    getUsers({ ...metadata, currentPage: metadata.currentPage - 1 });
  };

  const nextPage = () => {
    if (metadata.currentPage >= metadata.lastPage) return;

    getUsers({ ...metadata, currentPage: metadata.currentPage + 1 });
  };

  const closeModal = () => {
    setFormData({ name: "", email: "", password: "" });
    setSelectedId(null);
    setOpenModal(false);
    setErrors({});
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const token = await getAccessToken();

    const res =
      action === "add"
        ? await api.post("/api/users", {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              ...formData,
            }),
          })
        : await api.put(`/api/users/${selectedId}`, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              ...formData,
            }),
          });

    const { data, errors } = await res.json();

    if (!res.ok) {
      if (errors) setErrors(errors);
      return;
    }

    action === "add"
      ? setUsers([...users, data])
      : setUsers(
          [...users.filter((u) => u.id !== selectedId), data].sort(
            (a, b) => a.id - b.id,
          ),
        );

    setFormData({ name: "", email: "", password: "" });
    setSelectedId(null);
    setOpenModal(false);
  };

  const handleDelete = async (id: number) => {
    const token = await getAccessToken();

    const res = await api.delete(`/api/users/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return;

    setUsers(users.filter((u) => u.id !== id));
  };

  const toggle = (state: Record<string, boolean>) => {
    setOpen({ ...open, ...state });
  };

  return Boolean(errors.init) ? (
    <div className="flex justify-center py-16">
      <div className="flex items-center gap-6">
        <img
          src="/src/assets/skansaba.dev.webp"
          className="w-32 grayscale-100 opacity-25"
        />
        <div>
          <h2 className="text-4xl font-semibold text-slate-700">Oops</h2>
          <p className="mt-0.5 text-slate-500">{errors.init?.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="flex gap-2 items-center mt-4 py-2 px-4 rounded text-sm bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-600 transition-colors"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm text-blue-500">USER</h2>
        <div className="flex gap-3">
          <div className="text-xs relative text-slate-600 group/perPage">
            <button
              className="leading-none px-2 h-8 flex gap-2 items-center border border-slate-200 rounded hover:bg-slate-50 active:bg-slate-50 transition-colors"
              onClick={() => toggle({ perPage: !open.perPage })}
            >
              {metadata.perPage} Baris <ChevronDown size={14} />
            </button>
            {open.perPage && (
              <div className="z-100 flex flex-col absolute top-full right-0 translate-y-1 py-1 bg-white border border-slate-200 rounded overflow-hidden">
                {[10, 15, 25, 50, 100].map((n) => (
                  <button
                    className="w-24 z-1 relative group"
                    onClick={() => {
                      setOpen({ perPage: false });
                      getUsers({
                        ...metadata,
                        perPage: n,
                        currentPage: 1,
                      });
                    }}
                  >
                    <div className="absolute justify-self-center -z-1 w-0 h-full opacity-0 bg-slate-50 group-hover:w-full group-hover:opacity-100 group-active:w-full group-active:opacity-100 duration-300"></div>
                    <div
                      className={`${metadata.perPage === n && "text-blue-500"} w-full p-2 text-left transition-colors`}
                    >
                      {n} Baris
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            className="p-2 bg-white text-slate-600 border border-slate-200 rounded hover:bg-slate-50 active:bg-slate-50 transition-colors"
            onClick={async () => await getUsers()}
          >
            <RefreshCw className={`${isLoading && "animate-spin"}`} size={14} />
          </button>
          <button
            className="p-2 bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-600 transition-colors rounded"
            onClick={() => {
              setAction("add");
              setOpenModal(true);
            }}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="overflow-auto w-full">
        {isLoading && !users.length ? (
          <SkelTable />
        ) : (
          <table className="table-auto w-max min-w-full border border-slate-200">
            <thead>
              <tr className="bg-white border-b border-slate-200 divide-x divide-slate-200">
                {cols.map((c) => (
                  <th key={c} className="font-medium p-2">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {users.map((u) => (
                <tr
                  key={u.id}
                  tabIndex={0}
                  className="relative text-slate-800 bg-slate-50 odd:bg-slate-100 divide-x divide-slate-200 outline outline-transparent -outline-offset-1 focus-within:bg-white transition-colors group"
                >
                  <td className="p-2 text-center">{u.id}</td>
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2 text-right">
                    {u.email_verified_at === null
                      ? "-"
                      : dayjs(u.email_verified_at).format("DD-MM-YYYY")}
                  </td>
                  <td className="p-2 text-right">
                    {dayjs(u.created_at).format("DD-MM-YYYY")}
                  </td>
                  <td className="p-2 text-right">
                    {dayjs(u.updated_at).format("DD-MM-YYYY")}
                  </td>
                  <td className="absolute bottom-full left-0 flex gap-1 p-1 border border-l-0 border-slate-200 bg-white opacity-0 translate-y-5 pointer-events-none group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto transition-all">
                    <button
                      className="p-2 flex gap-2 items-center text-xs rounded hover:bg-slate-100 active:bg-slate-100 transition-colors"
                      onClick={() => handleDelete(u.id)}
                    >
                      <Trash size={12} />
                      Hapus
                    </button>
                    <button
                      className="p-2 flex gap-2 items-center text-xs rounded hover:bg-slate-100 active:bg-slate-100 transition-colors"
                      onClick={() => {
                        setFormData({
                          name: u.name,
                          email: u.email,
                          password: "",
                        });
                        setAction("edit");
                        setSelectedId(u.id);
                        setOpenModal(true);
                      }}
                    >
                      <Edit size={12} />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex justify-between py-6 text-slate-600">
        <div className="text-sm">
          Jumlah : {metadata.to + 1 - metadata.from}
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="text-right text-sm font-[arial]">
            Halaman{" "}
            <span className="text-blue-500">{metadata.currentPage}</span> /{" "}
            {metadata.lastPage}
          </div>
          <div className="flex gap-3 items-center">
            <button
              className="p-2 bg-white text-slate-600 border border-slate-200 rounded hover:bg-slate-50 active:bg-slate-50 transition-colors"
              onClick={previousPage}
            >
              <ChevronLeft size={14} />
            </button>

            <button
              className="p-2 bg-white text-slate-600 border border-slate-200 rounded hover:bg-slate-50 active:bg-slate-50 transition-colors"
              onClick={nextPage}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {openModal && (
        <>
          <div
            className="fixed inset-0 bg-black/25 z-901"
            onClick={closeModal}
          ></div>
          <form
            className="fixed left-1/2 top-1/2 -translate-1/2 z-902 bg-white p-12 w-full max-w-md mx-auto grid grid-cols-2 gap-8"
            onSubmit={(e) => handleSubmit(e)}
          >
            <button
              type="button"
              className="absolute top-6 right-6 p-2 rounded text-slate-600 hover:bg-slate-100 active:bg-slate-100 transition-colors"
              onClick={closeModal}
            >
              <X />
            </button>
            <div className="w-max col-span-2">
              <h2 className="text-xl font-medium text-blue-500">
                {action === "add" ? "TAMBAH" : "EDIT"}
              </h2>
            </div>
            <div className="relative col-span-2">
              <label htmlFor="name" className="">
                Nama
              </label>
              <input
                id="name"
                name="name"
                className="peer w-full py-3 mt-2 focus-within:outline-none focus-within:bg-slate-100/70 duration-300"
                placeholder="Masukkan nama"
                defaultValue={formData.name}
                onBlur={(e) => updateFormData({ name: e.target.value })}
              />
              <hr className="absolute w-full bottom-0 border-slate-300" />
              <hr className="absolute bottom-0 w-0 border-blue-500 peer-focus-within:w-full duration-300" />
              <span className="absolute top-full left-0 translate-y-1 text-slate-600 text-sm">
                {errors.name}
              </span>
            </div>
            <div className="relative col-span-2">
              <label htmlFor="email" className="">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                className="peer w-full py-3 mt-2 focus-within:outline-none focus-within:bg-slate-100/70 duration-300"
                placeholder="Masukkan email"
                defaultValue={formData.email}
                onBlur={(e) => updateFormData({ email: e.target.value })}
              />
              <hr className="absolute w-full bottom-0 border-slate-300" />
              <hr className="absolute bottom-0 w-0 border-blue-500 peer-focus-within:w-full duration-300" />

              <span className="absolute top-full left-0 translate-y-1 text-slate-600 text-sm">
                {errors.email}
              </span>
            </div>
            {action === "add" && (
              <div className="relative col-span-2">
                <label htmlFor="password" className="">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="peer w-full py-3 mt-2 focus-within:outline-none focus-within:bg-slate-100/70 duration-300"
                    placeholder="Masukkan password"
                    onBlur={(e) => updateFormData({ password: e.target.value })}
                    onKeyDown={(e) => {
                      e.key == "Enter" &&
                        updateFormData({ password: e.currentTarget.value });
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-1/2 -translate-y-1/4 text-slate-600"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeClosed size={16} /> : <Eye size={16} />}
                  </button>
                  <hr className="absolute w-full bottom-0 border-slate-300" />
                  <hr className="absolute bottom-0 w-0 border-blue-500 peer-focus-within:w-full duration-300" />
                </div>

                <span className="absolute top-full left-0 translate-y-1 text-slate-600 text-sm">
                  {errors.password}
                </span>
              </div>
            )}
            <button
              type="submit"
              className="mt-6 col-span-2 w-full px-5 py-2.5 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-600"
            >
              Simpan
            </button>
          </form>
        </>
      )}
    </div>
  );
}
