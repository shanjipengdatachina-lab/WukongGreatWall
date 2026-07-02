<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">数据统计</h2>
    </div>

    <div class="filter-bar">
      <t-space align="center">
        <span class="filter-label">时间范围：</span>
        <t-date-range-picker
          v-model="dateRange"
          clearable
          style="width: 280px"
          @change="handleDateChange"
        />
        <t-button theme="primary" @click="refreshData">刷新数据</t-button>
      </t-space>
    </div>

    <t-loading :loading="loading" size="medium">
      <template v-if="error">
        <t-alert theme="error" :message="error" close @close="error = ''" />
      </template>

      <template v-else-if="!loading && overview">
        <div class="stat-cards-row">
          <t-card class="stat-card" hover-shadow>
            <div class="stat-content">
              <div class="stat-icon" style="background: #E8F0FE">
                <t-icon name="user" size="28px" style="color: #0052D9" />
              </div>
              <div class="stat-info">
                <t-statistic
                  :value="overview.studentCount"
                  title="学员总数"
                  unit="人"
                  :trend="overview.studentGrowth > 0 ? 'increase' : 'decrease'"
                  :trend-num="Math.abs(overview.studentGrowth)"
                />
              </div>
            </div>
          </t-card>

          <t-card class="stat-card" hover-shadow>
            <div class="stat-content">
              <div class="stat-icon" style="background: #FEF0E8">
                <t-icon name="file-paste" size="28px" style="color: #E37318" />
              </div>
              <div class="stat-info">
                <t-statistic
                  :value="overview.courseAssignmentCount"
                  title="课程作业数"
                  unit="份"
                  :trend="overview.assignmentGrowth > 0 ? 'increase' : 'decrease'"
                  :trend-num="Math.abs(overview.assignmentGrowth)"
                />
              </div>
            </div>
          </t-card>

          <t-card class="stat-card" hover-shadow>
            <div class="stat-content">
              <div class="stat-icon" style="background: #E8F8E8">
                <t-icon name="task" size="28px" style="color: #00A870" />
              </div>
              <div class="stat-info">
                <t-statistic
                  :value="overview.topicTaskCount"
                  title="课题任务数"
                  unit="个"
                  :trend="overview.taskGrowth > 0 ? 'increase' : 'decrease'"
                  :trend-num="Math.abs(overview.taskGrowth)"
                />
              </div>
            </div>
          </t-card>

          <t-card class="stat-card" hover-shadow>
            <div class="stat-content">
              <div class="stat-icon" style="background: #FEF0F8">
                <t-icon name="chart-line" size="28px" style="color: #D54941" />
              </div>
              <div class="stat-info">
                <t-statistic
                  :value="overview.pendingReviewCount"
                  title="待评审数"
                  unit="份"
                />
              </div>
            </div>
          </t-card>
        </div>

        <div class="charts-row">
          <t-card class="chart-card" title="学员增长趋势" hover-shadow>
            <div ref="studentTrendChartRef" class="chart-box"></div>
          </t-card>

          <t-card class="chart-card" title="作业提交趋势" hover-shadow>
            <div ref="submissionTrendChartRef" class="chart-box"></div>
          </t-card>
        </div>

        <div class="charts-row">
          <t-card class="chart-card" title="课题任务统计" hover-shadow>
            <div ref="topicStatusChartRef" class="chart-box"></div>
          </t-card>

          <t-card class="chart-card" title="学员院校分布" hover-shadow>
            <div ref="schoolChartRef" class="chart-box"></div>
          </t-card>
        </div>
      </template>

      <t-empty v-else-if="!loading" description="暂无数据" />
    </t-loading>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import * as echarts from 'echarts'
import { mockDashboardOverview, mockDashboardTrend } from '@/mock'
import type { DashboardOverview, DashboardTrend } from '@/mock/types'

const loading = ref(true)
const error = ref('')
const dateRange = ref<string[]>([])
const overview = ref<DashboardOverview | null>(null)
const trend = ref<DashboardTrend | null>(null)

const studentTrendChartRef = ref<HTMLDivElement | null>(null)
const submissionTrendChartRef = ref<HTMLDivElement | null>(null)
const topicStatusChartRef = ref<HTMLDivElement | null>(null)
const schoolChartRef = ref<HTMLDivElement | null>(null)

let studentTrendChart: echarts.ECharts | null = null
let submissionTrendChart: echarts.ECharts | null = null
let topicStatusChart: echarts.ECharts | null = null
let schoolChart: echarts.ECharts | null = null

function loadData() {
  loading.value = true
  error.value = ''
  try {
    overview.value = mockDashboardOverview()
    trend.value = mockDashboardTrend()
  } catch (e: any) {
    error.value = e?.message || '数据加载失败'
  } finally {
    loading.value = false
    nextTick(() => {
      initCharts()
    })
  }
}

function initStudentTrendChart() {
  if (!studentTrendChartRef.value || !trend.value) return
  if (studentTrendChart) studentTrendChart.dispose()
  studentTrendChart = echarts.init(studentTrendChartRef.value)
  studentTrendChart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { top: 20, right: 30, bottom: 30, left: 50 },
    xAxis: {
      type: 'category',
      data: trend.value.dates,
      axisLabel: { color: '#666' },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#666' },
      splitLine: { lineStyle: { color: '#E7E7E7' } },
    },
    series: [
      {
        name: '学员数量',
        type: 'line',
        data: trend.value.studentCounts,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { color: '#0052D9', width: 2 },
        itemStyle: { color: '#0052D9' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0,82,217,0.2)' },
            { offset: 1, color: 'rgba(0,82,217,0.02)' },
          ]),
        },
      },
    ],
  })
}

function initSubmissionTrendChart() {
  if (!submissionTrendChartRef.value || !trend.value) return
  if (submissionTrendChart) submissionTrendChart.dispose()
  submissionTrendChart = echarts.init(submissionTrendChartRef.value)
  submissionTrendChart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { top: 20, right: 30, bottom: 30, left: 50 },
    xAxis: {
      type: 'category',
      data: trend.value.dates,
      axisLabel: { color: '#666' },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#666' },
      splitLine: { lineStyle: { color: '#E7E7E7' } },
    },
    series: [
      {
        name: '提交数',
        type: 'bar',
        data: trend.value.submissionCounts,
        barWidth: 32,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#0052D9' },
            { offset: 1, color: '#366EF4' },
          ]),
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
  })
}

function initTopicStatusChart() {
  if (!topicStatusChartRef.value) return
  if (topicStatusChart) topicStatusChart.dispose()
  topicStatusChart = echarts.init(topicStatusChartRef.value)

  const topicStatusData = [
    { value: 5, name: '进行中' },
    { value: 3, name: '待开始' },
    { value: 2, name: '已完成' },
    { value: 1, name: '已逾期' },
  ]

  topicStatusChart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c} 个 ({d}%)' },
    legend: { bottom: 0, textStyle: { color: '#666' } },
    series: [
      {
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
        label: { show: false },
        emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
        data: topicStatusData,
        color: ['#0052D9', '#E37318', '#00A870', '#D54941'],
      },
    ],
  })
}

function initSchoolChart() {
  if (!schoolChartRef.value) return
  if (schoolChart) schoolChart.dispose()
  schoolChart = echarts.init(schoolChartRef.value)

  const schoolData = [
    { name: '清华大学', value: 5 },
    { name: '北京大学', value: 4 },
    { name: '浙江大学', value: 3 },
    { name: '复旦大学', value: 3 },
    { name: '上海交通大学', value: 2 },
    { name: '南京大学', value: 2 },
    { name: '武汉大学', value: 2 },
    { name: '中国美术学院', value: 3 },
    { name: '北京电影学院', value: 3 },
    { name: '中央美术学院', value: 2 },
  ].sort((a, b) => a.value - b.value)

  schoolChart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { top: 10, right: 40, bottom: 20, left: 100 },
    xAxis: {
      type: 'value',
      axisLabel: { color: '#666' },
      splitLine: { lineStyle: { color: '#E7E7E7' } },
    },
    yAxis: {
      type: 'category',
      data: schoolData.map((d) => d.name),
      axisLabel: { color: '#666' },
      inverse: true,
    },
    series: [
      {
        type: 'bar',
        data: schoolData.map((d) => d.value),
        barWidth: 16,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#366EF4' },
            { offset: 1, color: '#0052D9' },
          ]),
          borderRadius: [0, 4, 4, 0],
        },
        label: { show: true, position: 'right', color: '#666' },
      },
    ],
  })
}

function initCharts() {
  initStudentTrendChart()
  initSubmissionTrendChart()
  initTopicStatusChart()
  initSchoolChart()
}

function handleResize() {
  studentTrendChart?.resize()
  submissionTrendChart?.resize()
  topicStatusChart?.resize()
  schoolChart?.resize()
}

function handleDateChange() {
  loadData()
}

function refreshData() {
  loadData()
  MessagePlugin.success('数据已刷新')
}

function disposeAllCharts() {
  studentTrendChart?.dispose()
  submissionTrendChart?.dispose()
  topicStatusChart?.dispose()
  schoolChart?.dispose()
}

onMounted(() => {
  loadData()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  disposeAllCharts()
})
</script>

<style scoped>
.page-container {
  max-width: 1400px;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #1F2329;
  margin: 0;
}

.filter-bar {
  background: #fff;
  border-radius: 8px;
  padding: 16px 20px;
  margin-bottom: 20px;
  border: 1px solid #E7E7E7;
}

.filter-label {
  font-size: 14px;
  color: #666;
}

.stat-cards-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 8px;
}

.stat-card :deep(.t-card__body) {
  padding: 20px;
}

.stat-content {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
  min-width: 0;
}

.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.chart-card {
  border-radius: 8px;
}

.chart-card :deep(.t-card__header) {
  font-weight: 600;
  font-size: 16px;
}

.chart-box {
  width: 100%;
  height: 340px;
}

@media (max-width: 1200px) {
  .stat-cards-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .charts-row {
    grid-template-columns: 1fr;
  }
}
</style>
