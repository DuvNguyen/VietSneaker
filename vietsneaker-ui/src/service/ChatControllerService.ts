import { OpenAPI } from "../gen/core/OpenAPI";
import { request as __request } from "../gen/core/request";
import type { CancelablePromise } from "../gen/core/CancelablePromise";
import type { ChatRequest } from "../model/ChatRequest";


export class ChatControllerService {
    public static chat(body: ChatRequest): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: "POST",
            url: "/chat",
            body,
            mediaType: "application/json",
        });
    }


    public static health(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: "GET",
            url: "/chat/health",
        });
    }
}
