import request from './index'

export function getStudentDashboard() {
  return request.get('/dashboard/overview')
}

export function getMyCourses() {
  return request.get<any[]>('/student/courses')
}

export function getMyAssignments() {
  return request.get<any[]>('/student/assignments')
}

export function getMySubmissions() {
  return request.get<any[]>('/student/submissions')
}

export function submitAssignment(data: any) {
  return request.post('/submissions', data)
}

export function getMyTopics() {
  return request.get<any[]>('/student/topics')
}

export function getTopicDetail(id: number) {
  return request.get(`/student/topics/${id}`)
}

export function getMyTasks() {
  return request.get<any[]>('/student/tasks')
}

export function updateTask(id: number, data: any) {
  return request.put(`/student/tasks/${id}`, data)
}

export function getGameOverview() {
  return request.get('/student/game/overview')
}

export function gameCheckin() {
  return request.post('/student/game/checkin')
}

export function getXPLog() {
  return request.get<any[]>('/student/game/xp-log')
}

export function getAchievements() {
  return request.get<any[]>('/student/game/achievements')
}

export function getLeaderboard(type?: string) {
  return request.get<any[]>('/student/game/leaderboard', { params: { type } })
}

export function getCalendarData() {
  return request.get<any[]>('/student/game/calendar')
}

export function getTEDProfile() {
  return request.get('/student/ted-profile')
}

export function updateTEDProfile(data: any) {
  return request.put('/student/ted-profile', data)
}

export function publishTEDProfile() {
  return request.post('/student/ted-profile/publish')
}

export function getScholarProfile(scholarId: string) {
  return request.get(`/scholar/${scholarId}`)
}
