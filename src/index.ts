import { VAxios } from './axios'

function createApi() {
  return new VAxios({
    timeout: 1000 * 60,
    headers: {
      'Content-Type': 'application/json',
    },

  })
}

export default createApi()
