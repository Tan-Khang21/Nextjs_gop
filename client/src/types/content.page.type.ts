import { Order } from "@/api/contentApi";
import { JSX } from "react";

// ─── INTERFACE: Header & Navbar ───────────────────────────────
export interface MenuHeader {
  idpart: string;
  idquanly: string;
  kieuhienthi: string;
  hinhdaidien: string;
  tieude: string;
  url: string;
  menucap1: [{ idpart: string; tieude: string; url: string }];
}

export interface ContentHeader {
  Logo: string;
  Icon: string;
  Logonguoidangbai: string;
  BannerChinh: string;
}

export interface PageCategories {
  id: string;
  kieuhienthi: string;
  hinhdaidien: string;
  tieude: string;
  url: string | null;
  children?: PageCategoriesChild[];
}

export interface PageCategoriesChild {
  id: string;
  tieude: string;
  url: string;
}

// ─── INTERFACE: Product ───────────────────────────────────────
export interface Product {
  id: string;
  ngaydang: Date;
  hinhdaidien: string;
  hinhlienquan: [
    { id: string; ord: number; hinhdaidien: string; tieude: string }
  ];
  tieude: string;
  url: string;
  masp: string;
  trongluong: string;
  giasi: number;
  luotxem: string;
  gia: number;
  giakhuyenmai: number;
  nd: string;
  noidungchitiet: JSX.Element;
  chophepbinhluan: boolean;
  hienbinhluan: boolean;
}

export interface Products {
  module: string;
  tenham: string;
  tieude: string;
  metatitle: string;
  metakeywords: string;
  metadiscription: string;
  noidungchitiet: string;
  recordsTotal: number;
  recordsFiltered: number;
  data: [Product];
}

// ─── NEW API INTERFACE ───────────────────────────────────────
export interface NewApiResponse {
  recordsTotal: number;
  recordsFiltered: number;
  data: NewProductItem[];
}

export interface NewProductItem {
  id: string;
  ngaydang: string;
  hinhdaidien: string;
  tieude: string;
  url: string;
  masp: string;
  trongluong: string;
  gia: string;
  giakhuyenmai: string;
  thuonghieu?: Array<{tengoi: string; url: string}>;
  cpu?: Array<{tengoi: string; url: string}>;
  ram?: Array<{tengoi: string; url: string}>;
  ocung?: Array<{tengoi: string; url: string}>;
  carddohoa?: Array<{tengoi: string; url: string}>;
  mainboard?: Array<{tengoi: string; url: string}>;
  nhucau?: Array<{tengoi: string; url: string}>;
  kichcomanhinh?: Array<{tengoi: string; url: string}>;
}

export interface ProductRelated {
  tieude: string;
  url: string;
  recordsTotal: number;
  recordsFiltered: number;
  data: ProductRelatedData[];
}

interface ProductRelatedData {
  id: string;
  tieude: string;
  hinhdaidien: string;
  url: string;
  tomtat: string;
  gia: string;
  giakhuyenmai: string;
  thuonghieu: string;
  ngaydang: string;
  hinhanh: ProductRelatedImg[];
}

interface ProductRelatedImg {
  id: string;
  hinhdaidien: string;
  tieude: string;
}

export type ProductInfo = {
  [key: string]: { tengoi: string; url: string }[];
};

export type ProductDetail = Product & ProductInfo;

// ─── INTERFACE: News ──────────────────────────────────────────
export interface News {
  module: string;
  tenham: string;
  tieude: string;
  url: string;
  metatitle: string;
  hinhanhdaidien?: string;
  metakeywords: string;
  metadescriptions: string;
  noidungchitiet: string;
  NhomTruyVan: string;
  kieu: string;
  recordsTotal: number;
  recordsFiltered: number;
  data: [NewsData];
  [key: string]: any; 
}

export interface NewsData {
  id: number;
  ngaydang: Date;
  hinhdaidien: string;
  tieude: string;
  url: string;
  tomtat: string;
}

export interface NewsDetailType {
  id: string;
  ngaydang: string;
  luotxem: string;
  chophepbinhluan: string;
  hienthibinhluan: string;
  tieude: string;
  hinhdaidien: string;
  noidungchitiet: string;
}

export type NewsDetail = NewsDetailType[];

export interface NewsRelatedType {
  tieude: string;
  url: string;
  recordsTotal: number;
  recordsFiltered: number;
  data: NewsRelatedData[];
}

export interface NewsRelatedData {
  id: string;
  tieude: string;
  hinhdaidien: string;
  url: string;
  tomtat: string;
  ngaydang: string;
}

// ─── INTERFACE: Cart, Wishlist, Order ─────────────────────────
export interface Cart {
  mess: string;
  data: [
    {
      img: string;
      product_id: string;
      product_name: string;
      price: string;
      email: string;
      quantity: number;
    }
  ];
}

export interface ProductActionResult {
  success: boolean;
  mess: string;
}

export interface CheckoutPayload {
  bin: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  description: string;
  orderCode: number;
  currency: string;
  paymentLinkId: string;
  status: string;
  checkoutUrl: string;
  qrCode: string;
}

// ─── INTERFACE: Search, Contact, Content ──────────────────────
export interface SearchedContentState {
  idparent: string;
  id: string;
  hinhdaidien: string;
  tieude: string;
  url: string;
  gia: number;
  giakhuyenmai: number;
  tomtat: string;
  DateTime: string;
  kieuhienthi: string;
}

export type ContentApi = {
  id: string;
  hinhdaidien: string;
  tieude: string;
  url: string;
  kieuhienthi: string;
};

export interface Content {
  id: number;
  hinhdaidien: string;
  tieude: string;
  url: string;
  kieuhienthi: string;
}

export type ContactApi = {
  KieuHienThi: string;
  id: string;
  tieude: string;
  hinhdaidien: string;
  metatitle: string;
  metakeywords: string;
  metadescriptions: string;
  url: string;
  link: string;
  thanhcong: string;
  data: Array<{
    tennhom: string;
    cauhinh: {
      tieude: string;
      kieu: string;
      nhandan: string;
      batbuoc: string;
      sua: string;
      huongdan: string;
      giatri: string;
      nhom: string;
    };
  }>;
};

// ─── INTERFACE: Redux State ───────────────────────────────────
interface ContentState {
  newsDetail: NewsDetail;
  searchKeyWord: string | null;
  orderResult: { data: string; link: CheckoutPayload; order_id: string } | null;
  productActionResult: string | null;
  news: Record<string, News[]>;
  products: Record<string, NewApiResponse[]>; // Cập nhật để dùng NewApiResponse
  productRelated: ProductRelated | null;
  loading: boolean;
  paymentResult: string | null;
  homeContent: Content[] | [];
  newsRelated: NewsRelatedType | null;
  orderapi: Order[] | [];
  productDetail: ProductDetail[];
  resultCode: number | null;
  error: string | null;
  searchedContent: SearchedContentState[] | [];
  headerMenu: MenuHeader[];
  headerContent: ContentHeader | null;
  navbar: PageCategories[] | null;
  cart: Cart | null;
  rightContent: ContentApi[] | [];
  leftContent: ContentApi[] | [];
  wishlist:
    | {
        ProductID: string;
        Image: string;
        Price: number;
        Title: string;
      }[]
    | null;
  contact: ContactApi[];
}

// ─── INITIAL STATE ────────────────────────────────────────────
export const initialState: ContentState = {
  products: {},
  productRelated: null,
  orderResult: null,
  navbar: [],
  newsRelated: null,
  orderapi: [],
  homeContent: [],
  paymentResult: null,
  newsDetail: [],
  searchKeyWord: null,
  rightContent: [],
  leftContent: [],
  cart: null,
  searchedContent: [],
  headerMenu: [],
  headerContent: null,
  contact: [],
  wishlist: [],
  productDetail: [],
  productActionResult: null,
  news: {},
  resultCode: null,
  loading: false,
  error: null,
};
