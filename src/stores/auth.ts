import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi } from '@/api/auth'
import type { LoginParams, LoginResult } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const user = ref<LoginResult['user'] | null>(
    JSON.parse(localStorage.getItem('user') || 'null')
  )

  const isLoggedIn = computed(() => !!token.value)
  const userRole = computed(() => user.value?.role || '')
  const userName = computed(() => user.value?.username || user.value?.name || '')

  async function loginAction(params: LoginParams) {
    const data: any = await loginApi(params)
    token.value = data.token
    const u = data.user
    user.value = {
      id: u.id,
      name: u.profile?.real_name || u.username || u.name,
      username: u.username,
      email: u.email,
      role: u.role,
      scholarId: u.scholar_id,
      avatar: u.profile?.avatar,
      institution: u.profile?.institution?.name,
    }
    if (params.remember) {
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))
    }
    return data
  }

  function logout() {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return { token, user, isLoggedIn, userRole, userName, loginAction, logout }
})
