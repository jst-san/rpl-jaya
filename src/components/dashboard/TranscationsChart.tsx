import { useEffect, useState } from "react";
import { Line, XAxis, YAxis, Tooltip, createHorizontalChart } from "recharts";
import { Api } from "../../lib/api";
import { getAccessToken } from "../../lib/cookies";

const Typed = createHorizontalChart()({
  XAxis,
  YAxis,
  Tooltip,
  Line,
});

export default function TransactionsChart() {
  const [data, setData] = useState<{ tanggal: string; jumlah: number }[]>([]);
  const api = new Api();

  useEffect(() => {
    (async () => {
      const token = await getAccessToken();

      const res = await api.get("/api/dashboard/activity", [], {
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
    <div className="col-span-2 row-span-2 p-6 bg-white border border-slate-200 rounded-md flex flex-col">
      <div className="text-slate-900 font-medium">Aktivitas Transaksi</div>
      <div className="text-xs text-slate-600 mb-6">
        Aktivitas transaksi hingga 7 hari
      </div>
      <Typed.LineChart
        style={{
          width: "100%",
          height: "100%",
          fontSize: "0.75rem",
          outline: "none",
        }}
        responsive
        data={data}
        dataKey="tanggal"
      >
        <Typed.XAxis dataKey="tanggal" hide={true} />
        <Typed.YAxis dataKey={"jumlah"} width="auto" />
        <Tooltip contentStyle={{ fontSize: "0.75rem" }} />
        <Typed.Line dataKey="jumlah" />
      </Typed.LineChart>
    </div>
  );
}
