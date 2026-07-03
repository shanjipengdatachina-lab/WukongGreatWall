import request from './index'

export function getStudents(params: Record<string, any>) {
  return request.get<any>('/users', { params })
}

export function getStudent(id: number) {
  return request.get<any>(`/users/${id}`)
}

export function createStudent(data: any) {
  return request.post<any>('/users', data)
}

export function updateStudent(id: number, data: any) {
  return request.put<any>(`/users/${id}`, data)
}

export function disableStudent(id: number) {
  return request.put<any>(`/users/${id}`, { status: 'inactive' })
}

export function resetPassword(id: number, password?: string) {
  return request.post<any>(`/users/${id}/reset-password`, { password })
}
