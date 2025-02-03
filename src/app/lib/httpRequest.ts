import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type HttpHeaders = Record<string, string>;

interface HttpRequestOptions {
  method?: HttpMethod;
  headers?: HttpHeaders;
  body?: any;
  queryParams?: Record<string, string | number>;
  timeout?: number;
}

interface HttpResponse<T = any> {
  data: T;
  status: number;
  headers: Record<string, any>;
}

const httpRequest = async <T = any>(
  url: string,
  options: HttpRequestOptions = {}
): Promise<HttpResponse<T>> => {
  const {
    method = "GET",
    headers = { "Content-Type": "application/json" },
    body,
    queryParams,
    timeout,
  } = options;

  const config: AxiosRequestConfig = {
    url,
    method,
    headers,
    params: queryParams,
    data: body,
    timeout,
  };

  try {
    const response: AxiosResponse<T> = await axios(config);
    return {
      data: response.data,
      status: response.status,
      headers: response.headers,
    };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.message || "Axios error occurred");
    }
    throw error;
  }
};

export default httpRequest;
