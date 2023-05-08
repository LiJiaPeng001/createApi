import type { AxiosRequestConfig } from 'axios'
export interface Result<T = any>
{
  code: number;
  type: 'success' | 'error' | 'warning';
  message: string;
  result: T;
}

export interface CreateApiOption {
  retryCount: number; // 重新请求数量
  retryDelay: number; // 请求延时
  createOptions: AxiosRequestConfig; // axios默认配置
  beforeRequest?: <T>(config: T) => T;
  afterResponse?:<T>(config:T) => T
  loading?: any; // loading
  toast?: any; // toast
}

export interface ConditionConfig {
  shouldLogin?: boolean;
  shouldToast?: boolean;
  shouldLoading?: boolean;
  shouldStatus?: boolean;
}