<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">消息中心</h2>
      <t-space>
        <t-badge :count="unreadTotal" :offset="[-6, 6]">
          <t-button variant="outline" @click="handleMarkAllRead" :disabled="unreadTotal === 0">
            <template #icon><t-icon name="check-circle" /></template>
            全部标记已读
          </t-button>
        </t-badge>
      </t-space>
    </div>

    <t-card class="message-card" :bordered="true">
      <t-tabs v-model="activeTab" @change="handleTabChange">
        <t-tab-panel value="all" label="全部" />
        <t-tab-panel value="system" label="系统通知" />
        <t-tab-panel value="notification" label="课程提醒" />
        <t-tab-panel value="assignment" label="作业提醒" />
        <t-tab-panel value="topic" label="课题消息" />
      </t-tabs>

      <t-loading :loading="loading" size="medium">
        <template v-if="error">
          <t-alert theme="error" :message="error" close @close="error = ''" />
        </template>

        <template v-else-if="!loading && filteredMessages.length > 0">
          <div class="message-list">
            <div
              v-for="msg in filteredMessages"
              :key="msg.id"
              class="message-item"
              :class="{ 'message-unread': !msg.isRead }"
              @click="handleViewDetail(msg)"
            >
              <div class="message-left">
                <t-badge :dot="!msg.isRead" :offset="[-2, 2]">
                  <t-icon
                    :name="getTypeIcon(msg.type)"
                    size="20px"
                    :style="{ color: getTypeColor(msg.type) }"
                  />
                </t-badge>
              </div>
              <div class="message-center">
                <div class="message-title-row">
                  <span class="message-title" :class="{ 'fw-bold': !msg.isRead }">
                    {{ msg.title }}
                  </span>
                  <template v-if="msg.isStarred">
                    <t-icon name="star-filled" size="14px" style="color: #F5A623" />
                  </template>
                </div>
                <div class="message-content">
                  {{ truncateContent(msg.content, 80) }}
                </div>
              </div>
              <div class="message-right">
                <t-tag :theme="getTypeTagTheme(msg.type)" variant="light" size="small">
                  {{ getTypeLabel(msg.type) }}
                </t-tag>
                <span class="message-time">{{ formatTime(msg.createdAt) }}</span>
                <t-tag
                  :theme="msg.isRead ? 'default' : 'primary'"
                  variant="outline"
                  size="small"
                >
                  {{ msg.isRead ? '已读' : '未读' }}
                </t-tag>
              </div>
            </div>
          </div>

          <div class="pagination-wrapper">
            <t-pagination
              v-model="pagination.current"
              v-model:page-size="pagination.pageSize"
              :total="pagination.total"
              :page-size-options="[5, 10, 20]"
              show-page-size
              @change="loadMessages"
            />
          </div>
        </template>

        <t-empty v-else-if="!loading" description="暂无消息" />
      </t-loading>
    </t-card>

    <t-dialog
      v-model:visible="detailVisible"
      header="消息详情"
      width="600px"
      :footer="false"
    >
      <template v-if="selectedMessage">
        <div class="detail-header">
          <h3 class="detail-title">{{ selectedMessage.title }}</h3>
          <t-space size="small">
            <t-tag :theme="getTypeTagTheme(selectedMessage.type)" variant="light">
              {{ getTypeLabel(selectedMessage.type) }}
            </t-tag>
            <t-tag :theme="selectedMessage.isRead ? 'default' : 'primary'" variant="outline">
              {{ selectedMessage.isRead ? '已读' : '未读' }}
            </t-tag>
          </t-space>
        </div>
        <t-divider />
        <div class="detail-meta">
          <span>发件人：{{ selectedMessage.senderName }}</span>
          <span>时间：{{ selectedMessage.createdAt }}</span>
        </div>
        <t-divider />
        <div class="detail-content">{{ selectedMessage.content }}</div>
      </template>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { mockMessages } from '@/mock'
import type { Message } from '@/mock/types'

const loading = ref(false)
const error = ref('')
const activeTab = ref('all')
const detailVisible = ref(false)
const selectedMessage = ref<Message | null>(null)

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
})

const messageList = ref<Message[]>([])

const unreadTotal = computed(() => messageList.value.filter((m) => !m.isRead).length)

const filteredMessages = computed(() => {
  if (activeTab.value === 'all') return messageList.value
  return messageList.value.filter((m) => m.type === activeTab.value)
})

const typeLabelMap: Record<string, string> = {
  system: '系统',
  assignment: '作业',
  review: '评审',
  topic: '课题',
  notification: '课程',
}

const typeTagThemeMap: Record<string, string> = {
  system: 'primary',
  assignment: 'warning',
  review: 'warning',
  topic: 'default',
  notification: 'success',
}

const typeColorMap: Record<string, string> = {
  system: '#0052D9',
  assignment: '#E37318',
  review: '#E37318',
  topic: '#666',
  notification: '#00A870',
}

const typeIconMap: Record<string, string> = {
  system: 'info-circle',
  assignment: 'file-paste',
  review: 'edit',
  topic: 'flag',
  notification: 'book',
}

function getTypeLabel(type: string): string {
  return typeLabelMap[type] || type
}

function getTypeTagTheme(type: string): string {
  return typeTagThemeMap[type] || 'default'
}

function getTypeColor(type: string): string {
  return typeColorMap[type] || '#666'
}

function getTypeIcon(type: string): string {
  return typeIconMap[type] || 'notification'
}

function formatTime(time: string): string {
  if (!time) return ''
  return time.slice(5, 16)
}

function truncateContent(content: string, maxLen: number): string {
  if (!content) return ''
  return content.length > maxLen ? content.slice(0, maxLen) + '...' : content
}

function loadMessages() {
  loading.value = true
  error.value = ''
  try {
    const result = mockMessages(pagination.current, pagination.pageSize)
    messageList.value = result.items
    pagination.total = result.total
  } catch (e: any) {
    error.value = e?.message || '消息加载失败'
  } finally {
    loading.value = false
  }
}

function handleTabChange() {
  pagination.current = 1
}

function handleViewDetail(msg: Message) {
  selectedMessage.value = msg
  detailVisible.value = true
  if (!msg.isRead) {
    msg.isRead = true
  }
}

function handleMarkAllRead() {
  const unread = messageList.value.filter((m) => !m.isRead)
  if (unread.length === 0) {
    MessagePlugin.info('没有未读消息')
    return
  }
  unread.forEach((m) => {
    m.isRead = true
  })
  MessagePlugin.success(`已标记 ${unread.length} 条消息为已读`)
}

loadMessages()
</script>

<style scoped>
.page-container {
  max-width: 1200px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #1F2329;
  margin: 0;
}

.message-card {
  border-radius: 8px;
}

.message-card :deep(.t-card__body) {
  padding: 0;
}

.message-card :deep(.t-tabs__header) {
  padding: 0 20px;
}

.message-list {
  padding: 0 20px;
}

.message-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  cursor: pointer;
  border-bottom: 1px solid #F0F0F0;
  transition: background 0.2s;
}

.message-item:hover {
  background: #F5F7FA;
}

.message-item:last-child {
  border-bottom: none;
}

.message-unread {
  background: #F0F5FF;
}

.message-left {
  flex-shrink: 0;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message-center {
  flex: 1;
  min-width: 0;
}

.message-title-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.message-title {
  font-size: 15px;
  color: #1F2329;
}

.fw-bold {
  font-weight: 600;
}

.message-content {
  font-size: 13px;
  color: #999;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.message-right {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.message-time {
  font-size: 12px;
  color: #bbb;
}

.pagination-wrapper {
  padding: 16px 20px;
  display: flex;
  justify-content: flex-end;
}

.detail-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.detail-title {
  font-size: 18px;
  font-weight: 600;
  color: #1F2329;
  margin: 0;
  flex: 1;
}

.detail-meta {
  display: flex;
  gap: 24px;
  font-size: 13px;
  color: #999;
}

.detail-content {
  font-size: 15px;
  line-height: 1.8;
  color: #333;
  white-space: pre-wrap;
}
</style>
