/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateOrderStatusRequest = {
  status?: UpdateOrderStatusRequest.status;
};
export namespace UpdateOrderStatusRequest {
  export enum status {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    SHIPPED = "SHIPPED",
    RETURNING = "RETURNING",
    RETURNED = "RETURNED",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED",
  }
}
