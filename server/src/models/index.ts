import { User } from './User';
import { Institution } from './Institution';
import { Profile } from './Profile';
import { Course } from './Course';
import { CourseChapter } from './CourseChapter';
import { Assignment } from './Assignment';
import { Submission } from './Submission';
import { File } from './File';
import { Topic } from './Topic';
import { TopicMember } from './TopicMember';
import { TopicTask } from './TopicTask';
import { Annotation } from './Annotation';
import { Comment } from './Comment';
import { LabInvitation } from './LabInvitation';
import { AuditLog } from './AuditLog';
import { TEDProfile } from './TEDProfile';
import { GameXP } from './GameXP';
import { GameXPLog } from './GameXPLog';
import { Achievement } from './Achievement';
import { UserAchievement } from './UserAchievement';

User.hasOne(Profile, { foreignKey: 'user_id', as: 'profile' });
Profile.belongsTo(User, { foreignKey: 'user_id' });

Profile.belongsTo(Institution, { foreignKey: 'institution_id', as: 'institution' });
Institution.hasMany(Profile, { foreignKey: 'institution_id' });

Course.hasMany(CourseChapter, { foreignKey: 'course_id', as: 'chapters' });
CourseChapter.belongsTo(Course, { foreignKey: 'course_id' });

Course.hasMany(Assignment, { foreignKey: 'course_id', as: 'assignments' });
Assignment.belongsTo(Course, { foreignKey: 'course_id' });

Assignment.hasMany(Submission, { foreignKey: 'assignment_id', as: 'submissions' });
Submission.belongsTo(Assignment, { foreignKey: 'assignment_id' });

Submission.hasMany(Annotation, { foreignKey: 'submission_id', as: 'annotations' });
Annotation.belongsTo(Submission, { foreignKey: 'submission_id' });

Submission.hasMany(Comment, { foreignKey: 'submission_id', as: 'comments' });
Comment.belongsTo(Submission, { foreignKey: 'submission_id' });

Topic.hasMany(TopicMember, { foreignKey: 'topic_id', as: 'members' });
TopicMember.belongsTo(Topic, { foreignKey: 'topic_id' });

Topic.hasMany(TopicTask, { foreignKey: 'topic_id', as: 'tasks' });
TopicTask.belongsTo(Topic, { foreignKey: 'topic_id' });

User.hasOne(TEDProfile, { foreignKey: 'user_id', as: 'tedProfile' });
TEDProfile.belongsTo(User, { foreignKey: 'user_id' });

User.hasOne(GameXP, { foreignKey: 'user_id', as: 'gameXp' });
GameXP.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(GameXPLog, { foreignKey: 'user_id', as: 'xpLogs' });
GameXPLog.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(UserAchievement, { foreignKey: 'user_id', as: 'userAchievements' });
UserAchievement.belongsTo(User, { foreignKey: 'user_id' });

export {
  User, Institution, Profile, Course, CourseChapter, Assignment, Submission, File,
  Topic, TopicMember, TopicTask, Annotation, Comment, LabInvitation, AuditLog,
  TEDProfile, GameXP, GameXPLog, Achievement, UserAchievement
};
