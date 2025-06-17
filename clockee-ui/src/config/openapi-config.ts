import { OpenAPI } from "@/gen";
import { API_BASE } from "./app-config";

// Override axios global variable config
OpenAPI.WITH_CREDENTIALS = true;
OpenAPI.BASE = API_BASE;
