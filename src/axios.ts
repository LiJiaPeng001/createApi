import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelTokenSource, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'

let source: CancelTokenSource | undefined

export class VAxios {
  private axiosInstance: AxiosInstance
  public retryCount: number
  public readonly retryDelay: number

  constructor(options: AxiosRequestConfig) {
    this.axiosInstance = axios.create(options)
    this.retryCount = 2
    this.retryDelay = 100
    this.setupInterceptors()
  }

  /**
   * @desc 拦截器配置
   */
  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      // !ignoreCancelToken && axiosCanceler.addPending(config)
      // 设置token
      return config
    }, undefined)
    this.axiosInstance.interceptors.response.use((res: AxiosResponse<any>) => {
      // 设置取消请求
      // res && axiosCanceler.removePending(res.config)
      return res
    }, undefined)
  }

  /**
   * 发送请求
   * @param config 请求配置
   * @returns Promise<AxiosResponse<T>>
   */
  async request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    let retry = 0

    const sendRequest = async (): Promise<AxiosResponse<T>> => {
      try {
        source = axios.CancelToken.source()
        config.cancelToken = source.token

        const response = await this.axiosInstance.request<T>(config)

        return response
      }
      catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message)
          throw error
        }

        if (retry < this.retryCount) {
          retry++
          await new Promise(resolve => setTimeout(resolve, this.retryDelay))
          return sendRequest()
        }

        throw error
      }
    }

    return sendRequest()
  }

  /**
   * 取消请求
   * @param message 取消原因
   */
  cancelRequest(message?: string): void {
    if (source)
      source.cancel(message)
  }
}
