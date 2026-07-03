<template>
  <div class="student-dashboard">
    <t-row :gutter="16">
      <t-col :span="7">
        <t-card class="welcome-card" :bordered="false">
          <div class="welcome-header">
            <t-space>
              <t-avatar :image="avatarUrl" size="48px">{{ userName?.charAt(0) }}</t-avatar>
              <div>
                <h3>欢迎回来，{{ userName }}</h3>
                <t-space size="small">
                  <t-tag theme="primary" variant="light" size="small">{{ authStore.user?.scholarId }}</t-tag>
                </t-space>
              </div>
            </t-space>
            <t-button theme="primary" variant="outline" @click="$router.push('/student/game')">
              <t-icon name="star" /> Game 中心
            </t-button>
          </div>
        </t-card>
        <t-card title="快速操作" :bordered="false" style="margin-top:16px">
          <t-space direction="vertical" size="8px" style="width:100%">
            <t-button block variant="outline" @click="$router.push('/student/courses')">
              <t-icon name="book" /> 我的课程
            </t-button>
            <t-button block variant="outline" @click="$router.push('/student/assignments')">
              <t-icon name="assignment" /> 提交作业
            </t-button>
            <t-button block variant="outline" @click="$router.push('/student/topics')">
              <t-icon name="folder" /> 我的课题
            </t-button>
            <t-button block variant="outline" @click="$router.push('/student/ted-profile')">
              <t-icon name="user" /> TED 档案
            </t-button>
          </t-space>
        </t-card>
      </t-col>
      <t-col :span="5">
        <t-card title="学习进度" :bordered="false">
          <t-loading :loading="loading" size="small">
            <div v-for="c in enrolledCourses" :key="c.id" class="progress-item">
              <span class="progress-label">{{ c.name }}</span>
              <t-progress :percentage="Math.floor(Math.random() * 40 + 30)" theme="primary" size="small" />
            </div>
            <t-empty v-if="enrolledCourses.length === 0" description="暂无课程数据" size="small" />
          </t-loading>
        </t-card>
        <t-card title="待办事项" :bordered="false" style="margin-top:16px">
          <t-loading :loading="loading" size="small">
            <t-list :split="true" v-if="todoList.length > 0">
              <t-list-item v-for="item in todoList" :key="item.text">
                <t-list-item-meta :description="item.text">
                  <template #avatar>
                    <t-tag :theme="item.urgent ? 'danger' : 'warning'" variant="light" size="small">
                      {{ item.urgent ? '紧急' : '待办' }}
                    </t-tag>
                  </template>
                </t-list-item-meta>
              </t-list-item>
            </t-list>
            <t-empty v-else description="暂无待办事项" size="small" />
          </t-loading>
        </t-card>
      </t-col>
    </t-row>

    <t-row :gutter="16" style="margin-top:16px">
      <t-col :span="6">
        <t-card title="最近活动" :bordered="false">
          <t-loading :loading="loading" size="small">
            <t-timeline v-if="gameState?.recentLogs?.length">
              <t-timeline-item v-for="(log, i) in gameState.recentLogs.slice(0,5)" :key="i">
                {{ log.description }} <t-tag theme="success" variant="light" size="small">+{{ log.xp }} XP</t-tag>
              </t-timeline-item>
            </t-timeline>
            <t-empty v-else description="暂无活动记录" size="small" />
          </t-loading>
        </t-card>
      </t-col>
      <t-col :span="6">
        <t-card title="排行榜快照" :bordered="false">
          <t-loading :loading="loading" size="small">
            <div v-if="gameState" class="rank-snapshot">
              <div class="rank-item">
                <t-icon name="star-filled" style="color:#f5a623" />
                <span>你的排名: {{ gameState.rank || '-' }}</span>
              </div>
              <t-button variant="text" theme="primary" @click="$router.push('/student/game/leaderboard')">查看完整排行榜</t-button>
            </div>
            <t-empty v-else description="加载中..." size="small" />
          </t-loading>
        </t-card>
      </t-col>
    </t-row>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useStudentStore } from '@/stores/student'

const authStore = useAuthStore()
const studentStore = useStudentStore()

const loading = studentStore.loading
const enrolledCourses = computed(() => studentStore.enrolledCourses)
const pendingAssignments = computed(() => studentStore.pendingAssignments)
const gameState = computed(() => studentStore.gameState)

const userName = computed(() => authStore.userName)
const avatarUrl = computed(() => {
  const av = (authStore.user as any)?.avatar
  return av ? `http://localhost:3001${av}` : ''
})

const todoList = computed(() => {
  const list: any[] = []
  const now = Date.now()
  pendingAssignments.value.forEach((a: any) => {
    const deadline = a.deadline ? new Date(a.deadline).getTime() : 0
    list.push({ text: `作业: ${a.title}`, urgent: deadline > 0 && deadline - now < 3 * 86400000 })
  })
  studentStore.myTasks.filter((t: any) => t.status !== 'completed').forEach((t: any) => {
    list.push({ text: `任务: ${t.title}`, urgent: t.priority === 'urgent' })
  })
  return list.slice(0, 5)
})

onMounted(() => { studentStore.loadAll() })
</script>

<style scoped>
.student-dashboard { max-width: 1200px; }
.welcome-card { background: linear-gradient(135deg, #0052D9 0%, #266FE8 100%); color: #fff; }
.welcome-card h3 { color: #fff; margin: 0 0 4px 0; font-size: 18px; }
.welcome-header { display: flex; justify-content: space-between; align-items: center; }
.progress-item { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.progress-label { flex-shrink: 0; width: 120px; font-size: 13px; color: #4E5969; }
.rank-snapshot { display: flex; flex-direction: column; gap: 8px; }
.rank-item { display: flex; align-items: center; gap: 8px; font-size: 14px; }
</style>
