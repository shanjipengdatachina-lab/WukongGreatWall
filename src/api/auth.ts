import request from './index'
import type { LoginParams, LoginResult } from '@/types'

export function login(data: LoginParams) {
  return request.post<LoginResult>('/auth/login', {
    username: data.account,
    password: data.password,
  })
}
