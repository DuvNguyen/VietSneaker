import httpClient from "@/lib/http-client";

export default class RecommandService {
  static async getRecommend(history: any[]) {
    const resp = await httpClient.post("/recommend", {
      history: history,
    });

    return resp.data; // [{productId, reason}]
  }
}
