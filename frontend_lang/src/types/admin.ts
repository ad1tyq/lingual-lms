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
  category: string;
  japaneseTag: string;
  views: number;
  percentage: number;
}

export interface AdminStats {
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
}
