import RenderPageContent from "./RenderPageContent";
import axios from "axios";
import { Metadata } from "next";
import BannerPage from "./BannerPage";

type PageParams = {
  params: {
    slug1: string;
    slug2: string;
  };
};

// Server-side metadata
export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug1, slug2 } = await params;
  const id = slug2;
  const pagemodule = slug1 === "lienhe" ? "tintuc" : "tintuc";

  const response = await axios.get(
    `http://127.0.0.1:8000/api/module.${pagemodule}.php?id=${id}`
  );

  const data = Array.isArray(response.data) ? response.data[0] : response.data;

  return {
    title: `Chồi Xanh | ${data?.tieude}`,
    description: data?.metadescription ?? "",
    keywords: data?.metakeywords ?? "",
  };
}

export default async function Page({ params }: PageParams) {
  const { slug1, slug2 } = await params;
  return (
    <>
      <BannerPage />
      <RenderPageContent module={slug1} id={slug2} />
    </>
  );
}
