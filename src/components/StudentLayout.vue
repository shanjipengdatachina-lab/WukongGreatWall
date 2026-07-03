<template>
  <t-layout class="student-layout">
    <t-aside class="student-sidebar">
      <div class="sidebar-logo">
        <span class="logo-text">悟空云界</span>
        <t-tag theme="primary" variant="light" size="small">学员端</t-tag>
      </div>
      <t-menu
        :value="activeMenu"
        :expanded="expandedKeys"
        theme="light"
        expand-type="normal"
        @change="handleMenuChange"
        @expand="handleExpandChange"
      >
        <t-menu-item value="/student/dashboard">
          <template #icon><t-icon name="dashboard" /></template>
          学员首页
        </t-menu-item>
        <t-menu-item value="/student/courses">
          <template #icon><t-icon name="book" /></template>
          我的课程
        </t-menu-item>
        <t-menu-item value="/student/assignments">
          <template #icon><t-icon name="assignment" /></template>
          我的作业
        </t-menu-item>
        <t-menu-item value="/student/topics">
          <template #icon><t-icon name="folder" /></template>
          我的课题
        </t-menu-item>
        <t-menu-item value="/student/tasks">
          <template #icon><t-icon name="list" /></template>
          我的任务
        </t-menu-item>
        <t-menu-item value="/student/game">
          <template #icon><t-icon name="star" /></template>
          Game 中心
        </t-menu-item>
        <t-menu-item value="/student/ted-profile">
          <template #icon><t-icon name="user" /></template>
          TED 档案
        </t-menu-item>
        <t-menu-item value="/student/works">
          <template #icon><t-icon name="image" /></template>
          我的成果
        </t-menu-item>
        <t-menu-item value="/collaboration/map">
          <template #icon><t-icon name="map" /></template>
          协作地图
        </t-menu-item>
        <t-menu-item value="/resources">
          <template #icon><t-icon name="folder-open" /></template>
          资源中心
        </t-menu-item>
        <t-menu-item value="/messages">
          <template #icon><t-icon name="notification" /></template>
          消息通知
        </t-menu-item>
      </t-menu>
    </t-aside>
    <t-layout class="student-main">
      <t-header class="student-header">
        <div class="header-left">
          <span class="header-title">学员协作系统</span>
        </div>
        <div class="header-right">
          <t-badge :count="msgCount" :max-count="99" :dot="false">
            <t-button variant="text" shape="square">
              <t-icon name="notification" />
            </t-button>
          </t-badge>
          <t-dropdown :options="userDropdownOptions" @click="handleUserAction">
            <t-space class="user-info">
              <t-avatar :image="avatarUrl" size="small">{{ userName?.charAt(0) }}</t-avatar>
              <span class="user-name">{{ userName }}</span>
              <t-icon name="chevron-down" size="14px" />
            </t-space>
          </t-dropdown>
        </div>
      </t-header>
      <t-content class="student-content">
        <router-view />
      </t-content>
    </t-layout>
  </t-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { MessagePlugin } from 'tdesign-vue-next'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const activeMenu = ref(route.path)
const expandedKeys = ref<string[]>([])
const msgCount = ref(3)
const AVATAR_BASE = 'http://localhost:3001'

const userName = computed(() => authStore.userName)
const avatarUrl = computed(() => {
  const av = (authStore.user as any)?.avatar
  return av ? `${AVATAR_BASE}${av}` : ''
})

const userDropdownOptions = [
  { content: '个人资料', value: 'profile' },
  { content: 'TED 档案', value: 'ted' },
  { content: '退出登录', value: 'logout' },
]

watch(() => route.path, (val) => { activeMenu.value = val })

function handleMenuChange(value: string) {
  router.push(value)
}

function handleExpandChange(value: string[]) {
  expandedKeys.value = value
}

function handleUserAction(data: any) {
  if (data.value === 'logout') {
    authStore.logout()
    router.push('/login')
    MessagePlugin.success('已退出登录')
  } else if (data.value === 'ted') {
    router.push('/student/ted-profile')
  } else if (data.value === 'profile') {
    router.push('/student/ted-profile')
  }
}
</script>

<style scoped>
.student-layout { height: 100vh; }
.student-sidebar {
  width: 220px;
  min-width: 220px;
  background: #fff;
  border-right: 1px solid #e7e7e7;
  overflow-y: auto;
}
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}
.logo-text { font-size: 16px; font-weight: 700; color: #0052D9; }
.student-main { display: flex; flex-direction: column; overflow: hidden; }
.student-header {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: #fff;
  border-bottom: 1px solid #e7e7e7;
  flex-shrink: 0;
}
.header-title { font-size: 15px; font-weight: 500; color: #1F2329; }
.header-right { display: flex; align-items: center; gap: 12px; }
.user-info {
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}
.user-info:hover { background: #f5f5f5; }
.user-name { font-size: 14px; color: #1F2329; }
.student-content {
  padding: 24px;
  overflow-y: auto;
  background: #f5f7fa;
}
</style>
