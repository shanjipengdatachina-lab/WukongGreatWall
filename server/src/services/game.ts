import { GameXP } from '../models/GameXP';
import { GameXPLog } from '../models/GameXPLog';
import { Achievement } from '../models/Achievement';
import { UserAchievement } from '../models/UserAchievement';
import { User, Profile, Institution } from '../models';
import { calcLevel, LEVEL_XP } from '../models/GameXP';
import { Op } from 'sequelize';
import { sequelize } from '../config/database';

export async function addXP(userId: number, action: string, xp: number, description: string, refType?: string, refId?: number) {
  const today = new Date().toISOString().split('T')[0];

  let gameXp = await GameXP.findOne({ where: { user_id: userId } });
  if (!gameXp) {
    gameXp = await GameXP.create({ user_id: userId, total_xp: 0, level: 1, level_title: '学童', streak_days: 0, longest_streak: 0 });
  }

  await GameXPLog.create({ user_id: userId, action, xp, description, reference_type: refType, reference_id: refId });

  const newTotal = gameXp.total_xp + xp;
  const { level, title } = calcLevel(newTotal);
  const levelUp = level > gameXp.level;

  await gameXp.update({
    total_xp: newTotal,
    level,
    level_title: title,
    last_active_date: today
  });

  await checkAchievements(userId);

  return { xp, totalXp: newTotal, level, levelTitle: title, levelUp, nextLevelXp: LEVEL_XP[level] || LEVEL_XP[9] };
}

export async function checkin(userId: number) {
  const today = new Date().toISOString().split('T')[0];

  let gameXp = await GameXP.findOne({ where: { user_id: userId } });
  if (!gameXp) {
    gameXp = await GameXP.create({ user_id: userId, total_xp: 0, level: 1, level_title: '学童', streak_days: 0, longest_streak: 0 });
  }

  if (gameXp.last_checkin_date === today) {
    return { alreadyCheckedIn: true, ...gameXp.toJSON() };
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  let newStreak = gameXp.last_checkin_date === yesterday ? gameXp.streak_days + 1 : 1;
  const longest = Math.max(newStreak, gameXp.longest_streak);

  let bonusXp = 5;
  if (newStreak === 7) bonusXp = 5 + 50;

  const result = await addXP(userId, 'daily_checkin', bonusXp, newStreak === 7 ? '连续签到7天，额外奖励50XP' : '每日签到');

  await gameXp.update({
    streak_days: newStreak,
    longest_streak: longest,
    last_checkin_date: today,
    last_active_date: today
  });

  return { ...result, streakDays: newStreak };
}

export async function getGameOverview(userId: number) {
  let gameXp = await GameXP.findOne({ where: { user_id: userId } });
  if (!gameXp) {
    gameXp = await GameXP.create({ user_id: userId, total_xp: 0, level: 1, level_title: '学童', streak_days: 0, longest_streak: 0 });
  }

  const recentLogs = await GameXPLog.findAll({ where: { user_id: userId }, order: [['created_at', 'DESC']], limit: 10 });
  const achievements = await getAchievements(userId);

  const currentLevelIdx = gameXp.level - 1;
  const nextLevelXp = LEVEL_XP[currentLevelIdx + 1] || LEVEL_XP[9];
  const currentLevelXp = LEVEL_XP[currentLevelIdx] || 0;
  const progress = nextLevelXp ? Math.round(((gameXp.total_xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100) : 100;

  return {
    totalXp: gameXp.total_xp,
    level: gameXp.level,
    levelTitle: gameXp.level_title,
    streakDays: gameXp.streak_days,
    longestStreak: gameXp.longest_streak,
    lastCheckinDate: gameXp.last_checkin_date,
    nextLevelXp,
    xpForNextLevel: nextLevelXp ? nextLevelXp - gameXp.total_xp : 0,
    progress,
    achievements,
    recentLogs
  };
}

export async function getLeaderboard(type: string = 'xp', limit: number = 30) {
  const allXp = await GameXP.findAll({
    include: [{ model: User, as: 'User', include: [{ model: Profile, as: 'profile', include: [{ model: Institution, as: 'institution' }] }] }],
    order: [[type === 'streak' ? 'streak_days' : 'total_xp', 'DESC']],
    limit
  });
  return allXp.map((gx: any, idx: number) => ({
    rank: idx + 1,
    userId: gx.user_id,
    totalXp: gx.total_xp,
    level: gx.level,
    levelTitle: gx.level_title,
    streakDays: gx.streak_days,
    name: gx.User?.profile?.real_name || gx.User?.username,
    avatar: gx.User?.profile?.avatar,
    institution: gx.User?.profile?.institution?.name
  }));
}

export async function getAchievements(userId: number) {
  const allAchievements = await Achievement.findAll({ order: [['sort_order', 'ASC']] });
  const userAchs = await UserAchievement.findAll({ where: { user_id: userId } });

  return allAchievements.map(ach => {
    const ua = userAchs.find(ua => ua.achievement_id === ach.id);
    return {
      id: ach.id,
      code: ach.code,
      name: ach.name,
      description: ach.description,
      icon: ach.icon,
      category: ach.category,
      xpReward: ach.xp_reward,
      progress: ua?.progress || 0,
      target: ach.condition_value,
      unlocked: ua?.unlocked || false,
      unlockedAt: ua?.unlocked_at
    };
  });
}

export async function getCalendarData(userId: number) {
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  const logs = await GameXPLog.findAll({
    where: { user_id: userId, created_at: { [Op.gte]: startDate } },
    attributes: [[sequelize.fn('DATE', sequelize.col('created_at')), 'date'], [sequelize.fn('SUM', sequelize.col('xp')), 'total']],
    group: ['date'],
    raw: true
  });

  return logs;
}

async function checkAchievements(userId: number) {
  const gameXp = await GameXP.findOne({ where: { user_id: userId } });
  if (!gameXp) return;

  const allAch = await Achievement.findAll();
  const { Submission, File, TopicMember } = require('../models');
  const submissionCount = await Submission.count({ where: { user_id: userId } });
  const fileCount = await File.count({ where: { uploaded_by: userId } });
  const topicCount = await TopicMember.count({ where: { user_id: userId, status: 'accepted' } });
  const loginCount = await GameXPLog.count({ where: { user_id: userId, action: 'daily_checkin' } });

  for (const ach of allAch) {
    let progress = 0;
    switch (ach.condition_type) {
      case 'total_xp': progress = gameXp.total_xp; break;
      case 'streak_days': progress = gameXp.streak_days; break;
      case 'submission_count': progress = submissionCount; break;
      case 'file_count': progress = fileCount; break;
      case 'topic_count': progress = topicCount; break;
      case 'login_count': progress = loginCount; break;
      case 'first_login': progress = loginCount > 0 ? 1 : 0; break;
      default: progress = 0;
    }
    const unlocked = progress >= ach.condition_value;

    const [ua] = await UserAchievement.findOrCreate({
      where: { user_id: userId, achievement_id: ach.id },
      defaults: { user_id: userId, achievement_id: ach.id, progress, target: ach.condition_value, unlocked }
    });

    if (!ua.unlocked && unlocked) {
      await ua.update({ progress, unlocked: true, unlocked_at: new Date() });
    } else if (ua.progress !== progress) {
      await ua.update({ progress });
    }
  }
}


