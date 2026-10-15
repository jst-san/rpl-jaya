import { useEffect, useState } from "react";
import { Api } from "../../lib/api";
import { getAccessToken } from "../../lib/cookies";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function LowStocks() {
  const [data, setData] = useState<
    { nama_barang: string; kode_barang: string; stok: number }[]
  >([]);
  const api = new Api();

  useEffect(() => {
    (async () => {
      const token = await getAccessToken();

      const res = await api.get("/api/dashboard/low_stocks", [], {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const { data } = await res.json();

      setData(data);
    })();
  }, []);

  return (
    <div className="row-span-2 relative w-full p-6 bg-white border border-slate-200 rounded-md flex flex-col">
      <div className="text-xs font-medium text-slate-500 mt-3 flex items-end justify-between">
        <span className="">STOK MENIPIS</span>
        <Link
          className="p-0.5 border rounded-full hover:bg-blue-500 hover:text-white duration-300"
          to="/admin/items"
        >
          <ArrowUpRight size={12} />
        </Link>
      </div>
      <div className="overflow-auto flex flex-col gap-1 mt-2">
        {data.length ? (
          data?.map((i) => (
            <div className="p-2 rounded border border-slate-200">
              <div className="text-[0.6rem] text-slate-500">
                {i.kode_barang}
              </div>
              <div className="text-xs">{i.nama_barang}</div>

              <div className="text-[0.7rem] leading-4 text-slate-600">
                stok: {i.stok}
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-slate-300 text-center mt-3">
            Tidak ada
          </div>
        )}
      </div>
    </div>
  );
}
