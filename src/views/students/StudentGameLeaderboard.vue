<template>
  <div class="leaderboard-page">
    <t-page-header title="排行榜" @back="() => $router.push('/student/game')" />
    <t-card :bordered="false">
      <t-tabs v-model="tab" @change="loadData">
        <t-tab-panel value="xp" label="总经验榜" />
        <t-tab-panel value="streak" label="连续签到榜" />
      </t-tabs>
      <t-loading :loading="loading">
        <div class="leader-list">
          <div v-for="(item, i) in list" :key="item.userId" class="leader-row" :class="{ me: item.userId === myUserId }">
            <span class="rank-num">{{ i + 1 }}</span>
            <span class="rank-medal" v-if="i < 3">{{ ['🥇','🥈','🥉'][i] }}</span>
            <t-avatar v-if="item.avatar" :image="'http://localhost:3001' + item.avatar" size="32px" />
            <t-avatar v-else size="32px">{{ item.name?.charAt(0) }}</t-avatar>
            <span class="rank-name">{{ item.name }}</span>
            <span class="rank-institution">{{ item.institution }}</span>
            <t-tag theme="primary" variant="light">{{ tab === 'xp' ? item.totalXp + ' XP' : item.streakDays + ' 天' }}</t-tag>
          </div>
        </div>
      </t-loading>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getLeaderboard } from '@/api/student'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const myUserId = (authStore.user as any)?.id || 0
const tab = ref('xp')
const list = ref<any[]>([])
const loading = ref(false)

async function loadData() {
  loading.value = true
  try { list.value = await getLeaderboard(tab.value) || [] }
  catch { list.value = [] }
  finally { loading.value = false }
}

onMounted(loadData)
</script>

<style scoped>
.leaderboard-page { max-width: 800px; }
.leader-list { display: flex; flex-direction: column; gap: 4px; }
.leader-row {
  display: flex; align-items: center; gap: 10px; padding: 10px 12px;
  border-radius: 6px; transition: background .2s;
}
.leader-row:hover { background: #f5f7fa; }
.leader-row.me { background: #f0f5ff; border: 1px solid #d6e4ff; }
.rank-num { width: 28px; text-align: center; font-weight: 600; color: #86909C; }
.rank-medal { font-size: 20px; }
.rank-name { font-weight: 500; flex: 1; }
.rank-institution { font-size: 13px; color: #86909C; flex: 2; }
</style>
