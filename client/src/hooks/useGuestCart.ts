import { useState, useEffect } from 'react';
import { getCurrentCart, CurrentCart, clearExpiredCookie } from '@/api/contentApi';

export function useGuestCart() {
  const [cart, setCart] = useState<CurrentCart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy giỏ hàng hiện tại
  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Xóa cookie hết hạn trước khi fetch
      clearExpiredCookie();
      
      const cartData = await getCurrentCart();
      setCart(cartData);
    } catch (err) {
      setError('Không thể tải giỏ hàng');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh giỏ hàng sau khi thêm sản phẩm
  const refreshCart = () => {
    fetchCart();
  };

  // Lấy tổng số lượng sản phẩm trong giỏ
  const getTotalItems = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  // Tự động load giỏ hàng khi component mount
  useEffect(() => {
    fetchCart();
  }, []);

  return {
    cart,
    loading,
    error,
    refreshCart,
    getTotalItems,
  };
}
