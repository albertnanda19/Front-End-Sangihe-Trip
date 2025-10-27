"use client";

import { useAdminDashboard } from "@/hooks/admin/use-admin-dashboard";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  MoreHorizontal,
  Eye,
  UserCheck,
  MessageSquare,
  Search,
  UserPlus,
  Plus,
  Star,
} from "lucide-react";

export default function AdminDashboard() {
  const {
    kpiData,
    userRegistrationData,
    popularDestinationsData,
    tripPlansData,
    reviewRatingsData,
    loading,
    error,
    formatMonthLabel,
    formatNumber,
    hasData,
  } = useAdminDashboard();

  if (loading) {
    return <div className="text-center py-10">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  const recentActivities = [
    {
      id: 1,
      type: "user_registration",
      user: "Sarah Wijaya",
      action: "mendaftar sebagai pengguna baru",
      time: "2 menit yang lalu",
      icon: UserPlus,
      color: "text-green-600",
    },
  ];

  const quickActions = [
    {
      title: "Tambah Destinasi Baru",
      description: "Tambahkan destinasi wisata baru",
      icon: Plus,
      color: "bg-blue-500 hover:bg-blue-600",
      href: "/admin/destinations/new",
    },
  ];

  const alerts = [
    {
      id: 1,
      type: "warning",
      title: "Pending Moderation",
      message: "23 review menunggu moderasi",
      action: "Lihat Review",
      href: "/admin/reviews",
    },
  ];

  const recentUsers = [
    {
      id: 1,
      name: "Sarah Wijaya",
      email: "sarah.wijaya@email.com",
      avatar: "/placeholder.svg?height=32&width=32",
      joinDate: "2024-01-15",
      status: "active",
      tripPlans: 3,
    },
  ];

  const pendingReviews = [
    {
      id: 1,
      user: "John Doe",
      destination: "Pantai Paal",
      rating: 5,
      comment: "Pantai yang sangat indah dengan pasir putih...",
      date: "2024-01-15",
      status: "pending",
    },
  ];

  const popularSearches = [
    { query: "pantai sangihe", count: 1250 },
    { query: "gunung sahendaruman", count: 980 },
    { query: "diving bunaken", count: 850 },
    { query: "kuliner sangihe", count: 720 },
    { query: "penginapan murah", count: 650 },
  ];

  return (
    <>
      <div className="p-6 space-y-8">
        {/* Statistics Overview */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Dashboard Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {kpiData.map((kpi, index) => {
              const Icon = kpi.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          {kpi.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {kpi.value}
                        </p>
                        <div className="flex items-center mt-1">
                          {kpi.trend === "up" ? (
                            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                          )}
                          <span
                            className={`text-sm ${
                              kpi.trend === "up"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {kpi.growth}
                          </span>
                        </div>
                      </div>
                      <div className={`p-3 rounded-full bg-gray-100`}>
                        <Icon className={`h-6 w-6 ${kpi.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Registration Trend */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>User Registration Trend</CardTitle>
              <CardDescription>Monthly user registrations</CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <ChartContainer
                config={{
                  users: {
                    label: "Users",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[200px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  {hasData(userRegistrationData) ? (
                    <LineChart
                      data={userRegistrationData}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tickFormatter={formatMonthLabel} fontSize={12} />
                      <YAxis fontSize={12} tickFormatter={(v) => formatNumber(v as number)} />
                      <ChartTooltip content={<ChartTooltipContent formatter={(v) => formatNumber(v as number)} />} />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="var(--color-users)"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-slate-400">Tidak ada data pendaftaran</div>
                  )}
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Popular Destinations */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Popular Destinations</CardTitle>
              <CardDescription>Most visited destinations</CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <ChartContainer
                config={{
                  visits: {
                    label: "Visits",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[200px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  {hasData(popularDestinationsData) ? (
                    <BarChart
                      data={popularDestinationsData.slice().sort((a, b) => b.visits - a.visits)}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        fontSize={10}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis fontSize={12} tickFormatter={(v) => formatNumber(v as number)} />
                      <ChartTooltip content={<ChartTooltipContent formatter={(v) => formatNumber(v as number)} />} />
                      <Bar dataKey="visits" fill="var(--color-visits)">
                        <LabelList dataKey="visits" position="top" formatter={(v: unknown) => formatNumber(v as number)} />
                      </Bar>
                    </BarChart>
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-slate-400">Tidak ada destinasi populer</div>
                  )}
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Trip Plans by Month */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Trip Plans by Month</CardTitle>
              <CardDescription>Monthly trip planning activity</CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <ChartContainer
                config={{
                  plans: {
                    label: "Plans",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[200px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  {hasData(tripPlansData) ? (
                    <AreaChart
                      data={tripPlansData}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="gradPlans" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--color-plans)" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="var(--color-plans)" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tickFormatter={formatMonthLabel} fontSize={12} />
                      <YAxis fontSize={12} tickFormatter={(v) => formatNumber(v as number)} />
                      <ChartTooltip content={<ChartTooltipContent formatter={(v) => formatNumber(v as number)} />} />
                      <Area
                        type="monotone"
                        dataKey="plans"
                        stroke="var(--color-plans)"
                        fill="url(#gradPlans)"
                        fillOpacity={1}
                        dot={{ r: 2 }}
                      />
                    </AreaChart>
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-slate-400">Tidak ada data rencana perjalanan</div>
                  )}
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Review Ratings Distribution */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Review Ratings Distribution</CardTitle>
              <CardDescription>Distribution of review ratings</CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <ChartContainer
                config={{
                  count: {
                    label: "Count",
                    color: "hsl(var(--chart-4))",
                  },
                }}
                className="h-[200px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  {hasData(reviewRatingsData) ? (
                    <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <Pie
                        data={reviewRatingsData.slice().sort((a, b) => a.rating - b.rating)}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="count"
                        label={(entry) => `${entry.rating}: ${entry.count}`}
                      >
                        {reviewRatingsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent formatter={(v) => formatNumber(v as number)} />} />
                      <Legend />
                    </PieChart>
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-slate-400">Tidak ada data review</div>
                  )}
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>
                Latest system activities and user actions
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="space-y-4">
                {recentActivities.map(
                  (activity: {
                    id: number;
                    type: string;
                    user: string;
                    action: string;
                    time: string;
                    icon: React.ComponentType<{ className?: string }>;
                    color: string;
                  }) => {
                    const Icon = activity.icon;
                    return (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full bg-gray-100`}>
                          <Icon className={`h-4 w-4 ${activity.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">{activity.user}</span>{" "}
                            {activity.action}
                          </p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="space-y-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                      <Button asChild key={index} variant="outline" className="w-full justify-start h-auto p-3">
                        <Link href={action.href} className="flex items-center">
                          <Icon className="h-4 w-4 mr-3" />
                          <div className="text-left">
                            <div className="font-medium">{action.title}</div>
                            <div className="text-xs text-gray-500">
                              {action.description}
                            </div>
                          </div>
                        </Link>
                      </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts & Notifications */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Alerts & Notifications</CardTitle>
            <CardDescription>
              System alerts and important notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {alerts.map((alert) => (
                <Alert
                  key={alert.id}
                  className={`
                  ${alert.type === "error" ? "border-red-200 bg-red-50" : ""}
                  ${alert.type === "warning" ? "border-yellow-200 bg-yellow-50" : ""}
                  ${alert.type === "success" ? "border-green-200 bg-green-50" : ""}
                  ${alert.type === "info" ? "border-blue-200 bg-blue-50" : ""}
                `}
                >
                  <AlertTriangle
                    className={`h-4 w-4 ${
                      alert.type === "error"
                        ? "text-red-600"
                        : alert.type === "warning"
                        ? "text-yellow-600"
                        : alert.type === "success"
                        ? "text-green-600"
                        : "text-blue-600"
                    }`}
                  />
                  <AlertDescription>
                    <div className="font-medium">{alert.title}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {alert.message}
                    </div>
                    <Button variant="link" className="p-0 h-auto text-xs mt-2">
                      {alert.action}
                    </Button>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Users */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>Newly registered users</CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={user.avatar || "/placeholder.svg"}
                            />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="text-sm font-medium truncate">
                              {user.name}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.status === "active" ? "default" : "secondary"
                          }
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Activate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Send Message
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pending Reviews */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Pending Reviews</CardTitle>
              <CardDescription>Reviews awaiting moderation</CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="space-y-4">
                {pendingReviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-sm">{review.user}</div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                      {review.destination}
                    </div>
                    <div className="text-xs text-gray-500 mb-3 line-clamp-2">
                      {review.comment}
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="text-xs">
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Popular Searches */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Popular Searches</CardTitle>
              <CardDescription>Most searched terms</CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="space-y-3">
                {popularSearches.map((search, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <Search className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{search.query}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {search.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}