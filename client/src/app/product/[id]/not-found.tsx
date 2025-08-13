import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container py-5">
      <div className="text-center">
        <h1 className="display-1 fw-bold text-muted">404</h1>
        <h2 className="mb-4">Không tìm thấy sản phẩm</h2>
        <p className="mb-4 text-muted">
          Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <div className="d-grid gap-2 d-md-flex justify-content-md-center">
          <Link href="/" className="btn btn-success btn-lg me-md-2">
            Về trang chủ
          </Link>
          <Link href="/search" className="btn btn-outline-success btn-lg">
            Tìm kiếm sản phẩm
          </Link>
        </div>
      </div>
    </div>
  );
}
