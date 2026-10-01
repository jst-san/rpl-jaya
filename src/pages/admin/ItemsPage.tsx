import { Api } from "../../lib/api";
import { toRupiah } from "../../lib/numberFormatter";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import SkelTable from "../../components/SkelTable";

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState<{ code: string; message: string } | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const api = new Api();

  useEffect(() => {
    (async () => {
      const res = await api.get("/api/barang");

      const decoded = await res.json();

      if (!res.ok) {
        return setError({ code: decoded.code, message: decoded.message });
      }

      setItems(decoded);
        setIsLoading(false);
    })();
  }, []);

  const tCols = ["ID", "Kode", "Nama", "Harga", "Stok", "Dibuat", "Diperbarui"];

  return error ? (
    <div>a{error.message}</div>
  ) : (
    <div className="overflow-auto w-full">
      {isLoading ? (
        <SkelTable />
      ) : (
        <table className="table-auto w-max min-w-full border border-slate-200">
          <thead>
            <tr className="bg-white border-b border-slate-200 divide-x divide-slate-200">
              {tCols.map((c) => (
                <th className="font-medium p-2">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {items.map((i: any) => (
              <tr className="text-slate-800 bg-slate-50 odd:bg-slate-100 divide-x divide-slate-200">
                <td className="p-2 text-center">{i.id}</td>
                <td className="p-2">{i.kode_barang}</td>
                <td className="p-2">{i.nama_barang}</td>
                <td className="p-2 text-right">{toRupiah(i.harga)}</td>
                <td className="p-2">{i.stok}</td>
                <td className="p-2 text-right">
                  {dayjs(i.created_at).format("DD-MM-YYYY")}
                </td>
                <td className="p-2 text-right">
                  {dayjs(i.updated_at).format("DD-MM-YYYY")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
