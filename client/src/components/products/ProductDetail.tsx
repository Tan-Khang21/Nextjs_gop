"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
// import ProductContainer from "./ProductContainer";
import {} from "@/redux/slices/content.slice";
import { useParams } from "next/navigation";
import Link from "next/link";
import { reNameInfo } from "@/redux/utils";
import Order from "./Order";
import { getProductDetail, saveCart } from "@/redux/api/reduxContentApi";
import SpinAnimation from "../items/SpinAnimation";
import RelatedProduct from "./RelatedProduct";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faCartPlus,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { ProductActionAddWishlist } from "@/api/contentApi";

const fixedFields = [
  "id",
  "ngaydang",
  "hinhdaidien",
  "hinhlienquan",
  "tieude",
  "url",
  "masp",
  "trongluong",
  "giasi",
  "luotxem",
  "gia",
  "giakhuyenmai",
  "nd",
  "chophepbinhluan",
  "hienbinhluan",
];

export default function ProductDetail() {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const [addWishlistResult, setAddWishlistResult] = useState<string>();
  const { users } = useSelector((state: RootState) => state.auths);
  const { loading } = useSelector((state: RootState) => state.contents);
  const { productDetail, orderResult,productActionResult } = useSelector(
    (state: RootState) => state.contents
  );
  const [expanded, setExpanded] = useState(false);
  const id = params.slug3;
  //add to cart function
  const handleAddtoCart = async ({
    img,
    product_id,
    product_name,
    price,
    email,
    quantity,
  }: {
    img: string;
    product_id: string;
    product_name: string;
    price: string;
    email: string;
    quantity: number;
  }) => {
    await dispatch(
      saveCart({
        img,
        product_id,
        product_name,
        price,
        email,
        quantity,
      })
    );
  };
  //add to wishlist function
  const handleAddtoWishList = async ({
    ProductID,
    Image,
    Price,
    Title,
  }: {
    ProductID: string;
    Image: string;
    Price: number;
    Title: string;
  }) => {
    const result: string = await ProductActionAddWishlist({
      Image,
      ProductID,
      Price,
      Title,
    });
    setAddWishlistResult(result);
  };
  // Fetch product detail
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        await dispatch(getProductDetail({ id: Number(id) }));
      } catch (error) {
        console.error(error);
      }
    };
    fetchDetail();
  }, [dispatch, id]);

  if (loading) {
    return <SpinAnimation />;
  }
  return (
    <div>
      {productDetail ? (
        <div className="p-2 mt-2 min-vh-100 w-100">
          {productDetail.map((products, idx) => (
            <div key={idx} className="d-block">
              {/* Product Info */}
              <div className="row row-lg-cols-2 row-md-cols-1">
                {/* Left : Image + Gallery */}
                <div className="mb-4 border col-lg-6">
                  <div className="w-100">
                    <Order
                      product_name={products.tieude}
                      product_id={products.id.trimEnd()}
                      product_price={Number(products.gia)}
                    />
                    {/* ProductId={id as string}
                    Image={products.hinhdaidien}
                    Title={products.tieude} */}
                    <div className="mb-3 text-center ">
                      <Image
                        src={`${products.hinhdaidien}`}
                        alt={products.tieude}
                        width={440}
                        height={300}
                        className="h-100 w-100 object-fit-cover"
                      />
                    </div>
                    <h5 className="pb-2 border-bottom">Tổng quan sản phẩm</h5>
                    <div className="gap-1 row row-cols-5 g-3 justify-content-center">
                      {products.hinhlienquan?.map((thum) => (
                        <div key={thum.ord} className="p-1 col-lg-2">
                          <Image
                            src={`${thum.hinhdaidien}`}
                            alt={`thumbnail-${thum.ord}`}
                            title={`thumbnail-${thum.ord}`}
                            width={100}
                            height={100}
                            className="w-100 h-100 object-fit-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right : Product Details */}

                <div className="mb-4 border col-lg-5 ms-1">
                  <div className="p-3">
                    <p className="text-start fw-bold text-wrap">
                      TÊN SẢN PHẨM: {products.tieude.toLocaleUpperCase()}
                    </p>
                    {/* Dynamic Fields */}
                    <div className="mt-4">
                      <p className="fw-bold border-bottom">
                        THÔNG TIN SẢN PHẨM
                      </p>
                      {Object.entries(products)
                        .filter(
                          ([key, value]) =>
                            !fixedFields.includes(key) && Array.isArray(value)
                        )
                        .map(([key, items]) => (
                          <div key={key} className="mb-2 d-flex">
                            <strong>{reNameInfo(key)}:</strong>
                            <span className="flex-wrap gap-2 mt-1 d-flex">
                              {items.map((item) => (
                                <Link
                                  href={`/${item.url}`}
                                  key={`${key}-${item.url}`}
                                  className="badge text-bg-light text-decoration-none"
                                >
                                  {item.tengoi}
                                </Link>
                              ))}
                            </span>
                          </div>
                        ))}
                    </div>
                    <strong>Lượt xem: {products.luotxem}</strong>
                    {/* Action Buttons */}
                    <div className="my-3">
                      <div className="gap-1 row row-cols-3 justify-content-center">
                        {/* add to cart btn */}
                        <button
                          className="border-2 btn rounded-0 border-success col-3"
                          onClick={() =>
                            handleAddtoCart({
                              email: users?.email as string,
                              img: products.hinhdaidien,
                              product_name: products.tieude,
                              product_id: products.id,
                              quantity: 1,
                              price: products.gia.toLocaleString(),
                            })
                          }
                        >
                          <FontAwesomeIcon
                            icon={faCartPlus}
                            className="text-success"
                          />
                        </button>
                        {/* add to wl btn */}
                        <button
                          className="border-2 btn rounded-0 border-success col-3"
                          onClick={() =>
                            handleAddtoWishList({
                              Image: products.hinhdaidien,
                              ProductID: products.id,
                              Price: products.gia,
                              Title: products.tieude,
                            })
                          }
                        >
                          <FontAwesomeIcon
                            icon={faHeart}
                            className="text-success"
                          />
                        </button>
                        <button
                          className="btn btn-success rounded-0 col-3"
                          data-bs-toggle="modal"
                          data-bs-target="#myModal"
                        >
                          <FontAwesomeIcon icon={faBagShopping} />
                        </button>
                      </div>
                    </div>
                    {/* Thông báo khi tương tác với các nút bấm */}

                    {orderResult ? (
                      <div
                        className="text-center alert alert-warning"
                        role="alert"
                      >
                        {orderResult.data}
                      </div>
                    ) : null}
                    {addWishlistResult ? (
                      <div
                        className="text-center alert alert-warning"
                        role="alert"
                      >
                        {addWishlistResult}
                      </div>
                    ) : null}
                    {productActionResult ? (
                      <div
                        className="text-center alert alert-warning"
                        role="alert"
                      >
                        {productActionResult}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
              {/* Product Description */}
              <div className="p-3 bg-white border position-relative">
                <div
                  className={`transition-all overflow-hidden ${
                    expanded ? "" : ""
                  }`}
                  style={{ maxBlockSize: expanded ? "100%" : "300px" }}
                >
                  <div
                    className="productDescription"
                    dangerouslySetInnerHTML={{
                      __html: products.noidungchitiet,
                    }}
                  />
                </div>
                {!expanded && (
                  <div
                    className="bottom-0 position-absolute start-0 w-100"
                    style={{
                      blockSize: "60px",
                      background: "linear-gradient(to top, white, transparent)",
                    }}
                  />
                )}
              </div>

              {/* Toggle Description */}
              <div className="mt-3 text-center">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setExpanded((prev) => !prev)}
                >
                  {expanded ? "Ẩn bớt" : "Xem thêm"}
                </button>
              </div>
            </div>
          ))}
          <RelatedProduct id={id as string} />
        </div>
      ) : (
        <SpinAnimation />
      )}
    </div>
  );
}
