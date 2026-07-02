<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">培训邀约</h2>
      <t-button variant="outline" @click="handleExport">
        <template #icon><t-icon name="download" /></template>
        导出记录
      </t-button>
    </div>

    <div class="filter-bar">
      <t-form layout="inline" :data="filters" @submit="handleSearch" @reset="handleReset">
        <t-form-item label="学校">
          <t-input v-model="filters.keyword" placeholder="请输入学校名称" clearable style="width: 200px" />
        </t-form-item>
        <t-form-item label="状态">
          <t-select v-model="filters.status" placeholder="全部状态" clearable style="width: 140px">
            <t-option value="pending" label="待处理" />
            <t-option value="accepted" label="已接受" />
            <t-option value="rejected" label="已拒绝" />
          </t-select>
        </t-form-item>
        <t-form-item label="邀约日期">
          <t-date-range-picker
            v-model="filters.dateRange"
            placeholder="请选择日期范围"
            clearable
            style="width: 260px"
          />
        </t-form-item>
        <t-form-item>
          <t-space size="8px">
            <t-button theme="primary" type="submit">查询</t-button>
            <t-button variant="outline" type="reset">重置</t-button>
          </t-space>
        </t-form-item>
      </t-form>
    </div>

    <t-loading :loading="loading" size="medium">
      <div v-if="!isEmpty" class="table-container">
        <t-table
          row-key="id"
          :data="dataSource"
          :columns="columns"
          :pagination="{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
          }"
          stripe
          hover
          table-layout="auto"
          @page-change="handlePageChange"
        >
          <template #status="{ row }">
            <t-tag :theme="statusTagTheme(row.status)" variant="light" size="small">
              {{ statusLabel(row.status) }}
            </t-tag>
          </template>
          <template #operation="{ row }">
            <t-space size="small">
              <t-link theme="primary" hover="color" @click="handleViewDetail(row)">查看</t-link>
              <t-link theme="warning" hover="color" @click="handleOpenRemark(row)">备注</t-link>
              <t-link theme="primary" hover="color" @click="handleOpenStatus(row)">更新状态</t-link>
            </t-space>
          </template>
        </t-table>
      </div>
      <t-empty v-else description="暂无培训邀约记录" />
    </t-loading>

    <t-drawer
      v-model:visible="detailDrawerVisible"
      header="邀约详情"
      size="480px"
      :footer="false"
    >
      <template v-if="detailTarget">
        <t-descriptions :column="1" bordered>
          <t-descriptions-item label="邀约编号">{{ detailTarget.id }}</t-descriptions-item>
          <t-descriptions-item label="学校">{{ detailTarget.schoolName }}</t-descriptions-item>
          <t-descriptions-item label="联系人">{{ detailTarget.contactPerson }}</t-descriptions-item>
          <t-descriptions-item label="联系电话">{{ detailTarget.contactPhone }}</t-descriptions-item>
          <t-descriptions-item label="联系邮箱">{{ detailTarget.contactEmail }}</t-descriptions-item>
          <t-descriptions-item label="邀约人数">{{ detailTarget.invitedStudents }}人</t-descriptions-item>
          <t-descriptions-item label="邀约日期">{{ detailTarget.inviteDate }}</t-descriptions-item>
          <t-descriptions-item label="回复日期">
            {{ detailTarget.responseDate || '暂无回复' }}
          </t-descriptions-item>
          <t-descriptions-item label="状态">
            <t-tag :theme="statusTagTheme(detailTarget.status)" variant="light">
              {{ statusLabel(detailTarget.status) }}
            </t-tag>
          </t-descriptions-item>
          <t-descriptions-item label="备注">
            {{ detailTarget.notes || '暂无备注' }}
          </t-descriptions-item>
        </t-descriptions>
      </template>
    </t-drawer>

    <t-dialog
      v-model:visible="statusDialogVisible"
      header="更新邀约状态"
      :confirm-btn="{ content: '确认更新', theme: 'primary', loading: submitting }"
      :cancel-btn="{ content: '取消' }"
      width="460px"
      @confirm="handleStatusConfirm"
    >
      <t-form :data="statusForm" label-width="90px">
        <t-form-item label="当前状态">
          <t-tag v-if="statusTarget" :theme="statusTagTheme(statusTarget.status)" variant="light">
            {{ statusLabel(statusTarget.status) }}
          </t-tag>
        </t-form-item>
        <t-form-item label="新状态" name="newStatus">
          <t-select v-model="statusForm.newStatus" placeholder="请选择新状态" style="width: 100%">
            <t-option value="pending" label="待处理" />
            <t-option value="accepted" label="已接受" />
            <t-option value="rejected" label="已拒绝" />
          </t-select>
        </t-form-item>
        <t-form-item label="备注" name="remark">
          <t-textarea
            v-model="statusForm.remark"
            placeholder="请输入状态更新备注（可选）"
            :autosize="{ minRows: 2, maxRows: 4 }"
          />
        </t-form-item>
      </t-form>
    </t-dialog>

    <t-dialog
      v-model:visible="remarkDialogVisible"
      header="添加备注"
      :confirm-btn="{ content: '保存备注', theme: 'primary' }"
      :cancel-btn="{ content: '取消' }"
      width="460px"
      @confirm="handleRemarkConfirm"
    >
      <t-form :data="remarkForm" label-width="80px">
        <t-form-item label="学校">
          <span v-if="remarkTarget">{{ remarkTarget.schoolName }}</span>
        </t-form-item>
        <t-form-item label="备注内容" name="content">
          <t-textarea
            v-model="remarkForm.content"
            placeholder="请输入备注内容"
            :autosize="{ minRows: 3, maxRows: 6 }"
          />
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { mockInvitations } from '@/mock/invitations'
import type { Invitation } from '@/mock/types'

const loading = ref(false)
const dataSource = ref<Invitation[]>([])
const isEmpty = computed(() => !loading.value && dataSource.value.length === 0)

const filters = reactive({
  keyword: '',
  status: '',
  dateRange: [] as string[],
})

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
})

const detailDrawerVisible = ref(false)
const detailTarget = ref<Invitation | null>(null)

const statusDialogVisible = ref(false)
const statusTarget = ref<Invitation | null>(null)
const submitting = ref(false)
const statusForm = reactive({
  newStatus: '',
  remark: '',
})

const remarkDialogVisible = ref(false)
const remarkTarget = ref<Invitation | null>(null)
const remarkForm = reactive({
  content: '',
})

const columns = [
  { colKey: 'schoolName', title: '学校', ellipsis: true, width: 200 },
  { colKey: 'contactPerson', title: '联系人', width: 100 },
  { colKey: 'contactPhone', title: '联系电话', width: 130 },
  { colKey: 'contactEmail', title: '邮箱', ellipsis: true, width: 200 },
  { colKey: 'invitedStudents', title: '邀约人数', width: 100 },
  { colKey: 'inviteDate', title: '邀约日期', width: 120 },
  { colKey: 'status', title: '状态', width: 100 },
  { colKey: 'operation', title: '操作', width: 220, fixed: 'right' as const },
]

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    pending: '待处理',
    accepted: '已接受',
    rejected: '已拒绝',
  }
  return map[status] || status
}

function statusTagTheme(status: string): string {
  const map: Record<string, string> = {
    pending: 'warning',
    accepted: 'success',
    rejected: 'danger',
  }
  return map[status] || 'default'
}

function fetchData() {
  loading.value = true
  try {
    const res = mockInvitations(pagination.current, pagination.pageSize)
    let filtered = res.items

    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase()
      filtered = filtered.filter(
        r =>
          r.schoolName.toLowerCase().includes(kw) ||
          r.contactPerson.toLowerCase().includes(kw)
      )
    }

    if (filters.status) {
      filtered = filtered.filter(r => r.status === filters.status)
    }

    if (filters.dateRange && filters.dateRange.length === 2) {
      const [start, end] = filters.dateRange
      filtered = filtered.filter(r => r.inviteDate >= start && r.inviteDate <= end)
    }

    dataSource.value = filtered
    pagination.total = filtered.length
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
  filters.dateRange = []
  pagination.current = 1
  fetchData()
}

function handlePageChange(pageInfo: { current: number; pageSize: number }) {
  pagination.current = pageInfo.current
  pagination.pageSize = pageInfo.pageSize
  fetchData()
}

function handleViewDetail(row: Invitation) {
  detailTarget.value = row
  detailDrawerVisible.value = true
}

function handleOpenRemark(row: Invitation) {
  remarkTarget.value = row
  remarkForm.content = row.notes || ''
  remarkDialogVisible.value = true
}

function handleRemarkConfirm() {
  if (!remarkForm.content.trim()) {
    MessagePlugin.warning('请输入备注内容')
    return
  }
  MessagePlugin.success(`已为 ${remarkTarget.value?.schoolName} 添加备注`)
  remarkDialogVisible.value = false
  remarkTarget.value = null
  remarkForm.content = ''
}

function handleOpenStatus(row: Invitation) {
  statusTarget.value = row
  statusForm.newStatus = row.status
  statusForm.remark = ''
  statusDialogVisible.value = true
}

function handleStatusConfirm() {
  if (!statusForm.newStatus) {
    MessagePlugin.warning('请选择新状态')
    return
  }
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    MessagePlugin.success(
      `已将 ${statusTarget.value?.schoolName} 状态更新为 ${statusLabel(statusForm.newStatus)}`
    )
    statusDialogVisible.value = false
    statusTarget.value = null
    fetchData()
  }, 600)
}

function handleExport() {
  MessagePlugin.info('导出功能开发中')
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.page-container {
  padding: 0;
}

.page-header {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #1F2329;
  margin: 0;
}

.filter-bar {
  margin-bottom: 16px;
  padding: 16px;
  background: #fff;
  border-radius: 6px;
}

.table-container {
  background: #fff;
  border-radius: 6px;
  padding: 0;
}
</style>
