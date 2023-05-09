import { VAxios } from './axios'

function createApi() {
  return new VAxios({
    createOptions: {
      timeout: 1000 * 60,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  })
}

export default createApi()
