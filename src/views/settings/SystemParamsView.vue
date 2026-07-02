<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">系统参数</h2>
    </div>

    <t-loading :loading="loading" size="medium">
      <template v-if="error">
        <t-alert theme="error" :message="error" close @close="error = ''" />
      </template>

      <template v-else-if="!loading && config">
        <t-alert theme="info" message="系统参数配置修改后立即生效，请谨慎操作" style="margin-bottom: 16px" />

        <t-card title="基本设置" :bordered="true" class="config-card">
          <t-form
            ref="formRef"
            :data="formData"
            :rules="formRules"
            label-width="160px"
            style="max-width: 640px"
          >
            <t-form-item label="站点名称" name="siteName">
              <t-input v-model="formData.siteName" placeholder="请输入站点名称" />
            </t-form-item>
            <t-form-item label="站点描述" name="siteDescription">
              <t-textarea
                v-model="formData.siteDescription"
                placeholder="请输入站点描述"
                :maxlength="500"
                :autosize="{ minRows: 3, maxRows: 5 }"
              />
            </t-form-item>
            <t-form-item label="上传文件大小限制(MB)" name="uploadMaxSize">
              <t-input-number
                v-model="formData.uploadMaxSize"
                :min="1"
                :max="1024"
                placeholder="请输入文件大小限制"
                style="width: 200px"
              />
            </t-form-item>
            <t-form-item label="允许上传文件类型" name="uploadAllowedTypes">
              <t-input
                v-model="formData.uploadAllowedTypes"
                placeholder="多个类型用逗号分隔，如：pdf,doc,docx"
              />
            </t-form-item>
            <t-form-item>
              <t-space>
                <t-popconfirm content="确认保存系统参数？" @confirm="handleSave">
                  <t-button theme="primary" :loading="saving">
                    <template #icon><t-icon name="check" /></template>
                    保存
                  </t-button>
                </t-popconfirm>
                <t-button variant="outline" @click="handleReset">重置</t-button>
              </t-space>
            </t-form-item>
          </t-form>
        </t-card>

        <t-card title="系统信息" :bordered="true" class="config-card" style="margin-top: 16px">
          <div class="system-info-grid">
            <div class="system-info-item">
              <span class="info-label">系统版本</span>
              <span class="info-value">{{ systemInfo.version }}</span>
            </div>
            <div class="system-info-item">
              <span class="info-label">前端框架</span>
              <span class="info-value">{{ systemInfo.framework }}</span>
            </div>
            <div class="system-info-item">
              <span class="info-label">UI 组件库</span>
              <span class="info-value">{{ systemInfo.uiLib }}</span>
            </div>
            <div class="system-info-item">
              <span class="info-label">运行环境</span>
              <span class="info-value">{{ systemInfo.runtime }}</span>
            </div>
            <div class="system-info-item">
              <span class="info-label">数据库版本</span>
              <span class="info-value">{{ systemInfo.dbVersion }}</span>
            </div>
            <div class="system-info-item">
              <span class="info-label">运行时间</span>
              <span class="info-value">{{ systemInfo.uptime }}</span>
            </div>
          </div>
        </t-card>
      </template>

      <t-empty v-else-if="!loading" description="暂无配置数据" />
    </t-loading>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import type { FormInstanceFunctions, FormRule } from 'tdesign-vue-next'
import { mockSystemConfig } from '@/mock'
import type { SystemConfig } from '@/mock/types'

const loading = ref(false)
const saving = ref(false)
const error = ref('')
const config = ref<SystemConfig | null>(null)
const formRef = ref<FormInstanceFunctions | null>(null)

interface ConfigForm {
  siteName: string
  siteDescription: string
  uploadMaxSize: number
  uploadAllowedTypes: string
}

const formData = reactive<ConfigForm>({
  siteName: '',
  siteDescription: '',
  uploadMaxSize: 500,
  uploadAllowedTypes: '',
})

const formRules: Record<string, FormRule[]> = {
  siteName: [{ required: true, message: '请输入站点名称', trigger: 'blur' }],
  uploadMaxSize: [
    { required: true, message: '请输入文件大小限制', trigger: 'blur' },
    { validator: (val: number) => val >= 1, message: '最小值为1MB', trigger: 'blur' },
  ],
}

const systemInfo = {
  version: 'v2.1.0',
  framework: 'Vue 3.5 + TypeScript',
  uiLib: 'TDesign Vue Next 1.20',
  runtime: 'Node.js 20 LTS',
  dbVersion: 'MySQL 8.0.36',
  uptime: '47 天 12 小时 35 分钟',
}

function loadConfig() {
  loading.value = true
  error.value = ''
  try {
    const c = mockSystemConfig()
    config.value = c
    formData.siteName = c.siteName
    formData.siteDescription = ''
    formData.uploadMaxSize = c.maxFileSize
    formData.uploadAllowedTypes = c.allowedFileTypes.join(', ')
  } catch (e: any) {
    error.value = e?.message || '配置数据加载失败'
  } finally {
    loading.value = false
  }
}

async function handleSave() {
  const valid = await formRef.value?.validate()
  if (valid !== true) return

  saving.value = true
  try {
    if (config.value) {
      config.value.siteName = formData.siteName
      config.value.maxFileSize = formData.uploadMaxSize
      config.value.allowedFileTypes = formData.uploadAllowedTypes
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    }
    MessagePlugin.success('系统参数已保存')
  } catch (e: any) {
    MessagePlugin.error(e?.message || '保存失败')
  } finally {
    saving.value = false
  }
}

function handleReset() {
  if (config.value) {
    formData.siteName = config.value.siteName
    formData.siteDescription = ''
    formData.uploadMaxSize = config.value.maxFileSize
    formData.uploadAllowedTypes = config.value.allowedFileTypes.join(', ')
  }
  formRef.value?.clearValidate()
  MessagePlugin.success('已重置为原始配置')
}

loadConfig()
</script>

<style scoped>
.page-container {
  max-width: 960px;
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

.config-card {
  border-radius: 8px;
}

.config-card :deep(.t-card__header) {
  font-weight: 600;
  font-size: 16px;
}

.config-card :deep(.t-card__body) {
  padding: 24px;
}

.system-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.system-info-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #F5F7FA;
  border-radius: 6px;
}

.info-label {
  font-size: 14px;
  color: #999;
  width: 100px;
  flex-shrink: 0;
}

.info-value {
  font-size: 14px;
  color: #1F2329;
  font-weight: 500;
}
</style>
