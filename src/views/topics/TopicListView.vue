<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">课题管理</h2>
    </div>

    <div class="filter-bar">
      <t-form layout="inline" :data="filters" @submit="handleSearch" @reset="handleReset">
        <t-form-item label="课题名称">
          <t-input v-model="filters.keyword" placeholder="请输入课题名称" clearable style="width:200px" />
        </t-form-item>
        <t-form-item label="状态">
          <t-select v-model="filters.status" placeholder="请选择状态" clearable style="width:140px">
            <t-option value="active" label="进行中" />
            <t-option value="completed" label="已完成" />
            <t-option value="archived" label="已归档" />
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
        <span class="table-title">课题列表</span>
        <div class="toolbar-actions">
          <t-button theme="primary" @click="handleCreate">
            <template #icon><t-icon name="add" /></template>
            新建课题
          </t-button>
        </div>
      </div>

      <t-loading :loading="loading" size="medium">
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
          <template #status="{ row }">
            <t-tag :theme="statusTheme(row.status)" variant="light">
              {{ statusLabel(row.status) }}
            </t-tag>
          </template>
          <template #progress="{ row }">
            <t-progress
              :percentage="computeProgress(row)"
              :label="computeProgress(row) + '%'"
              theme="line"
              size="small"
              :color="{ from: '#0052D9', to: '#00A870' }"
            />
          </template>
          <template #operation="{ row }">
            <t-space size="small">
              <t-link theme="primary" hover="color" @click="handleViewDetail(row)">查看详情</t-link>
              <t-link theme="primary" hover="color" @click="handleEdit(row)">编辑</t-link>
              <t-popconfirm content="确认归档该课题？" @confirm="handleArchive(row)">
                <t-link theme="warning" hover="color">归档</t-link>
              </t-popconfirm>
            </t-space>
          </template>
        </t-table>
        <t-empty v-else description="暂无课题数据" />
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
      <t-form ref="formRef" :data="formData" :rules="formRules" label-width="90px">
        <t-form-item label="课题名称" name="title">
          <t-input v-model="formData.title" placeholder="请输入课题名称" />
        </t-form-item>
        <t-form-item label="课题描述" name="description">
          <t-textarea v-model="formData.description" placeholder="请输入课题描述" :autosize="{ minRows: 3, maxRows: 6 }" />
        </t-form-item>
        <t-form-item label="负责人" name="leader">
          <t-input v-model="formData.leader" placeholder="请输入负责人姓名" />
        </t-form-item>
        <t-form-item label="负责人单位" name="leaderUniversity">
          <t-input v-model="formData.leaderUniversity" placeholder="请输入负责人所在单位" />
        </t-form-item>
        <t-form-item label="开始日期" name="startDate">
          <t-date-picker v-model="formData.startDate" placeholder="请选择开始日期" style="width:100%" />
        </t-form-item>
        <t-form-item label="结束日期" name="endDate">
          <t-date-picker v-model="formData.endDate" placeholder="请选择结束日期" style="width:100%" />
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { MessagePlugin } from 'tdesign-vue-next'
import { mockTopics } from '@/mock/topics'
import type { Topic, PaginatedResponse } from '@/mock/types'

const router = useRouter()

const loading = ref(false)
const dataSource = ref<Topic[]>([])

const filters = reactive({
  keyword: '',
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

const columns = [
  { colKey: 'title', title: '课题名称', ellipsis: true, width: 260 },
  { colKey: 'leader', title: '负责人', width: 100 },
  { colKey: 'memberCount', title: '成员数量', width: 90, align: 'center' },
  { colKey: 'taskCount', title: '任务数量', width: 90, align: 'center' },
  { colKey: 'status', title: '状态', width: 90, cell: 'status' },
  { colKey: 'progress', title: '进度', width: 160, cell: 'progress' },
  { colKey: 'createdAt', title: '创建时间', width: 120 },
  { colKey: 'operation', title: '操作', width: 200, fixed: 'right', cell: 'operation' },
]

function statusTheme(status: string): 'default' | 'primary' | 'success' | 'warning' {
  const map: Record<string, 'default' | 'primary' | 'success' | 'warning'> = {
    active: 'primary',
    completed: 'success',
    archived: 'warning',
  }
  return map[status] || 'default'
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    active: '进行中',
    completed: '已完成',
    archived: '已归档',
  }
  return map[status] || status
}

function computeProgress(row: Topic): number {
  if (row.taskCount === 0) return 0
  const pct = Math.round((row.outcomeCount / row.taskCount) * 100)
  return Math.min(pct, 100)
}

function fetchData() {
  loading.value = true
  try {
    const keyword = filters.keyword.toLowerCase()
    let result: PaginatedResponse<Topic> = mockTopics(pagination.current, pagination.pageSize)
    if (filters.status) {
      result.items = result.items.filter(item => item.status === filters.status)
    }
    if (keyword) {
      result.items = result.items.filter(
        item => item.title.toLowerCase().includes(keyword) || item.leader.includes(keyword)
      )
    }
    pagination.total = result.items.length
    dataSource.value = result.items
  } catch (e) {
    MessagePlugin.error('加载课题列表失败')
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
  filters.status = ''
  pagination.current = 1
  fetchData()
}

function handlePageChange(pageInfo: { current: number; pageSize: number }) {
  pagination.current = pageInfo.current
  pagination.pageSize = pageInfo.pageSize
  fetchData()
}

function handleViewDetail(row: Topic) {
  router.push(`/topics/${row.id}`)
}

const dialogVisible = ref(false)
const submitting = ref(false)
const editingTopic = ref<Topic | null>(null)

const dialogTitle = computed(() => (editingTopic.value ? '编辑课题' : '新建课题'))

const formData = reactive({
  title: '',
  description: '',
  leader: '',
  leaderUniversity: '',
  startDate: '',
  endDate: '',
})

const formRules = {
  title: [{ required: true, message: '请输入课题名称', trigger: 'blur' }],
  leader: [{ required: true, message: '请输入负责人姓名', trigger: 'blur' }],
  startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
}

const formRef = ref()

function handleCreate() {
  editingTopic.value = null
  formData.title = ''
  formData.description = ''
  formData.leader = ''
  formData.leaderUniversity = ''
  formData.startDate = ''
  formData.endDate = ''
  dialogVisible.value = true
}

function handleEdit(row: Topic) {
  editingTopic.value = row
  formData.title = row.title
  formData.description = row.description
  formData.leader = row.leader
  formData.leaderUniversity = row.leaderUniversity
  formData.startDate = row.startDate
  formData.endDate = row.endDate
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
    if (editingTopic.value) {
      Object.assign(editingTopic.value, formData)
      MessagePlugin.success('课题编辑成功')
    } else {
      MessagePlugin.success('课题创建成功')
    }
    dialogVisible.value = false
    fetchData()
  } catch {
    MessagePlugin.error('操作失败，请重试')
  } finally {
    submitting.value = false
  }
}

function handleArchive(row: Topic) {
  row.status = 'archived'
  MessagePlugin.success('课题已归档')
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
:deep(.t-table) {
  font-size: 14px;
}
</style>
