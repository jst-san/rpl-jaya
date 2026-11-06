import { Api } from "../../lib/api";
import { toRupiah } from "../../lib/numberFormatter";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import SkelTable from "../../components/SkelTable";
import type { Barang, Transaksi, TransaksiFillable } from "../../types/models";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Info,
  Minus,
  Plus,
  RefreshCw,
  Trash,
  View,
  X,
} from "lucide-react";
import { getAccessToken } from "../../lib/cookies";
import { Link } from "react-router-dom";
import type { PaginationMetadata } from "../../types/data";

export default function EmployeePage() {
  const [transactions, setTransactions] = useState<Transaksi[]>([]);
  const [items, setItems] = useState<
    (Barang & { qty: number; subtotal: number })[]
  >([]);
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

  const getTransactions = async (params: PaginationMetadata = metadata) => {
    setIsLoading(true);

    const token = await getAccessToken();

    const res = await api.get(
      `/api/transaksi?page=${params.currentPage}&per_page=${params.perPage}`,
      [],
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

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

    setTransactions(payload.data);
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

  const getItems = async () => {
    const token = await getAccessToken();

    const res = await api.get("/api/barang", [], {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const { data } = await res.json();

    if (!res.ok) {
      return setErrors({
        items: {
          code: res.statusText,
          message: "Terjadi kesalahan saat memuat data",
        },
      });
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

  const updateMetadata = (data: Partial<PaginationMetadata>) => {
    setMetadata({ ...metadata, ...data });
  };

  const previousPage = () => {
    if (metadata.currentPage <= 1) return;

    getTransactions({ ...metadata, currentPage: metadata.currentPage - 1 });
  };

  const nextPage = () => {
    if (metadata.currentPage >= metadata.lastPage) return;

    getTransactions({ ...metadata, currentPage: metadata.currentPage + 1 });
  };

  const handleDelete = async (id: number) => {
    const token = await getAccessToken();

    const res = await api.delete(`/api/transaksi/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

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
        <h2 className="text-sm text-blue-500">TRANSAKSI</h2>
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
                      getTransactions({
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
            onClick={async () => await getTransactions()}
          >
            <RefreshCw className={`${isLoading && "animate-spin"}`} size={14} />
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
                    <Link
                      className="p-2 flex gap-2 items-center text-xs rounded hover:bg-slate-100 active:bg-slate-100 transition-colors"
                      to={`/admin/transactions/${t.id}`}
                    >
                      <Eye size={12} />
                      Detail
                    </Link>
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
    </div>
  );
}
