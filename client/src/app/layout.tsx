import type { Metadata } from "next";
import { Nunito, Nunito_Sans } from "next/font/google";
import "./globals.css";
import "@/components/icon/fontawesome";
import { ReduxProvider } from "@/redux/provider";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/footer";
import AppProvider from "@/redux/AppProvider";
// import HeaderTop from "@/components/header/HeaderTop";
import RightContent from "@/components/pagebody/RightContent";
import LeftContent from "@/components/pagebody/LeftContent";
import BannerPage from "./[slug1]/[slug2]/BannerPage";
import Map from "@/components/items/Map";
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductContainer from "@/components/products/ProductContainer";
import SidebarMenu from "@/components/sidebar/SidebarMenu"; 
import NewsPage from "@/components/news/NewsPage1";
import PageBanner from "@/components/header/PageBanner";
import HomeTail from "@/app/HomeTail";

//boot script

// Đặt đúng tên theo font
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "Công ty Chồi Xanh Media - Chuyên cung cấp máy tính và thiết bị công nghệ",
  description:
    "Chồi Xanh Media cung cấp các loại máy tính, laptop và thiết bị công nghệ chất lượng cao, đáp ứng mọi nhu cầu của doanh nghiệp và cá nhân",
  keywords: [
    "máy tính, laptop, PC, thiết bị công nghệ, phần cứng máy tính, Chồi Xanh Media",
  ],
};
// Đặt lại title cho các trang con
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} ${nunitoSans.variable}`}>
        <ReduxProvider>
          <AppProvider>
            <header>
              {/* <HeaderTop /> */}
              <Header />
            </header>
            <PageBanner img="https://demodienmay.125.atoz.vn/mediaroot/media/userfiles/useruploads/455/image/slide/thiet-bi-dien-may_033704340.png" />
            <main className="container-fluid">
              <div className="row">
                {/* Cột danh mục bên trái */}
                <div className="col-lg-3">
                  <SidebarMenu />
                </div>

                {/* Cột nội dung chính (Sản phẩm và Tin tức) */}
                <div className="col-lg-6">
                  {children}
                  {/*<ProductContainer id="35278" />
                  <NewsPage id="tintuc" />*/}
                </div>

                {/* Cột bên phải (Optional) */}
                <div className="col-lg-3 d-lg-block d-none">
                  <RightContent />
                </div>
              </div>
            </main>
            <footer>
              <Map />
              <Footer />
            </footer>
          </AppProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}

