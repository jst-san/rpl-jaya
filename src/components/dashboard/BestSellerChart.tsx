import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { Api } from "../../lib/api";
import { useEffect, useState } from "react";
import { getAccessToken } from "../../lib/cookies";

export default function BestSellerChart({
  isAnimationActive = true,
}: {
  isAnimationActive?: boolean;
}) {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const api = new Api();

  useEffect(() => {
    (async () => {
      const token = await getAccessToken();

      const res = await api.get("/api/dashboard/best_seller", [], {
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
    <div className="row-span-2 w-full p-6 bg-white border border-slate-200 rounded-md flex flex-col">
      <div className="text-xs font-medium text-slate-500 flex items-end justify-between">
        <span className="">BARANG TERJUAL</span>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <PieChart
          style={{
            width: "100%",
            maxWidth: "500px",
            maxHeight: "80vh",
            aspectRatio: 1,
          }}
          responsive
        >
          <Pie
            data={data}
            innerRadius="80%"
            outerRadius="100%"
            cornerRadius="5%"
            paddingAngle={5}
            dataKey="value"
            isAnimationActive={isAnimationActive}
          >
            {data.map((d, idx) => (
              <Cell
                key={d.name}
                fill={idx + 1 === data.length ? "#909090" : "#2b7fff"}
                fillOpacity={1 - idx * 0.1}
              />
            ))}
          </Pie>
          <Tooltip itemStyle={{ fontSize: "0.75rem" }} />
        </PieChart>
      </div>
    </div>
  );
}
