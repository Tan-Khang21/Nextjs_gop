import {
  faFacebook,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import {
  faHeadphones,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

export const headerTopMenuListLeft = [
  { id: 1, name: "Instagram", icon: faInstagram },
  { id: 2, name: "Facebook", icon: faFacebook },
  { id: 3, name: "Youtube", icon: faYoutube },
];
export const headerTopMenuListRight = [
  {
    id: 2,
    name: "Tài khoản",
    url: "#",
    icon: faUser,
    menuchild: [
      { id: 1, name: "Đăng nhập", url: "/login" },
      { id: 2, name: "Đăng ký", url: "/register" },
    ],
  },
  { id: 3, name: "Hỗ trợ", icon: faHeadphones, url: "tel:02839743179" },
];

