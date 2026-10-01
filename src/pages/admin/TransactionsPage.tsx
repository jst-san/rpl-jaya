import { Api } from "../../lib/api";
import { toRupiah } from "../../lib/numberFormatter";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import SkelTable from "../../components/SkelTable";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState<{ code: string; message: string } | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const api = new Api();

  useEffect(() => {
    (async () => {
      const res = await api.get("/api/transaksi");

      const decoded = await res.json();

      if (!res.ok) {
        return setError({ code: decoded.code, message: decoded.message });
      }

      setTransactions(decoded);
        setIsLoading(false);
    })();
  }, []);

  const tCols = ["ID", "Nomor Transaksi", "Tanggal Transaksi", "Total","Dibuat", "Diperbarui"];

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
            {transactions.map((t: any) => (
              <tr className="text-slate-800 bg-slate-50 odd:bg-slate-100 divide-x divide-slate-200">
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
