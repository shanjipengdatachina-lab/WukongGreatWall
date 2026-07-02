import type { DashboardOverview, DashboardTrend } from './types'

export function mockDashboardOverview(): DashboardOverview {
  return {
    studentCount: 29,
    courseAssignmentCount: 12,
    topicTaskCount: 8,
    pendingReviewCount: 15,
    studentGrowth: 12.5,
    assignmentGrowth: 8.3,
    taskGrowth: 5.2,
  }
}

export function mockDashboardTrend(): DashboardTrend {
  const dates: string[] = []
  const studentCounts: number[] = []
  const submissionCounts: number[] = []
  const topicTaskCounts: number[] = []

  const baseDate = new Date()
  baseDate.setDate(baseDate.getDate() - 6)

  for (let i = 0; i < 7; i++) {
    const d = new Date(baseDate)
    d.setDate(d.getDate() + i)
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    dates.push(`${month}-${day}`)

    studentCounts.push(22 + i)
    submissionCounts.push(5 + Math.floor(Math.random() * 8) + i)
    topicTaskCounts.push(3 + Math.floor(Math.random() * 5) + i)
  }

  return { dates, studentCounts, submissionCounts, topicTaskCounts }
}
