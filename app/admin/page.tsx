"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  FileText,
  AlertTriangle,
  DollarSign,
  Users,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

// Types for dashboard data
interface DashboardStats {
  totalRevenue: number;
  activePolicies: number;
  pendingClaims: number;
  totalUsers: number;
}

interface RecentActivity {
  id: string;
  type: "policy" | "claim" | "user" | "review";
  action: string;
  description: string;
  timestamp: string;
}

// Stats card component
function StatsCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  iconBg,
}: {
  title: string;
  value: string;
  change?: string;
  changeType?: "up" | "down";
  icon: React.ElementType;
  iconBg: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${changeType === "up" ? "text-green-600" : "text-red-600"
              }`}>
              {changeType === "up" ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              <span>{change} bu ay</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${iconBg}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

// Activity type badge
function ActivityBadge({ type }: { type: string }) {
  const styles = {
    policy: "bg-blue-100 text-blue-700",
    claim: "bg-orange-100 text-orange-700",
    user: "bg-green-100 text-green-700",
    review: "bg-purple-100 text-purple-700",
  };

  const labels = {
    policy: "Poliçe",
    claim: "Hasar",
    user: "Kullanıcı",
    review: "Yorum",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[type as keyof typeof styles]}`}>
      {labels[type as keyof typeof labels]}
    </span>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    activePolicies: 0,
    pendingClaims: 0,
    totalUsers: 0,
  });
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = async () => {
      try {
        // TODO: Replace with actual API calls
        // For now using demo data
        setStats({
          totalRevenue: 125840,
          activePolicies: 342,
          pendingClaims: 12,
          totalUsers: 1256,
        });

        setActivities([
          {
            id: "1",
            type: "policy",
            action: "Yeni Poliçe",
            description: "iPhone 15 Pro için Kazaen Hasar poliçesi oluşturuldu",
            timestamp: "2 dakika önce",
          },
          {
            id: "2",
            type: "claim",
            action: "Hasar Bildirimi",
            description: "MacBook Pro ekran hasarı bildirimi alındı",
            timestamp: "15 dakika önce",
          },
          {
            id: "3",
            type: "user",
            action: "Yeni Kayıt",
            description: "ahmet.yilmaz@email.com kullanıcı kaydı tamamlandı",
            timestamp: "1 saat önce",
          },
          {
            id: "4",
            type: "review",
            action: "Yeni Yorum",
            description: "5 yıldızlı yorum onay bekliyor",
            timestamp: "2 saat önce",
          },
          {
            id: "5",
            type: "claim",
            action: "Hasar Onaylandı",
            description: "Samsung Galaxy S24 batarya hasarı onaylandı",
            timestamp: "3 saat önce",
          },
        ]);
      } catch (error) {
        console.error("Dashboard data error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Hoş Geldiniz 👋</h2>
        <p className="text-gray-500 mt-1">
          İşte Waypla&apos;nın genel durumu
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Toplam Gelir"
          value={`₺${stats.totalRevenue.toLocaleString("tr-TR")}`}
          change="+12%"
          changeType="up"
          icon={DollarSign}
          iconBg="bg-green-500"
        />
        <StatsCard
          title="Aktif Poliçeler"
          value={stats.activePolicies.toString()}
          change="+8%"
          changeType="up"
          icon={FileText}
          iconBg="bg-blue-500"
        />
        <StatsCard
          title="Bekleyen Hasarlar"
          value={stats.pendingClaims.toString()}
          change="-3"
          changeType="down"
          icon={AlertTriangle}
          iconBg="bg-orange-500"
        />
        <StatsCard
          title="Toplam Kullanıcı"
          value={stats.totalUsers.toLocaleString("tr-TR")}
          change="+24"
          changeType="up"
          icon={Users}
          iconBg="bg-purple-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Son Aktiviteler</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Tümünü Gör
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {activities.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="mt-0.5">
                    <ActivityBadge type={activity.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500 truncate">{activity.description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{activity.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats Panel */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Hızlı İstatistikler</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Bugünkü Satışlar</span>
              <span className="font-semibold text-gray-900">₺4,250</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Bekleyen Onaylar</span>
              <span className="font-semibold text-orange-600">7</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Aktif Servis Talepleri</span>
              <span className="font-semibold text-gray-900">23</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Onay Bekleyen Yorumlar</span>
              <span className="font-semibold text-purple-600">4</span>
            </div>
            <hr className="my-4" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Müşteri Memnuniyeti</span>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="font-semibold text-green-600">98%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
