<template>
  <t-layout class="app-layout">
    <t-aside width="232px" class="app-aside">
      <div class="logo-container" @click="goHome">
        <div class="logo-icon">☁</div>
        <span class="logo-text">悟空云界</span>
      </div>
      <t-menu
        :value="activeMenu"
        :expanded="expandedKeys"
        :collapsed="false"
        expand-type="normal"
        theme="light"
        @change="handleMenuChange"
        @expand="handleExpandChange"
      >
        <t-menu-item value="dashboard">
          <template #icon><t-icon name="dashboard" /></template>
          工作台
        </t-menu-item>
        <t-menu-item v-if="isAdmin" value="students">
          <template #icon><t-icon name="usergroup" /></template>
          学员管理
        </t-menu-item>
        <t-menu-item value="courses">
          <template #icon><t-icon name="book" /></template>
          课程管理
        </t-menu-item>
        <t-menu-item value="assignments">
          <template #icon><t-icon name="assignment" /></template>
          作业管理
        </t-menu-item>
        <t-menu-item v-if="isAdmin" value="reviews">
          <template #icon><t-icon name="check-rectangle" /></template>
          评审管理
        </t-menu-item>
        <t-submenu value="topics" title="课题管理">
          <template #icon><t-icon name="folder" /></template>
          <t-menu-item value="topics">课题工作台</t-menu-item>
        </t-submenu>
        <t-menu-item value="topic-tasks">
          <template #icon><t-icon name="list" /></template>
          任务管理
        </t-menu-item>
        <t-submenu value="outcomes" title="成果管理">
          <template #icon><t-icon name="image" /></template>
          <t-menu-item value="outcomes">成果展示</t-menu-item>
        </t-submenu>
        <t-submenu value="collaboration" title="协作空间">
          <template #icon><t-icon name="map" /></template>
          <t-menu-item value="collaboration/map">协作地图</t-menu-item>
          <t-menu-item value="collaboration/graph">课题星图</t-menu-item>
        </t-submenu>
        <t-menu-item value="resources">
          <template #icon><t-icon name="folder-open" /></template>
          资源中心
        </t-menu-item>
        <t-menu-item v-if="isAdmin" value="invitations">
          <template #icon><t-icon name="calendar" /></template>
          培训邀约
        </t-menu-item>
        <t-menu-item v-if="isAdmin" value="analytics">
          <template #icon><t-icon name="chart" /></template>
          数据统计
        </t-menu-item>
        <t-menu-item value="messages">
          <template #icon><t-icon name="notification" /></template>
          消息中心
        </t-menu-item>
        <t-submenu v-if="isAdmin" value="settings" title="系统设置">
          <template #icon><t-icon name="setting" /></template>
          <t-menu-item value="settings/roles">角色权限</t-menu-item>
          <t-menu-item value="settings/dictionaries">基础字典</t-menu-item>
          <t-menu-item value="settings/system">系统参数</t-menu-item>
          <t-menu-item value="settings/audit-logs">操作日志</t-menu-item>
        </t-submenu>
      </t-menu>
    </t-aside>
    <t-layout class="app-main-layout">
      <t-header class="app-header">
        <div class="header-left">
          <t-breadcrumb>
            <t-breadcrumb-item
              v-for="(item, index) in breadcrumbs"
              :key="index"
              :to="index < breadcrumbs.length - 1 ? item.path : undefined"
            >
              {{ item.title }}
            </t-breadcrumb-item>
          </t-breadcrumb>
        </div>
        <div class="header-right">
          <t-button variant="text" shape="square">
            <t-icon name="search" />
          </t-button>
          <t-badge :count="5" :offset="[-4, 4]">
            <t-button variant="text" shape="square" @click="$router.push('/messages')">
              <t-icon name="notification" />
            </t-button>
          </t-badge>
          <t-dropdown :options="userMenuOptions" @click="handleUserMenu">
            <div class="user-info">
              <t-avatar size="small">{{ userName?.charAt(0) || '管' }}</t-avatar>
              <span class="user-name">{{ userName || '管理员' }}</span>
            </div>
          </t-dropdown>
        </div>
      </t-header>
      <t-content class="app-content">
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

const userName = computed(() => authStore.userName)
const isAdmin = computed(() => authStore.userRole === 'admin')

const expandedKeys = ref<string[]>(['topics', 'outcomes', 'collaboration', 'settings'])

const breadcrumbMap: Record<string, string> = {
  'dashboard': '工作台',
  'students': '学员管理',
  'courses': '课程管理',
  'assignments': '作业管理',
  'reviews': '评审管理',
  'topics': '课题管理',
  'topic-tasks': '任务管理',
  'outcomes': '成果管理',
  'collaboration/map': '协作地图',
  'collaboration/graph': '课题星图',
  'resources': '资源中心',
  'invitations': '培训邀约',
  'analytics': '数据统计',
  'messages': '消息中心',
  'settings/roles': '角色权限',
  'settings/dictionaries': '基础字典',
  'settings/system': '系统参数',
  'settings/audit-logs': '操作日志',
}

const activeMenu = computed(() => {
  const path = route.path.replace(/^\//, '')
  if (path.startsWith('topics') && route.params.id) return 'topics'
  if (path.startsWith('reviews')) return 'reviews'
  if (path.startsWith('settings/')) return path
  return path || 'dashboard'
})

const parentMenuMap: Record<string, string> = {
  'topics': 'topics',
  'outcomes': 'outcomes',
  'collaboration/map': 'collaboration',
  'collaboration/graph': 'collaboration',
  'settings/roles': 'settings',
  'settings/dictionaries': 'settings',
  'settings/system': 'settings',
  'settings/audit-logs': 'settings',
}

watch(
  () => route.path,
  () => {
    const path = route.path.replace(/^\//, '')
    const parent = parentMenuMap[path]
    if (parent && !expandedKeys.value.includes(parent)) {
      expandedKeys.value = [...expandedKeys.value, parent]
    }
  },
  { immediate: true }
)

const breadcrumbs = computed(() => {
  const path = route.path.replace(/^\//, '')
  const items: { title: string; path?: string }[] = [{ title: '首页', path: '/dashboard' }]
  if (path && path !== 'dashboard') {
    if (path.startsWith('topics/') && route.params.id) {
      items.push({ title: '课题管理', path: '/topics' })
      items.push({ title: '课题详情' })
    } else if (path.startsWith('reviews/')) {
      items.push({ title: '作业管理', path: '/assignments' })
      items.push({ title: '评审工作台' })
    } else if (path.startsWith('settings/')) {
      items.push({ title: '系统设置' })
      const sub = path.replace('settings/', '')
      const title = breadcrumbMap['settings/' + sub]
      if (title) items.push({ title })
    } else {
      const title = breadcrumbMap[path]
      if (title) items.push({ title })
    }
  }
  return items
})

const userMenuOptions = [
  { content: '个人信息', value: 'profile' },
  { content: '修改密码', value: 'password' },
  { content: '退出登录', value: 'logout' },
]

function goHome() {
  router.push('/dashboard')
}

function handleExpandChange(keys: string[]) {
  expandedKeys.value = keys
}

function handleMenuChange(value: string) {
  router.push('/' + value)
}

function handleUserMenu(data: { value: string }) {
  if (data.value === 'logout') {
    authStore.logout()
    MessagePlugin.success('已退出登录')
    router.push('/login')
  } else if (data.value === 'profile') {
    MessagePlugin.info('个人信息功能开发中')
  } else if (data.value === 'password') {
    MessagePlugin.info('修改密码功能开发中')
  }
}
</script>

<style scoped>
.app-layout {
  height: 100vh;
  width: 100%;
  min-width: 1024px;
  overflow: hidden;
}

.app-aside {
  background: #fff;
  border-right: 1px solid #E7E7E7;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
  width: 232px !important;
  min-width: 232px !important;
  max-width: 232px !important;
}

.logo-container {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  cursor: pointer;
  border-bottom: 1px solid #E7E7E7;
  gap: 10px;
}

.logo-icon {
  font-size: 28px;
  color: #0052D9;
  flex-shrink: 0;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: #0052D9;
  white-space: nowrap;
}

.app-aside :deep(.t-menu) {
  flex: 1;
  border-right: none;
  overflow-y: auto;
}

.app-main-layout {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
  min-width: 0;
}

.app-header {
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #E7E7E7;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  flex-shrink: 0;
  min-width: 0;
}

.app-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  overflow-x: auto;
  background: #F5F7FA;
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.user-info:hover {
  background: #F5F7FA;
}

.user-name {
  font-size: 14px;
  color: #1F2329;
}

.app-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: #F5F7FA;
}
</style>
