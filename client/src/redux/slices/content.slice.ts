import { initialState } from "@/types/content.page.type";
import { createSlice } from "@reduxjs/toolkit";

import {
  getNavbar,
  getCart,
  getContactPageContent,
  getNews,
  getProduct,
  getProductDetail,
  getWebContent,
  getWishList,
  oderFunction,
  saveCart,
  getContentHeader,
  getNewsDetail,
  searchContentByKeyword,
  checkPaymentApi,
  getOder,
  getHomeContentApi,
} from "../api/reduxContentApi";

// ------------------------ Slice ------------------------
const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //lấy navbar
      .addCase(getHomeContentApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(getHomeContentApi.fulfilled, (state, action) => {
        state.loading = false;
        state.homeContent = action.payload;
      })
      .addCase(getHomeContentApi.rejected, (state) => {
        state.loading = false;
        state.error = "Error fetch navbar";
      })
      .addCase(getNavbar.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNavbar.fulfilled, (state, action) => {
        state.loading = false;
        state.navbar = action.payload;
      })
      .addCase(getNavbar.rejected, (state) => {
        state.loading = false;
        state.error = "Error fetch navbar";
      })
      // Lấy tất cả sản phẩm
      .addCase(getProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        const { id, data } = action.payload;
        state.products[id] = data;
        state.loading = false;
        state.error = null;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      //lấy sản phẩm chi tiết
      .addCase(getProductDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductDetail.fulfilled, (state, action) => {
        state.productDetail = action.payload.product;
        state.productRelated = action.payload.related;
        state.loading = false;
      })
      .addCase(getProductDetail.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      //laays tin tuc;
      .addCase(getNews.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNews.fulfilled, (state, action) => {
        state.loading = false;
        const { id, data } = action.payload;
        state.news[id] = data;
      })
      .addCase(getNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //lấy tin tức chi tiết
      .addCase(getNewsDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNewsDetail.fulfilled, (state, action) => {
        state.newsDetail = action.payload.newsDetail;
        state.newsRelated = action.payload.related;
        state.loading = false;
      })
      .addCase(getNewsDetail.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      //save cart
      .addCase(saveCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveCart.fulfilled, (state, action) => {
        state.loading = false;
        state.productActionResult = action.payload;
      })
      .addCase(saveCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //save wishlist

      //get cart
      .addCase(getCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //get wish-list
      .addCase(getWishList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getWishList.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
      })
      .addCase(getWishList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //order
      .addCase(oderFunction.pending, (state) => {
        state.loading = true;
      })
      .addCase(oderFunction.fulfilled, (state, action) => {
        state.orderResult = action.payload;
        state.loading = false;
      })
      .addCase(oderFunction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //lấy nội dung trái phải
      /*.addCase(getHomeContentApi.pending, (state) => {
        state.loading = true;
      })*/
      
      .addCase(getWebContent.fulfilled, (state, action) => {
        state.loading = false;
        state.leftContent = action.payload.leftContent;
        state.rightContent = action.payload.rightContent;
      })
      .addCase(getWebContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //
      .addCase(getContactPageContent.pending, (state) => {
        state.loading = true;
      })
      .addCase(getContactPageContent.fulfilled, (state, action) => {
        state.loading = false;
        state.contact = action.payload;
      })
      .addCase(getContactPageContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //get header  content
      .addCase(getContentHeader.pending, (state) => {
        state.loading = true;
      })
      .addCase(getContentHeader.fulfilled, (state, action) => {
        state.loading = false;
        state.headerContent = action.payload.content;
        state.headerMenu = action.payload.menu;
      })
      .addCase(getContentHeader.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(searchContentByKeyword.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchContentByKeyword.fulfilled, (state, action) => {
        state.loading = false;
        state.searchedContent = action.payload;
      })
      .addCase(searchContentByKeyword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(checkPaymentApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkPaymentApi.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentResult = action.payload;
      })
      .addCase(checkPaymentApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getOder.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderapi = action.payload;
      })
      .addCase(getOder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export default contentSlice.reducer;
