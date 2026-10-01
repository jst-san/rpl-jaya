import { ArrowRight, Info } from "lucide-react";
import { Api } from "../../lib/api";
import { toRupiah } from "../../lib/numberFormatter";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const api = new Api();
  const [barangsCount, setBarangsCount] = useState<number>(0);
  const [transaksisCount, setTransaksisCount] = useState<number>(0);
  const [transaksisTotal, setTransaksisTotal] = useState<number>(0);
  const [todayTransaksis, setTodayTransaksis] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await api.get("/api/dashboard").then((r) => r.json());

      if (res.errors || !res.success) {
        alert("Terjadi kesalahan");
      }

      const { data } = res;

      setBarangsCount(data.barangsCount);
      setTransaksisCount(data.transaksisCount);
      setTransaksisTotal(data.transaksisTotal);
      setTodayTransaksis(data.todayTransaksis);
    })();
  }, []);
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="relative w-full h-48 px-6 bg-white border border-slate-200 flex flex-col overflow-hidden">
        <div className="flex-1 grid place-content-center relative">
          <p className="text-center text-2xl font-bold">{barangsCount}</p>
          <a className="absolute bottom-2 w-full flex items-center justify-center gap-2 text-xs text-slate-400">
            Lihat Detail <Info className="inline" size={12} />
          </a>
        </div>
        <div className="p-6 text-center text-slate-600 py-3 border-t border-blue-500">
          Jenis Baramg
        </div>
        <hr className="absolute top-6 left-6 w-8 border-t-blue-500" />
        <hr className="absolute top-8 left-6 w-6 border-t-blue-500" />
      </div>

      <div className="relative w-full h-48 px-6 bg-white border border-slate-200 flex flex-col overflow-hidden">
        <div className="flex-1 grid place-content-center relative">
          <p className="text-center text-2xl font-bold">{transaksisCount}</p>
          <a className="absolute bottom-2 w-full flex items-center justify-center gap-2 text-xs text-slate-400">
            Lihat Detail <Info className="inline" size={12} />
          </a>
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
          <a className="absolute bottom-2 w-full flex items-center justify-center gap-2 text-xs text-slate-400">
            Lihat Detail <Info className="inline" size={12} />
          </a>
        </div>
        <div className="p-6 text-center text-slate-600 py-3 border-t border-blue-500">
          Total Nominal Transaksi
        </div>
        <hr className="absolute top-6 left-6 w-8 border-t-blue-500" />
        <hr className="absolute top-8 left-6 w-6 border-t-blue-500" />
      </div>

      <div className="relative w-full p-6 bg-white border border-slate-200 flex flex-col overflow-hidden">
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
