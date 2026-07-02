export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface Student {
  id: number
  scholarId: string
  name: string
  email: string
  phone: string
  school: string
  department: string
  researchDirection: string
  title: string
  role: 'student' | 'teacher' | 'reviewer' | 'admin'
  courseProgress: number
  visibility: 'all' | 'partial'
  reviewerAuthorized: boolean
  status: 'active' | 'disabled'
  createdAt: string
  updatedAt: string
}

export interface Course {
  id: number
  title: string
  description: string
  chapters: Chapter[]
  publishTarget: 'all' | 'group'
  groupId?: number
  status: 'published' | 'draft'
  createdAt: string
  updatedAt: string
}

export interface Chapter {
  id: number
  courseId: number
  title: string
  description: string
  lessonCount: number
  totalDuration: string
  sortOrder: number
  status: 'published' | 'draft'
}

export interface Lesson {
  id: number
  chapterId: number
  title: string
  content: string
  duration: string
  sortOrder: number
}

export interface CourseResource {
  id: number
  courseId: number
  name: string
  type: 'link' | 'pdf' | 'project' | 'other'
  url: string
  fileSize?: string
  uploaderId: number
  uploaderName: string
  status: 'published' | 'draft'
  createdAt: string
}

export interface Assignment {
  id: number
  title: string
  courseId: number
  courseName: string
  type: 'course' | 'topic'
  deadline: string
  format: 'image' | 'pdf' | 'image+pdf'
  submitRate: number
  reviewRate: number
  status: 'in_progress' | 'completed' | 'overdue'
  createdAt: string
}

export interface Submission {
  id: number
  assignmentId: number
  studentId: number
  studentName: string
  scholarId: string
  school: string
  files: SubmissionFile[]
  versions: SubmissionVersion[]
  annotations: Annotation[]
  comments: Comment[]
  status: 'submitted' | 'reviewed' | 'approved' | 'rejected'
  submittedAt: string
}

export interface SubmissionFile {
  id: number
  name: string
  url: string
  type: 'image' | 'pdf'
  size: string
}

export interface SubmissionVersion {
  id: number
  versionNumber: number
  submittedAt: string
  files: SubmissionFile[]
}

export interface Annotation {
  id: number
  authorId: number
  authorName: string
  authorRole: 'teacher' | 'reviewer'
  content: string
  position?: string
  createdAt: string
}

export interface Comment {
  id: number
  authorId: number
  authorName: string
  authorRole: string
  content: string
  createdAt: string
}

export interface Topic {
  id: number
  title: string
  description: string
  leaderId: number
  leaderName: string
  memberCount: number
  taskCount: number
  status: 'preparing' | 'in_progress' | 'completed' | 'archived'
  progress: number
  createdAt: string
  updatedAt: string
}

export interface TopicMember {
  id: number
  topicId: number
  studentId: number
  name: string
  school: string
  title: string
  role: 'leader' | 'core_member' | 'member'
  status: 'pending' | 'approved' | 'removed'
  joinedAt: string
}

export interface TopicAnnouncement {
  id: number
  topicId: number
  title: string
  content: string
  publisherId: number
  publisherName: string
  createdAt: string
}

export interface TopicTask {
  id: number
  topicId: number
  topicName: string
  title: string
  type: 'individual' | 'team'
  groupName?: string
  deadline: string
  maxClaimCount: number
  claimCount: number
  submitRate: number
  reviewRate: number
  status: 'not_started' | 'in_progress' | 'submitted' | 'overdue'
  createdAt: string
}

export interface Outcome {
  id: number
  name: string
  type: 'render' | 'document' | 'video' | 'model'
  contributorId: number
  contributorName: string
  school: string
  topicId: number
  topicName: string
  status: 'published' | 'draft' | 'reviewing'
  featured: boolean
  thumbnail: string
  files: OutcomeFile[]
  createdAt: string
}

export interface OutcomeFile {
  id: number
  name: string
  url: string
  type: string
  size: string
}

export interface CollaborationNode {
  id: number
  name: string
  school: string
  region: string
  coordinates: [number, number]
  researchDirection: string
  scholarId: string
  topicRole?: string
}

export interface CollaborationLink {
  source: number
  target: number
  topicName: string
}

export interface Resource {
  id: number
  name: string
  type: string
  module: 'course' | 'assignment' | 'topic' | 'outcome'
  size: string
  uploaderId: number
  uploaderName: string
  visibility: 'all' | 'topic_member' | 'admin'
  url: string
  createdAt: string
}

export interface Invitation {
  id: number
  school: string
  department: string
  expectedTopic: string
  expectedDate: string
  submitterId: number
  submitterName: string
  status: 'pending' | 'contacted' | 'scheduled' | 'completed'
  remark: string
  createdAt: string
}

export interface Role {
  id: number
  name: string
  permissions: string[]
  createdAt: string
}

export interface Dictionary {
  id: number
  category: string
  label: string
  value: string
  sortOrder: number
  status: 'active' | 'disabled'
}

export interface SystemConfig {
  uploadMaxSize: number
  uploadAllowedTypes: string
  siteName: string
  siteDescription: string
}

export interface AuditLog {
  id: number
  userId: number
  userName: string
  action: string
  resource: string
  detail: string
  ip: string
  createdAt: string
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

export interface Message {
  id: number
  title: string
  content: string
  type: 'system' | 'course' | 'assignment' | 'topic'
  isRead: boolean
  createdAt: string
}

export interface LoginParams {
  account: string
  password: string
  remember: boolean
}

export interface LoginResult {
  token: string
  user: {
    id: number
    name: string
    role: string
    scholarId: string
  }
}

export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
}
