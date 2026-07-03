<template>
  <div class="ted-edit-page">
    <t-page-header title="TED 学者档案">
      <template #actions>
        <t-space>
          <t-button variant="outline" @click="handlePreview">预览</t-button>
          <t-button theme="primary" @click="handleSave" :loading="saving">保存</t-button>
          <t-button theme="success" @click="handlePublish" :loading="publishing" :disabled="profile?.status === 'published'">
            {{ profile?.status === 'published' ? '已发布' : '发布' }}
          </t-button>
        </t-space>
      </template>
    </t-page-header>

    <t-loading :loading="loading" size="medium">
      <div class="edit-sections" v-if="profile">
        <t-card title="基本信息" :bordered="false">
          <t-form label-align="right" label-width="100px">
            <t-form-item label="Scholar ID">
              <t-input :value="profile.scholar_id" disabled />
            </t-form-item>
            <t-form-item label="展示名称">
              <t-input v-model="form.display_name" placeholder="请输入展示名称" />
            </t-form-item>
            <t-form-item label="头衔">
              <t-input v-model="form.title" placeholder="如：数字艺术研究员" />
            </t-form-item>
            <t-form-item label="所在地">
              <t-input v-model="form.location" placeholder="如：中国·唐山" />
            </t-form-item>
            <t-form-item label="个人简介">
              <t-textarea v-model="form.bio_full" :autosize="{ minRows:4, maxRows:8 }" placeholder="请输入完整个人简介" />
            </t-form-item>
          </t-form>
        </t-card>

        <t-card title="研究方向" :bordered="false" style="margin-top:16px">
          <t-tag-input v-model="researchTags" placeholder="输入研究方向后回车添加" clearable />
        </t-card>

        <t-card title="教育经历" :bordered="false" style="margin-top:16px">
          <div v-for="(edu,i) in educationList" :key="i" class="edu-row">
            <t-input v-model="edu.degree" placeholder="学位" style="width:150px" />
            <t-input v-model="edu.institution" placeholder="院校" style="flex:1" />
            <t-input v-model="edu.year" placeholder="年份" style="width:100px" />
            <t-button variant="text" theme="danger" @click="educationList.splice(i,1)"><t-icon name="delete" /></t-button>
          </div>
          <t-button variant="dashed" block @click="educationList.push({degree:'',institution:'',year:''})">+ 添加教育经历</t-button>
        </t-card>

        <t-card title="荣誉奖项" :bordered="false" style="margin-top:16px">
          <div v-for="(a,i) in achievementList" :key="i" class="edu-row">
            <t-input v-model="a.name" placeholder="奖项名称" style="width:160px" />
            <t-input v-model="a.year" placeholder="年份" style="width:100px" />
            <t-input v-model="a.description" placeholder="描述" style="flex:1" />
            <t-button variant="text" theme="danger" @click="achievementList.splice(i,1)"><t-icon name="delete" /></t-button>
          </div>
          <t-button variant="dashed" block @click="achievementList.push({name:'',year:'',description:''})">+ 添加荣誉奖项</t-button>
        </t-card>

        <t-card title="公开设置" :bordered="false" style="margin-top:16px">
          <t-checkbox-group v-model="visibleFields">
            <t-row :gutter="16">
              <t-col :span="4"><t-checkbox value="display_name">姓名</t-checkbox></t-col>
              <t-col :span="4"><t-checkbox value="title">头衔</t-checkbox></t-col>
              <t-col :span="4"><t-checkbox value="institution">院校</t-checkbox></t-col>
              <t-col :span="4"><t-checkbox value="avatar">头像</t-checkbox></t-col>
              <t-col :span="4"><t-checkbox value="cover_image">封面</t-checkbox></t-col>
              <t-col :span="4"><t-checkbox value="location">所在地</t-checkbox></t-col>
              <t-col :span="4"><t-checkbox value="research_fields">研究方向</t-checkbox></t-col>
              <t-col :span="4"><t-checkbox value="keywords">关键词</t-checkbox></t-col>
              <t-col :span="4"><t-checkbox value="bio_full">简介</t-checkbox></t-col>
              <t-col :span="4"><t-checkbox value="education">教育经历</t-checkbox></t-col>
              <t-col :span="4"><t-checkbox value="achievements">荣誉奖项</t-checkbox></t-col>
              <t-col :span="4"><t-checkbox value="featured_works">精选作品</t-checkbox></t-col>
              <t-col :span="4"><t-checkbox value="social_links">社交链接</t-checkbox></t-col>
              <t-col :span="4"><t-checkbox value="course_progress">课程进度</t-checkbox></t-col>
            </t-row>
          </t-checkbox-group>
        </t-card>
      </div>
    </t-loading>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getTEDProfile, updateTEDProfile, publishTEDProfile } from '@/api/student'
import { MessagePlugin } from 'tdesign-vue-next'

const router = useRouter()
const profile = ref<any>(null)
const loading = ref(true)
const saving = ref(false)
const publishing = ref(false)
const form = reactive<any>({})
const researchTags = ref<string[]>([])
const educationList = ref<any[]>([])
const achievementList = ref<any[]>([])
const visibleFields = ref<string[]>([])

async function load() {
  loading.value = true
  try {
    profile.value = await getTEDProfile()
    if (profile.value) {
      form.display_name = profile.value.display_name || ''
      form.title = profile.value.title || ''
      form.location = profile.value.location || ''
      form.bio_full = profile.value.bio_full || ''
      try { researchTags.value = JSON.parse(profile.value.research_fields || '[]') } catch { researchTags.value = [] }
      try { educationList.value = JSON.parse(profile.value.education || '[]') } catch { educationList.value = [{degree:'',institution:'',year:''}] }
      if (educationList.value.length === 0) educationList.value.push({degree:'',institution:'',year:''})
      try { achievementList.value = JSON.parse(profile.value.achievements || '[]') } catch { achievementList.value = [{name:'',year:'',description:''}] }
      if (achievementList.value.length === 0) achievementList.value.push({name:'',year:'',description:''})
      try { visibleFields.value = JSON.parse(profile.value.visible_fields || '[]') } catch { visibleFields.value = [] }
    }
  } catch { MessagePlugin.error('加载失败') }
  finally { loading.value = false }
}

async function handleSave() {
  saving.value = true
  try {
    await updateTEDProfile({
      ...form,
      research_fields: JSON.stringify(researchTags.value),
      education: JSON.stringify(educationList.value.filter((e: any) => e.degree || e.institution)),
      achievements: JSON.stringify(achievementList.value.filter((a: any) => a.name)),
      visible_fields: JSON.stringify(visibleFields.value),
    })
    MessagePlugin.success('保存成功')
  } catch { MessagePlugin.error('保存失败') }
  finally { saving.value = false }
}

async function handlePublish() {
  publishing.value = true
  await handleSave()
  try {
    await publishTEDProfile()
    profile.value.status = 'published'
    MessagePlugin.success('档案已发布')
  } catch { MessagePlugin.error('发布失败') }
  finally { publishing.value = false }
}

function handlePreview() {
  if (profile.value?.scholar_id) {
    window.open(`/scholar/${profile.value.scholar_id}`, '_blank')
  }
}

onMounted(load)
</script>

<style scoped>
.ted-edit-page { max-width: 1000px; }
.edu-row { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; }
</style>
