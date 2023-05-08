import axios from 'axios'
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import type { ConditionConfig, CreateApiOption, Result } from './types/index'
import { AxiosCanceler } from './axiosCancel'

export class VAxios {
  private axiosInstance: AxiosInstance
  public options: CreateApiOption

  constructor(options: CreateApiOption) {
    this.options = options
    this.axiosInstance = axios.create(options.createOptions)
    this.setupInterceptors()
  }

  /**
   * @desc 拦截器配置
   */
  private setupInterceptors() {
    const axiosCanceler = new AxiosCanceler()

    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (this.options.beforeRequest) {
          config
            = this.options.beforeRequest<InternalAxiosRequestConfig>(config)
        }
        axiosCanceler.addPending(config)
        return config
      },
      undefined,
    )
    this.axiosInstance.interceptors.response.use((res: AxiosResponse<any>) => {
      // 设置取消请求
      res && axiosCanceler.removePending(res.config)
      if (this.options.afterResponse)
        res = this.options.afterResponse<AxiosResponse<any>>(res)
      return res
    }, undefined)
  }

  /**
   * 发送请求
   * @param config 请求配置
   * @returns Promise<AxiosResponse<T>>
   */
  async request<T = any>(
    config: AxiosRequestConfig,
    condition?: ConditionConfig,
  ): Promise<T> {
    const { shouldLoading } = condition as ConditionConfig
    const { loading, toast, retryCount, retryDelay } = this.options
    let retry = 0

    const sendRequest = async (): Promise<T> => {
      try {
        if (shouldLoading)
          loading.show()

        const res = await this.axiosInstance.request<
          any,
          AxiosResponse<Result>
        >(config)
        if (shouldLoading)
          loading.hide()
        return res as unknown as Promise<T>
      }
      catch (error) {
        toast(error)
        if (axios.isCancel(error)) {
          console.error('Request canceled:', error.message)
          throw error
        }

        if (retry < retryCount) {
          retry++
          await new Promise(resolve => setTimeout(resolve, retryDelay))
          return sendRequest()
        }

        throw error
      }
    }

    return sendRequest()
  }

  get<T = any>(
    config: AxiosRequestConfig,
    options?: ConditionConfig,
  ): Promise<T> {
    return this.request({ ...config, method: 'GET' }, options)
  }

  post<T = any>(
    config: AxiosRequestConfig,
    options?: ConditionConfig,
  ): Promise<T> {
    return this.request({ ...config, method: 'POST' }, options)
  }

  put<T = any>(
    config: AxiosRequestConfig,
    options?: ConditionConfig,
  ): Promise<T> {
    return this.request({ ...config, method: 'PUT' }, options)
  }

  delete<T = any>(
    config: AxiosRequestConfig,
    options?: ConditionConfig,
  ): Promise<T> {
    return this.request({ ...config, method: 'DELETE' }, options)
  }
}
