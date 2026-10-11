import { Link, useParams } from "react-router-dom";
import { Api } from "../../lib/api";
import { useEffect, useState } from "react";
import { toRupiah } from "../../lib/numberFormatter";
import type { Barang, DetailTransaksi, Transaksi } from "../../types/models";
import { ArrowLeft, ChevronLeft, RefreshCw } from "lucide-react";
import { getAccessToken } from "../../lib/cookies";

interface TransaksiDetails extends Transaksi {
  detail_transaksis: (DetailTransaksi & { barang: Barang })[];
}

export default function TransactionDetailsPage() {
  const [transaction, setTransaction] = useState<TransaksiDetails>();
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  const api = new Api();

  useEffect(() => {
    (async () => {
      await getTransactionDetails(Number(id));
    })();
  }, []);

  const getTransactionDetails = async (id: number) => {
    setIsLoading(true);

    const token = await getAccessToken();

    const res = await api.get(`/api/transaksi/${id}`, [], {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const { data, errors } = await res.json();

    if (!res.ok) {
      setIsLoading(false);
      return setErrors({
        init: {
          code: res.statusText,
          message: "Terjadi kesalahan saat memuat data",
        },
      });
    }

    setTransaction(data);
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
      <Link
        className="flex gap-1 items-center text-sm text-slate-600 hover:text-blue-500 active:text-blue-500 transition-colors"
        to="/admin/transactions"
      >
        <ArrowLeft size={16} />
        Kembali
      </Link>
      {
        <div className="mt-8 grid grid-cols-1 xl:grid-cols-[20rem_auto]">
          <div className="p-8 space-y-4 border border-slate-200">
            <div className="border-b border-b-slate-200 text-blue-500 font-medium pb-8 text-center">
              DETAIL TRANSAKSI
            </div>
            <div>
              <p className="text-slate-700">Nomor Transaksi</p>
              <p className="h-6">{transaction?.nomor_transaksi}</p>
            </div>
            <div>
              <p className="text-slate-700">Tanggal Transaksi</p>
              <p className="h-6">{transaction?.tanggal}</p>
            </div>
            <div>
              <p className="text-slate-700">Jenis Barang</p>
              <p className="h-6">{transaction?.detail_transaksis?.length}</p>
            </div>
            <div className="bg-slate-100 p-4 rounded-md">
              <p className="text-slate-700">Total Pembayaran</p>

              <p className="text-2xl text-blue-500 h-8">
                {transaction && toRupiah(transaction?.total)}
              </p>
            </div>
          </div>

          <div className="p-8 space-y-4 border border-slate-200 border-t-0 xl:border-t xl:border-l-0">
            <div className="border-b border-b-slate-200 text-blue-500 font-medium pb-8 text-center">
              RINCIAN
            </div>
            <div className="overflow-x-auto">
              <table className="w-max min-w-full table-auto">
                <thead className="border border-slate-300">
                  <tr className="bg-slate-100 text-center">
                    <th className="py-4 px-2 font-bold">No</th>
                    <th className="py-4 px-2 font-bold">Barang</th>
                    <th className="py-4 px-2 font-bold">Kode Barang</th>
                    <th className="py-4 px-2 font-bold">Harga Satuan</th>
                    <th className="py-4 px-2 font-bold">Jumlah</th>
                    <th className="py-4 px-2 font-bold">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="border border-slate-300 border-t-0 divide-y divide-slate-300">
                  {transaction?.detail_transaksis.map(
                    (dt: any, idx: number) => (
                      <tr className="">
                        <td className="py-4 px-2 text-center">{idx + 1}</td>
                        <td className="py-4 px-2">{dt.barang.nama_barang}</td>
                        <td>{dt.barang.kode_barang}</td>
                        <td className="py-4 px-2 text-right">
                          {toRupiah(dt.barang.harga)}
                        </td>
                        <td className="py-4 px-2 text-center">{dt.jumlah}</td>
                        <td className="py-4 px-2 text-right">
                          {toRupiah(dt.harga)}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
                <tfoot className="border border-t-0 border-slate-300">
                  <tr>
                    <td className="py-4 px-2"></td>
                    <td className="py-4 px-2 font-bold text-blue-500">Total</td>
                    <td className="py-4 px-2"></td>
                    <td className="py-4 px-2"></td>
                    <td className="py-4 px-2"></td>

                    <td className="py-4 px-2 text-right font-medium text-blue-500">
                      {transaction && toRupiah(transaction?.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      }
    </div>
  );
}
