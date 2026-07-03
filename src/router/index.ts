import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/AppLayout.vue'
import StudentLayout from '@/components/StudentLayout.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/LoginView.vue'),
    meta: { requiresAuth: false, title: '登录' },
  },
  {
    path: '/scholar/:scholarId',
    name: 'ScholarProfile',
    component: () => import('@/views/students/ScholarProfileView.vue'),
    meta: { requiresAuth: false, title: '学者档案' },
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
      { path: 'students', name: 'StudentList', component: () => import('@/views/students/StudentListView.vue'), meta: { title: '学员管理', roles: ['admin'] } },
      { path: 'courses', name: 'CourseList', component: () => import('@/views/courses/CourseListView.vue'), meta: { title: '课程管理' } },
      { path: 'assignments', name: 'AssignmentList', component: () => import('@/views/assignments/AssignmentListView.vue'), meta: { title: '作业管理' } },
      { path: 'reviews', name: 'ReviewList', component: () => import('@/views/reviews/ReviewListView.vue'), meta: { title: '评审管理', roles: ['admin'] } },
      { path: 'reviews/:submissionId', name: 'ReviewWorkspace', component: () => import('@/views/reviews/ReviewWorkspaceView.vue'), meta: { title: '评审工作台', roles: ['admin'] } },
      { path: 'topics', name: 'TopicList', component: () => import('@/views/topics/TopicListView.vue'), meta: { title: '课题管理' } },
      { path: 'topics/:id', name: 'TopicDetail', component: () => import('@/views/topics/TopicDetailView.vue'), meta: { title: '课题详情' } },
      { path: 'topic-tasks', name: 'TopicTaskList', component: () => import('@/views/topicTasks/TopicTaskListView.vue'), meta: { title: '任务管理' } },
      { path: 'outcomes', name: 'OutcomeList', component: () => import('@/views/outcomes/OutcomeListView.vue'), meta: { title: '成果管理' } },
      { path: 'collaboration/map', name: 'CollaborationMap', component: () => import('@/views/collaboration/CollaborationMapView.vue'), meta: { title: '协作地图' } },
      { path: 'collaboration/graph', name: 'TopicGraph', component: () => import('@/views/collaboration/TopicGraphView.vue'), meta: { title: '课题星图' } },
      { path: 'resources', name: 'ResourceCenter', component: () => import('@/views/resources/ResourceCenterView.vue'), meta: { title: '资源中心' } },
      { path: 'invitations', name: 'InvitationList', component: () => import('@/views/invitations/InvitationListView.vue'), meta: { title: '培训邀约', roles: ['admin'] } },
      { path: 'analytics', name: 'Analytics', component: () => import('@/views/analytics/AnalyticsView.vue'), meta: { title: '数据统计', roles: ['admin'] } },
      { path: 'messages', name: 'MessageCenter', component: () => import('@/views/messages/MessageCenterView.vue'), meta: { title: '消息中心' } },
      {
        path: 'settings', name: 'SystemSettings', redirect: '/settings/roles', meta: { title: '系统设置', roles: ['admin'] },
        children: [
          { path: 'roles', name: 'SettingsRoles', component: () => import('@/views/settings/RolesView.vue'), meta: { title: '角色权限', roles: ['admin'] } },
          { path: 'dictionaries', name: 'SettingsDictionaries', component: () => import('@/views/settings/DictionariesView.vue'), meta: { title: '基础字典', roles: ['admin'] } },
          { path: 'system', name: 'SettingsSystem', component: () => import('@/views/settings/SystemParamsView.vue'), meta: { title: '系统参数', roles: ['admin'] } },
          { path: 'audit-logs', name: 'SettingsAuditLogs', component: () => import('@/views/settings/AuditLogsView.vue'), meta: { title: '操作日志', roles: ['admin'] } },
        ],
      },
    ],
  },
  {
    path: '/student',
    component: StudentLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/student/dashboard' },
      { path: 'dashboard', name: 'StudentDashboard', component: () => import('@/views/students/StudentDashboardView.vue'), meta: { title: '学员首页' } },
      { path: 'courses', name: 'StudentCourses', component: () => import('@/views/students/StudentCoursesView.vue'), meta: { title: '我的课程' } },
      { path: 'assignments', name: 'StudentAssignments', component: () => import('@/views/students/StudentAssignmentsView.vue'), meta: { title: '我的作业' } },
      { path: 'topics', name: 'StudentTopics', component: () => import('@/views/students/StudentTopicsView.vue'), meta: { title: '我的课题' } },
      { path: 'tasks', name: 'StudentTasks', component: () => import('@/views/students/StudentTasksView.vue'), meta: { title: '我的任务' } },
      { path: 'game', name: 'StudentGame', component: () => import('@/views/students/StudentGameView.vue'), meta: { title: 'Game 中心' } },
      { path: 'game/leaderboard', name: 'GameLeaderboard', component: () => import('@/views/students/StudentGameLeaderboard.vue'), meta: { title: '排行榜' } },
      { path: 'game/achievements', name: 'GameAchievements', component: () => import('@/views/students/StudentGameAchievements.vue'), meta: { title: '成就徽章' } },
      { path: 'ted-profile', name: 'StudentTED', component: () => import('@/views/students/StudentTEDEdit.vue'), meta: { title: 'TED 档案' } },
      { path: 'works', name: 'StudentWorks', component: () => import('@/views/students/StudentWorksView.vue'), meta: { title: '我的成果' } },
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
    return
  }

  if (to.path === '/login' && authStore.isLoggedIn) {
    const dest = authStore.userRole === 'admin' ? '/dashboard' : '/student/dashboard'
    next(dest)
    return
  }

  if (to.meta.roles) {
    if (!(to.meta.roles as string[]).includes(authStore.userRole)) {
      next(authStore.userRole === 'admin' ? '/dashboard' : '/student/dashboard')
      return
    }
  }

  if (to.path === '/' && authStore.isLoggedIn) {
    next(authStore.userRole === 'admin' ? '/dashboard' : '/student/dashboard')
    return
  }

  next()
})

export default router
