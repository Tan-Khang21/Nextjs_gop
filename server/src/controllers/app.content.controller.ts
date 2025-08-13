import express, { response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import { payos } from "../server.ts";
dotenv.config();

// Types
type Request = express.Request;
type Response = express.Response;

// Router khởi tạo
const appContentRouter = express.Router();
// Env API
const serverApiUrl = process.env.SERVER_API;
const productApiUrl = process.env.PRODUCT_API;
const relatedProductUrl = process.env.RELATED_PRODUCT_API;
const newsApiUrl = process.env.NEWS_API;
const productDetailApiUrl = process.env.PRODUCT_DETAIL_API;
/* ========== ROUTER ========== */
appContentRouter.get("/get-product", async (req, res) => {
  await getProduct(req, res);
});
appContentRouter.get("/get-product-detail", async (req, res) => {
  await getProductDetail(req, res);
});
appContentRouter.get("/get-news-detail", async (req, res) => {
  await getNewsDetail(req, res);
});
appContentRouter.get("/get-page-categories", async (req, res) => {
  await getPageCategories(req, res);
});
appContentRouter.get("/get-content-header", async (req, res) => {
  await getContentHeader(req, res);
});
appContentRouter.get("/get-home-content", async (req, res) => {
  await getHomePageContent(req, res);
});
appContentRouter.get("/get-wrap-content", async (req, res) => {
  await getWrapContent(req, res);
});
appContentRouter.get("/get-news", async (req, res) => {
  await getNews(req, res);
});
appContentRouter.post("/oder", async (req, res) => {
  await oderFunction(req, res);
});
appContentRouter.get("/get-filter", async (req, res) => {
  await getFilter(req, res);
});
appContentRouter.get("/get-contact-form", async (req, res) => {
  await getContactPageContent(req, res);
});
appContentRouter.get("/search-content", async (req, res) => {
  await searchContent(req, res);
});
appContentRouter.get("/get-order", async (req, res) => {
  await getOrderApi(req, res);
});
appContentRouter.post("/save-cart", async (req, res) => {
  await addToCart(req, res);
});
appContentRouter.get("/get-cart", async (req, res) => {
  await getCart(req, res);
});
appContentRouter.put("/update-cart", async (req, res) => {
  await updateCartQuantity(req, res);
});
appContentRouter.put("/remove-cart", async (req, res) => {
  await removeCart(req, res);
});
/* ========== CONTROLLERS ========== */

const updateCartQuantity = async (req: Request, res: Response) => {
  try {
    const { email, product_id, quantity } = req.body;
    const api = await axios.post(`${serverApiUrl}/cart.update.quantity.php`, {
      email,
      product_id,
      quantity,
    });
    return res.status(200).json(api.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return res
        .status(500)
        .json({ mess: "Lỗi axios", error: `${error.toString()}` });
    }
    return res.status(500).json({ mess: `SERVER ERROR: ${error.toString()}` });
  }
};
// const getProduct = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.query;
//     const response = await axios.get(`${productApiUrl}?id=${id}`);
//     const product = response.data;
//     if (!product || product.length === 0) {
//       return res.status(400).json({ mess: "Không có sản phẩm" });
//     }
//     return res.status(200).json({ mess: "Product is defined", product });
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       return res
//         .status(500)
//         .json({ mess: "Lỗi axios", error: `${error.toString()}` });
//     }
//     return res.status(500).json({ mess: `SERVER ERROR: ${error.toString()}` });
//   }
// };

const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const response = await axios.get(`https://demochung.125.atoz.vn/ww2/module.Sanpham.trangchu.asp?id=35279`);
    const product = response.data;
    if (!product || product.length === 0) {
      return res.status(400).json({ mess: "Không có sản phẩm" });
    }
    return res.status(200).json({ mess: "Product is defined", product });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return res
        .status(500)
        .json({ mess: "Lỗi axios", error: `${error.toString()}` });
    }
    return res.status(500).json({ mess: `SERVER ERROR: ${error.toString()}` });
  }
};


const getProductDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const productRes = await axios.get(`${productDetailApiUrl}?id=${id}`);
    const related = await axios.get(`${relatedProductUrl}?id=${id}`);
    const productDetail = productRes.data;
    const relatedProduct = related.data[0];
    return res.status(200).json({
      mess: "Chi tiết sản phẩm và sản phẩm liên quan",
      product: productDetail,
      relatedProduct: relatedProduct,
    });
  } catch (error) {
    return res.status(500).json({ mess: `SERVER ERROR: ${error.toString()}` });
  }
};

const getPageCategories = async (_req: Request, res: Response) => {
  try {
    const response = await axios.get(`${serverApiUrl}/web.vitritop.php`);
    const data = response.data[0].data;
    return res.status(200).json({ mess: "Menu top page", menu: data });
  } catch (error) {
    return res.status(500).json({ mess: `SERVER: ${error.toString()}` });
  }
};

const getContentHeader = async (_req: Request, res: Response) => {
  try {
    const response = await axios.get(
      `https://choixanh.com.vn/ww2/app.menu.top.asp`
    );
    const response2 = await axios.get(
      `https://choixanh.com.vn/ww2/web.banner.asp`
    );
    const data_header = response2.data[0];
    return res.status(200).json({
      mess: "header content",
      header_content: { menu: response.data, content: data_header },
    });
  } catch (error) {
    return res.status(500).json({ mess: `SERVER: ${error.toString()}` });
  }
};

const getHomePageContent = async (_req: Request, res: Response) => {
  try {
    const response = await axios.get(`${serverApiUrl}/web.danhmuctrangchu.php`);
    const data = response.data[0].data;
    return res.status(200).json({ mess: "Home page content", content: data });
  } catch (error) {
    return res.status(500).json({ mess: `SERVER: ${error.toString()}` });
  }
};

const getWrapContent = async (_req: Request, res: Response) => {
  try {
    const leftRes = await axios.get(`${serverApiUrl}/web.vitritrai.php`);
    const rightRes = await axios.get(`${serverApiUrl}/web.vitriphai.php`);
    const leftData: [
      {
        recordsTotal: number;
        data: Array<{
          id: string;
          tieude: string;
          hinhdaidien: string;
          url: any;
        }>;
      }
    ] = leftRes.data;
    const rightData: [
      {
        recordsTotal: number;
        data: Array<{
          id: string;
          tieude: string;
          hinhdaidien: string;
          url: any;
        }>;
      }
    ] = rightRes.data;
    //left
    const leftapi = leftData[0].data;
    //right
    const rightapi = rightData[0].data;
    return res
      .status(200)
      .json({ mess: "Wrap content", content: { leftapi, rightapi } });
  } catch (error) {
    return res.status(500).json({ mess: `SERVER: ${error.toString()}` });
  }
};

const addToCart = async (req: Request, res: Response) => {
  try {
    const { img, product_id, product_name, price, email, quantity } = req.body;
    const response = await axios.post(`${serverApiUrl}/add.cart.php`, {
      product_id,
      email,
      quantity,
    });
    return res
      .status(200)
      .json({ mess: "Thao tác thêm vào giỏ hàng", result: response.data });
  } catch (error) {
    return res.status(500).json({ mess: `SERVER ERROR: ${error.toString()}` });
  }
};
const removeCart = async (req: Request, res: Response) => {
  try {
    const { product_id, email } = req.body;
    const response = await axios.post(`${serverApiUrl}/remove.cart.php`, {
      product_id,
      email,
    });
    return res
      .status(200)
      .json({ mess: response.data.message, result: response.data.success });
  } catch (error) {
    return res.status(500).json({ mess: `SERVER ERROR: ${error.toString()}` });
  }
};

const getNews = async (req: Request, res: Response) => {
  try {
    const { id, sl, page } = req.query;
    const response = await axios.get(
      `${newsApiUrl}?id=${id}&sl=${sl}&pageid=${page}`
    );
    return res.status(200).json({ mess: "Found!", news: response.data });
  } catch (error) {
    return res.status(500).json({ mess: `SERVER ERROR: ${error.toString()}` });
  }
};
const getNewsDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const newsDetail = await axios.get(
      `${serverApiUrl}/module.tintuc.chitiet.php?id=${id}`
    );
    const newsRelated = await axios.get(
      `${serverApiUrl}/module.tintuc.chitiet.lienquan.php?id=${id}`
    );

    const newsData = newsDetail.data;
    const newsRelatedData = newsRelated.data[0];
    return res.status(200).json({
      mess: "Tin tức chi tiết và tin tức liên quan",
      newsDetail: newsData,
      newsRelated: newsRelatedData,
    });
  } catch (error) {
    return res.status(500).json({ mess: `SERVER ERROR: ${error.toString()}` });
  }
};
const getCart = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;
    const response = await axios.post(`${serverApiUrl}/get.cart.php`, {
      email,
    });
    const db = response.data;
    return res.status(200).json({ mess: "Lấy giỏ hàng", data: db.data });
  } catch (error) {
    return res.status(500).json({ mess: `SERVER ERROR: ${error.toString()}` });
  }
};
//order
interface OrderRequestType {
  customer_name: string;
  tel: string;
  address: string;
  product_price: number;
  note: string;
  pay_method: string;
  email: string;
  total_price: number;
  items: [{ idpart: number; price: number; quantity: number }];
}
const oderFunction = async (req: Request, res: Response) => {
  try {
    const {
      customer_name,
      tel,
      address,
      email,
      pay_method,
      note,
      total_price,
      items,
    }: OrderRequestType = req.body;

    // Tạo link thanh toán QR
    if (pay_method === "banking") {
      const response = await axios.post(`${serverApiUrl}/add.order.php`, {
        customer_name,
        tel,
        address,
        note:note,
        statusOrder: 1,
        email,
        total_price,
        items,
      });
      const status = response.data.status;
      const order_id = response.data.order_id;
      const randomCode = Date.now() + Math.floor(Math.random() * 1);
      const link = await payos.createPaymentLink({
        orderCode: randomCode,
        amount: total_price,
        buyerName: customer_name,
        buyerAddress: address,
        buyerEmail: email,
        buyerPhone: tel,
        cancelUrl: "http://localhost:3000",
        returnUrl: "http://localhost:3000",
        signature: customer_name,
        description: `ODR-${randomCode}`,
        expiredAt: Math.floor(Date.now() / 1000) + 15 * 60,
      });
      return res.status(200).json({
        success: status,
        mess: "Đặt hàng thành công vui lòng thanh toán",
        link,
        order_id,
      });
    }

    //thanh toán khi nhận hàng
    const response = await axios.post(`${serverApiUrl}/add.order.php`, {
      customer_name,
      tel,
      address,
      note,
      email,
      total_price,
      items,
    });
    const status = response.data.status;
    const order_id = response.data.order_id;
    return res.status(200).json({
      success: status,
      mess: "Đặt hàng thành công! thanh toán khi nhận hàng",
      order_id,
    });
  } catch (error) {
    return res.status(500).json({ mess: `SERVER ERROR: ${error}` });
  }
};

//interface get order
export interface Order {
  id: string;
  customer_name: string;
  email: string;
  tel: string;
  address: string;
  status: string;
  note: any;
  total_price: string;
  date: string;
  items: Item[];
}

export interface Item {
  id: string;
  quantity: string;
  price: string;
  name: string;
  image: string;
}

const getOrderApi = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;
    const response = await axios.post(`${serverApiUrl}/order.history.php`, {
      email,
    });
    const api: Order[] = response.data.orders;
    return res
      .status(200)
      .json({ mess: "Lấy thành công lịch sử đơn hàng", orders: api });
  } catch (error) {
    return res.status(500).json({ mess: `SERVER ERROR: ${error}` });
  }
};
const getFilter = async (_req: Request, res: Response) => {
  try {
    const filterMaster = await axios.get(
      `https://choixanh.com.vn/ww2/crm.boloc.master.asp`
    );
    const details = await Promise.all(
      filterMaster.data.map((item: any) =>
        axios.get(`https://choixanh.com.vn/ww2/crm.boloc.chitiet?id=${item.id}`)
      )
    );
    const all = details.flatMap((detail) => detail.data);
    if (all.length === 0) {
      return res.status(404).json({ mess: "Không tìm thấy filter" });
    }
    return res.status(200).json({ mess: "Filter OK", filter: all });
  } catch (error) {
    return res.status(500).json({ mess: `SERVER ERROR: ${error.toString()}` });
  }
};
const getContactPageContent = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const response = await axios.get(
      `https://choixanh.com.vn/ww2/module.Lienhe.asp?id=${id}`
    );
    return res.status(200).json({ mess: "Liên hệ", contact: response.data });
  } catch (error) {
    return res.status(500).json({ mess: `SERVER ERROR: ${error.toString()}` });
  }
};
const searchContent = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    const searching = await axios.get(
      `${serverApiUrl}/search.sanpham.php?query=${query}`
    );
    const response = searching.data;
    return res.status(200).json({ mess: "tìm kiếm", data: response.data });
  } catch (error) {
    return res.status(500).json({ mess: `SERVER ERROR: ${error.toString()}` });
  }
};
/* ========== EXPORT ========== */
export default appContentRouter;
