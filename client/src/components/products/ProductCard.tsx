import Link from "next/link";
import { formatGia } from "@/redux/utils";
import { addToCartGuest } from "@/api/contentApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useState } from "react";

interface ProductCardProps {
  product: {
    id: string;
    tieude: string;
    hinhdaidien: string;
    gia: string;
    giakhuyenmai: string;
    thuonghieu?: Array<{ tengoi: string; url: string }>;
    cpu?: Array<{ tengoi: string; url: string }>;
    mainboard?: Array<{ tengoi: string; url: string }>;
    dungluongram?: Array<{ tengoi: string; url: string }>;
    ram?: Array<{ tengoi: string; url: string }>;
    ocung?: Array<{ tengoi: string; url: string }>;
    carddohoa?: Array<{ tengoi: string; url: string }>;
    kichcomanhinh?: Array<{ tengoi: string; url: string }>;
    bonhotrong?: Array<{ tengoi: string; url: string }>;
    chipxuli?: Array<{ tengoi: string; url: string }>;
    kichcomanhinhtivi?: Array<{ tengoi: string; url: string }>;
    hangsanxuat?: Array<{ tengoi: string; url: string }>;
    congsuat?: Array<{ tengoi: string; url: string }>;
  };
  brokenImages: Set<string>;
  onImageError: (imageUrl: string) => void;
  onCartUpdate?: () => void; // Optional callback để refresh cart
}

export default function ProductCard({ product, brokenImages, onImageError, onCartUpdate }: ProductCardProps) {
  const { users } = useSelector((state: RootState) => state.auths);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  // Handle add to cart cho người dùng chưa đăng nhập  
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!users) {
      // Người dùng chưa đăng nhập - dùng cookie
      setAddingToCart(true);
      try {
        const result = await addToCartGuest(product.id);
        
        // Hiển thị thông báo thành công
        setCartMessage(`Đã thêm "${product.tieude}" vào giỏ hàng`);
        
        // Gọi callback để refresh cart nếu có
        if (onCartUpdate) {
          onCartUpdate();
        }
        
        // Ẩn thông báo sau 3 giây
        setTimeout(() => {
          setCartMessage("");
        }, 3000);
        
        console.log("Added to cart:", result);
      } catch (error) {
        console.error("Error adding to cart:", error);
        setCartMessage("Có lỗi xảy ra khi thêm vào giỏ hàng");
        
        setTimeout(() => {
          setCartMessage("");
        }, 3000);
      } finally {
        setAddingToCart(false);
      }
    } else {
      // Người dùng đã đăng nhập - có thể thêm logic khác ở đây
      setCartMessage("Chức năng cho người dùng đã đăng nhập sẽ được triển khai sau");
      setTimeout(() => {
        setCartMessage("");
      }, 3000);
    }
  };

  // Lấy thông tin kỹ thuật quan trọng
  const getBrand = () => {
    return product.thuonghieu?.[0]?.tengoi || 
           product.hangsanxuat?.[0]?.tengoi || '';
  };

  const getSpecs = () => {
    const specs = [];
    
    // CPU
    if (product.cpu?.[0]?.tengoi) {
      specs.push({ icon: '🖥️', label: 'CPU', value: product.cpu[0].tengoi, color: '#007bff' });
    } else if (product.chipxuli?.[0]?.tengoi) {
      specs.push({ icon: '⚡', label: 'Chip', value: product.chipxuli[0].tengoi, color: '#007bff' });
    }
    
    // Mainboard
    if (product.mainboard?.[0]?.tengoi) {
      specs.push({ icon: '🔧', label: 'Mainboard', value: product.mainboard[0].tengoi, color: '#6c757d' });
    }
    
    // RAM
    const ramValue = product.dungluongram?.[0]?.tengoi || product.ram?.[0]?.tengoi;
    if (ramValue) {
      specs.push({ icon: '💾', label: 'Dung lượng RAM', value: ramValue, color: '#e83e8c' });
    }
    
    // Storage
    if (product.ocung?.[0]?.tengoi) {
      specs.push({ icon: '💿', label: 'Ổ cứng', value: product.ocung[0].tengoi, color: '#fd7e14' });
    } else if (product.bonhotrong?.[0]?.tengoi) {
      specs.push({ icon: '💿', label: 'Bộ nhớ trong', value: product.bonhotrong[0].tengoi, color: '#fd7e14' });
    }
    
    // Graphics
    if (product.carddohoa?.[0]?.tengoi) {
      specs.push({ icon: '🎮', label: 'Card đồ họa', value: product.carddohoa[0].tengoi, color: '#20c997' });
    }
    
    // Screen size
    const screenSize = product.kichcomanhinh?.[0]?.tengoi || 
                      product.kichcomanhinhtivi?.[0]?.tengoi;
    if (screenSize) {
      specs.push({ icon: '📺', label: 'Kích cỡ màn hình', value: screenSize, color: '#6f42c1' });
    }
    
    // Power for AC
    if (product.congsuat?.[0]?.tengoi) {
      specs.push({ icon: '⚡', label: 'Công suất', value: product.congsuat[0].tengoi, color: '#ffc107' });
    }
    
    return specs.slice(0, 4); // Lấy tối đa 4 specs quan trọng nhất
  };

  const specs = getSpecs();
  const brand = getBrand();

  return (
    <div className="modern-product-card">
      <Link
        href={`/product/${product.id}`}
        className="text-decoration-none h-100 d-block"
      >
        <div className="card modern-card h-100 border-0 position-relative overflow-hidden">
          {/* Sale badge */}
          {product.giakhuyenmai && product.giakhuyenmai !== "0" && (
            <div className="sale-badge">
              <span className="badge bg-danger">
                -{product.giakhuyenmai}%
              </span>
            </div>
          )}
          
          <div className="card-body p-0 d-flex flex-column h-100">
            {/* Product Title */}
            <div className="product-title-section">
              <h6 className="product-title">
                {product.tieude}
              </h6>
            </div>
            
            {/* Product Image */}
            <div className="product-image-section">
              {product.hinhdaidien && !brokenImages.has(product.hinhdaidien) ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={product.hinhdaidien}
                  alt={product.tieude}
                  className="product-image"
                  onError={() => onImageError(product.hinhdaidien)}
                />
              ) : (
                <div className="image-placeholder">
                  <i className="fas fa-image text-muted"></i>
                  <span className="text-muted small">Không có hình</span>
                </div>
              )}
            </div>

            {/* Specifications */}
            <div className="specs-section">
              {specs.map((spec, index) => (
                <div key={index} className="spec-item">
                  <div className="spec-icon" style={{ color: spec.color }}>
                    {spec.icon}
                  </div>
                  <div className="spec-content">
                    <div className="spec-label" style={{ color: spec.color }}>
                      {spec.label}:
                    </div>
                    <div className="spec-value">
                      {spec.value}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Brand */}
              {brand && (
                <div className="spec-item">
                  <div className="spec-icon" style={{ color: '#17a2b8' }}>
                    🏷️
                  </div>
                  <div className="spec-content">
                    <div className="spec-label" style={{ color: '#17a2b8' }}>
                      Thương hiệu:
                    </div>
                    <div className="spec-value">
                      {brand}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Price & Actions */}
            <div className="price-action-section mt-auto">
              <div className="price-section">
                {product.gia && product.gia !== "0" ? (
                  <div className="price-display">
                    {formatGia(product.gia)}
                  </div>
                ) : (
                  <div className="price-contact">
                    Giá bán 0
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="action-buttons">
                {/* Hiển thị thông báo */}
                {cartMessage && (
                  <div className="cart-message alert alert-info alert-sm mb-2 p-2 text-center small">
                    {cartMessage}
                  </div>
                )}
                
                <button 
                  className="btn-modern btn-primary-modern"
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                >
                  <i className={`fas ${addingToCart ? 'fa-spinner fa-spin' : 'fa-shopping-cart'} me-1`}></i>
                  {addingToCart ? 'Đang thêm...' : 'Mua hàng'}
                </button>
                <button 
                  className="btn-modern btn-secondary-modern"
                  onClick={(e) => {
                    e.preventDefault();
                    // Add to wishlist logic here
                  }}
                >
                  <i className="fas fa-heart me-1"></i>
                  Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
