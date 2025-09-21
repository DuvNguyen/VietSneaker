/* tslint:disable */
/* eslint-disable */
import { AdminProductControllerService } from "@/gen/services/AdminProductControllerService";
import httpClient from "@/lib/http-client";
import { AxiosResponse } from "axios";

export class ProductService {
  /**
   * {@link AdminProductControllerService.createProduct} override to use
   * request header "Content-Type": "multipart/form-data" instead of 'application/json'
   * @param productId
   * @param formData
   * @returns any OK
   * @throws ApiError
   */
  public static uploadProductImage(
    productId: number,
    data: {
      /**
       * Image file to upload
       */
      file: Blob;
    },
  ): Promise<AxiosResponse<any, any>> {
    const formData = new FormData();
    formData.append("file", data.file);
    const url = `/admin/products/image/${productId}`;
    const response = httpClient.post(url, formData, {
      headers: {
        // Mandatory to upload image file
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  }
}
