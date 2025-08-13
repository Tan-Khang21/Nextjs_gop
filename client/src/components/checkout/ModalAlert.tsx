"use client";

import { useEffect, useState } from "react";

interface SuccessModalProps {
  open: boolean;
  onClose?: () => void;
}

export default function SuccessModal({ open, onClose }: SuccessModalProps) {
  const [isVisible, setIsVisible] = useState(open);

  useEffect(() => {
    setIsVisible(open);

    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <div
      className="top-0 bg-opacity-50 position-fixed start-0 w-100 h-100 bg-dark d-flex align-items-center justify-content-center z-3"
      style={{ pointerEvents: "auto" }}
    >
      <div
        className="p-4 text-center bg-white rounded shadow"
        style={{ pointerEvents: "auto" }}
      >
        <h4 className="mb-3 text-success">🎉 Thanh toán thành công!</h4>
        <p>Cảm ơn bạn đã mua hàng.</p>
        <button
          type="button"
          className="mt-3 btn btn-success"
          onClick={handleClose}
        >
          Đóng
        </button>
      </div>
    </div>
  );
}
