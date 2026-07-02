import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/AppLayout.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/LoginView.vue'),
    meta: { requiresAuth: false, title: '登录' },
  },
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/dashboard' },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/DashboardView.vue'),
        meta: { title: '工作台' },
      },
      {
        path: 'students',
        name: 'StudentList',
        component: () => import('@/views/students/StudentListView.vue'),
        meta: { title: '学员管理' },
      },
      {
        path: 'courses',
        name: 'CourseList',
        component: () => import('@/views/courses/CourseListView.vue'),
        meta: { title: '课程管理' },
      },
      {
        path: 'assignments',
        name: 'AssignmentList',
        component: () => import('@/views/assignments/AssignmentListView.vue'),
        meta: { title: '作业管理' },
      },
      {
        path: 'reviews',
        name: 'ReviewList',
        component: () => import('@/views/reviews/ReviewListView.vue'),
        meta: { title: '评审管理' },
      },
      {
        path: 'reviews/:submissionId',
        name: 'ReviewWorkspace',
        component: () => import('@/views/reviews/ReviewWorkspaceView.vue'),
        meta: { title: '评审工作台' },
      },
      {
        path: 'topics',
        name: 'TopicList',
        component: () => import('@/views/topics/TopicListView.vue'),
        meta: { title: '课题管理' },
      },
      {
        path: 'topics/:id',
        name: 'TopicDetail',
        component: () => import('@/views/topics/TopicDetailView.vue'),
        meta: { title: '课题详情' },
      },
      {
        path: 'topic-tasks',
        name: 'TopicTaskList',
        component: () => import('@/views/topicTasks/TopicTaskListView.vue'),
        meta: { title: '任务管理' },
      },
      {
        path: 'outcomes',
        name: 'OutcomeList',
        component: () => import('@/views/outcomes/OutcomeListView.vue'),
        meta: { title: '成果管理' },
      },
      {
        path: 'collaboration/map',
        name: 'CollaborationMap',
        component: () => import('@/views/collaboration/CollaborationMapView.vue'),
        meta: { title: '协作地图' },
      },
      {
        path: 'collaboration/graph',
        name: 'TopicGraph',
        component: () => import('@/views/collaboration/TopicGraphView.vue'),
        meta: { title: '课题星图' },
      },
      {
        path: 'resources',
        name: 'ResourceCenter',
        component: () => import('@/views/resources/ResourceCenterView.vue'),
        meta: { title: '资源中心' },
      },
      {
        path: 'invitations',
        name: 'InvitationList',
        component: () => import('@/views/invitations/InvitationListView.vue'),
        meta: { title: '培训邀约' },
      },
      {
        path: 'analytics',
        name: 'Analytics',
        component: () => import('@/views/analytics/AnalyticsView.vue'),
        meta: { title: '数据统计' },
      },
      {
        path: 'messages',
        name: 'MessageCenter',
        component: () => import('@/views/messages/MessageCenterView.vue'),
        meta: { title: '消息中心' },
      },
      {
        path: 'settings',
        name: 'SystemSettings',
        redirect: '/settings/roles',
        meta: { title: '系统设置' },
        children: [
          {
            path: 'roles',
            name: 'SettingsRoles',
            component: () => import('@/views/settings/RolesView.vue'),
            meta: { title: '角色权限' },
          },
          {
            path: 'dictionaries',
            name: 'SettingsDictionaries',
            component: () => import('@/views/settings/DictionariesView.vue'),
            meta: { title: '基础字典' },
          },
          {
            path: 'system',
            name: 'SettingsSystem',
            component: () => import('@/views/settings/SystemParamsView.vue'),
            meta: { title: '系统参数' },
          },
          {
            path: 'audit-logs',
            name: 'SettingsAuditLogs',
            component: () => import('@/views/settings/AuditLogsView.vue'),
            meta: { title: '操作日志' },
          },
        ],
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  document.title = `${to.meta.title || '悟空云界'} - 悟空云界学员协作系统`
  if (to.meta.requiresAuth !== false && !authStore.isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && authStore.isLoggedIn) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
