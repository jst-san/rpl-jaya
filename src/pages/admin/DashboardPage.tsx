import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  CreditCard,
  DollarSign,
  Info,
  RefreshCw,
} from "lucide-react";
import { Api } from "../../lib/api";
import { toRupiah } from "../../lib/numberFormatter";
import { useEffect, useState } from "react";
import { getAccessToken } from "../../lib/cookies";
import { Link } from "react-router-dom";
import type { Transaksi } from "../../types/models";
import TransactionsChart from "../../components/dashboard/TranscationsChart";
import BestSellerChart from "../../components/dashboard/BestSellerChart";
import Stats from "../../components/dashboard/Stats";
import LowStocks from "../../components/dashboard/LowStocks";

export default function DashboardPage() {
  const [errors, setErrors] = useState<Record<string, any>>({});

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
    <div className="w-full grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-38.5 gap-6">
      <Stats />

      <LowStocks />

        <TransactionsChart />

        <BestSellerChart />
    </div>
  );
}
