import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { injectable } from 'inversify';
import config from 'config';

@injectable()
class HttpIntegrationConnector {
  private createAxiosInstance(
    baseURL: string,
    timeout: number = config.get<number>('timeoutAxios'),
  ): AxiosInstance {
    return axios.create({
      baseURL,
      timeout,
    });
  }

  public async get<T>(
    baseURL: string,
    url: string,
    reqConfig?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    const axiosInstance = this.createAxiosInstance(baseURL);
    return axiosInstance.get<T>(url, reqConfig);
  }

  public async post<T>(
    baseURL: string,
    url: string,
    data?: any,
    reqConfig?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    const axiosInstance = this.createAxiosInstance(baseURL);
    return axiosInstance.post<T>(url, data, reqConfig);
  }

  public async put<T>(
    baseURL: string,
    url: string,
    data?: any,
    reqConfig?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    const axiosInstance = this.createAxiosInstance(baseURL);
    return axiosInstance.put<T>(url, data, reqConfig);
  }

  public async delete<T>(
    baseURL: string,
    url: string,
    reqConfig?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    const axiosInstance = this.createAxiosInstance(baseURL);
    return axiosInstance.delete<T>(url, reqConfig);
  }
}

export default HttpIntegrationConnector;
