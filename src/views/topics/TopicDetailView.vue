<template>
  <div class="page-container">
    <div class="page-header">
      <t-space align="center">
        <t-button variant="text" @click="goBack">
          <t-icon name="chevron-left" />
        </t-button>
        <h2 class="page-title">{{ topic?.title || '课题详情' }}</h2>
        <t-tag v-if="topic" :theme="statusTheme(topic.status)" variant="light">
          {{ statusLabel(topic.status) }}
        </t-tag>
      </t-space>
    </div>

    <t-loading :loading="loading" size="medium">
      <t-card v-if="topic" class="detail-card">
        <t-tabs v-model="activeTab">
          <t-tab-panel value="info" label="课题说明">
            <div class="tab-content">
              <t-card title="基本信息" :bordered="false" class="info-card">
                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label">课题名称</span>
                    <span class="info-value">{{ topic.title }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">负责人</span>
                    <span class="info-value">{{ topic.leader }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">负责人单位</span>
                    <span class="info-value">{{ topic.leaderUniversity }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">成员数量</span>
                    <span class="info-value">{{ topic.memberCount }} 人</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">任务数量</span>
                    <span class="info-value">{{ topic.taskCount }} 个</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">成果数量</span>
                    <span class="info-value">{{ topic.outcomeCount }} 个</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">起止时间</span>
                    <span class="info-value">{{ topic.startDate }} ~ {{ topic.endDate }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">创建时间</span>
                    <span class="info-value">{{ topic.createdAt }}</span>
                  </div>
                </div>
              </t-card>

              <t-card title="课题描述" :bordered="false" class="info-card">
                <p class="desc-text">{{ topic.description }}</p>
              </t-card>

              <t-card title="研究进度" :bordered="false" class="info-card">
                <div class="progress-section">
                  <t-progress
                    :percentage="topicProgress"
                    :label="topicProgress + '%'"
                    theme="line"
                    :color="{ from: '#0052D9', to: '#00A870' }"
                  />
                </div>
                <t-steps :current="currentStep" readonly class="topic-steps">
                  <t-step-item title="立项启动" />
                  <t-step-item title="研究开展" />
                  <t-step-item title="成果产出" />
                  <t-step-item title="结题验收" />
                </t-steps>
              </t-card>
            </div>
          </t-tab-panel>

          <t-tab-panel value="members" label="成员管理">
            <div class="tab-content">
              <t-table
                row-key="id"
                :data="members"
                :columns="memberColumns"
                :pagination="memberPagination"
                stripe
                hover
                @page-change="handleMemberPageChange"
              >
                <template #role="{ row }">
                  <t-tag :theme="roleTheme(row.role)" variant="light" size="small">
                    {{ row.role }}
                  </t-tag>
                </template>
                <template #memberStatus="{ row }">
                  <t-tag :theme="memberStatusTheme(row)" variant="light" size="small">
                    {{ memberStatusLabel(row) }}
                  </t-tag>
                </template>
                <template #taskProgress="{ row }">
                  <t-progress
                    v-if="row.taskCount > 0"
                    :percentage="Math.round((row.completedTaskCount / row.taskCount) * 100)"
                    theme="line"
                    size="small"
                    :color="{ from: '#0052D9', to: '#00A870' }"
                  />
                  <span v-else class="text-muted">-</span>
                </template>
                <template #memberOperation="{ row }">
                  <t-space size="small">
                    <t-popconfirm
                      v-if="memberNeedsApprove(row)"
                      content="确认审核通过该成员？"
                      @confirm="handleApproveMember(row)"
                    >
                      <t-link theme="success" hover="color">通过</t-link>
                    </t-popconfirm>
                    <t-popconfirm
                      v-if="row.role !== '负责人'"
                      content="确认移除该成员？"
                      @confirm="handleRemoveMember(row)"
                    >
                      <t-link theme="danger" hover="color">移除</t-link>
                    </t-popconfirm>
                  </t-space>
                </template>
              </t-table>
            </div>
          </t-tab-panel>

          <t-tab-panel value="resources" label="课题资源">
            <div class="tab-content">
              <div class="table-header">
                <span class="table-title">资源列表</span>
                <t-button theme="primary" size="small" @click="handleUploadResource">
                  <template #icon><t-icon name="upload" /></template>
                  上传资源
                </t-button>
              </div>
              <t-table
                row-key="id"
                :data="resources"
                :columns="resourceColumns"
                stripe
                hover
              >
                <template #resourceType="{ row }">
                  <t-tag variant="light" size="small" :theme="resourceTypeTheme(row.type)">
                    {{ resourceTypeLabel(row.type) }}
                  </t-tag>
                </template>
                <template #resourceOp="{ row }">
                  <t-space size="small">
                    <t-link theme="primary" hover="color" @click="handleDownloadResource(row)">下载</t-link>
                    <t-popconfirm content="确认删除该资源？" @confirm="handleDeleteResource(row)">
                      <t-link theme="danger" hover="color">删除</t-link>
                    </t-popconfirm>
                  </t-space>
                </template>
              </t-table>
              <t-empty v-if="resources.length === 0" description="暂无课题资源" />
            </div>
          </t-tab-panel>

          <t-tab-panel value="announcements" label="公告板">
            <div class="tab-content">
              <div class="table-header">
                <span class="table-title">公告列表</span>
                <t-button theme="primary" size="small" @click="handleCreateAnnouncement">
                  <template #icon><t-icon name="add" /></template>
                  发布公告
                </t-button>
              </div>
              <t-list v-if="announcements.length > 0" :split="true">
                <t-list-item v-for="item in announcements" :key="item.id">
                  <t-list-item-meta>
                    <template #title>
                      <t-space align="center" size="small">
                        <t-tag v-if="item.isTop" theme="danger" size="small">置顶</t-tag>
                        <span class="announcement-title">{{ item.title }}</span>
                      </t-space>
                    </template>
                    <template #description>
                      <div class="announcement-meta">
                        <span>{{ item.publisher }}</span>
                        <t-divider layout="vertical" />
                        <span>{{ item.publishTime }}</span>
                      </div>
                    </template>
                  </t-list-item-meta>
                  <template #content>
                    <p class="announcement-content">{{ item.content }}</p>
                  </template>
                </t-list-item>
              </t-list>
              <t-empty v-else description="暂无公告" />
            </div>
          </t-tab-panel>
        </t-tabs>
      </t-card>

      <t-empty v-else-if="!loading" description="课题不存在" />
    </t-loading>

    <t-dialog
      v-model:visible="announcementDialogVisible"
      header="发布公告"
      :confirm-btn="{ content: '发布', theme: 'primary', loading: announcementSubmitting }"
      :cancel-btn="{ content: '取消' }"
      width="520px"
      @confirm="handleAnnouncementSubmit"
    >
      <t-form ref="announcementFormRef" :data="announcementForm" :rules="announcementRules" label-width="80px">
        <t-form-item label="公告标题" name="title">
          <t-input v-model="announcementForm.title" placeholder="请输入公告标题" />
        </t-form-item>
        <t-form-item label="公告内容" name="content">
          <t-textarea v-model="announcementForm.content" placeholder="请输入公告内容" :autosize="{ minRows: 4, maxRows: 8 }" />
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { MessagePlugin } from 'tdesign-vue-next'
import { mockTopics, mockTopicMembers, mockTopicAnnouncements } from '@/mock/topics'
import type { Topic, TopicMember, TopicAnnouncement } from '@/mock/types'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const topic = ref<Topic | null>(null)
const activeTab = ref('info')

const topicProgress = computed(() => {
  if (!topic.value) return 0
  if (topic.value.taskCount === 0) return 0
  return Math.min(Math.round((topic.value.outcomeCount / topic.value.taskCount) * 100), 100)
})

const currentStep = computed(() => {
  const pct = topicProgress.value
  if (pct >= 100) return 3
  if (pct >= 60) return 2
  if (pct >= 10) return 1
  return 0
})

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

function goBack() {
  router.push('/topics')
}

const members = ref<TopicMember[]>([])
const memberPagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showJumper: true,
})

const memberColumns = [
  { colKey: 'studentName', title: '成员姓名', width: 100 },
  { colKey: 'university', title: '所在单位', ellipsis: true, width: 200 },
  { colKey: 'role', title: '角色', width: 100, cell: 'role' },
  { colKey: 'memberStatus', title: '状态', width: 90, cell: 'memberStatus' },
  { colKey: 'joinDate', title: '加入时间', width: 120 },
  { colKey: 'taskProgress', title: '任务进度', width: 150, cell: 'taskProgress' },
  { colKey: 'memberOperation', title: '操作', width: 140, fixed: 'right', cell: 'memberOperation' },
]

function roleTheme(role: string): 'danger' | 'primary' | 'default' {
  if (role === '负责人') return 'danger'
  if (role === '核心成员') return 'primary'
  return 'default'
}

function memberStatusTheme(row: TopicMember): 'warning' | 'success' | 'default' {
  const idx = parseInt(row.id.replace('TM', ''), 10)
  if (idx % 5 === 0) return 'warning'
  if (row.completedTaskCount > 0) return 'success'
  return 'default'
}

function memberStatusLabel(row: TopicMember): string {
  const idx = parseInt(row.id.replace('TM', ''), 10)
  if (idx % 5 === 0) return '待审核'
  if (row.completedTaskCount > 0) return '审核通过'
  return '已退出'
}

function memberNeedsApprove(row: TopicMember): boolean {
  return memberStatusLabel(row) === '待审核'
}

function handleApproveMember(_row: TopicMember) {
  MessagePlugin.success('成员已审核通过')
}

function handleRemoveMember(_row: TopicMember) {
  MessagePlugin.success('成员已移除')
}

function handleMemberPageChange(pageInfo: { current: number; pageSize: number }) {
  memberPagination.current = pageInfo.current
  memberPagination.pageSize = pageInfo.pageSize
  if (topic.value) {
    const result = mockTopicMembers(topic.value.id, memberPagination.current, memberPagination.pageSize)
    members.value = result.items
    memberPagination.total = result.total
  }
}

interface TopicResource {
  id: string
  name: string
  type: string
  size: string
  uploadTime: string
}

const resources = ref<TopicResource[]>([
  { id: 'TR001', name: '课题启动会议纪要.pdf', type: 'document', size: '2.3MB', uploadTime: '2026-03-05' },
  { id: 'TR002', name: '八达岭长城参考图片集.zip', type: 'image', size: '156MB', uploadTime: '2026-03-10' },
  { id: 'TR003', name: '三维扫描设备操作手册.pdf', type: 'document', size: '8.5MB', uploadTime: '2026-03-15' },
  { id: 'TR004', name: '数字化保护技术路线图.vsd', type: 'project', size: '4.1MB', uploadTime: '2026-04-01' },
  { id: 'TR005', name: '中期检查汇报PPT.pptx', type: 'document', size: '12MB', uploadTime: '2026-06-20' },
])

const resourceColumns = [
  { colKey: 'name', title: '资源名称', ellipsis: true },
  { colKey: 'resourceType', title: '类型', width: 100, cell: 'resourceType' },
  { colKey: 'size', title: '大小', width: 100 },
  { colKey: 'uploadTime', title: '上传时间', width: 130 },
  { colKey: 'resourceOp', title: '操作', width: 140, fixed: 'right', cell: 'resourceOp' },
]

function resourceTypeTheme(type: string): 'primary' | 'success' | 'warning' | 'default' {
  const map: Record<string, 'primary' | 'success' | 'warning' | 'default'> = {
    document: 'primary',
    image: 'success',
    project: 'warning',
  }
  return map[type] || 'default'
}

function resourceTypeLabel(type: string): string {
  const map: Record<string, string> = {
    document: '文档',
    image: '图片',
    project: '工程文件',
    video: '视频',
    model: '模型',
  }
  return map[type] || type
}

function handleUploadResource() {
  MessagePlugin.info('资源上传功能')
}

function handleDownloadResource(row: TopicResource) {
  MessagePlugin.success(`正在下载: ${row.name}`)
}

function handleDeleteResource(row: TopicResource) {
  resources.value = resources.value.filter(r => r.id !== row.id)
  MessagePlugin.success('资源已删除')
}

const announcements = ref<TopicAnnouncement[]>([])

const announcementDialogVisible = ref(false)
const announcementSubmitting = ref(false)
const announcementForm = reactive({
  title: '',
  content: '',
})
const announcementRules = {
  title: [{ required: true, message: '请输入公告标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入公告内容', trigger: 'blur' }],
}
const announcementFormRef = ref()

function handleCreateAnnouncement() {
  announcementForm.title = ''
  announcementForm.content = ''
  announcementDialogVisible.value = true
}

async function handleAnnouncementSubmit() {
  const valid = await announcementFormRef.value?.validate()
  if (valid !== true) return

  announcementSubmitting.value = true
  try {
    const newAnnouncement: TopicAnnouncement = {
      id: 'TA' + Date.now(),
      topicId: topic.value?.id || '',
      title: announcementForm.title,
      content: announcementForm.content,
      publisher: '当前用户',
      publishTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
      isTop: false,
    }
    announcements.value.unshift(newAnnouncement)
    MessagePlugin.success('公告发布成功')
    announcementDialogVisible.value = false
  } catch {
    MessagePlugin.error('发布失败，请重试')
  } finally {
    announcementSubmitting.value = false
  }
}

onMounted(() => {
  loading.value = true
  try {
    const topicId = route.params.id as string
    const allTopics = mockTopics(1, 100).items
    topic.value = allTopics.find(t => t.id === topicId) || null

    if (topic.value) {
      const memberResult = mockTopicMembers(topicId, 1, 10)
      members.value = memberResult.items
      memberPagination.total = memberResult.total

      announcements.value = mockTopicAnnouncements(topicId)
    }
  } catch {
    MessagePlugin.error('加载课题详情失败')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.detail-card {
  border-radius: 6px;
}

.tab-content {
  padding: 16px 0;
}

.info-card {
  margin-bottom: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 13px;
  color: #646A73;
}

.info-value {
  font-size: 14px;
  color: #1F2329;
  font-weight: 500;
}

.desc-text {
  font-size: 14px;
  color: #646A73;
  line-height: 1.8;
}

.progress-section {
  margin-bottom: 24px;
}

.topic-steps {
  margin-top: 8px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 16px;
}

.table-title {
  font-size: 16px;
  font-weight: 600;
  color: #1F2329;
}

.announcement-title {
  font-size: 15px;
  font-weight: 500;
  color: #1F2329;
}

.announcement-meta {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #646A73;
  margin-top: 4px;
}

.announcement-content {
  font-size: 14px;
  color: #646A73;
  line-height: 1.7;
  margin-top: 8px;
}

.text-muted {
  color: #BBBFC4;
}
</style>
