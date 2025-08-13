"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatGia } from "@/redux/utils";
import SpinAnimation from "@/components/items/SpinAnimation";
import ProductCard from "@/components/products/ProductCard";

interface ProductDetail {
  id: string;
  ngaydang: string;
  luotxem: string;
  diemdanhgia: string;
  soluong: string;
  chophepbinhluan: string;
  hienthibinhluan: string;
  url: string;
  tieude: string;
  noidungchitiet: string;
  hinhdaidien: string;
  ma: string;
  gia: string;
  giakhuyenmai: string;
  giasi: string;
  noidungtomtat: string;
}

interface ProductImage {
  id: string;
  IDPart: string;
  ord: string;
  hinhdaidien: string;
  tieude: string;
}

interface ImageApiResponse {
  error: boolean;
  message: string;
  tieude: string;
  xemthem: string;
  tennhom: string;
  data: ProductImage[];
}

interface RelatedProduct {
  id: string;
  ngaydang: string;
  hinhdaidien: string;
  tieude: string;
  url: string;
  masp: string;
  trongluong: string;
  gia: string;
  giakhuyenmai: string;
  thuonghieu?: Array<{ tengoi: string; url: string }>;
  kichcomanhinh?: Array<{ tengoi: string; url: string }>;
  tinhnangdacbiet?: Array<{ tengoi: string; url: string }>;
  hieunangvapin?: Array<{ tengoi: string; url: string }>;
  camera?: Array<{ tengoi: string; url: string }>;
  bonhotrong?: Array<{ tengoi: string; url: string }>;
  dungluongram?: Array<{ tengoi: string; url: string }>;
  tansoquet?: Array<{ tengoi: string; url: string }>;
  chipxuli?: Array<{ tengoi: string; url: string }>;
}

interface RelatedApiResponse {
  tieude: string;
  xemthem: string;
  tenham: string;
  url: string;
  baiviet: RelatedProduct[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  
  const [productData, setProductData] = useState<ProductDetail[]>([]);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<RelatedApiResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!productId) return;

    const fetchProductData = async () => {
      try {
        setLoading(true);
        
        // Fetch product detail, images và related products song song
        const [productResponse, imagesResponse, relatedResponse] = await Promise.all([
          fetch(`/api/product/${productId}`),
          fetch(`/api/product/${productId}/images`),
          fetch(`/api/product/${productId}/related`)
        ]);
        
        if (!productResponse.ok) {
          throw new Error('Không thể tải thông tin sản phẩm');
        }
        
        const productData = await productResponse.json();
        console.log('Product API Response:', productData);
        
        setProductData(productData);
        
        // Xử lý images response
        if (imagesResponse.ok) {
          const imagesData: ImageApiResponse[] = await imagesResponse.json();
          console.log('Images API Response:', imagesData);
          
          if (imagesData.length > 0 && imagesData[0].data) {
            // Sắp xếp images theo ord
            const sortedImages = imagesData[0].data.sort((a, b) => 
              parseInt(a.ord) - parseInt(b.ord)
            );
            setProductImages(sortedImages);
          }
        } else {
          console.warn('Không thể tải hình ảnh sản phẩm');
        }
        
        // Xử lý related products response
        if (relatedResponse.ok) {
          const relatedData: RelatedApiResponse[] = await relatedResponse.json();
          console.log('Related Products API Response:', relatedData);
          setRelatedProducts(relatedData);
        } else {
          console.warn('Không thể tải sản phẩm liên quan');
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  // Update document title when product loads
  useEffect(() => {
    const mainProduct = productData.find(product => product.id === productId);
    
    if (mainProduct) {
      document.title = `${mainProduct.tieude} | Chồi Xanh Media`;
    }
  }, [productData, productId]);

  const handleImageError = (imageUrl: string) => {
    setBrokenImages(prev => new Set(prev).add(imageUrl));
  };

  if (loading) {
    return (
      <div className="container py-5">
        <SpinAnimation />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <h4>Lỗi</h4>
          <p>{error}</p>
          <Link href="/" className="btn btn-primary">
            Quay về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  // Tìm sản phẩm chi tiết từ array trả về
  const mainProduct = productData.find(product => 
    product.id === productId || 
    String(product.id) === String(productId)
  );
  
  // Debug log để kiểm tra
  console.log('All products IDs:', productData.map(p => ({ id: p.id, type: typeof p.id, title: p.tieude })));
  console.log('Looking for productId:', productId, 'type:', typeof productId);
  console.log('Found mainProduct:', mainProduct);

  if (!mainProduct) {
    return (
      <div className="container py-4">
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">Trang chủ</Link>
            </li>
            <li className="breadcrumb-item active">Chi tiết sản phẩm</li>
          </ol>
        </nav>

        <div className="alert alert-warning mb-4">
          <h4>Không tìm thấy sản phẩm</h4>
          <p>Sản phẩm với ID <strong>{productId}</strong> không tồn tại hoặc đã bị xóa.</p>
        </div>

        <div className="text-center mt-4">
          <Link href="/" className="btn btn-success">
            Quay về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link href="/">Trang chủ</Link>
          </li>
          <li className="breadcrumb-item active">Chi tiết sản phẩm</li>
        </ol>
      </nav>

      {/* Chi tiết sản phẩm chính */}
      <div className="row mb-5">
        <div className="col-md-6">
          {/* Hình ảnh sản phẩm */}
          <div className="text-center">
            {productImages.length > 0 ? (
              <div>
                {/* Ảnh chính */}
                <div className="mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={productImages[currentImageIndex]?.hinhdaidien || mainProduct.hinhdaidien}
                    alt={mainProduct.tieude}
                    className="img-fluid rounded shadow"
                    style={{ maxHeight: '400px', objectFit: 'cover', width: '100%' }}
                    onError={() => handleImageError(productImages[currentImageIndex]?.hinhdaidien || mainProduct.hinhdaidien)}
                  />
                </div>
                
                {/* Thumbnail carousel */}
                {productImages.length > 1 && (
                  <div className="d-flex justify-content-center gap-2 flex-wrap">
                    {productImages.map((image, index) => (
                      <div
                        key={image.id}
                        className={`thumbnail-image ${index === currentImageIndex ? 'active' : ''}`}
                        style={{
                          cursor: 'pointer',
                          border: index === currentImageIndex ? '2px solid #007bff' : '1px solid #ddd',
                          borderRadius: '4px',
                          padding: '2px'
                        }}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image.hinhdaidien}
                          alt={`${mainProduct.tieude} ${index + 1}`}
                          style={{ 
                            width: '60px', 
                            height: '60px', 
                            objectFit: 'cover',
                            borderRadius: '2px'
                          }}
                          onError={() => handleImageError(image.hinhdaidien)}
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Navigation arrows */}
                {productImages.length > 1 && (
                  <div className="mt-2">
                    <button
                      className="btn btn-outline-secondary btn-sm me-2"
                      onClick={() => setCurrentImageIndex(
                        currentImageIndex > 0 ? currentImageIndex - 1 : productImages.length - 1
                      )}
                    >
                      ‹ Trước
                    </button>
                    <span className="mx-2 text-muted">
                      {currentImageIndex + 1} / {productImages.length}
                    </span>
                    <button
                      className="btn btn-outline-secondary btn-sm ms-2"
                      onClick={() => setCurrentImageIndex(
                        currentImageIndex < productImages.length - 1 ? currentImageIndex + 1 : 0
                      )}
                    >
                      Sau ›
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Fallback nếu không có hình ảnh từ API
              mainProduct.hinhdaidien && !brokenImages.has(mainProduct.hinhdaidien) ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={mainProduct.hinhdaidien}
                  alt={mainProduct.tieude}
                  className="img-fluid rounded shadow"
                  style={{ maxHeight: '400px', objectFit: 'cover' }}
                  onError={() => handleImageError(mainProduct.hinhdaidien)}
                />
              ) : (
                <div 
                  className="d-flex align-items-center justify-content-center bg-light rounded shadow"
                  style={{ height: '400px' }}
                >
                  <span className="text-muted">Không có hình ảnh</span>
                </div>
              )
            )}
          </div>
        </div>

        <div className="col-md-6">
          {/* Thông tin sản phẩm */}
          <h1 className="h3 fw-bold mb-3">{mainProduct.tieude}</h1>
          
          <div className="mb-3">
            <span className="badge bg-secondary me-2">Mã SP: {mainProduct.ma}</span>
            {mainProduct.giakhuyenmai && mainProduct.giakhuyenmai !== "0" && (
              <span className="badge bg-danger">Giảm {mainProduct.giakhuyenmai}%</span>
            )}
          </div>

          {/* Giá */}
          <div className="mb-4">
            {mainProduct.gia && mainProduct.gia !== "0" ? (
              <h2 className="text-danger fw-bold">{formatGia(mainProduct.gia)}</h2>
            ) : (
              <h2 className="text-muted">Liên hệ để biết giá</h2>
            )}
          </div>

          {/* Thông tin cơ bản */}
          <div className="mb-4">
            <h5 className="fw-bold mb-3">Thông tin sản phẩm</h5>
            <div className="row g-2">
              <div className="col-12">
                <strong>Ngày đăng:</strong> {new Date(mainProduct.ngaydang).toLocaleDateString('vi-VN')}
              </div>
              <div className="col-12">
                <strong>Lượt xem:</strong> {mainProduct.luotxem}
              </div>
              <div className="col-12">
                <strong>Điểm đánh giá:</strong> {mainProduct.diemdanhgia}/100
              </div>
              <div className="col-12">
                <strong>Số lượng:</strong> {mainProduct.soluong}
              </div>
            </div>
          </div>

          {/* Nội dung chi tiết */}
          {mainProduct.noidungchitiet && (
            <div className="mb-4">
              <h5 className="fw-bold mb-3">Mô tả chi tiết</h5>
              <div 
                className="content-detail border p-3 rounded bg-light"
                style={{ maxHeight: '300px', overflowY: 'auto' }}
                dangerouslySetInnerHTML={{ __html: mainProduct.noidungchitiet }}
              />
            </div>
          )}

          {/* Nút hành động */}
          <div className="d-grid gap-2 d-md-flex">
            <button className="btn btn-success btn-lg me-md-2">
              Thêm vào giỏ hàng
            </button>
            <button className="btn btn-outline-success btn-lg">
              Mua ngay
            </button>
          </div>
        </div>
      </div>

      {/* Sản phẩm liên quan */}
      {relatedProducts.map((section, sectionIndex) => {
        // Chỉ hiển thị section có sản phẩm
        const relatedItems = section.baiviet?.filter(product => product.id !== productId) || [];
        
        return relatedItems.length > 0 && (
          <div key={sectionIndex} className="mb-5">
            <h4 className="fw-bold text-success border-bottom border-3 border-success pb-2 mb-4">
              {section.tieude}
            </h4>
            <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-3 g-4">
              {relatedItems.slice(0, 6).map((product) => (
                <div key={product.id} className="col">
                  <ProductCard
                    product={product}
                    brokenImages={brokenImages}
                    onImageError={handleImageError}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
