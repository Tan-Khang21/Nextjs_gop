import express from "express";
import axios from "axios";
import { payos } from "../server.ts";
// import axios from "axios";
type Request = express.Request;
type Response = express.Response;
const paymentRoutes = express.Router();

paymentRoutes.post("/receive-hook", async (req, res) => {
  await webHook(req, res);
});
paymentRoutes.post("/cancel-payment", async (req, res) => {
  await cancelPayment(req, res);
});

const webHook = async (req: Request, res: Response) => {
  try {
    const { checkIP } = req.body;

    const response = await axios.post(
      `https://pay.payos.vn/api/web/${checkIP}/check-status/`
    );
    const result = response.data;
    return res.status(200).json({
      mess: `Kiểm tra trạng thái đơn hàng`,
      result: result.data.status,
    });
  } catch (error) {
    return res.status(500).json({
      mess: `SERVER ERROR::${error}`,
    });
  }
};
const cancelPayment = async (req: Request, res: Response) => {
  try {
    const { orderCode, order_id, email } = req.body;

    const response = await axios.post(
      "http://localhost:8000/api/cancel.order.php",
      {
        IDBG: order_id,
        email,
      }
    );
    const state = await payos.cancelPaymentLink(orderCode);
    const data = response.data.message;
    const result = state.status;
    return res
      .status(200)
      .json({ mess: "Hủy thanh toán", result: data, status: result });
  } catch (error) {
    return res.status(500).json({
      mess: `SERVER ERROR::${error}`,
    });
  }
};

export default paymentRoutes;
