"use client";

import React from "react";

export default function SpinAnimation() {
  return (
    <div className="d-flex align-items-center justify-content-center w-100 min-vh-100">
      <div className="spinner-border text-secondary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
