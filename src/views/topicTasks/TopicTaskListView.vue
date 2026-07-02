<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">任务管理</h2>
    </div>

    <div class="stat-cards">
      <t-card class="stat-card" :bordered="false">
        <div class="stat-label">全部任务</div>
        <div class="stat-value">{{ stats.total }}</div>
      </t-card>
      <t-card class="stat-card" :bordered="false">
        <div class="stat-label">未开始</div>
        <div class="stat-value" style="color:#646A73">{{ stats.notStarted }}</div>
      </t-card>
      <t-card class="stat-card" :bordered="false">
        <div class="stat-label">进行中</div>
        <div class="stat-value" style="color:#0052D9">{{ stats.inProgress }}</div>
      </t-card>
      <t-card class="stat-card" :bordered="false">
        <div class="stat-label">已提交</div>
        <div class="stat-value" style="color:#E37318">{{ stats.submitted }}</div>
      </t-card>
      <t-card class="stat-card" :bordered="false">
        <div class="stat-label">已逾期</div>
        <div class="stat-value" style="color:#D54941">{{ stats.overdue }}</div>
      </t-card>
    </div>

    <div class="filter-bar">
      <t-form layout="inline" :data="filters" @submit="handleSearch" @reset="handleReset">
        <t-form-item label="任务标题">
          <t-input v-model="filters.keyword" placeholder="请输入任务标题" clearable style="width:180px" />
        </t-form-item>
        <t-form-item label="所属课题">
          <t-select v-model="filters.topicId" placeholder="请选择课题" clearable style="width:200px">
            <t-option v-for="t in topicOptions" :key="t.id" :value="t.id" :label="t.title" />
          </t-select>
        </t-form-item>
        <t-form-item label="优先级">
          <t-select v-model="filters.priority" placeholder="请选择优先级" clearable style="width:130px">
            <t-option value="urgent" label="紧急" />
            <t-option value="high" label="高" />
            <t-option value="medium" label="中" />
            <t-option value="low" label="低" />
          </t-select>
        </t-form-item>
        <t-form-item label="状态">
          <t-select v-model="filters.status" placeholder="请选择状态" clearable style="width:130px">
            <t-option value="todo" label="未开始" />
            <t-option value="in_progress" label="进行中" />
            <t-option value="review" label="审核中" />
            <t-option value="done" label="已完成" />
          </t-select>
        </t-form-item>
        <t-form-item>
          <t-button theme="primary" type="submit">查询</t-button>
          <t-button variant="outline" type="reset" style="margin-left:8px">重置</t-button>
        </t-form-item>
      </t-form>
    </div>

    <div class="table-container">
      <div class="table-header">
        <t-tabs v-model="viewMode" theme="card">
          <t-tab-panel value="list" label="列表视图" />
          <t-tab-panel value="board" label="看板视图" />
        </t-tabs>
        <div class="toolbar-actions">
          <t-button theme="primary" @click="handleCreate">
            <template #icon><t-icon name="add" /></template>
            新建任务
          </t-button>
        </div>
      </div>

      <t-loading :loading="loading" size="medium">
        <template v-if="viewMode === 'list'">
        <t-table
          v-if="dataSource.length > 0"
          row-key="id"
          :data="dataSource"
          :columns="columns"
          :pagination="pagination"
          stripe
          hover
          table-layout="auto"
          @page-change="handlePageChange"
        >
          <template #taskType="{ row }">
            <t-tag :theme="taskTypeTag(row)" variant="light" size="small">
              {{ taskTypeLabel(row) }}
            </t-tag>
          </template>
          <template #priority="{ row }">
            <t-tag :theme="priorityTheme(row.priority)" variant="light" size="small">
              {{ priorityLabel(row.priority) }}
            </t-tag>
          </template>
          <template #progress="{ row }">
            <t-progress
              :percentage="row.progress"
              :label="row.progress + '%'"
              theme="line"
              size="small"
              :color="progressColor(row)"
            />
          </template>
          <template #status="{ row }">
            <t-tag :theme="taskStatusTheme(row)" variant="light" size="small">
              {{ taskStatusLabel(row) }}
            </t-tag>
          </template>
          <template #deadline="{ row }">
            <span :class="{ 'text-danger': isOverdue(row) }">{{ row.deadline }}</span>
          </template>
          <template #operation="{ row }">
            <t-space size="small">
              <t-link theme="primary" hover="color" @click="handleViewSubmit(row)">查看提交</t-link>
              <t-link theme="primary" hover="color" @click="handleEdit(row)">编辑</t-link>
              <t-popconfirm content="确认删除该任务？" @confirm="handleDelete(row)">
                <t-link theme="danger" hover="color">删除</t-link>
              </t-popconfirm>
            </t-space>
          </template>
        </t-table>
        <t-empty v-else description="暂无任务数据" />
        </template>
        <template v-else>
          <div class="board-view">
            <div v-for="col in boardColumns" :key="col.status" class="board-column">
              <div class="board-column-header">
                <span>{{ col.label }}</span>
                <t-tag size="small" theme="default">{{ col.items.length }}</t-tag>
              </div>
              <div class="board-column-body">
                <t-card
                  v-for="task in col.items"
                  :key="task.id"
                  class="board-card"
                  :bordered="true"
                  hover-shadow
                  @click="handleEdit(task)"
                >
                  <div class="board-card-title">{{ task.title }}</div>
                  <div class="board-card-meta">
                    <t-tag size="small" :theme="taskTypeTag(task)" variant="light">{{ taskTypeLabel(task) }}</t-tag>
                    <t-tag size="small" :theme="priorityTheme(task.priority)" variant="light">{{ priorityLabel(task.priority) }}</t-tag>
                  </div>
                  <div class="board-card-footer">
                    <span class="board-card-assignee">{{ task.assigneeName }}</span>
                    <span :class="['board-card-deadline', { 'text-danger': isOverdue(task) }]">{{ task.deadline }}</span>
                  </div>
                </t-card>
                <t-empty v-if="col.items.length === 0" size="small" description="暂无" />
              </div>
            </div>
          </div>
        </template>
      </t-loading>
    </div>

    <t-dialog
      v-model:visible="dialogVisible"
      :header="dialogTitle"
      :confirm-btn="{ content: '保存', theme: 'primary', loading: submitting }"
      :cancel-btn="{ content: '取消' }"
      width="560px"
      @confirm="handleSubmit"
      @close="handleDialogClose"
    >
      <t-form ref="formRef" :data="formData" :rules="formRules" label-width="100px">
        <t-form-item label="任务标题" name="title">
          <t-input v-model="formData.title" placeholder="请输入任务标题" />
        </t-form-item>
        <t-form-item label="所属课题" name="topicId">
          <t-select v-model="formData.topicId" placeholder="请选择所属课题">
            <t-option v-for="t in topicOptions" :key="t.id" :value="t.id" :label="t.title" />
          </t-select>
        </t-form-item>
        <t-form-item label="任务描述" name="description">
          <t-textarea v-model="formData.description" placeholder="请输入任务描述" :autosize="{ minRows: 2, maxRows: 4 }" />
        </t-form-item>
        <t-form-item label="负责人" name="assigneeName">
          <t-input v-model="formData.assigneeName" placeholder="请输入负责人姓名" />
        </t-form-item>
        <t-form-item label="优先级" name="priority">
          <t-select v-model="formData.priority" placeholder="请选择优先级">
            <t-option value="low" label="低" />
            <t-option value="medium" label="中" />
            <t-option value="high" label="高" />
            <t-option value="urgent" label="紧急" />
          </t-select>
        </t-form-item>
        <t-form-item label="截止时间" name="deadline">
          <t-date-picker v-model="formData.deadline" placeholder="请选择截止时间" style="width:100%" />
        </t-form-item>
        <t-form-item label="状态" name="status">
          <t-select v-model="formData.status" placeholder="请选择状态">
            <t-option value="todo" label="未开始" />
            <t-option value="in_progress" label="进行中" />
            <t-option value="review" label="审核中" />
            <t-option value="done" label="已完成" />
          </t-select>
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { mockTopicTasks } from '@/mock/topicTasks'
import { mockTopics } from '@/mock/topics'
import type { TopicTask } from '@/mock/types'

const loading = ref(false)
const dataSource = ref<TopicTask[]>([])
const viewMode = ref<'list' | 'board'>('list')

const boardColumns = computed(() => {
  const cols = [
    { status: 'todo', label: '未开始', items: [] as TopicTask[] },
    { status: 'in_progress', label: '进行中', items: [] as TopicTask[] },
    { status: 'review', label: '已提交', items: [] as TopicTask[] },
    { status: 'done', label: '已完成', items: [] as TopicTask[] },
  ]
  allTasks.value.forEach(t => {
    const col = cols.find(c => c.status === t.status)
    if (col) col.items.push(t)
  })
  return cols
})

const topicOptions = computed(() => {
  const result = mockTopics(1, 100)
  return result.items.map(t => ({ id: t.id, title: t.title }))
})

const filters = reactive({
  keyword: '',
  topicId: '',
  priority: '',
  status: '',
})

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showJumper: true,
  showPageSize: true,
  pageSizeOptions: [10, 20, 50],
})

const allTasks = ref<TopicTask[]>([])

const stats = computed(() => {
  const now = new Date()
  const total = allTasks.value.length
  const notStarted = allTasks.value.filter(t => t.status === 'todo').length
  const inProgress = allTasks.value.filter(t => t.status === 'in_progress').length
  const submitted = allTasks.value.filter(t => t.status === 'review').length
  const done = allTasks.value.filter(t => t.status === 'done').length
  const overdue = allTasks.value.filter(t => {
    if (t.status === 'done') return false
    return new Date(t.deadline) < now
  }).length
  return { total, notStarted, inProgress, submitted, done, overdue }
})

const columns = [
  { colKey: 'title', title: '任务标题', ellipsis: true, width: 220 },
  { colKey: 'topicTitle', title: '所属课题', ellipsis: true, width: 200 },
  { colKey: 'taskType', title: '任务类型', width: 90, cell: 'taskType' },
  { colKey: 'priority', title: '优先级', width: 80, cell: 'priority' },
  { colKey: 'assigneeName', title: '负责人', width: 90 },
  { colKey: 'deadline', title: '截止时间', width: 115, cell: 'deadline' },
  { colKey: 'progress', title: '进度', width: 150, cell: 'progress' },
  { colKey: 'status', title: '状态', width: 90, cell: 'status' },
  { colKey: 'operation', title: '操作', width: 190, fixed: 'right', cell: 'operation' },
]

function taskTypeTag(row: TopicTask): 'primary' | 'success' {
  const idx = parseInt(row.id.replace('TT', ''), 10)
  return idx % 3 === 0 ? 'success' : 'primary'
}

function taskTypeLabel(row: TopicTask): string {
  const idx = parseInt(row.id.replace('TT', ''), 10)
  return idx % 3 === 0 ? '多人认领' : '个人任务'
}

function priorityTheme(priority: string): 'danger' | 'warning' | 'primary' | 'default' {
  const map: Record<string, 'danger' | 'warning' | 'primary' | 'default'> = {
    urgent: 'danger',
    high: 'warning',
    medium: 'primary',
    low: 'default',
  }
  return map[priority] || 'default'
}

function priorityLabel(priority: string): string {
  const map: Record<string, string> = {
    urgent: '紧急',
    high: '高',
    medium: '中',
    low: '低',
  }
  return map[priority] || priority
}

function progressColor(row: TopicTask): { from: string; to: string } {
  if (isOverdue(row)) return { from: '#D54941', to: '#E37318' }
  if (row.status === 'done') return { from: '#00A870', to: '#00A870' }
  return { from: '#0052D9', to: '#00A870' }
}

function isOverdue(row: TopicTask): boolean {
  if (row.status === 'done') return false
  return new Date(row.deadline) < new Date()
}

function taskStatusTheme(row: TopicTask): 'default' | 'primary' | 'success' | 'danger' {
  if (isOverdue(row) && row.status !== 'done') return 'danger'
  const map: Record<string, 'default' | 'primary' | 'success' | 'danger'> = {
    todo: 'default',
    in_progress: 'primary',
    review: 'success',
    done: 'success',
  }
  return map[row.status] || 'default'
}

function taskStatusLabel(row: TopicTask): string {
  if (isOverdue(row) && row.status !== 'done') return '已逾期'
  const map: Record<string, string> = {
    todo: '未开始',
    in_progress: '进行中',
    review: '审核中',
    done: '已完成',
  }
  return map[row.status] || row.status
}

function fetchData() {
  loading.value = true
  try {
    const all = mockTopicTasks(1, 100).items
    allTasks.value = all

    let filtered = [...all]
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase()
      filtered = filtered.filter(t => t.title.toLowerCase().includes(kw))
    }
    if (filters.topicId) {
      filtered = filtered.filter(t => t.topicId === filters.topicId)
    }
    if (filters.priority) {
      filtered = filtered.filter(t => t.priority === filters.priority)
    }
    if (filters.status) {
      filtered = filtered.filter(t => t.status === filters.status)
    }

    pagination.total = filtered.length
    const start = (pagination.current - 1) * pagination.pageSize
    dataSource.value = filtered.slice(start, start + pagination.pageSize)
  } catch {
    MessagePlugin.error('加载任务列表失败')
    dataSource.value = []
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.current = 1
  fetchData()
}

function handleReset() {
  filters.keyword = ''
  filters.topicId = ''
  filters.priority = ''
  filters.status = ''
  pagination.current = 1
  fetchData()
}

function handlePageChange(pageInfo: { current: number; pageSize: number }) {
  pagination.current = pageInfo.current
  pagination.pageSize = pageInfo.pageSize
  fetchData()
}

function handleViewSubmit(row: TopicTask) {
  MessagePlugin.info(`查看任务提交: ${row.title}`)
}

const dialogVisible = ref(false)
const submitting = ref(false)
const editingTask = ref<TopicTask | null>(null)

const dialogTitle = computed(() => (editingTask.value ? '编辑任务' : '新建任务'))

const formData = reactive({
  title: '',
  topicId: '',
  description: '',
  assigneeName: '',
  priority: 'medium' as string,
  deadline: '',
  status: 'todo' as string,
})

const formRules = {
  title: [{ required: true, message: '请输入任务标题', trigger: 'blur' }],
  topicId: [{ required: true, message: '请选择所属课题', trigger: 'change' }],
  assigneeName: [{ required: true, message: '请输入负责人姓名', trigger: 'blur' }],
  deadline: [{ required: true, message: '请选择截止时间', trigger: 'change' }],
  priority: [{ required: true, message: '请选择优先级', trigger: 'change' }],
}

const formRef = ref()

function handleCreate() {
  editingTask.value = null
  formData.title = ''
  formData.topicId = ''
  formData.description = ''
  formData.assigneeName = ''
  formData.priority = 'medium'
  formData.deadline = ''
  formData.status = 'todo'
  dialogVisible.value = true
}

function handleEdit(row: TopicTask) {
  editingTask.value = row
  formData.title = row.title
  formData.topicId = row.topicId
  formData.description = row.description
  formData.assigneeName = row.assigneeName
  formData.priority = row.priority
  formData.deadline = row.deadline
  formData.status = row.status
  dialogVisible.value = true
}

function handleDialogClose() {
  formRef.value?.reset()
}

async function handleSubmit() {
  const valid = await formRef.value?.validate()
  if (valid !== true) return

  submitting.value = true
  try {
    if (editingTask.value) {
      Object.assign(editingTask.value, {
        title: formData.title,
        topicId: formData.topicId,
        description: formData.description,
        assigneeName: formData.assigneeName,
        priority: formData.priority,
        deadline: formData.deadline,
        status: formData.status,
      })
      MessagePlugin.success('任务编辑成功')
    } else {
      MessagePlugin.success('任务创建成功')
    }
    dialogVisible.value = false
    fetchData()
  } catch {
    MessagePlugin.error('操作失败，请重试')
  } finally {
    submitting.value = false
  }
}

function handleDelete(row: TopicTask) {
  const idx = allTasks.value.findIndex(t => t.id === row.id)
  if (idx > -1) {
    allTasks.value.splice(idx, 1)
  }
  MessagePlugin.success('任务已删除')
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.stat-card {
  border-radius: 6px;
}

.stat-label {
  font-size: 14px;
  color: #646A73;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1F2329;
}

.text-danger {
  color: #D54941;
  font-weight: 500;
}

.board-view {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  min-height: 400px;
}

.board-column {
  background: #F5F7FA;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  min-height: 400px;
}

.board-column-header {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #1F2329;
  border-bottom: 1px solid #E7E7E7;
}

.board-column-body {
  padding: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
}

.board-card {
  cursor: pointer;
}

.board-card-title {
  font-size: 14px;
  font-weight: 500;
  color: #1F2329;
  margin-bottom: 8px;
}

.board-card-meta {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}

.board-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #646A73;
}

.board-card-deadline {
  color: #646A73;
}
</style>
