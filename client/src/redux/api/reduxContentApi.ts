// ------------------------ API & Type Imports ------------------------
import {
  getApiContentHeader,
  getContactPageContentApi,
  getContent,
  getNewsApi,
  getNewsDetailApi,
  getPageCategories,
  getProductAPI,
  getProductDetailApi,
  getCartFormApi,
  oderAction,
  ProductActionAddToCart,
  searchContent,
  getWishListFormSession,
  checkPayment,
  Order,
  getOderFunction,
  getHomeContent,
} from "@/api/contentApi";
import {
  Cart,
  CheckoutPayload,
  ContactApi,
  Content,
  ContentApi,
  ContentHeader,
  MenuHeader,
  News,
  NewsDetail,
  NewsRelatedType,
  PageCategories,
  ProductDetail,
  ProductRelated,
  NewApiResponse,
  SearchedContentState,
} from "@/types/content.page.type";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ------------------------ NAVBAR / CONTENT ------------------------

export const getHomeContentApi = createAsyncThunk<
  Content[],
  void,
  { rejectValue: string }
>("home-content", async (_, thunkAPI) => {
  try {
    const content = await getHomeContent() as Content[];
    return content;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue("Lỗi axios ở client");
    }
    return thunkAPI.rejectWithValue("SERVER error");
  }
});
// Lấy menu navbar (menu chính của website)
export const getNavbar = createAsyncThunk<
  PageCategories[],
  void,
  { rejectValue: string }
>("get-navbar", async (_, thunkAPI) => {
  try {
    const data = await getPageCategories();
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue("Lỗi axios ở client");
    }
    return thunkAPI.rejectWithValue("SERVER error");
  }
});

// Lấy nội dung bên trái / phải website
export const getWebContent = createAsyncThunk<
  { leftContent: ContentApi[]; rightContent: ContentApi[] },
  void,
  { rejectValue: string }
>("getwebcontent", async (_, thunkAPI) => {
  try {
    const content = await getContent();
    return {
      leftContent: content.leftapi,
      rightContent: content.rightapi,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue("Không thể lấy nội dung");
    }
    return thunkAPI.rejectWithValue("Lỗi không xác định!");
  }
});

// ------------------------ PRODUCT ------------------------

// Lấy danh sách sản phẩm theo category
export const getProduct = createAsyncThunk<
  { id: string; data: NewApiResponse[] },
  { id: string },
  { rejectValue: string }
>("content/get-product", async ({ id }, thunkAPI) => {
  try {
    const res = await getProductAPI({ id: id });
    return { id, data: res?.product };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue("Không thể lấy danh sách sản phẩm");
    }
    return thunkAPI.rejectWithValue("Lỗi không xác định!");
  }
});

// Lấy chi tiết sản phẩm
export const getProductDetail = createAsyncThunk<
  { product: ProductDetail[]; related: ProductRelated },
  { id: number },
  { rejectValue: string }
>("content/get-product-detail", async ({ id }, thunkAPI) => {
  try {
    const payload = await getProductDetailApi({ id: id });
    return { product: payload.product, related: payload.related };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(`Axios Error::${error}`);
    }
    return thunkAPI.rejectWithValue(`Server Error`);
  }
});

// ------------------------ NEWS ------------------------

// Lấy danh sách tin tức
/*export const getNews = createAsyncThunk<
  { id: string; data: News[] },
  { id: string; sl: 30; page: number },
  { rejectValue: string }
>("content/get-news", async ({ id, sl, page }, thunkAPI) => {
  try {
    const payload = await getNewsApi({ id: id, page: page, sl: sl });
    return { id: payload.id, data: payload.news };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue("Không thể lấy danh sách sản phẩm");
    }
    return thunkAPI.rejectWithValue("Lỗi không xác định!");
  }
});*/

export const getNews = createAsyncThunk<
  { id: string; data: News[] },
  { id: string; sl: number; page: number },
  { rejectValue: string }
>(
  "content/get-news",
  async ({ id, sl, page }, thunkAPI) => {
    try {
      // Chỉ fetch ở client
      if (typeof window === "undefined") {
        return thunkAPI.rejectWithValue("Do not fetch on server!");
      }
      const response = await axios.get('/api/proxyNews', {
        params: { id, sl, page }
      });
      const newsList: News[] = Array.isArray(response.data)
        ? (response.data[0]?.data || [])
        : (response.data?.news || []);
      return { id, data: newsList };
    } catch (error) {
      return thunkAPI.rejectWithValue("Lỗi khi lấy danh sách tin tức");
    }
  }
);

// Lấy chi tiết tin tucws
export const getNewsDetail = createAsyncThunk<
  { newsDetail: NewsDetail; related: NewsRelatedType },
  { id: string },
  { rejectValue: string }
>("content/get-news-detail", async ({ id }, thunkAPI) => {
  try {
    const payload = await getNewsDetailApi({ id: id });
    return { newsDetail: payload.newsDetail, related: payload.newsRelated };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(`Axios Error::${error}`);
    }
    return thunkAPI.rejectWithValue(`Server Error`);
  }
});

export const searchContentByKeyword = createAsyncThunk<
  SearchedContentState[],
  { key: string },
  { rejectValue: string }
>("search-content", async ({ key }, thunkAPI) => {
  try {
    const payload = await searchContent(key);
    return payload;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(`Axios Error::${error}`);
    }
    return thunkAPI.rejectWithValue(`Server Error`);
  }
});
// ------------------------ CART / WISHLIST ------------------------

// Thêm sản phẩm vào giỏ hàng
export const saveCart = createAsyncThunk<
  string,
  {
    img: string;
    product_id: string;
    product_name: string;
    price: string;
    email: string;
    quantity: number;
  },
  { rejectValue: string }
>(
  "cart/save",
  async (
    { img, product_id, product_name, price, email, quantity },
    thunkAPI
  ) => {
    try {
      const result = await ProductActionAddToCart({
        img,
        product_id,
        product_name,
        price,
        email,
        quantity,
      });
      return result;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue("Lỗi post client ");
      }
      return thunkAPI.rejectWithValue("SERVER error");
    }
  }
);

// Thêm sản phẩm vào danh sách yêu thích

// Lấy giỏ hàng
export const getCart = createAsyncThunk<
  Cart,
  { email: string },
  { rejectValue: string }
>("cart/get-cart", async ({ email }, thunkAPI) => {
  try {
    const result = await getCartFormApi({
      email: email ?? "",
    });
    return result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue("Lỗi post client ");
    }
    return thunkAPI.rejectWithValue("SERVER error");
  }
});

// Lấy danh sách yêu thích
export const getWishList = createAsyncThunk<
  {
    ProductID: string;
    Image: string;
    Price: number;
    Title: string;
  }[],
  void,
  { rejectValue: string }
>("cart/get-wishlist", async (_, thunkAPI) => {
  try {
    const result = await getWishListFormSession();
    return result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue("Lỗi post client ");
    }
    return thunkAPI.rejectWithValue("SERVER error");
  }
});

// ------------------------ ORDER ------------------------
export const getOder = createAsyncThunk<
  Order[],
  { email: string },
  { rejectValue: string }
>("get-oder", async ({ email }, thunkAPI) => {
  try {
    const res = await getOderFunction({ email });
    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue("Lỗi post client ");
    }
    return thunkAPI.rejectWithValue("SERVER error");
  }
});
export const oderFunction = createAsyncThunk<
  { data: string; link: CheckoutPayload; order_id: string },
  {
    customer_name: string | false | undefined;
    tel: string | undefined | false;
    email: string;
    product_price: number;
    address: string | false | undefined;
    note: string;
    pay_method: string;
    total_price: number;
    items: { idpart: number; quantity: number; price: number }[];
  },
  { rejectValue: string }
>(
  "product/order",
  async (
    {
      customer_name,
      tel,
      email,
      address,
      note,
      product_price,
      total_price,
      items,
      pay_method,
    },
    thunkAPI
  ) => {
    try {
      const result = await oderAction({
        customer_name,
        tel,
        email,
        product_price,
        address,
        note,
        total_price,
        items,
        pay_method,
      });
      return result;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue("Lỗi post client ");
      }
      return thunkAPI.rejectWithValue("SERVER error");
    }
  }
);

export const checkPaymentApi = createAsyncThunk<
  string,
  { paymentLinkId: string },
  { rejectValue: string }
>("checkout", async ({ paymentLinkId }, thunkAPI) => {
  try {
    const res = await checkPayment(paymentLinkId);
    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue("Lỗi post client ");
    }
    return thunkAPI.rejectWithValue("SERVER error");
  }
});
//Lấy nội dung header
export const getContentHeader = createAsyncThunk<
  {
    menu: MenuHeader[];
    content: ContentHeader;
  },
  void,
  { rejectValue: string }
>("get-content-header", async (_, thunkAPI) => {
  try {
    const res = await getApiContentHeader();
    return {
      menu: res.menu,
      content: res.content,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue("Lỗi post client ");
    }
    return thunkAPI.rejectWithValue("SERVER error");
  }
});
//------------------------ CONTACT ------------------------
export const getContactPageContent = createAsyncThunk<
  ContactApi[],
  { id: string },
  { rejectValue: string }
>("get/contact", async ({ id }, thunkAPI) => {
  try {
    const payload = await getContactPageContentApi({ id: id });
    return payload;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue("Lỗi post client ");
    }
    return thunkAPI.rejectWithValue("SERVER error");
  }
});
