export default function SkelTable() {
  return (
    <table className="table-fixed w-full border border-slate-200 pointer-events-none">
      <thead>
        <tr className="bg-white border-b border-slate-200 animate-pulse">
          <th className="p-2 text-transparent">|</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200 text-sm">
        <tr className="bg-slate-100 animate-pulse">
          <td className="p-2 text-transparent">|</td>
        </tr>
        <tr className="bg-slate-50 animate-pulse">
          <td className="p-2 text-transparent">|</td>
        </tr>
        <tr className="bg-slate-100 animate-pulse">
          <td className="p-2 text-transparent">|</td>
        </tr>
        <tr className="bg-slate-50 animate-pulse">
          <td className="p-2 text-transparent">|</td>
        </tr>
        <tr className="bg-slate-100 animate-pulse">
          <td className="p-2 text-transparent">|</td>
        </tr>
      </tbody>
    </table>
  );
}
