import { VAxios } from './axios'

function createApi() {
  return new VAxios({
    retryCount: 2,
    retryDelay: 100,
    createOptions: {
      timeout: 1000 * 60,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  })
}

export default createApi()
