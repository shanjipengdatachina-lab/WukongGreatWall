<template>
  <div class="login-page">
    <div class="login-bg">
      <div class="login-bg-left"></div>
      <div class="login-bg-right"></div>
    </div>
    <div class="login-container">
      <div class="login-card-wrapper">
        <t-card class="login-card" :bordered="false">
          <div class="login-header">
            <div class="login-logo">
              <span class="login-logo-icon">☁</span>
            </div>
            <h1 class="login-title">悟空云界</h1>
            <p class="login-subtitle">数字长城技术培训学员协作系统</p>
          </div>
          <t-divider />
          <t-form
            ref="formRef"
            :data="formData"
            :rules="formRules"
            label-align="top"
            @submit="handleSubmit"
          >
            <t-form-item label="账号" name="account">
              <t-input
                v-model="formData.account"
                placeholder="请输入账号"
                size="large"
                clearable
                @keydown.enter="handleSubmit"
              >
                <template #prefix-icon>
                  <t-icon name="user" />
                </template>
              </t-input>
            </t-form-item>
            <t-form-item label="密码" name="password">
              <t-input
                v-model="formData.password"
                type="password"
                placeholder="请输入密码"
                size="large"
                clearable
                @keydown.enter="handleSubmit"
              >
                <template #prefix-icon>
                  <t-icon name="lock-on" />
                </template>
              </t-input>
            </t-form-item>
            <t-form-item name="remember">
              <t-checkbox v-model="formData.remember">记住登录</t-checkbox>
            </t-form-item>
            <t-form-item>
              <t-button
                theme="primary"
                type="submit"
                block
                size="large"
                :loading="loading"
              >
                登 录
              </t-button>
            </t-form-item>
          </t-form>

        </t-card>
        <p class="login-footer">© 2026 悟空云界学员协作系统</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { MessagePlugin } from 'tdesign-vue-next'
import type { FormInstanceFunctions, FormRule } from 'tdesign-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const formRef = ref<FormInstanceFunctions>()
const loading = ref(false)

const formData = reactive({
  account: '',
  password: '',
  remember: true,
})

const formRules: Record<string, FormRule[]> = {
  account: [
    { required: true, message: '请输入账号', type: 'error' },
  ],
  password: [
    { required: true, message: '请输入密码', type: 'error' },
    { min: 6, message: '密码长度不能少于6位', type: 'error' },
  ],
}

async function handleSubmit() {
  const valid = await formRef.value?.validate()
  if (valid !== true) return

  loading.value = true
  try {
    await authStore.loginAction({
      account: formData.account,
      password: formData.password,
      remember: formData.remember,
    })
    MessagePlugin.success('登录成功')
    router.push('/dashboard')
  } catch {
    MessagePlugin.error('账号或密码错误')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f0f5ff 0%, #e8f0fe 50%, #f5f7fa 100%);
}

.login-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.login-bg-left {
  position: absolute;
  top: -180px;
  left: -180px;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 82, 217, 0.06) 0%, transparent 70%);
}

.login-bg-right {
  position: absolute;
  bottom: -200px;
  right: -150px;
  width: 700px;
  height: 700px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 82, 217, 0.04) 0%, transparent 70%);
}

.login-container {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.login-card-wrapper {
  width: 440px;
}

.login-card {
  border-radius: 12px;
  box-shadow: 0 8px 40px rgba(0, 52, 153, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 8px;
}

.login-header {
  text-align: center;
  padding: 16px 0 8px;
}

.login-logo {
  margin-bottom: 12px;
}

.login-logo-icon {
  font-size: 48px;
  color: #0052D9;
  line-height: 1;
}

.login-title {
  font-size: 26px;
  font-weight: 700;
  color: #0052D9;
  margin: 0 0 8px;
  letter-spacing: 2px;
}

.login-subtitle {
  font-size: 14px;
  color: #86909C;
  margin: 0;
  letter-spacing: 1px;
}

.login-footer {
  text-align: center;
  font-size: 12px;
  color: #C9CDD4;
  margin-top: 24px;
}
</style>
