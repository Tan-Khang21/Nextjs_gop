/*'use client';

import { useGuestCart } from "@/hooks/useGuestCart";
import { formatGia } from "@/redux/utils";
import { getFullImageUrl, removeFromCart } from "@/api/authApi";
import Image from "next/image";
import { useState } from "react";

export default function GuestCart() {
  const { 
    cart, 
    loading, 
    error, 
    refreshCart, 
    getTotalItems
  } = useGuestCart();

  const [removingItems, setRemovingItems] = useState<string[]>([]);

  const cartCount = getTotalItems();
  const totalAmount = cart?.totalAmount || 0;

  // SỬA HÀM handleRemoveItem (log trước khi gọi, chặn khi thiếu id)
const handleRemoveItem = async (idpart: string, productName: string) => {
  console.log("🧪 [handleRemoveItem] incoming:", { idpart, productName });

  if (!idpart) {
    console.error("❌ [handleRemoveItem] idpart rỗng/undefined");
    alert("Không xác định được sản phẩm để xóa (id rỗng).");
    return;
  }

  if (!confirm(`Bạn có chắc chắn muốn xóa "${productName}" khỏi giỏ hàng?`)) return;

  setRemovingItems(prev => [...prev, idpart]);

  try {
    console.log("🔥 [handleRemoveItem] CALL removeFromCart with idpart:", idpart);
    const result = await removeFromCart(idpart);
    console.log("🔥 [handleRemoveItem] RESULT:", result);

    if (result.success) {
      await refreshCart();
    } else {
      console.error("❌ Remove failed:", result.message);
      alert("Có lỗi xảy ra khi xóa sản phẩm: " + result.message);
    }
  } catch (error) {
    console.error("❌ Remove error:", error);
    alert("Có lỗi xảy ra khi xóa sản phẩm");
  } finally {
    setRemovingItems(prev => prev.filter(id => id !== idpart));
  }
};


  if (loading) {
    return (
      <div className="guest-cart">
        <h5>Giỏ hàng của bạn</h5>
        <div className="text-center">
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="guest-cart">
        <h5>Giỏ hàng của bạn</h5>
        <div className="alert alert-danger">
          {error}
          <button 
            className="btn btn-sm btn-outline-primary ml-2"
            onClick={refreshCart}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="guest-cart">
        <h5>Giỏ hàng của bạn</h5>
        <div className="text-muted text-center">
          <i className="fas fa-shopping-cart fa-3x mb-3"></i>
          <p>Giỏ hàng trống</p>
        </div>
      </div>
    );
  }

  return (
    <div className="guest-cart">
      <h5>
        Giỏ hàng của bạn 
        <span className="badge badge-primary ml-2">{cartCount}</span>
      </h5>
      
      <div className="cart-items">
        {cart.items.map((item, index) => (
          <div key={index} className="cart-item border-bottom py-2">
            <div className="row align-items-center">
              <div className="col-3">
                {item.image && (
                  <div className="position-relative" style={{ width: '60px', height: '60px' }}>
                    <Image 
                      src={getFullImageUrl(item.image)} 
                      alt={item.partName}
                      fill
                      className="rounded"
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="col-5">
                <h6 className="mb-1" style={{ fontSize: '0.9rem' }}>
                  {item.partName}
                </h6>
                <div className="text-primary">
                  <strong>{formatGia(item.price.toString())}</strong>
                </div>
                <small className="text-muted">
                  Số lượng: {item.quantity}
                </small>
              </div>
              <div className="col-3 text-right">
                <div className="text-primary mb-2">
                  <strong>{formatGia((item.price * item.quantity).toString())}</strong>
                </div>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleRemoveItem(item.id, item.partName)}
                  disabled={removingItems.includes(item.id)}
                  title="Xóa sản phẩm"
                >
                  {removingItems.includes(item.id) ? (
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    <i className="fas fa-trash-alt"></i>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="cart-summary mt-3 pt-3 border-top">
        <div className="row">
          <div className="col-6">
            <strong>Tổng cộng:</strong>
          </div>
          <div className="col-6 text-right">
            <strong className="text-primary">
              {formatGia(totalAmount.toString())}
            </strong>
          </div>
        </div>
        
        <div className="mt-3">
          <button className="btn btn-primary btn-sm btn-block mb-2">
            <i className="fas fa-shopping-cart mr-1"></i>
            Xem giỏ hàng chi tiết
          </button>
          <button className="btn btn-success btn-sm btn-block">
            <i className="fas fa-credit-card mr-1"></i>
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}*/