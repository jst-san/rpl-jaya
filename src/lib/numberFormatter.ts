export function toRupiah(n: number | string) {
    return "Rp" + Number(n).toLocaleString() + ",00";
  }
  