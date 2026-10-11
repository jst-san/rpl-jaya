import { ArrowRight, Info, RefreshCw } from "lucide-react";
import { Api } from "../../lib/api";
import { toRupiah } from "../../lib/numberFormatter";
import { useEffect, useState } from "react";
import { getAccessToken } from "../../lib/cookies";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [barangsCount, setBarangsCount] = useState<number>(0);
  const [transaksisCount, setTransaksisCount] = useState<number>(0);
  const [transaksisTotal, setTransaksisTotal] = useState<number>(0);
  const [todayTransaksis, setTodayTransaksis] = useState([]);
  const api = new Api();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const token = await getAccessToken();

      const res = await api.get("/api/dashboard", [], {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const { data } = await res.json();

      if (!res.ok) {
        setIsLoading(false);
        return setErrors({
          init: {
            code: res.statusText,
            message: "Terjadi kesalahan saat memuat data",
          },
        });
      }

      setBarangsCount(data.barangsCount);
      setTransaksisCount(data.transaksisCount);
      setTransaksisTotal(data.transaksisTotal);
      setTodayTransaksis(data.todayTransaksis);
      setIsLoading(false);
    })();
  }, []);
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
  ) : isLoading ? (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="relative w-full h-48 px-6 border border-slate-200 bg-slate-50 animate-pulse"></div>
      <div className="relative w-full h-48 px-6 border border-slate-200 bg-slate-50 animate-pulse"></div>
      <div className="relative w-full h-48 px-6 border border-slate-200 bg-slate-50 animate-pulse"></div>
   <div className="relative w-full h-64 p-6 border border-slate-200 bg-slate-50 animate-pulse"></div>
    </div>
  ) : (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="relative w-full h-48 px-6 bg-white border border-slate-200 flex flex-col overflow-hidden">
        <div className="flex-1 grid place-content-center relative">
          <p className="text-center text-2xl font-bold">{barangsCount}</p>
          <Link
            to="/admin/items"
            className="absolute bottom-2 w-full flex items-center justify-center gap-2 text-xs text-slate-400"
          >
            Lihat Detail <Info className="inline" size={12} />
          </Link>
        </div>
        <div className="p-6 text-center text-slate-600 py-3 border-t border-blue-500">
          Jenis Barang
        </div>
        <hr className="absolute top-6 left-6 w-8 border-t-blue-500" />
        <hr className="absolute top-8 left-6 w-6 border-t-blue-500" />
      </div>

      <div className="relative w-full h-48 px-6 bg-white border border-slate-200 flex flex-col overflow-hidden">
        <div className="flex-1 grid place-content-center relative">
          <p className="text-center text-2xl font-bold">{transaksisCount}</p>
          <Link
            to="/admin/transactions"
            className="absolute bottom-2 w-full flex items-center justify-center gap-2 text-xs text-slate-400"
          >
            Lihat Detail <Info className="inline" size={12} />
          </Link>
        </div>
        <div className="p-6 text-center text-slate-600 py-3 border-t border-blue-500">
          Jumlah Transkasi
        </div>
        <hr className="absolute top-6 left-6 w-8 border-t-blue-500" />
        <hr className="absolute top-8 left-6 w-6 border-t-blue-500" />
      </div>

      <div className="relative w-full h-48 px-6 bg-white border border-slate-200 flex flex-col overflow-hidden">
        <div className="flex-1 grid place-content-center relative">
          <p className="text-center text-2xl font-bold">
            {toRupiah(transaksisTotal)}
          </p>
          <Link
            to="/admin/transactions"
            className="absolute bottom-2 w-full flex items-center justify-center gap-2 text-xs text-slate-400"
          >
            Lihat Detail <Info className="inline" size={12} />
          </Link>
        </div>
        <div className="p-6 text-center text-slate-600 py-3 border-t border-blue-500">
          Total Nominal Transaksi
        </div>
        <hr className="absolute top-6 left-6 w-8 border-t-blue-500" />
        <hr className="absolute top-8 left-6 w-6 border-t-blue-500" />
      </div>

      <div className="relative w-full max-h-64 p-6 bg-white border border-slate-200 flex flex-col overflow-auto">
        <p className="text-slate-600">Transaksi hari ini:</p>

        <ul className="mt-4">
          {todayTransaksis.length ? (
            todayTransaksis.map((t: any, idx) => (
              <li className="text-slate-600 py-2 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <hr className="w-2 border-blue-500" /> {t.nomor_transaksi}
                  </div>
                  <div className="text-blue-500">{toRupiah(t.total)}</div>
                </div>
                <a className="h-full flex items-center pl-1 border-l border-blue-500 group">
                  <ArrowRight
                    className="text-blue-500 group-hover:translate-x-1 group-active:translate-x-1 duration-300"
                    size={12}
                  />
                </a>
              </li>
            ))
          ) : (
            <span className="text-slate-400">Belum ada transaksi</span>
          )}
        </ul>
      </div>
    </div>
  );
}
