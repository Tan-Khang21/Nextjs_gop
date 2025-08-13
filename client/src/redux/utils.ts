import contentReducer from "./slices/content.slice";
import authReducer from "./slices/auth.slice";
import {
  faBuilding,
  faDiagramProject,
  faEnvelope,
  faHouse,
  faLeaf,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

export { contentReducer, authReducer };

// //lấy url chuyển trang
export const toSlug = (str: string) => {
  return str
    .toLowerCase() // viết thường
    .normalize("NFD") // tách dấu
    .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
    .replace(/đ/g, "d") // chuyển đ thành d
    .replace(/[^a-z0-9\s-]/g, "") // loại bỏ ký tự đặc biệt
    .trim() // bỏ khoảng trắng đầu cuối
    .replace(/\s+/g, "-") // thay khoảng trắng bằng dấu -
    .replace(/-+/g, "-"); // loại bỏ dấu - trùng lặp
};

// chuyển thông số sản phẩm sang tiếng viêt
export function reNameInfo(tieude: string): string {
  const list = [
    { thuonghieu: "Thương hiệu" },
    { ram: "RAM" },
    { cpu: "CPU" },
    { mainboard: "Main Board" },
    { ocung: "Ổ cứng" },
    { carddohoa: "Card đồ họa" },
    { nhucau: "Nhu cầu" },
    { kichcomanhinh: "Kích cỡ màn hình" },
    { kichthuocmanhinh: "Kích thước màn hình" },
    { dungluong: "Dung lượng" },
    { hangsanxuat: "Hãng sản xuất" },
    { dophangiai: "Độ phân giải" },
    { hedieuhanhtivi: "Hệ điều hành tivi" },
    { kichcomanhinhtivi: "Kích cỡ màn hình Tivi" },
    { tienich: "Tiện ích" },
    { gia: "Giá" },
    { giakhuyenmai: "Giá khuyến mại" },
    { congxuat: "Công xuất" },
    { congnghe: "Công nghệ" },
    { loaimay: "Loại máy" },
    { kieudang: "Kiểu dáng" },
    { tinhnangdacbiet: "Tính năng đặc biệt" },
    { hieunangvapin: "Hiệu năng và pin" },
    { camera: "Camera" },
    { tansoquet: "Tần số quét" },
    { dungluongram: "Dung luong ram" },
    { chipxuli: "Chip xử lý" },
    { bonhotrong: "Bộ nhớ trong" },
    { phanloai: "Phân loại" },
  ];

  const item = list.find((obj) => Object.keys(obj)[0] === tieude);
  return item ? Object.values(item)[0] : tieude;
}

export const footerList = [
  {
    id: 1,
    footer: [
      {
        id: 1,
        icons: [{ id: 1, content: faBuilding }],
        content: "Công ty TNHH tư vấn và dịch vụ Chồi Xanh",
        url: "https://choixanh.net",
      },
      {
        id: 2,
        icons: [{ id: 1, content: faBuilding }],
        content: "82A - 82B Dân Tộc, Q.Tân Phú",
        url: "https://maps.app.goo.gl/X3Z7swbAfkxzdQBu9",
      },
      {
        id: 3,
        icons: [{ id: 1, content: null }],
        content: "MST: 0314581926",
        url: "https://masothue.com/0314581926-cong-ty-tnhh-choi-xanh-media",
      },
      {
        id: 4,
        icons: [{ id: 1, content: faPhone }],
        content: "028 3974 3179",
        url: "02839743179",
      },
      {
        id: 5,
        icons: [{ id: 1, content: faEnvelope }],
        content: "info@choixanh.vn",
        url: "mailto:info@choixanh.net",
      },
    ],
  },
  {
    id: 2,
    footer: [
      {
        id: 1,
        icons: [{ id: 1, content: faDiagramProject }],
        content: "Theo dõi Chồi Xanh",
        url: "https://www.facebook.com/quocdat473",
      },
      {
        id: 2,
        icons: [
          { id: 1, content: faFacebook },
          { id: 2, content: faYoutube },
          { id: 3, content: faTwitter },
          { id: 4, content: faInstagram },
          { id: 5, content: faLinkedin },
        ],
        content: "",
        url: "",
      },
      {
        id: 3,
        icons: [{ id: 1, content: faLeaf }],
        content: "Vận hành bởi Chồi Xanh Media thành viên của Atoz.vn",
        url: "https://atoz.vn/",
      },
    ],
  },
  {
    id: 3,
    footer: [
      {
        id: 1,
        icons: [{ id: 1, content: null }],
        content: "Điều khoản sử dụng",
        url: "https://choixanh.com.vn/dieu-khoan-va-dieu-kien-su-dung-trang-web",
      },
      {
        id: 2,
        icons: [{ id: 1, content: null }],
        content: "Chính sách cookie",
        url: "https://choixanh.com.vn/chinh-sach-su-dung-cookie",
      },
      {
        id: 3,
        icons: [{ id: 1, content: null }],
        content: "Chính sách dữ liệu",
        url: "https://choixanh.com.vn/chinh-sach-xu-ly-du-lieu",
      },
      {
        id: 4,
        icons: [{ id: 1, content: null }],
        content: "Chính sách hoạt động & hợp tác",
        url: "https://choixanh.com.vn/chinh-sach-hoat-dong-va-hop-tac",
      },
    ],
  },
];

export const menuList = [{ id: 1, name: "Trang chủ", url: "/", icon: faHouse }];

export const formatGia = (value: string | number) => {
  const num = Number(value);
  return num.toLocaleString("vi-VN") + " ₫";
};


const fixedType = [
  { inputType: "inputtext", changed: "text" },
  { inputType: "inputemail", changed: "email" },
  { inputType: "inputtel", changed: "tel" },
  { inputType: "inputnumber", changed: "number" },
  { inputType: "inputdate", changed: "date" },
  { inputType: "request", changed: "text" }, // ❗ Đổi từ "reset" => "text"
];

export function fixedInputType(type: string) {
  const findType = fixedType.find((item) => item.inputType === type);
  return findType ? findType.changed : "text"; // fallback
}
