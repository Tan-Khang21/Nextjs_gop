"use client";
import Image from "next/image";

export default function PageBanner({ img }: { img: string }) {
  return (
    <div className="d-flex justify-content-center py-3" style={{ background: "#fff" }}>
      <div
        className="shadow"
        style={{
          borderRadius: "24px",
          overflow: "hidden",
          width: "1200px",
          maxWidth: "100%",
        }}
      >
        <Image
          src={img}
          width={1200}
          height={350}
          alt="Banner"
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            objectFit: "cover",
            borderRadius: "24px",
          }}
          priority
        />
      </div>
    </div>
  );
}
