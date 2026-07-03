<template>
  <div class="game-center">
    <t-page-header title="Game 学习中心" />
    <t-row :gutter="16">
      <t-col :span="8">
        <t-card class="overview-card" :bordered="false">
          <t-row :gutter="16">
            <t-col :span="6"><t-statistic title="经验值" :value="gameState?.totalXp || 0" unit="XP" /></t-col>
            <t-col :span="6"><t-statistic title="等级" :value="`Lv.${gameState?.level || 1}`" :extra="gameState?.levelTitle" /></t-col>
            <t-col :span="6"><t-statistic title="连续签到" :value="gameState?.streakDays || 0" unit="天" /></t-col>
            <t-col :span="6"><t-statistic title="最长连续" :value="gameState?.longestStreak || 0" unit="天" /></t-col>
          </t-row>
          <t-divider />
          <div v-if="gameState">
            <span>距下一级「{{ gameState.level >= 10 ? '已满级' : getNextLevelTitle(gameState.level) }}」还需: {{ gameState.xpForNextLevel || 0 }} XP</span>
            <t-progress :percentage="Math.min(gameState.progress || 0, 100)" theme="success" style="margin-top:8px" />
          </div>
        </t-card>
      </t-col>
      <t-col :span="4">
        <t-card :bordered="false">
          <h4>每日签到</h4>
          <t-button block theme="primary" size="large" @click="doCheckin" :loading="checkingIn" :disabled="alreadyChecked">
            <t-icon name="check" /> {{ alreadyChecked ? '今日已签到' : '签到 +5 XP' }}
          </t-button>
        </t-card>
      </t-col>
    </t-row>

    <t-row :gutter="16" style="margin-top:16px">
      <t-col :span="6">
        <t-card title="成就徽章" :bordered="false">
          <t-row :gutter="8">
            <t-col v-for="ach in achievements.slice(0,6)" :key="ach.code" :span="4">
              <div class="achievement-card" :class="{ unlocked: ach.unlocked }">
                <div class="ach-icon">{{ ach.unlocked ? '✅' : '🔒' }}</div>
                <div class="ach-name">{{ ach.name }}</div>
                <t-progress :percentage="ach.target ? Math.round(ach.progress / ach.target * 100) : 0" theme="primary" size="small" />
              </div>
            </t-col>
          </t-row>
          <t-button variant="text" theme="primary" block @click="$router.push('/student/game/achievements')">查看全部成就</t-button>
        </t-card>
      </t-col>
      <t-col :span="6">
        <t-card title="经验值明细" :bordered="false">
          <t-timeline v-if="recentLogs.length">
            <t-timeline-item v-for="(log,i) in recentLogs" :key="i">
              {{ log.description }}
              <t-tag theme="success" variant="light" size="small">+{{ log.xp }} XP</t-tag>
            </t-timeline-item>
          </t-timeline>
          <t-empty v-else description="暂无记录" size="small" />
        </t-card>
      </t-col>
    </t-row>

    <t-row :gutter="16" style="margin-top:16px">
      <t-col :span="4">
        <t-button block variant="outline" @click="$router.push('/student/game/leaderboard')">排行榜</t-button>
      </t-col>
      <t-col :span="4">
        <t-button block variant="outline" @click="$router.push('/student/game/achievements')">全部成就</t-button>
      </t-col>
    </t-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gameCheckin } from '@/api/student'
import { useStudentStore } from '@/stores/student'
import { MessagePlugin } from 'tdesign-vue-next'

const studentStore = useStudentStore()
const gameState = ref<any>(null)
const achievements = ref<any[]>([])
const recentLogs = ref<any[]>([])
const checkingIn = ref(false)
const alreadyChecked = ref(false)

const levelTitles = ['学童','学子','学正','学士','硕士','博士','学者','专家','大师','宗师']
function getNextLevelTitle(lv: number) { return levelTitles[lv] || '宗师' }

async function loadGame() {
  await studentStore.loadAll()
  gameState.value = studentStore.gameState
  achievements.value = studentStore.achievements
  recentLogs.value = studentStore.gameState?.recentLogs || []
  alreadyChecked.value = studentStore.gameState?.lastCheckinDate === new Date().toISOString().split('T')[0]
}

async function doCheckin() {
  checkingIn.value = true
  try {
    const res: any = await gameCheckin()
    if (res.alreadyCheckedIn) {
      MessagePlugin.warning('今日已签到')
      alreadyChecked.value = true
    } else {
      MessagePlugin.success(`签到成功！获得 +${res.xp} XP`)
      if (res.levelUp) MessagePlugin.success(`🎉 升级了！${res.levelTitle}`)
      studentStore.refreshGame()
      gameState.value = studentStore.gameState
      alreadyChecked.value = true
    }
  } catch { MessagePlugin.error('签到失败') }
  finally { checkingIn.value = false }
}

onMounted(loadGame)
</script>

<style scoped>
.game-center { max-width: 1200px; }
.overview-card :deep(.t-statistic__title) { color: #86909C; font-size: 13px; }
.achievement-card {
  text-align: center;
  padding: 8px;
  border: 1px solid #e7e7e7;
  border-radius: 6px;
  margin-bottom: 8px;
  opacity: 0.6;
}
.achievement-card.unlocked { opacity: 1; border-color: #0052D9; background: #f0f5ff; }
.ach-icon { font-size: 24px; margin-bottom: 4px; }
.ach-name { font-size: 11px; color: #4E5969; }
</style>
