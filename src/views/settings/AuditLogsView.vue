<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">操作日志</h2>
    </div>

    <t-alert theme="warning" message="操作日志不可删除，用于安全审计" style="margin-bottom: 16px" />

    <div class="filter-bar">
      <t-form layout="inline" :data="filters" @submit="handleSearch" @reset="handleReset">
        <t-form-item label="操作人">
          <t-input v-model="filters.userName" placeholder="请输入操作人" clearable style="width: 160px" />
        </t-form-item>
        <t-form-item label="操作类型">
          <t-select v-model="filters.actionType" placeholder="全部" clearable style="width: 140px">
            <t-option value="" label="全部" />
            <t-option value="登录" label="登录" />
            <t-option value="创建" label="创建" />
            <t-option value="更新" label="更新" />
            <t-option value="删除" label="删除" />
            <t-option value="审批" label="审批" />
            <t-option value="导出" label="导出" />
          </t-select>
        </t-form-item>
        <t-form-item label="时间范围">
          <t-date-range-picker
            v-model="filters.dateRange"
            clearable
            style="width: 260px"
          />
        </t-form-item>
        <t-form-item>
          <t-button theme="primary" type="submit">查询</t-button>
          <t-button variant="outline" type="reset" style="margin-left: 8px">重置</t-button>
        </t-form-item>
      </t-form>
    </div>

    <t-loading :loading="loading" size="medium">
      <template v-if="error">
        <t-alert theme="error" :message="error" close @close="error = ''" />
      </template>

      <template v-else-if="!loading && logList.length > 0">
        <t-card :bordered="true" class="table-card">
          <t-table
            row-key="id"
            :data="logList"
            :columns="columns"
            stripe
            hover
            table-layout="auto"
          >
            <template #action="{ row }">
              <t-tag :theme="getActionTheme(row.action)" variant="light">
                {{ row.action }}
              </t-tag>
            </template>
            <template #status="{ row }">
              <t-tag :theme="row.status === 'success' ? 'success' : 'danger'" variant="light">
                {{ row.status === 'success' ? '成功' : '失败' }}
              </t-tag>
            </template>
            <template #operation="{ row }">
              <t-link theme="primary" hover="color" @click="handleViewDetail(row)">
                查看详情
              </t-link>
            </template>
          </t-table>

          <div class="pagination-wrapper">
            <t-pagination
              v-model="pagination.current"
              v-model:page-size="pagination.pageSize"
              :total="pagination.total"
              :page-size-options="[10, 20, 50]"
              show-page-size
              @change="loadLogs"
            />
          </div>
        </t-card>
      </template>

      <t-empty v-else-if="!loading" description="暂无操作日志" />
    </t-loading>

    <t-drawer
      v-model:visible="drawerVisible"
      header="操作日志详情"
      size="480px"
      :footer="false"
    >
      <template v-if="selectedLog">
        <div class="detail-section">
          <div class="detail-item">
            <span class="detail-label">操作人</span>
            <span class="detail-value">{{ selectedLog.userName }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">用户ID</span>
            <span class="detail-value">{{ selectedLog.userId }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">操作类型</span>
            <t-tag :theme="getActionTheme(selectedLog.action)" variant="light" size="small">
              {{ selectedLog.action }}
            </t-tag>
          </div>
          <div class="detail-item">
            <span class="detail-label">操作对象</span>
            <span class="detail-value">{{ selectedLog.module }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">执行状态</span>
            <t-tag :theme="selectedLog.status === 'success' ? 'success' : 'danger'" variant="light" size="small">
              {{ selectedLog.status === 'success' ? '成功' : '失败' }}
            </t-tag>
          </div>
          <t-divider />
          <div class="detail-item block">
            <span class="detail-label">操作详情</span>
            <span class="detail-value detail-text">{{ selectedLog.detail }}</span>
          </div>
          <t-divider />
          <div class="detail-item">
            <span class="detail-label">IP 地址</span>
            <span class="detail-value">{{ selectedLog.ip }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">User Agent</span>
            <span class="detail-value detail-text">{{ selectedLog.userAgent }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">操作时间</span>
            <span class="detail-value">{{ selectedLog.createdAt }}</span>
          </div>
        </div>
      </template>
    </t-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { mockAuditLogs } from '@/mock'
import type { AuditLog } from '@/mock/types'

const loading = ref(false)
const error = ref('')
const logList = ref<AuditLog[]>([])
const drawerVisible = ref(false)
const selectedLog = ref<AuditLog | null>(null)

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
})

const filters = reactive({
  userName: '',
  actionType: '',
  dateRange: [] as string[],
})

const columns = [
  { colKey: 'userName', title: '操作人', width: 120 },
  { colKey: 'action', title: '操作类型', width: 100 },
  { colKey: 'module', title: '操作对象', width: 120 },
  { colKey: 'detail', title: '操作详情', ellipsis: true },
  { colKey: 'status', title: '执行状态', width: 90 },
  { colKey: 'ip', title: 'IP地址', width: 140 },
  { colKey: 'createdAt', title: '操作时间', width: 160 },
  { colKey: 'operation', title: '操作', width: 90 },
]

const actionKeywords: Record<string, string[]> = {
  '登录': ['登录'],
  '创建': ['新增', '发布', '上传'],
  '更新': ['修改', '配置', '调整', '标记'],
  '删除': ['删除'],
  '审批': ['评审'],
  '导出': ['下载'],
}

function categorizeAction(action: string): string {
  for (const [category, keywords] of Object.entries(actionKeywords)) {
    if (keywords.some((kw) => action.includes(kw))) {
      return category
    }
  }
  return '其他'
}

const actionThemeMap: Record<string, string> = {
  '登录': 'primary',
  '创建': 'success',
  '更新': 'warning',
  '删除': 'danger',
  '审批': 'primary',
  '导出': 'default',
  '其他': 'default',
}

function getActionTheme(action: string): string {
  return actionThemeMap[categorizeAction(action)] || 'default'
}

function loadLogs() {
  loading.value = true
  error.value = ''
  try {
    let result = mockAuditLogs(pagination.current, pagination.pageSize)

    if (filters.userName) {
      result.items = result.items.filter((item) =>
        item.userName.includes(filters.userName)
      )
    }

    if (filters.actionType) {
      result.items = result.items.filter(
        (item) => categorizeAction(item.action) === filters.actionType
      )
    }

    if (filters.dateRange.length === 2) {
      const [start, end] = filters.dateRange
      result.items = result.items.filter((item) => {
        const date = item.createdAt.slice(0, 10)
        return date >= start && date <= end
      })
    }

    logList.value = result.items
    pagination.total = result.total
  } catch (e: any) {
    error.value = e?.message || '日志数据加载失败'
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.current = 1
  loadLogs()
}

function handleReset() {
  filters.userName = ''
  filters.actionType = ''
  filters.dateRange = []
  pagination.current = 1
  loadLogs()
}

function handleViewDetail(row: AuditLog) {
  selectedLog.value = row
  drawerVisible.value = true
}

loadLogs()
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
  margin-bottom: 16px;
  border: 1px solid #E7E7E7;
}

.table-card {
  border-radius: 8px;
}

.pagination-wrapper {
  padding: 16px 0 0;
  display: flex;
  justify-content: flex-end;
}

.detail-section {
  padding: 4px 0;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
}

.detail-item.block {
  flex-direction: column;
  gap: 8px;
}

.detail-label {
  font-size: 14px;
  color: #999;
  width: 90px;
  flex-shrink: 0;
}

.detail-value {
  font-size: 14px;
  color: #1F2329;
  flex: 1;
}

.detail-text {
  line-height: 1.7;
  word-break: break-all;
}
</style>
