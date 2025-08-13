import { useState, useEffect } from 'react';
import { getCurrentCart, CurrentCart, clearExpiredCookie } from '@/api/contentApi';
import { getDathangMabaogiayCookie } from '@/api/authApi';

export function useGuestCart() {
  const [cart, setCart] = useState<CurrentCart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy giỏ hàng hiện tại
  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Kiểm tra và lấy DathangMabaogia nếu chưa có
      const existingDathang = localStorage.getItem('DathangMabaogia');
      if (!existingDathang) {
        console.log('🔥 [useGuestCart] DathangMabaogia not found, fetching from cookie API...');
        await getDathangMabaogiayCookie();
      }
      
      // Xóa cookie hết hạn trước khi fetch
      clearExpiredCookie();
      
      const cartData = await getCurrentCart();
      setCart(cartData);
      
      // Lưu ASP Session Cookie vào localStorage để đồng bộ với API xóa
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name.startsWith('ASPSESSIONID')) {
          localStorage.setItem('aspSessionName', name);
          localStorage.setItem('aspSessionValue', value);
          console.log('🔥 [useGuestCart] Saved ASP Session to localStorage:', name + "=" + value);
        }
        // Lưu DathangMabaogia nếu có
        if (name === 'DathangMabaogia') {
          localStorage.setItem('DathangMabaogia', value);
          console.log('🔥 [useGuestCart] Saved DathangMabaogia to localStorage:', value);
        }
      }
      
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
