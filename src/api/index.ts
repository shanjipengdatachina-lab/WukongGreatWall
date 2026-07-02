import axios from 'axios'
import { MessagePlugin } from 'tdesign-vue-next'
import type { ApiResponse } from '@/types'
import { useAuthStore } from '@/stores/auth'

const request = axios.create({
  baseURL: '/api/admin',
  timeout: 15000,
})

request.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

request.interceptors.response.use(
  (response) => {
    const res = response.data as ApiResponse
    if (res.code !== 0 && res.code !== 200) {
      MessagePlugin.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
      window.location.href = '/login'
    }
    MessagePlugin.error(error.message || '网络错误')
    return Promise.reject(error)
  }
)

export default request
