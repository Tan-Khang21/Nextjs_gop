import NewsDetailBySlug from "../../components/news/NewsDetailBySlug";

export const revalidate = 120;

export default function Page() {
  return <NewsDetailBySlug />;
}
