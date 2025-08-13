import SpinAnimation from "@/components/items/SpinAnimation";

export default function Loading() {
  return (
    <div className="container py-5">
      <div className="text-center">
        <SpinAnimation />
        <p className="mt-3 text-muted">Đang tải thông tin sản phẩm...</p>
      </div>
    </div>
  );
}
