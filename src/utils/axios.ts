import axios, { AxiosResponse, Method } from 'axios';
import config from 'config';

const apiBaseUrl = config.get<string>('defaultEntity.clientServerBaseUrl');

interface ApiResponse {
  success: boolean;
  message: string;
  data: any;
}

interface ErrorResponse {
  message: string;
  code?: string;
  details?: any;
}

function handleError(error: any): ErrorResponse {
  let errorResponse: ErrorResponse;

  if (axios.isAxiosError(error)) {
    errorResponse = {
      message: `Axios error (${error.code}): ${error.message}`,
      code: error.code,
      details: error.response?.data || null,
    };
  } else if (error instanceof Error) {
    errorResponse = {
      message: `Unexpected error: ${error.message}`,
    };
  } else {
    errorResponse = {
      message: 'Unknown error occurred',
    };
  }
  return errorResponse;
}

// Common request function to handle multiple methods (POST, PUT, DELETE, GET)
async function axiosRequest(
  method: Method,
  endpoint: string,
  authToken: string,
  requestData?: any, // Optional because GET requests may not need a request body
): Promise<ApiResponse | ErrorResponse> {
  const requestUrl = `${apiBaseUrl}${endpoint}`;
  try {
    const response: AxiosResponse<ApiResponse> = await axios({
      method,
      url: requestUrl,
      data: requestData, // Only used for methods like POST/PUT
      headers: {
        Authorization: authToken, // Add authorization header
      },
      timeout: 10000, // Timeout set to 10 seconds
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export { axiosRequest };
