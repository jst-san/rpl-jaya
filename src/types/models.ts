export interface Barang {
    id:number;
    nama_barang:string;
    kode_barang:string;
    harga:number;
    stok:number;
    created_at:string;
    updated_at:string;
}

export interface BarangFillable {
    nama_barang:string;
    kode_barang:string;
    harga:number;
    stok:number;
}


export interface Transaksi {
    id:number;
    nomor_transaksi:string;
    tanggal:string;
    total:number;
    created_at:string;
    updated_at:string;
}

export interface TransaksiFillable {
    nomor_transaksi:string;
    tanggal:string;
    total:number;
}

export interface DetailTransaksi {
    id:number;
    transaksi_id:number;
    barang_id:number;
    harga:number;
    jumlah:number;
    subtotal:number;
    created_at:number;
    updated_at:number;
}

export interface User {
    id:number;
    name:string;
    email:string;
    created_at:string;
    updated_at:string;
}