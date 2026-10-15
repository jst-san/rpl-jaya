import { useEffect, useState } from "react";
import { Api } from "../../lib/api";
import { getAccessToken } from "../../lib/cookies";
import { ArrowUpRight, Boxes, CreditCard, DollarSign } from "lucide-react";
import { toRupiah } from "../../lib/numberFormatter";
import { Link } from "react-router-dom";

export default function Stats() {
  const [barangsCount, setBarangsCount] = useState<number>(0);
  const [transaksisCount, setTransaksisCount] = useState<number>(0);
  const [transaksisTotal, setTransaksisTotal] = useState<number>(0);
  const api = new Api();

  const stats = [
    {
      icon: Boxes,
      value: barangsCount,
      label: "JUMLAH BARANG",
      href: "/admin/items",
    },
    {
      icon: CreditCard,
      value: transaksisCount,
      label: "JUMLAH TRANSAKSI",
      href: "/admin/transactions",
    },
    {
      icon: DollarSign,
      value: toRupiah(transaksisTotal),
      longValue: true,
      label: "TOTAL PENJUALAN",
      href: "/admin/transactions",
    },
  ];

  useEffect(() => {
    (async () => {
      const token = await getAccessToken();

      const res = await api.get("/api/dashboard/stats", [], {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const { data } = await res.json();

      setBarangsCount(data.barangsCount);
      setTransaksisCount(data.transaksisCount);
      setTransaksisTotal(data.transaksisTotal);
    })();
  }, []);
  return (
    <>
      {stats.map((s) => (
        <div className="relative w-full p-6 bg-white border border-slate-200 rounded-md flex flex-col">
          <div className="p-2 bg-blue-50 rounded w-max">
            <s.icon className="text-blue-500" size={18} />
          </div>
          <p
            className={`${s.longValue ? "text-sm min-[400px]:text-base md:text-lg lg:text-xl xl:text-2xl" : "text-2xl"} h-8 font-bold mt-2`}
          >
            {s.value}
          </p>
          <div className="text-xs font-medium text-slate-500 mt-3 flex items-end justify-between">
            <span className="">{s.label}</span>
            <Link
              className="p-0.5 border rounded-full hover:bg-blue-500 hover:text-white duration-300"
              to={s.href}
            >
              <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      ))}
    </>
  );
}
