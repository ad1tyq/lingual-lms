export interface AdminUser {
  id: number;
  email: string;
  username?: string;
  subscriptionStatus: 'FREE' | 'PRO';
  role: string;
  createdAt: string;
  lessonsCompleted: number;
  coursesEnrolled: number;
  lastActive: string;
}

export interface DailyTrafficPoint {
  day: string;
  date: string;
  visitors: number;
  videoViews: number;
  signups: number;
}

export interface CategoryStatItem {
  targetLanguage?: string;
  category: string;
  japaneseTag: string;
  views: number;
  percentage: number;
}

export interface LanguageStatItem {
  language: string;
  nativeName: string;
  flag: string;
  coursesCount: number;
  lessonsCount: number;
  estimatedLearners: number;
  sharePercentage: number;
}

export interface AdminStats {
  activeLanguage?: string;
  totalStudents: number;
  proMembers: number;
  freeMembers: number;
  totalCourses: number;
  totalLessons: number;
  totalCompletedLessons: number;
  monthlyRevenueYen: number;
  dailyActiveUsers: number;
  proConversionRate: number;
  weeklyTraffic: DailyTrafficPoint[];
  categoryStats: CategoryStatItem[];
  languageStats?: LanguageStatItem[];
}
