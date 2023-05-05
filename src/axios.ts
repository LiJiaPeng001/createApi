import axios from 'axios'
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { Result } from './types/index'

/**
 * @desc 功能点 支持取消以及重新发起请求
 */
export class VAxios {
  private axiosInstance: AxiosInstance
  private readonly options: AxiosRequestConfig
  constructor(options: AxiosRequestConfig) {
    this.options = options
    this.axiosInstance = axios.create(options)
  }

  request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request<any, AxiosResponse<Result>>(config)
        .then((res: AxiosResponse<Result>) => {
          resolve(res as unknown as Promise<T>)
        })
        .catch((e: Error | AxiosError) => {
          reject(e)
        })
    })
  }
}
