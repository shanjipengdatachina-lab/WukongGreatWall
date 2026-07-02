<template>
  <div class="page-container">
    <div v-if="loading" class="loading-wrap">
      <t-loading text="加载评审数据中..." />
    </div>
    <div v-else-if="errorMsg" class="error-wrap">
      <t-empty :description="errorMsg">
        <template #action>
          <t-button theme="primary" @click="$router.back()">返回列表</t-button>
        </template>
      </t-empty>
    </div>
    <div v-else-if="!submission" class="error-wrap">
      <t-empty description="提交记录不存在">
        <template #action>
          <t-button theme="primary" @click="$router.back()">返回列表</t-button>
        </template>
      </t-empty>
    </div>
    <template v-else>
      <t-card class="submission-info-card" :bordered="true">
        <div class="info-header">
          <div class="info-left">
            <div class="info-row">
              <span class="info-label">作业标题：</span>
              <span class="info-value">{{ submission.assignmentTitle }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">所属课程：</span>
              <span class="info-value">{{ submission.courseTitle }}</span>
            </div>
          </div>
          <div class="info-right">
            <div class="info-row">
              <span class="info-label">学员姓名：</span>
              <span class="info-value">{{ submission.studentName }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Scholar ID：</span>
              <span class="info-value">{{ submission.scholarId }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">院校：</span>
              <span class="info-value">{{ submission.university }}</span>
            </div>
          </div>
        </div>
        <div class="info-footer">
          <div class="info-row">
            <span class="info-label">提交版本：</span>
            <t-tag theme="primary" variant="light" size="small">
              V{{ currentVersion }}
            </t-tag>
          </div>
          <div class="info-row">
            <span class="info-label">提交时间：</span>
            <span class="info-value">{{ submission.submitTime }}</span>
          </div>
          <div v-if="submission.score !== null" class="info-row">
            <span class="info-label">评审分数：</span>
            <t-tag theme="success" variant="light" size="small">{{ submission.score }}分</t-tag>
          </div>
        </div>
        <div class="action-bar">
          <t-space>
            <t-button theme="success" @click="approveDialogVisible = true">通过</t-button>
            <t-button theme="warning" @click="rejectDialogVisible = true">退回修改</t-button>
            <t-button variant="outline" @click="$router.back()">返回</t-button>
          </t-space>
        </div>
      </t-card>

      <div class="workspace-content">
        <div class="preview-panel">
          <t-card :bordered="true" class="preview-card">
            <t-tabs v-model="previewTab">
              <t-tab-panel value="image" label="图片预览">
                <div class="preview-body">
                  <div v-if="imageFiles.length > 0" class="image-preview-area">
                    <div
                      v-for="img in imageFiles"
                      :key="img.id"
                      class="image-card"
                    >
                      <div class="image-placeholder">
                        <t-icon name="image" size="48px" />
                        <span class="image-name">{{ img.fileName }}</span>
                        <span class="image-size">{{ img.fileSize }}</span>
                      </div>
                    </div>
                  </div>
                  <t-empty v-else description="暂无可预览的图片文件" />
                </div>
              </t-tab-panel>
              <t-tab-panel value="pdf" label="PDF预览">
                <div class="preview-body">
                  <div v-if="pdfFiles.length > 0" class="pdf-preview-area">
                    <div
                      v-for="pdf in pdfFiles"
                      :key="pdf.id"
                      class="pdf-card"
                    >
                      <div class="pdf-placeholder">
                        <t-icon name="file-pdf" size="48px" />
                        <span class="pdf-name">{{ pdf.fileName }}</span>
                        <span class="pdf-size">{{ pdf.fileSize }}</span>
                        <span class="pdf-hint">（PDF预览区域）</span>
                      </div>
                    </div>
                  </div>
                  <t-empty v-else description="暂无可预览的PDF文件" />
                </div>
              </t-tab-panel>
            </t-tabs>
          </t-card>
        </div>

        <div class="sidebar-panel">
          <t-card :bordered="true" class="annotation-card">
            <t-tabs v-model="sidebarTab">
              <t-tab-panel value="teacher" label="老师批注">
                <div class="annotation-list">
                  <t-timeline v-if="teacherAnnotations.length > 0" mode="alternate">
                    <t-timeline-item
                      v-for="ann in teacherAnnotations"
                      :key="ann.id"
                      label=""
                    >
                      <div class="annotation-item">
                        <div class="annotation-header">
                          <t-tag theme="primary" variant="light" size="small">老师</t-tag>
                          <span class="annotation-author">{{ ann.author }}</span>
                          <span class="annotation-time">{{ ann.createdAt }}</span>
                        </div>
                        <div class="annotation-content">{{ ann.content }}</div>
                      </div>
                    </t-timeline-item>
                  </t-timeline>
                  <t-empty v-else description="暂无老师批注" size="small" />
                </div>
                <div class="annotation-input">
                  <t-textarea
                    v-model="newTeacherAnnotation"
                    placeholder="输入批注内容..."
                    :autosize="{ minRows: 2, maxRows: 4 }"
                  />
                  <t-button
                    theme="primary"
                    block
                    class="submit-annotation-btn"
                    :disabled="!newTeacherAnnotation.trim()"
                    @click="submitTeacherAnnotation"
                  >
                    提交批注
                  </t-button>
                </div>
              </t-tab-panel>

              <t-tab-panel value="reviewer" label="评审员批注">
                <div class="annotation-list">
                  <t-timeline v-if="reviewerAnnotations.length > 0" mode="alternate">
                    <t-timeline-item
                      v-for="ann in reviewerAnnotations"
                      :key="ann.id"
                      label=""
                    >
                      <div class="annotation-item">
                        <div class="annotation-header">
                          <t-tag theme="warning" variant="light" size="small">评审员</t-tag>
                          <span class="annotation-author">{{ ann.author }}</span>
                          <span class="annotation-time">{{ ann.createdAt }}</span>
                        </div>
                        <div class="annotation-content">{{ ann.content }}</div>
                      </div>
                    </t-timeline-item>
                  </t-timeline>
                  <t-empty v-else description="暂无评审员批注" size="small" />
                </div>
                <div class="annotation-input">
                  <t-textarea
                    v-model="newReviewerAnnotation"
                    placeholder="输入评审批注内容..."
                    :autosize="{ minRows: 2, maxRows: 4 }"
                  />
                  <t-button
                    theme="primary"
                    block
                    class="submit-annotation-btn"
                    :disabled="!newReviewerAnnotation.trim()"
                    @click="submitReviewerAnnotation"
                  >
                    提交评审
                  </t-button>
                </div>
              </t-tab-panel>

              <t-tab-panel value="comments" label="留言区">
                <div class="comment-list">
                  <t-list v-if="submission.comments.length > 0" :split="true">
                    <t-list-item v-for="cmt in submission.comments" :key="cmt.id">
                      <t-list-item-meta
                        :title="cmt.author"
                        :description="cmt.content"
                      />
                      <template #action>
                        <span class="comment-time">{{ cmt.createdAt }}</span>
                      </template>
                    </t-list-item>
                  </t-list>
                  <t-empty v-else description="暂无留言" size="small" />
                </div>
                <div class="annotation-input">
                  <t-textarea
                    v-model="newComment"
                    placeholder="输入留言内容..."
                    :autosize="{ minRows: 2, maxRows: 4 }"
                  />
                  <t-button
                    theme="primary"
                    block
                    class="submit-annotation-btn"
                    :disabled="!newComment.trim()"
                    @click="submitComment"
                  >
                    发送留言
                  </t-button>
                </div>
              </t-tab-panel>
            </t-tabs>
          </t-card>
        </div>
      </div>

      <t-card v-if="submission.versions.length > 0" :bordered="true" class="version-card">
        <template #title>版本历史</template>
        <t-steps :current="submission.versions.length - 1" layout="horizontal">
          <t-step-item
            v-for="ver in submission.versions"
            :key="ver.id"
            :title="`版本${ver.version}`"
            :content="ver.submitTime"
          />
        </t-steps>
      </t-card>
    </template>

    <t-dialog
      v-model:visible="approveDialogVisible"
      header="审核确认"
      :confirm-btn="{ content: '确认通过', theme: 'success' }"
      width="420px"
      @confirm="handleApprove"
    >
      <div class="confirm-content">确认通过该提交？</div>
    </t-dialog>

    <t-dialog
      v-model:visible="rejectDialogVisible"
      header="退回修改"
      :confirm-btn="{ content: '确认退回', theme: 'warning' }"
      width="480px"
      @confirm="handleReject"
    >
      <t-form :data="rejectForm" label-width="80px">
        <t-form-item label="退回原因" required>
          <t-textarea
            v-model="rejectForm.reason"
            placeholder="请输入退回修改的原因（必填）"
            :autosize="{ minRows: 3, maxRows: 6 }"
          />
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MessagePlugin } from 'tdesign-vue-next'
import { mockSubmission } from '@/mock'
import type { SubmissionDetail, Annotation } from '@/mock/types'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const errorMsg = ref('')
const submission = ref<SubmissionDetail | null>(null)

const submissionId = computed(() => route.params.submissionId as string)
const currentVersion = computed(() => {
  if (!submission.value) return 1
  return submission.value.versions.length
})

const previewTab = ref('image')
const sidebarTab = ref('teacher')

const imageFiles = computed(() => {
  if (!submission.value) return []
  return submission.value.files.filter(f => f.fileType !== 'pdf')
})

const pdfFiles = computed(() => {
  if (!submission.value) return []
  return submission.value.files.filter(f => f.fileType === 'pdf')
})

const teacherAnnotations = computed(() => {
  if (!submission.value) return []
  return submission.value.annotations.filter(a => true)
})

const reviewerAnnotations = ref<Annotation[]>([])

const newTeacherAnnotation = ref('')
const newReviewerAnnotation = ref('')
const newComment = ref('')

const approveDialogVisible = ref(false)
const rejectDialogVisible = ref(false)
const rejectForm = ref({ reason: '' })

function submitTeacherAnnotation() {
  if (!newTeacherAnnotation.value.trim()) return
  MessagePlugin.success('老师批注已提交')
  newTeacherAnnotation.value = ''
}

function submitReviewerAnnotation() {
  if (!newReviewerAnnotation.value.trim()) return
  MessagePlugin.success('评审员批注已提交')
  newReviewerAnnotation.value = ''
}

function submitComment() {
  if (!newComment.value.trim()) return
  MessagePlugin.success('留言已发送')
  newComment.value = ''
}

function handleApprove() {
  MessagePlugin.success('已通过该提交')
  approveDialogVisible.value = false
}

function handleReject() {
  if (!rejectForm.value.reason.trim()) {
    MessagePlugin.warning('请输入退回原因')
    return
  }
  MessagePlugin.success('已退回修改')
  rejectDialogVisible.value = false
  rejectForm.value.reason = ''
}

onMounted(() => {
  loading.value = true
  try {
    const data = mockSubmission(submissionId.value)
    if (!data) {
      errorMsg.value = '提交记录不存在'
    } else {
      submission.value = data
    }
  } catch {
    errorMsg.value = '加载评审数据失败'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.loading-wrap,
.error-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.submission-info-card {
  margin-bottom: 16px;
  position: relative;
}

.info-header {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 12px;
}

.info-left,
.info-right {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.info-label {
  color: #8A8F99;
  font-size: 13px;
  white-space: nowrap;
}

.info-value {
  color: #1F2329;
  font-size: 14px;
  font-weight: 500;
}

.info-footer {
  display: flex;
  gap: 24px;
  padding-top: 8px;
  border-top: 1px solid #F0F0F0;
}

.action-bar {
  position: absolute;
  top: 20px;
  right: 24px;
}

.workspace-content {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.preview-panel {
  flex: 0 0 70%;
  min-width: 0;
}

.sidebar-panel {
  flex: 1;
  min-width: 0;
}

.preview-card,
.annotation-card,
.version-card {
  height: fit-content;
}

.preview-body {
  min-height: 400px;
}

.image-preview-area,
.pdf-preview-area {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 16px 0;
}

.image-card,
.pdf-card {
  border: 1px solid #E7E7E7;
  border-radius: 8px;
  overflow: hidden;
}

.image-placeholder,
.pdf-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  gap: 8px;
  color: #8A8F99;
  background: #FAFAFA;
  min-height: 160px;
}

.image-name,
.pdf-name {
  font-size: 13px;
  color: #1F2329;
  text-align: center;
  word-break: break-all;
}

.image-size,
.pdf-size {
  font-size: 12px;
  color: #8A8F99;
}

.pdf-hint {
  font-size: 12px;
  color: #0052D9;
}

.pdf-placeholder .t-icon {
  color: #E34D59;
}

.annotation-list {
  min-height: 160px;
  max-height: 360px;
  overflow-y: auto;
  padding: 8px 0;
}

.annotation-item {
  padding: 4px 0;
}

.annotation-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.annotation-author {
  font-size: 13px;
  font-weight: 500;
  color: #1F2329;
}

.annotation-time {
  font-size: 12px;
  color: #8A8F99;
}

.annotation-content {
  font-size: 13px;
  color: #454D5A;
  margin-top: 4px;
  line-height: 1.6;
}

.annotation-input {
  padding: 12px 0 0;
  border-top: 1px solid #F0F0F0;
  margin-top: 8px;
}

.submit-annotation-btn {
  margin-top: 8px;
}

.comment-list {
  min-height: 160px;
  max-height: 360px;
  overflow-y: auto;
}

.comment-time {
  font-size: 12px;
  color: #8A8F99;
}

.confirm-content {
  padding: 16px 0;
  font-size: 15px;
  color: #1F2329;
}

.version-card {
  margin-top: 0;
}

:deep(.t-list-item__meta-description) {
  white-space: pre-wrap;
  line-height: 1.6;
}
</style>
