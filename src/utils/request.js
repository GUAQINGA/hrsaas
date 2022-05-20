import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'
import { getTimestamp } from '@/utils/auth'

const timeout = 3600

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    if (store.getters.token) {
      config.headers['Authorization'] = `Bearer ${store.getters.token}`
      if (checkTimeout()) {
        store.dispatch('user/logout')
        router.push('/login')
        return Promise.reject(new Error('登录超时，请重新登录'))
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  (response) => {
    const res = response.data
    // console.log(res)
    if (res.success) {
      return res.data
    } else {
      Message.error(res.message)
      return Promise.reject(new Error(res.message))
    }
  },
  (error) => {
    console.log('err' + error) // debug
    Message.error(error.message)
    return Promise.reject(error)
  }
)

function checkTimeout(param) {
  var currentTime = Date.now()
  var pastTime = getTimestamp()

  // console.log(currentTime)
  // console.log(pastTime)

  return (currentTime - pastTime) / 1000 > timeout
}

export default service
