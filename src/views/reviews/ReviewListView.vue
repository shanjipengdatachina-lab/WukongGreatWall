<template>
  <div class="review-list-page">
    <div class="stat-cards">
      <t-card class="stat-card-item" :bordered="false">
        <div class="stat-label">待评审</div>
        <div class="stat-value" style="color:#E37318">{{ stats.pending }}</div>
      </t-card>
      <t-card class="stat-card-item" :bordered="false">
        <div class="stat-label">评审中</div>
        <div class="stat-value" style="color:#0052D9">{{ stats.reviewing }}</div>
      </t-card>
      <t-card class="stat-card-item" :bordered="false">
        <div class="stat-label">已通过</div>
        <div class="stat-value" style="color:#2BA471">{{ stats.approved }}</div>
      </t-card>
      <t-card class="stat-card-item" :bordered="false">
        <div class="stat-label">已退回</div>
        <div class="stat-value" style="color:#D54941">{{ stats.rejected }}</div>
      </t-card>
    </div>

    <t-card :bordered="false" class="filter-section">
      <t-form layout="inline" label-align="right" :label-width="80">
        <t-form-item label="作业标题">
          <t-input
            v-model="filters.title"
            placeholder="请输入作业标题"
            clearable
            style="width: 200px"
          />
        </t-form-item>
        <t-form-item label="评审状态">
          <t-select
            v-model="filters.status"
            placeholder="全部"
            clearable
            style="width: 140px"
          >
            <t-option label="待评审" value="pending" />
            <t-option label="评审中" value="reviewing" />
            <t-option label="已通过" value="approved" />
            <t-option label="已退回" value="rejected" />
          </t-select>
        </t-form-item>
        <t-form-item label="作业类型">
          <t-select
            v-model="filters.type"
            placeholder="全部"
            clearable
            style="width: 140px"
          >
            <t-option label="课程作业" value="course" />
            <t-option label="课题任务" value="topic" />
          </t-select>
        </t-form-item>
        <t-form-item label="提交时间">
          <t-date-range-picker
            v-model="filters.dateRange"
            placeholder="选择时间范围"
            clearable
          />
        </t-form-item>
        <t-form-item>
          <t-space>
            <t-button theme="primary" @click="handleSearch">
              <template #icon><t-icon name="search" /></template>
              查询
            </t-button>
            <t-button variant="outline" @click="handleReset">
              <template #icon><t-icon name="refresh" /></template>
              重置
            </t-button>
          </t-space>
        </t-form-item>
      </t-form>
    </t-card>

    <t-card :bordered="false" class="table-section">
      <template #title>
        <span class="table-title">提交列表</span>
      </template>
      <template #actions>
        <t-space>
          <t-button variant="outline" @click="handleExport">
            <template #icon><t-icon name="download" /></template>
            导出
          </t-button>
        </t-space>
      </template>
      <t-loading :loading="loading" size="medium">
        <t-table
          v-if="dataSource.length > 0"
          row-key="id"
          :data="dataSource"
          :columns="columns"
          :pagination="false"
          stripe
          hover
          size="medium"
        >
          <template #student="{ row }">
            <div class="student-cell">
              <t-avatar size="small">{{ row.studentName?.charAt(0) }}</t-avatar>
              <div class="student-info">
                <div class="student-name">{{ row.studentName }}</div>
                <div class="student-meta">{{ row.scholarId }} · {{ row.school }}</div>
              </div>
            </div>
          </template>
          <template #status="{ row }">
            <t-tag :theme="statusTheme(row.status)" variant="light">{{ statusLabel(row.status) }}</t-tag>
          </template>
          <template #progress="{ row }">
            <t-progress :percentage="row.progress || 0" size="small" :label="false" />
          </template>
          <template #op="{ row }">
            <t-space>
              <t-button variant="text" @click="handleReview(row)">
                去评审
              </t-button>
              <t-button variant="text" @click="handleViewDetail(row)">
                查看
              </t-button>
            </t-space>
          </template>
        </t-table>
        <t-empty v-else description="暂无提交数据" />
        <div class="pagination-wrapper">
          <t-pagination
            v-model:current="pagination.page"
            v-model:page-size="pagination.pageSize"
            :total="pagination.total"
            :page-size-options="[10, 20, 50]"
            show-jumper
            show-page-size
            size="medium"
            @page-change="handlePageChange"
          />
        </div>
      </t-loading>
    </t-card>

    <t-drawer
      v-model:visible="drawerVisible"
      title="提交详情"
      size="large"
    >
      <t-descriptions v-if="currentSubmission" column="1" bordered>
        <t-descriptions-item label="作业标题">
          {{ currentSubmission.assignmentName }}
        </t-descriptions-item>
        <t-descriptions-item label="作业类型">
          <t-tag variant="light">{{ currentSubmission.type === 'course' ? '课程作业' : '课题任务' }}</t-tag>
        </t-descriptions-item>
        <t-descriptions-item label="学员姓名">
          {{ currentSubmission.studentName }}
        </t-descriptions-item>
        <t-descriptions-item label="Scholar ID">
          {{ currentSubmission.scholarId }}
        </t-descriptions-item>
        <t-descriptions-item label="所在院校">
          {{ currentSubmission.school }}
        </t-descriptions-item>
        <t-descriptions-item label="提交时间">
          {{ currentSubmission.submittedAt }}
        </t-descriptions-item>
        <t-descriptions-item label="评审状态">
          <t-tag :theme="statusTheme(currentSubmission.status)" variant="light">
            {{ statusLabel(currentSubmission.status) }}
          </t-tag>
        </t-descriptions-item>
        <t-descriptions-item label="批注数量">
          {{ currentSubmission.annotationCount || 0 }} 条
        </t-descriptions-item>
      </t-descriptions>

      <t-divider v-if="currentSubmission" orientation="left">提交文件</t-divider>
      <t-list v-if="currentSubmission">
        <t-list-item v-for="file in currentSubmission.files" :key="file.id">
          <t-list-item-meta>
            <template #avatar>
              <t-icon name="file-copy" size="20px" />
            </template>
            <template #title>{{ file.name }}</template>
            <template #description>{{ file.size }}</template>
          </t-list-item-meta>
          <t-button variant="text">下载</t-button>
        </t-list-item>
      </t-list>

      <template #footer>
        <t-space justify="end">
          <t-button variant="outline" @click="drawerVisible = false">关闭</t-button>
          <t-button theme="primary" @click="handleReview(currentSubmission)">
            去评审
          </t-button>
        </t-space>
      </template>
    </t-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { MessagePlugin } from 'tdesign-vue-next'

const router = useRouter()
const loading = ref(false)
const dataSource = ref<any[]>([])
const drawerVisible = ref(false)
const currentSubmission = ref<any>(null)

const filters = ref({
  title: '',
  status: '',
  type: '',
  dateRange: [],
})

const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
})

const allSubmissions = ref<any[]>([])

const columns = [
  { colKey: 'id', title: 'ID', width: 80 },
  { colKey: 'student', title: '学员信息', width: 220 },
  { colKey: 'assignmentName', title: '作业标题', width: 200, ellipsis: true },
  { colKey: 'typeLabel', title: '类型', width: 100 },
  { colKey: 'progress', title: '批注进度', width: 140 },
  { colKey: 'status', title: '状态', width: 100 },
  { colKey: 'submittedAt', title: '提交时间', width: 180 },
  { colKey: 'op', title: '操作', width: 140, fixed: 'right' },
]

const mockSubmissions = () => {
  const assignments = [
    { id: 1, name: '长城城墙材质制作', type: 'course' },
    { id: 2, name: '山海关关城建模', type: 'topic' },
    { id: 3, name: '烽火台UE5场景搭建', type: 'course' },
    { id: 4, name: '长城数字复原渲染', type: 'topic' },
    { id: 5, name: '明长城防御体系研究', type: 'course' },
    { id: 6, name: 'Houdini地形生成', type: 'course' },
    { id: 7, name: '金山岭段三维扫描数据处理', type: 'topic' },
    { id: 8, name: '数字人文可视化设计', type: 'course' },
  ]
  const students = [
    { id: 1, name: '张明远', scholarId: 'S2026-0001', school: '唐山工业职业技术大学' },
    { id: 2, name: '李思雨', scholarId: 'S2026-0002', school: '河北工业大学' },
    { id: 3, name: '王浩然', scholarId: 'S2026-0003', school: '沧州师范学院' },
    { id: 4, name: '刘美琪', scholarId: 'S2026-0004', school: '河北经贸大学' },
    { id: 5, name: '陈志强', scholarId: 'S2026-0005', school: '华北理工大学' },
    { id: 6, name: '赵晓彤', scholarId: 'S2026-0006', school: '鲁迅美术学院' },
    { id: 7, name: '孙伟', scholarId: 'S2026-0007', school: '唐山工业职业技术大学' },
    { id: 8, name: '周雅婷', scholarId: 'S2026-0008', school: '河北工业大学' },
    { id: 9, name: '吴俊杰', scholarId: 'S2026-0009', school: '河北师范大学' },
    { id: 10, name: '郑丽娜', scholarId: 'S2026-0010', school: '燕山大学' },
    { id: 11, name: '冯晓东', scholarId: 'S2026-0011', school: '河北大学' },
    { id: 12, name: '杨雪', scholarId: 'S2026-0012', school: '石家庄铁道大学' },
    { id: 13, name: '许文博', scholarId: 'S2026-0013', school: '河北科技大学' },
    { id: 14, name: '何佳怡', scholarId: 'S2026-0014', school: '华北电力大学' },
    { id: 15, name: '高翔', scholarId: 'S2026-0015', school: '河北农业大学' },
  ]
  const statuses = ['pending', 'reviewing', 'approved', 'rejected']
  const list: any[] = []
  for (let i = 1; i <= 28; i++) {
    const a = assignments[i % assignments.length]
    const s = students[i % students.length]
    const status = statuses[i % statuses.length]
    list.push({
      id: i,
      assignmentId: a.id,
      assignmentName: a.name,
      type: a.type,
      typeLabel: a.type === 'course' ? '课程作业' : '课题任务',
      studentId: s.id,
      studentName: s.name,
      scholarId: s.scholarId,
      school: s.school,
      status,
      progress: status === 'pending' ? 0 : status === 'reviewing' ? 40 + (i % 50) : 100,
      annotationCount: status === 'pending' ? 0 : Math.floor(Math.random() * 8) + 1,
      submittedAt: `2026-06-${(15 + (i % 15)).toString().padStart(2, '0')} ${(9 + (i % 8)).toString().padStart(2, '0')}:${((i * 7) % 60).toString().padStart(2, '0')}:00`,
      files: [
        { id: i * 10 + 1, name: `${a.name}_提交.${a.type === 'course' ? 'png' : 'pdf'}`, size: a.type === 'course' ? '2.4 MB' : '1.8 MB' },
      ],
    })
  }
  return list
}

const stats = computed(() => {
  const list = allSubmissions.value
  return {
    pending: list.filter(s => s.status === 'pending').length,
    reviewing: list.filter(s => s.status === 'reviewing').length,
    approved: list.filter(s => s.status === 'approved').length,
    rejected: list.filter(s => s.status === 'rejected').length,
  }
})

function statusTheme(status: string) {
  const map: Record<string, string> = {
    pending: 'warning',
    reviewing: 'primary',
    approved: 'success',
    rejected: 'danger',
  }
  return map[status] || 'default'
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    pending: '待评审',
    reviewing: '评审中',
    approved: '已通过',
    rejected: '已退回',
  }
  return map[status] || status
}

function loadData() {
  loading.value = true
  setTimeout(() => {
    let filtered = [...allSubmissions.value]
    if (filters.value.title) {
      filtered = filtered.filter(s => s.assignmentName.includes(filters.value.title))
    }
    if (filters.value.status) {
      filtered = filtered.filter(s => s.status === filters.value.status)
    }
    if (filters.value.type) {
      filtered = filtered.filter(s => s.type === filters.value.type)
    }
    pagination.value.total = filtered.length
    const start = (pagination.value.page - 1) * pagination.value.pageSize
    dataSource.value = filtered.slice(start, start + pagination.value.pageSize)
    loading.value = false
  }, 300)
}

function handleSearch() {
  pagination.value.page = 1
  loadData()
}

function handleReset() {
  filters.value = { title: '', status: '', type: '', dateRange: [] }
  pagination.value.page = 1
  loadData()
}

function handlePageChange() {
  loadData()
}

function handleReview(row: any) {
  router.push(`/reviews/${row.id}`)
}

function handleViewDetail(row: any) {
  currentSubmission.value = row
  drawerVisible.value = true
}

function handleExport() {
  MessagePlugin.info('导出功能开发中')
}

onMounted(() => {
  allSubmissions.value = mockSubmissions()
  loadData()
})
</script>

<style scoped>
.review-list-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card-item {
  text-align: left;
}

.stat-label {
  font-size: 14px;
  color: #646A73;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
}

.filter-section {
  margin-bottom: 0;
}

.table-section {
  flex: 1;
}

.table-title {
  font-size: 16px;
  font-weight: 600;
  color: #1F2329;
}

.student-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.student-info {
  display: flex;
  flex-direction: column;
}

.student-name {
  font-size: 14px;
  font-weight: 500;
  color: #1F2329;
}

.student-meta {
  font-size: 12px;
  color: #646A73;
  margin-top: 2px;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
}

@media (max-width: 1200px) {
  .stat-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stat-cards {
    grid-template-columns: 1fr;
  }
}
</style>
