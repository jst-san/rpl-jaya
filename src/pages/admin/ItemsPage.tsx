import { Api } from "../../lib/api";
import { toRupiah } from "../../lib/numberFormatter";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import SkelTable from "../../components/SkelTable";
import type { Barang, BarangFillable } from "../../types/models";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit,
  Plus,
  RefreshCw,
  Trash,
  X,
} from "lucide-react";
import { getAccessToken } from "../../lib/cookies";
import type { PaginationMetadata } from "../../types/data";

export default function ItemsPage() {
  const [items, setItems] = useState<Barang[]>([]);
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
  const [formData, setFormData] = useState<BarangFillable>({
    nama_barang: "",
    kode_barang: "",
    harga: 0,
    stok: 0,
  });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const api = new Api();
  const cols = ["ID", "Nama", "Kode", "Harga", "Stok", "Dibuat", "Diperbarui"];

  useEffect(() => {
    (async () => {
      await getItems();
    })();
  }, []);

  const getItems = async (params: PaginationMetadata = metadata) => {
    setIsLoading(true);

    const token = await getAccessToken();

    const res = await api.get(
      `/api/barang?page=${params.currentPage}&per_page=${params.perPage}`,
      [],
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const payload = (await res.json()) as Record<string, number> & {
      data: Barang[];
    };

    if (!res.ok) {
      setIsLoading(false);
      return setErrors({
        init: {
          code: res.statusText,
          message: "Terjadi kesalahan saat memuat data",
        },
      });
    }

    setItems(payload.data);
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

  const updateFormData = (data: Partial<BarangFillable>) => {
    setFormData({ ...formData, ...data });
  };

  const updateMetadata = (data: Partial<PaginationMetadata>) => {
    setMetadata({ ...metadata, ...data });
  };

  const previousPage = () => {
    if (metadata.currentPage <= 1) return;

    getItems({ ...metadata, currentPage: metadata.currentPage - 1 });
  };

  const nextPage = () => {
    if (metadata.currentPage >= metadata.lastPage) return;

    getItems({ ...metadata, currentPage: metadata.currentPage + 1 });
  };

  const closeModal = () => {
    setFormData({ nama_barang: "", kode_barang: "", harga: 0, stok: 0 });
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
        ? await api.post("/api/barang", {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              ...formData,
            }),
          })
        : await api.put(`/api/barang/${selectedId}`, {
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
      ? setItems([...items, data])
      : setItems(
          [...items.filter((i) => i.id !== selectedId), data].sort(
            (a, b) => a.id - b.id,
          ),
        );

    setFormData({ nama_barang: "", kode_barang: "", harga: 0, stok: 0 });
    setSelectedId(null);
    setOpenModal(false);
  };

  const handleDelete = async (id: number) => {
    const token = await getAccessToken();

    const res = await api.delete(`/api/barang/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return;

    setItems(items.filter((i) => i.id !== id));
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
        <h2 className="text-sm text-blue-500">BARANG</h2>
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
                      getItems({ ...metadata, perPage: n, currentPage: 1 });
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
            onClick={async () => await getItems()}
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
        {isLoading && !items.length ? (
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
              {items.map((i) => (
                <tr
                  key={i.id}
                  tabIndex={0}
                  className="relative text-slate-800 bg-slate-50 odd:bg-slate-100 divide-x divide-slate-200 outline outline-transparent -outline-offset-1 focus-within:bg-white transition-colors group"
                >
                  <td className="p-2 text-center">{i.id}</td>
                  <td className="p-2">{i.nama_barang}</td>
                  <td className="p-2">{i.kode_barang}</td>
                  <td className="p-2 text-right">{toRupiah(i.harga)}</td>
                  <td className="p-2">{i.stok}</td>
                  <td className="p-2 text-right">
                    {dayjs(i.created_at).format("DD-MM-YYYY")}
                  </td>
                  <td className="p-2 text-right">
                    {dayjs(i.updated_at).format("DD-MM-YYYY")}
                  </td>
                  <td className="absolute bottom-full left-0 flex gap-1 p-1 border border-l-0 border-slate-200 bg-white opacity-0 translate-y-5 pointer-events-none group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto transition-all">
                    <button
                      className="p-2 flex gap-2 items-center text-xs rounded hover:bg-slate-100 active:bg-slate-100 transition-colors"
                      onClick={() => handleDelete(i.id)}
                    >
                      <Trash size={12} />
                      Hapus
                    </button>
                    <button
                      className="p-2 flex gap-2 items-center text-xs rounded hover:bg-slate-100 active:bg-slate-100 transition-colors"
                      onClick={() => {
                        setFormData({
                          nama_barang: i.nama_barang,
                          kode_barang: i.kode_barang,
                          harga: i.harga,
                          stok: i.stok,
                        });
                        setAction("edit");
                        setSelectedId(i.id);
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
              <label htmlFor="nama_barang" className="">
                Nama
              </label>
              <input
                id="nama_barang"
                name="nama_barang"
                className="peer w-full py-3 mt-2 focus-within:outline-none focus-within:bg-slate-100/70 duration-300"
                placeholder="Nama barang"
                defaultValue={formData.nama_barang}
                onBlur={(e) => updateFormData({ nama_barang: e.target.value })}
              />
              <hr className="absolute w-full bottom-0 border-slate-300" />
              <hr className="absolute bottom-0 w-0 border-blue-500 peer-focus-within:w-full duration-300" />
              <span className="absolute top-full left-0 translate-y-1 text-slate-600 text-sm">
                {errors.nama_barang}
              </span>
            </div>
            <div className="relative col-span-2">
              <label htmlFor="kode_barang" className="">
                Kode
              </label>
              <input
                id="kode_barang"
                name="kode_barang"
                className="peer w-full py-3 mt-2 focus-within:outline-none focus-within:bg-slate-100/70 duration-300"
                placeholder="BRGXXX"
                defaultValue={formData.kode_barang}
                onBlur={(e) => updateFormData({ kode_barang: e.target.value })}
              />
              <hr className="absolute w-full bottom-0 border-slate-300" />
              <hr className="absolute bottom-0 w-0 border-blue-500 peer-focus-within:w-full duration-300" />

              <span className="absolute top-full left-0 translate-y-1 text-slate-600 text-sm">
                {errors.kode_barang}
              </span>
            </div>
            <div className="relative">
              <label htmlFor="harga" className="">
                Harga
              </label>
              <input
                id="harga"
                name="harga"
                type="number"
                className="peer w-full py-3 mt-2 focus-within:outline-none focus-within:bg-slate-100/70 duration-300"
                placeholder="Harga barang"
                defaultValue={formData.harga}
                onBlur={(e) =>
                  updateFormData({ harga: Number(e.target.value) })
                }
              />
              <hr className="absolute w-full bottom-0 border-slate-300" />
              <hr className="absolute bottom-0 w-0 border-blue-500 peer-focus-within:w-full duration-300" />

              <span className="absolute top-full left-0 translate-y-1 text-slate-600 text-sm">
                {errors.harga}
              </span>
            </div>
            <div className="relative">
              <label htmlFor="stok" className="">
                Stok
              </label>
              <input
                id="stok"
                name="stok"
                type="number"
                className="peer w-full py-3 mt-2 focus-within:outline-none focus-within:bg-slate-100/70 duration-300"
                placeholder="Stok barang"
                defaultValue={formData.stok}
                onBlur={(e) => updateFormData({ stok: Number(e.target.value) })}
              />
              <hr className="absolute w-full bottom-0 border-slate-300" />
              <hr className="absolute bottom-0 w-0 border-blue-500 peer-focus-within:w-full duration-300" />

              <span className="absolute top-full left-0 translate-y-1 text-slate-600 text-sm">
                {errors.stok}
              </span>
            </div>
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
