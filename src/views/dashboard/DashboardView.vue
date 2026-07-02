<template>
  <div class="dashboard-page">
    <t-loading :loading="loading" size="large">
      <t-row :gutter="16" class="stat-row">
        <t-col :span="6" v-for="stat in statCards" :key="stat.label">
          <t-card class="stat-card" :bordered="false" hover-shadow>
            <div class="stat-inner">
              <div class="stat-info">
                <span class="stat-label">{{ stat.label }}</span>
                <t-statistic
                  :value="stat.value"
                  :prefix="stat.prefix"
                  :suffix="stat.suffix"
                  :value-style="{ fontSize: '28px', fontWeight: 700, color: '#1F2329' }"
                />
                <span
                  class="stat-change"
                  :class="stat.growth >= 0 ? 'up' : 'down'"
                >
                  <t-icon :name="stat.growth >= 0 ? 'arrow-up' : 'arrow-down'" size="14px" />
                  较昨日 {{ stat.growth >= 0 ? '+' : '' }}{{ stat.growth }}%
                </span>
              </div>
              <div class="stat-icon" :style="{ background: stat.color }">
                <t-icon :name="stat.icon" size="28px" />
              </div>
            </div>
          </t-card>
        </t-col>
      </t-row>

      <t-card class="quick-actions-card" :bordered="false" title="快捷操作">
        <div class="quick-actions">
          <t-button
            v-for="action in quickActions"
            :key="action.label"
            variant="outline"
            size="large"
            class="quick-action-btn"
            @click="handleQuickAction(action.route)"
          >
            <t-icon :name="action.icon" size="20px" />
            <span>{{ action.label }}</span>
          </t-button>
        </div>
      </t-card>

      <t-row :gutter="16" class="bottom-row">
        <t-col :span="8">
          <t-card class="chart-card" :bordered="false" title="七日数据趋势">
            <template #actions>
              <t-space>
                <t-tag
                  v-for="item in chartLegends"
                  :key="item.key"
                  :theme="item.theme"
                  variant="light"
                  size="small"
                >
                  {{ item.label }}
                </t-tag>
              </t-space>
            </template>
            <div ref="chartRef" class="chart-container"></div>
          </t-card>
        </t-col>

        <t-col :span="4">
          <t-card class="pending-card" :bordered="false" title="待处理事项">
            <t-loading :loading="pendingLoading" size="small">
              <t-list v-if="pendingItems.length > 0" :split="true">
                <t-list-item v-for="item in pendingItems" :key="item.id">
                  <t-list-item-meta :title="item.title" :description="item.time">
                    <template #avatar>
                      <t-tag
                        :theme="item.typeTheme"
                        variant="light"
                        size="small"
                        shape="round"
                      >
                        {{ item.typeLabel }}
                      </t-tag>
                    </template>
                  </t-list-item-meta>
                </t-list-item>
              </t-list>
              <t-empty v-else description="暂无待处理事项" />
            </t-loading>
          </t-card>

          <t-card class="notice-card" :bordered="false" title="系统通知" style="margin-top: 16px">
            <t-loading :loading="noticeLoading" size="small">
              <t-list v-if="notices.length > 0" :split="true">
                <t-list-item v-for="item in notices" :key="item.id">
                  <t-list-item-meta :title="item.title" :description="item.time" />
                </t-list-item>
              </t-list>
              <t-empty v-else description="暂无系统通知" />
            </t-loading>
          </t-card>
        </t-col>
      </t-row>
    </t-loading>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { mockDashboardOverview, mockDashboardTrend } from '@/mock/dashboard'
import type { DashboardOverview, DashboardTrend } from '@/mock/types'

const router = useRouter()
const loading = ref(true)
const pendingLoading = ref(false)
const noticeLoading = ref(false)

const overview = ref<DashboardOverview>({
  studentCount: 0,
  courseAssignmentCount: 0,
  topicTaskCount: 0,
  pendingReviewCount: 0,
  studentGrowth: 0,
  assignmentGrowth: 0,
  taskGrowth: 0,
})

const trend = ref<DashboardTrend>({
  dates: [],
  studentCounts: [],
  submissionCounts: [],
  topicTaskCounts: [],
})

const statCards = computed(() => [
  {
    label: '学员总数',
    value: overview.value.studentCount,
    growth: overview.value.studentGrowth,
    icon: 'user',
    color: 'linear-gradient(135deg, #E8F3FF, #D4E8FF)',
  },
  {
    label: '课程作业',
    value: overview.value.courseAssignmentCount,
    growth: overview.value.assignmentGrowth,
    icon: 'file-paste',
    color: 'linear-gradient(135deg, #E8FFF3, #D4FFE8)',
  },
  {
    label: '课题任务',
    value: overview.value.topicTaskCount,
    growth: overview.value.taskGrowth,
    icon: 'task',
    color: 'linear-gradient(135deg, #FFF8E8, #FFECD4)',
  },
  {
    label: '待评审数',
    value: overview.value.pendingReviewCount,
    growth: 0,
    icon: 'edit',
    color: 'linear-gradient(135deg, #FFE8E8, #FFD4D4)',
  },
])

const quickActions = [
  { label: '学员管理', icon: 'user', route: '/students' },
  { label: '课程管理', icon: 'book', route: '/courses' },
  { label: '作业管理', icon: 'file-paste', route: '/assignments' },
  { label: '课题管理', icon: 'flag', route: '/topics' },
  { label: '任务管理', icon: 'task', route: '/topic-tasks' },
  { label: '成果管理', icon: 'star', route: '/outcomes' },
  { label: '资源中心', icon: 'folder', route: '/resources' },
  { label: '培训邀约', icon: 'mail', route: '/invitations' },
]

const pendingItems = ref<
  { id: number; title: string; time: string; typeLabel: string; typeTheme: string }[]
>([])
const notices = ref<{ id: number; title: string; time: string }[]>([])

const chartLegends = [
  { key: 'students', label: '新增学员', theme: 'primary' as const },
  { key: 'submissions', label: '提交作业', theme: 'success' as const },
  { key: 'tasks', label: '新增任务', theme: 'warning' as const },
]

const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

function initChart() {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  updateChart()
  window.addEventListener('resize', handleResize)
}

function updateChart() {
  if (!chartInstance) return
  chartInstance.setOption({
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['新增学员', '提交作业', '新增任务'],
      bottom: 0,
    },
    grid: {
      top: 24,
      left: 24,
      right: 24,
      bottom: 40,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: trend.value.dates,
      axisLine: { lineStyle: { color: '#E7E7E7' } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#F0F0F0' } },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        name: '新增学员',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: trend.value.studentCounts,
        lineStyle: { color: '#0052D9', width: 3 },
        itemStyle: { color: '#0052D9' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0,82,217,0.15)' },
            { offset: 1, color: 'rgba(0,82,217,0.01)' },
          ]),
        },
      },
      {
        name: '提交作业',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: trend.value.submissionCounts,
        lineStyle: { color: '#2BA471', width: 3 },
        itemStyle: { color: '#2BA471' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(43,164,113,0.15)' },
            { offset: 1, color: 'rgba(43,164,113,0.01)' },
          ]),
        },
      },
      {
        name: '新增任务',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: trend.value.topicTaskCounts,
        lineStyle: { color: '#E37318', width: 3 },
        itemStyle: { color: '#E37318' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(227,115,24,0.15)' },
            { offset: 1, color: 'rgba(227,115,24,0.01)' },
          ]),
        },
      },
    ],
  })
}

function handleResize() {
  chartInstance?.resize()
}

function handleQuickAction(route: string) {
  router.push(route)
}

function loadPendingItems() {
  pendingLoading.value = true
  setTimeout(() => {
    pendingItems.value = [
      { id: 1, title: '张明远提交了《长城数字复原》课程作业', time: '10分钟前', typeLabel: '作业', typeTheme: 'primary' },
      { id: 2, title: '3名新学员注册待审核', time: '30分钟前', typeLabel: '审核', typeTheme: 'warning' },
      { id: 3, title: '课题《山海关段三维建模》进度更新', time: '1小时前', typeLabel: '课题', typeTheme: 'success' },
      { id: 4, title: '李思雨的作业已逾期未提交', time: '2小时前', typeLabel: '作业', typeTheme: 'danger' },
      { id: 5, title: '赵晓琳申请加入《长城数字复原》课题', time: '3小时前', typeLabel: '课题', typeTheme: 'success' },
    ]
    pendingLoading.value = false
  }, 400)
}

function loadNotices() {
  noticeLoading.value = true
  setTimeout(() => {
    notices.value = [
      { id: 1, title: '系统将于今晚22:00进行维护升级', time: '2026-07-01 18:00' },
      { id: 2, title: '新版本v2.3.0发布：支持BIM模型在线批注', time: '2026-06-30 09:30' },
      { id: 3, title: '2026暑期培训计划已发布，请查看课程安排', time: '2026-06-28 14:00' },
      { id: 4, title: '评审委员会新增3名评审专家', time: '2026-06-25 10:00' },
    ]
    noticeLoading.value = false
  }, 300)
}

onMounted(() => {
  setTimeout(() => {
    overview.value = mockDashboardOverview()
    trend.value = mockDashboardTrend()
    loading.value = false
    setTimeout(() => {
      initChart()
    }, 100)
    loadPendingItems()
    loadNotices()
  }, 500)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<style scoped>
.dashboard-page {
  padding: 0;
}

.stat-row {
  margin-bottom: 16px;
}

.stat-card {
  border-radius: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-inner {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 14px;
  color: #86909C;
  margin-bottom: 4px;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 13px;
  margin-top: 4px;
}

.stat-change.up {
  color: #2BA471;
}

.stat-change.down {
  color: #D54941;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0052D9;
  font-size: 28px;
}

.quick-actions-card {
  margin-bottom: 16px;
  border-radius: 8px;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.quick-action-btn {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
  transition: all 0.2s;
  border-color: #E7E7E7;
}

.quick-action-btn:hover {
  border-color: #0052D9;
  color: #0052D9;
}

.bottom-row {
  margin: 0;
}

.chart-card {
  border-radius: 8px;
  height: 100%;
}

.chart-container {
  width: 100%;
  height: 340px;
}

.pending-card,
.notice-card {
  border-radius: 8px;
}

.pending-card :deep(.t-list-item),
.notice-card :deep(.t-list-item) {
  padding: 10px 0;
}
</style>
