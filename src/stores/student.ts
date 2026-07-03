import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getGameOverview, getMyCourses, getMyAssignments, getMySubmissions,
  getMyTopics, getMyTasks, getTEDProfile, getAchievements
} from '@/api/student'

export const useStudentStore = defineStore('student', () => {
  const gameState = ref<any>(null)
  const tedProfile = ref<any>(null)
  const enrolledCourses = ref<any[]>([])
  const pendingAssignments = ref<any[]>([])
  const mySubmissions = ref<any[]>([])
  const myTopics = ref<any[]>([])
  const myTasks = ref<any[]>([])
  const achievements = ref<any[]>([])
  const loading = ref(false)

  async function loadAll() {
    loading.value = true
    try {
      const [game, ted, courses, assignments, submissions, topics, tasks, achs] = await Promise.all([
        getGameOverview().catch(() => null),
        getTEDProfile().catch(() => null),
        getMyCourses().catch(() => []),
        getMyAssignments().catch(() => []),
        getMySubmissions().catch(() => []),
        getMyTopics().catch(() => []),
        getMyTasks().catch(() => []),
        getAchievements().catch(() => []),
      ])
      gameState.value = game
      tedProfile.value = ted
      enrolledCourses.value = courses || []
      pendingAssignments.value = assignments || []
      mySubmissions.value = submissions || []
      myTopics.value = topics || []
      myTasks.value = tasks || []
      achievements.value = achs || []
    } catch (e) {
      console.error('Failed to load student data:', e)
    } finally {
      loading.value = false
    }
  }

  async function refreshGame() {
    try { gameState.value = await getGameOverview() } catch {}
  }

  async function refreshTED() {
    try { tedProfile.value = await getTEDProfile() } catch {}
  }

  return {
    gameState, tedProfile, enrolledCourses, pendingAssignments,
    mySubmissions, myTopics, myTasks, achievements, loading,
    loadAll, refreshGame, refreshTED
  }
})
