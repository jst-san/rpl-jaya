import { Api } from "../../lib/api";
import { toRupiah } from "../../lib/numberFormatter";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import SkelTable from "../../components/SkelTable";
import type { Barang, Transaksi, TransaksiFillable } from "../../types/models";
import { Edit, Eye, Minus, Plus, RefreshCw, Trash, View, X } from "lucide-react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaksi[]>([]);
  const [items, setItems] = useState<
    (Barang & { qty: number; subtotal: number })[]
  >([]);
  const [selectedItems, setSelectedItems] = useState<
    (Barang & { qty: number })[]
  >([]);
  const [error, setError] = useState<{ code: string; message: string } | null>(
    null,
  );
  const [formError, setFormError] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [action, setAction] = useState<"add" | "edit">("add");
  const [formData, setFormData] = useState<TransaksiFillable>({
    nomor_transaksi: "",
    tanggal: "",
    total: 0,
  });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [trxStats, setTrxStats] = useState({ total: 0, itemsCount: 0 });

  const api = new Api();

  const cols = [
    "ID",
    "Nomor Transaksi",
    "Tanggal Transaksi",
    "Total",
    "Dibuat",
    "Diperbarui",
  ];

  useEffect(() => {
    (async () => {
      await getTransactions();
    })();
  }, []);

  const getTransactions = async () => {
    setIsLoading(true);
    const res = await api.get("/api/transaksi");

    const { data, errors } = await res.json();

    if (!res.ok) {
      return setError({ code: errors.code, message: errors.message });
    }

    setTransactions(data);
    setIsLoading(false);
  };

  const getItems = async () => {
    const res = await api.get("/api/barang");

    const { data, errors } = await res.json();

    if (!res.ok) {
      return setError({ code: errors.code, message: errors.message });
    }

    setItems(
      (data as Barang[]).map((b) => ({
        ...b,
        harga: Number(b.harga),
        qty: 0,
        subtotal: 0,
      })),
    );
  };

  const updateFormData = (data: Partial<TransaksiFillable>) => {
    setFormData({ ...formData, ...data });
  };

  const closeModal = () => {
    setOpenModal(false);
    if (action === "add") {
      setTrxStats({ total: 0, itemsCount: 0 });
      setItems(items.map((i) => ({ ...i, qty: 0, subtotal: 0 })));
    } else {
      setFormData({
        nomor_transaksi: "",
        tanggal: "",
        total: 0,
      });
    }
    setSelectedId(null);
    setFormError({});
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError({});
    const res =
      action === "add"
        ? await api.post("/api/transaksi", {
            body: JSON.stringify({
              items,
            }),
          })
        : await api.put(`/api/transaksi/${selectedId}`, {
            body: JSON.stringify({
              ...formData,
            }),
          });

    const { data, errors } = await res.json();
    if (!res.ok) {
      if (errors) setFormError(errors);
      return;
    }

    if (action === "add") {
      setTransactions([...transactions, data]);
      setTrxStats({ total: 0, itemsCount: 0 });
      setItems(items.map((i) => ({ ...i, qty: 0, subtotal: 0 })));
    } else {
      setTransactions(
        [...transactions.filter((t) => t.id !== selectedId), data].sort(
          (a, b) => a.id - b.id,
        ),
      );
      setFormData({
        nomor_transaksi: "",
        tanggal: "",
        total: 0,
      });
    }

    setSelectedId(null);
    setOpenModal(false);
  };

  const handleDelete = async (id: number) => {
    const res = await api.delete(`/api/transaksi/${id}`);

    if (!res.ok) return;

    setTransactions(transactions.filter((i) => i.id !== id));
  };

  function increase(id: number) {
    const target = items.find((i) => i.id === id);

    if (!target) return;

    if (target.qty === target.stok) return;

    target.qty++;
    target.subtotal += target.harga;

    setTrxStats({
      total: trxStats.total + target.harga,
      itemsCount: trxStats.itemsCount + 1,
    });
    setItems(items.map((i) => (i.id === id ? target : i)));
  }

  function decrease(id: number) {
    const target = items.find((s) => s.id === id);

    if (!target) return;

    if (target.qty === 0) return;

    target.qty--;
    target.subtotal -= target.harga;

    setTrxStats({
      total: trxStats.total - target.harga,
      itemsCount: trxStats.itemsCount - 1,
    });
    setItems(items.map((i) => (i.id === id ? target : i)));
  }

  return error ? (
    <div></div>
  ) : (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm text-blue-500">TRANSAKSI</h2>
        <div className="flex gap-3">
          <button
            className="p-2 bg-white text-slate-600 border border-slate-200 rounded hover:bg-slate-50 active:bg-slate-50 transition-colors"
            onClick={async () => await getTransactions()}
          >
            <RefreshCw className={`${isLoading && "animate-spin"}`} size={14} />
          </button>
          <button
            className="p-2 bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-600 transition-colors rounded"
            onClick={() => {
              setAction("add");
              setOpenModal(true);
              getItems();
            }}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
      <div className="overflow-auto w-full">
        {isLoading && !transactions.length ? (
          <SkelTable />
        ) : (
          <table className="table-auto w-max min-w-full border border-slate-200">
            <thead>
              <tr className="bg-white border-b border-slate-200 divide-x divide-slate-200">
                {cols.map((c) => (
                  <th className="font-medium p-2">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {transactions.map((t: any) => (
                <tr
                  tabIndex={0}
                  className="relative text-slate-800 bg-slate-50 odd:bg-slate-100 divide-x divide-slate-200 outline outline-transparent -outline-offset-1 focus-within:bg-white transition-colors group"
                >
                  <td className="p-2 text-center">{t.id}</td>
                  <td className="p-2">{t.nomor_transaksi}</td>
                  <td className="p-2 text-right">{t.tanggal}</td>
                  <td className="p-2 text-right">{toRupiah(t.total)}</td>
                  <td className="p-2 text-right">
                    {dayjs(t.created_at).format("DD-MM-YYYY")}
                  </td>
                  <td className="p-2 text-right">
                    {dayjs(t.updated_at).format("DD-MM-YYYY")}
                  </td>
                  <td className="absolute bottom-full left-0 flex gap-1 p-1 border border-l-0 border-slate-200 bg-white opacity-0 translate-y-5 pointer-events-none group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto transition-all">
                    <button
                      className="p-2 flex gap-2 items-center text-xs rounded hover:bg-slate-100 active:bg-slate-100 transition-colors"
                      onClick={() => handleDelete(t.id)}
                    >
                      <Trash size={12} />
                      Hapus
                    </button>
                    <button
                      className="p-2 flex gap-2 items-center text-xs rounded hover:bg-slate-100 active:bg-slate-100 transition-colors"
                      onClick={() => {
                        setFormData({
                          nomor_transaksi: t.nomor_transaksi,
                          tanggal: t.tanggal,
                          total: t.total,
                        });
                        setAction("edit");
                        setSelectedId(t.id);
                        setOpenModal(true);
                      }}
                    >
                      <Edit size={12} />
                      Edit
                    </button>
                    <a
                      className="p-2 flex gap-2 items-center text-xs rounded hover:bg-slate-100 active:bg-slate-100 transition-colors"
                      href={`/admin/transactions/${t.id}`}                      
                    >
                      <Eye size={12} />
                      Detail
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {openModal && action === "edit" && (
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
              <h2 className="text-xl font-medium text-blue-500">EDIT</h2>
            </div>
            <div className="relative col-span-2">
              <label htmlFor="nomor_transaksi" className="">
                Nomor Transaksi
              </label>
              <input
                id="nomor_transaksi"
                name="nomor_transaksi"
                className="peer w-full py-3 mt-2 focus-within:outline-none focus-within:bg-slate-100/70 duration-300"
                placeholder="TRX-XXX"
                defaultValue={formData.nomor_transaksi}
                onBlur={(e) =>
                  updateFormData({ nomor_transaksi: e.target.value })
                }
              />
              <hr className="absolute w-full bottom-0 border-slate-300" />
              <hr className="absolute bottom-0 w-0 border-blue-500 peer-focus-within:w-full duration-300" />
              <span className="absolute top-full left-0 translate-y-1 text-slate-600 text-sm">
                {formError.nomor_transaksi}
              </span>
            </div>
            <div className="relative col-span-2">
              <label htmlFor="tanggal" className="">
                Tanggal
              </label>
              <input
                id="tanggal"
                name="tanggal"
                className="peer w-full py-3 mt-2 focus-within:outline-none focus-within:bg-slate-100/70 duration-300"
                placeholder="YYYY-MM-DD"
                defaultValue={formData.tanggal}
                onBlur={(e) => updateFormData({ tanggal: e.target.value })}
              />
              <hr className="absolute w-full bottom-0 border-slate-300" />
              <hr className="absolute bottom-0 w-0 border-blue-500 peer-focus-within:w-full duration-300" />

              <span className="absolute top-full left-0 translate-y-1 text-slate-600 text-sm">
                {formError.tanggal}
              </span>
            </div>
            <div className="relative col-span-2">
              <label htmlFor="total" className="">
                Total
              </label>
              <input
                id="total"
                name="total"
                type="number"
                className="peer w-full py-3 mt-2 focus-within:outline-none focus-within:bg-slate-100/70 duration-300"
                placeholder="Total nominal"
                defaultValue={formData.total}
                onBlur={(e) =>
                  updateFormData({ total: Number(e.target.value) })
                }
              />
              <hr className="absolute w-full bottom-0 border-slate-300" />
              <hr className="absolute bottom-0 w-0 border-blue-500 peer-focus-within:w-full duration-300" />

              <span className="absolute top-full left-0 translate-y-1 text-slate-600 text-sm">
                {formError.total}
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

      {openModal && action === "add" && (
        <>
          <div
            className="fixed inset-0 bg-black/25 z-901"
            onClick={closeModal}
          ></div>
          <form
            className="fixed top-0 z-902 left-1/2 -translate-x-1/2 bg-white p-12 w-md h-full flex flex-col gap-8"
            onSubmit={handleSubmit}
          >
            <button
              type="button"
              className="absolute top-6 right-6 p-2 rounded text-slate-600 hover:bg-slate-100 active:bg-slate-100 transition-colors"
              onClick={closeModal}
            >
              <X />
            </button>
            <div className="w-max">
              <h2 className="text-xl font-medium text-blue-500">TAMBAH</h2>
            </div>
            <div className="overflow-auto">
              <div className="flex flex-col min-h-full divide-y divide-slate-200">
                {[...items, ...items, ...items].map((i) => (
                  <div className="flex flex-col py-3">
                    <span className="text-xs inline-block text-slate-400">
                      {i.kode_barang}
                    </span>
                    <h3 className="text-slate-800 text-lg">{i.nama_barang}</h3>
                    <span className="text-blue-500">{toRupiah(i.harga)}</span>
                    <div className="flex justify-between items-center">
                      <div className="text-slate-600 text-sm">
                        Stok: {i.stok}
                      </div>

                      <div className="grid grid-cols-[max-content_max-content_max-content]">
                        <button
                          type="button"
                          className="p-1 bg-white border border-slate-200 hover:bg-slate-50 active:bg-slate-50 transition-colors"
                          onClick={() => decrease(i.id)}
                        >
                          <Minus size={16} />
                        </button>
                        <div className="text-sm h-full aspect-square border-y border-slate-200 bg-white grid place-content-center">
                          {i.qty}
                        </div>
                        <button
                          type="button"
                          className="p-1 bg-white border border-slate-200 hover:bg-slate-50 active:bg-slate-50 transition-colors"
                          onClick={() => increase(i.id)}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-slate-800 mt-2 flex justify-between">
                      <div>Subtotal: </div>
                      <div>{toRupiah(i.subtotal)}</div>
                    </div>
                  </div>
                ))}
              </div>
              {trxStats.itemsCount && (
                <div className="sticky bottom-0 left-0 bg-white border-t border-slate-400 pt-3">
                  <div className="">
                    <div className="font-semibold">Detail</div>
                    <div className="max-h-26 overflow-auto">
                      <ul className="py-1 flex flex-col gap-1">
                        {items
                          .filter((i) => i.qty)
                          .map((i) => (
                            <li className="text-sm flex justify-between">
                              <div>
                                {i.nama_barang}{" "}
                                <span className="text-xs text-blue-500">
                                  x{i.qty}
                                </span>
                              </div>
                              <div className="font-sans">
                                {toRupiah(i.subtotal)}
                              </div>
                            </li>
                          ))}
                      </ul>
                    </div>
                    <hr className="border-slate-400" />
                    <div className="flex justify-between font-semibold pt-1">
                      <div className="">Total</div>
                      <div className="text-right">
                        {toRupiah(trxStats.total)}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-3 justify-self-end w-full py-2.5 px-5 rounded text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-600 transition-colors"
                  >
                    Selesai
                  </button>
                </div>
              )}
            </div>
          </form>
        </>
      )}
    </div>
  );
}
