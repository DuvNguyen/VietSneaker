import httpClient from "@/lib/http-client";

export default class OrderService {
  static async getOrderHistory() {
    const resp = await httpClient.get("/user/order/history");
    return resp.data; // danh sách history
  }
}
