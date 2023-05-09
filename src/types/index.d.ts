import type { AxiosRequestConfig } from 'axios'

export interface Result<T = any> {
  code: number
  type: 'success' | 'error' | 'warning'
  message: string
  result: T
}

export interface CreateApiOption {
  createOptions: AxiosRequestConfig // axios默认配置
  beforeRequest?: <T>(config: T) => T // 拦截器配置
  afterResponse?: <T>(config: T) => T // response处理
  loading?: any // loading
  toast?: any // toast
}
export interface ConditionConfig {
  retryCount?: number // 重新请求数量
  retryDelay?: number // 请求延时
  shouldLogin?: boolean
  shouldToast?: boolean
  shouldLoading?: boolean
  shouldStatus?: boolean
}
