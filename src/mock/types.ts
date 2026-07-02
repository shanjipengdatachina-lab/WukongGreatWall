export interface PaginatedResponse<T> {
  total: number
  page: number
  pageSize: number
  items: T[]
}

export interface DashboardOverview {
  studentCount: number
  courseAssignmentCount: number
  topicTaskCount: number
  pendingReviewCount: number
  studentGrowth: number
  assignmentGrowth: number
  taskGrowth: number
}

export interface DashboardTrend {
  dates: string[]
  studentCounts: number[]
  submissionCounts: number[]
  topicTaskCounts: number[]
}

export interface Student {
  id: string
  scholarId: string
  name: string
  gender: '男' | '女'
  university: string
  major: string
  researchDirection: string
  roleType: string
  grade: string
  phone: string
  email: string
  courseProgress: number
  visibility: 'visible' | 'hidden'
  status: 'active' | 'inactive'
  enrollmentDate: string
  avatar: string
}

export interface StudentDetail extends Student {
  completedAssignments: number
  totalAssignments: number
  topicCount: number
  outcomeCount: number
  loginCount: number
  lastLoginTime: string
  notes: string
}

export interface CourseChapter {
  id: string
  title: string
  order: number
  duration: string
  resourceCount: number
}

export interface Course {
  id: string
  title: string
  cover: string
  description: string
  teacher: string
  university: string
  studentCount: number
  chapterCount: number
  chapters: CourseChapter[]
  status: 'published' | 'draft'
  createdAt: string
  updatedAt: string
}

export interface CourseResource {
  id: string
  courseId: string
  courseTitle: string
  chapterId: string
  chapterTitle: string
  title: string
  type: 'link' | 'pdf' | 'project'
  url: string
  fileSize: string
  uploadTime: string
  downloadCount: number
}

export interface Assignment {
  id: string
  courseId: string
  courseTitle: string
  chapterId: string
  chapterTitle: string
  title: string
  description: string
  type: '个人作业' | '小组作业' | '课题作业'
  status: 'pending' | 'submitted' | 'reviewing' | 'reviewed' | 'overdue'
  deadline: string
  submitRate: number
  reviewRate: number
  totalStudents: number
  submittedCount: number
  reviewedCount: number
  createdAt: string
}

export interface Submission {
  id: string
  assignmentId: string
  studentId: string
  studentName: string
  scholarId: string
  university: string
  status: 'submitted' | 'reviewing' | 'reviewed'
  score: number | null
  submitTime: string
  reviewTime: string | null
  files: SubmissionFile[]
}

export interface SubmissionFile {
  id: string
  fileName: string
  fileSize: string
  fileType: string
  url: string
}

export interface SubmissionDetail extends Submission {
  assignmentTitle: string
  courseTitle: string
  versions: SubmissionVersion[]
  annotations: Annotation[]
  comments: Comment[]
}

export interface SubmissionVersion {
  id: string
  version: number
  fileName: string
  fileSize: string
  submitTime: string
  url: string
}

export interface Annotation {
  id: string
  page: number
  x: number
  y: number
  content: string
  author: string
  createdAt: string
}

export interface Comment {
  id: string
  author: string
  avatar: string
  content: string
  createdAt: string
}

export interface Topic {
  id: string
  title: string
  description: string
  leader: string
  leaderUniversity: string
  memberCount: number
  taskCount: number
  outcomeCount: number
  status: 'active' | 'completed' | 'archived'
  startDate: string
  endDate: string
  createdAt: string
}

export interface TopicMember {
  id: string
  topicId: string
  studentId: string
  studentName: string
  scholarId: string
  university: string
  role: '负责人' | '核心成员' | '参与成员'
  joinDate: string
  taskCount: number
  completedTaskCount: number
}

export interface TopicAnnouncement {
  id: string
  topicId: string
  title: string
  content: string
  publisher: string
  publishTime: string
  isTop: boolean
}

export interface TopicTask {
  id: string
  topicId: string
  topicTitle: string
  title: string
  description: string
  assigneeId: string
  assigneeName: string
  assigneeUniversity: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'todo' | 'in_progress' | 'review' | 'done'
  progress: number
  deadline: string
  createdAt: string
  completedAt: string | null
}

export interface Outcome {
  id: string
  topicId: string
  topicTitle: string
  title: string
  description: string
  type: 'render' | 'document' | 'video' | 'model'
  authors: string[]
  fileUrl: string
  fileSize: string
  thumbnail: string
  status: 'draft' | 'submitted' | 'approved'
  createdAt: string
  updatedAt: string
}

export interface MapNode {
  id: string
  name: string
  type: 'university' | 'student' | 'topic'
  longitude: number
  latitude: number
  value: number
}

export interface MapLink {
  source: string
  target: string
  value: number
  type: string
}

export interface GraphNode {
  id: string
  name: string
  type: 'student' | 'topic' | 'outcome' | 'resource'
  symbolSize: number
  university: string
}

export interface GraphLink {
  source: string
  target: string
  type: 'member' | 'contribute' | 'reference' | 'collaborate'
}

export interface Resource {
  id: string
  title: string
  type: 'document' | 'image' | 'video' | 'model' | 'project' | 'other'
  module: 'course' | 'assignment' | 'topic' | 'outcome'
  moduleId: string
  moduleTitle: string
  fileSize: string
  format: string
  uploader: string
  uploadTime: string
  downloadCount: number
  url: string
}

export interface Invitation {
  id: string
  schoolName: string
  contactPerson: string
  contactPhone: string
  contactEmail: string
  invitedStudents: number
  status: 'pending' | 'accepted' | 'rejected'
  inviteDate: string
  responseDate: string | null
  notes: string
}

export interface Role {
  id: string
  name: string
  code: string
  description: string
  permissions: string[]
  userCount: number
  createdAt: string
}

export interface Dictionary {
  id: string
  code: string
  name: string
  items: DictionaryItem[]
}

export interface DictionaryItem {
  id: string
  label: string
  value: string
  sort: number
  status: 'enabled' | 'disabled'
}

export interface SystemConfig {
  siteName: string
  siteLogo: string
  maxFileSize: number
  allowedFileTypes: string[]
  enableRegistration: boolean
  enableNotification: boolean
  maintenanceMode: boolean
  defaultPageSize: number
  sessionTimeout: number
}

export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  module: string
  detail: string
  ip: string
  userAgent: string
  status: 'success' | 'failure'
  createdAt: string
}

export interface Message {
  id: string
  title: string
  content: string
  type: 'system' | 'assignment' | 'review' | 'topic' | 'notification'
  senderId: string
  senderName: string
  receiverId: string
  receiverName: string
  isRead: boolean
  isStarred: boolean
  createdAt: string
  readAt: string | null
}
