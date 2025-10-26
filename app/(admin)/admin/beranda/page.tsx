"use client";

import { useState } from "react";
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
  Users,
  MapPin,
  Calendar,
  Star,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Plus,
  Shield,
  AlertTriangle,
  CheckCircle,
  MoreHorizontal,
  Eye,
  UserCheck,
  MessageSquare,
  Send,
  Activity,
  Search,
  UserPlus,
  PenTool,
} from "lucide-react";
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
} from "recharts";

// Mock data
const kpiData = [
  {
    title: "Total Users",
    value: "12,847",
    growth: "+12.5%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Total Destinations",
    value: "156",
    growth: "+3 bulan ini",
    trend: "up",
    icon: MapPin,
    color: "text-green-600",
  },
  {
    title: "Total Trip Plans",
    value: "3,429",
    growth: "+18.2%",
    trend: "up",
    icon: Calendar,
    color: "text-purple-600",
  },
  {
    title: "Total Reviews",
    value: "8,234",
    growth: "+5.8%",
    trend: "up",
    icon: Star,
    color: "text-yellow-600",
  },
  /*
  {
    title: "Monthly Active Users",
    value: "4,521",
    growth: "+8.3%",
    trend: "up",
    icon: Activity,
    color: "text-indigo-600",
  },
  {
    title: "Revenue",
    value: "Rp 245.8M",
    growth: "+15.2%",
    trend: "up",
    icon: DollarSign,
    color: "text-emerald-600",
  },
  */
];

const userRegistrationData = [
  { month: "Jan", users: 450 },
  { month: "Feb", users: 520 },
  { month: "Mar", users: 680 },
  { month: "Apr", users: 750 },
  { month: "May", users: 890 },
  { month: "Jun", users: 1200 },
];

const popularDestinationsData = [
  { name: "Pantai Paal", visits: 1250 },
  { name: "Gunung Sahendaruman", visits: 980 },
  { name: "Danau Linow", visits: 850 },
  { name: "Pulau Bunaken", visits: 720 },
  { name: "Air Terjun Kali", visits: 650 },
  { name: "Pantai Liang", visits: 580 },
];

const tripPlansData = [
  { month: "Jan", plans: 280 },
  { month: "Feb", plans: 320 },
  { month: "Mar", plans: 450 },
  { month: "Apr", plans: 380 },
  { month: "May", plans: 520 },
  { month: "Jun", plans: 680 },
];

const reviewRatingsData = [
  { rating: "5 Star", count: 3420, color: "#10B981" },
  { rating: "4 Star", count: 2890, color: "#3B82F6" },
  { rating: "3 Star", count: 1240, color: "#F59E0B" },
  { rating: "2 Star", count: 450, color: "#EF4444" },
  { rating: "1 Star", count: 234, color: "#6B7280" },
];

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
  {
    id: 2,
    type: "review",
    user: "Ahmad Rizki",
    action: "menulis review untuk Pantai Paal",
    time: "5 menit yang lalu",
    icon: Star,
    color: "text-yellow-600",
    status: "pending",
  },
  {
    id: 3,
    type: "trip_plan",
    user: "Maria Santos",
    action: "membuat rencana perjalanan baru",
    time: "12 menit yang lalu",
    icon: Calendar,
    color: "text-purple-600",
  },
  {
    id: 4,
    type: "system",
    user: "System",
    action: "backup database berhasil",
    time: "1 jam yang lalu",
    icon: CheckCircle,
    color: "text-blue-600",
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
  {
    title: "Tulis Artikel",
    description: "Buat artikel wisata baru",
    icon: PenTool,
    color: "bg-green-500 hover:bg-green-600",
    href: "/admin/articles/new",
  },
  {
    title: "Moderate Reviews",
    description: "Moderasi review pengguna",
    icon: Shield,
    color: "bg-yellow-500 hover:bg-yellow-600",
    href: "/admin/reviews",
  },
  {
    title: "Send Newsletter",
    description: "Kirim newsletter ke pengguna",
    icon: Send,
    color: "bg-purple-500 hover:bg-purple-600",
    href: "/admin/newsletter",
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
  {
    id: 2,
    type: "success",
    title: "System Health",
    message: "Semua sistem berjalan normal",
    action: "Lihat Detail",
    href: "/admin/system",
  },
  {
    id: 3,
    type: "error",
    title: "Low-Rated Destinations",
    message: "3 destinasi dengan rating rendah",
    action: "Lihat Destinasi",
    href: "/admin/destinations",
  },
  {
    id: 4,
    type: "info",
    title: "User Reports",
    message: "5 laporan pengguna perlu ditinjau",
    action: "Lihat Laporan",
    href: "/admin/reports",
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
  {
    id: 2,
    name: "Ahmad Rizki",
    email: "ahmad.rizki@email.com",
    avatar: "/placeholder.svg?height=32&width=32",
    joinDate: "2024-01-14",
    status: "active",
    tripPlans: 1,
  },
  {
    id: 3,
    name: "Maria Santos",
    email: "maria.santos@email.com",
    avatar: "/placeholder.svg?height=32&width=32",
    joinDate: "2024-01-13",
    status: "pending",
    tripPlans: 0,
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
  {
    id: 2,
    user: "Jane Smith",
    destination: "Gunung Sahendaruman",
    rating: 4,
    comment: "Pendakian yang menantang tapi pemandangan...",
    date: "2024-01-14",
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

export default function AdminDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    SANGIHETRIP
                  </h1>
                  <Badge variant="secondary" className="text-xs">
                    ADMIN
                  </Badge>
                </div>
              </div>

              <nav className="hidden md:flex space-x-6">
                <Button variant="ghost" className="text-blue-600 bg-blue-50">
                  Dashboard
                </Button>
                <Button variant="ghost">Users</Button>
                <Button variant="ghost">Destinations</Button>
                <Button variant="ghost">Articles</Button>
                <Button variant="ghost">Reviews</Button>
                <Button variant="ghost">Analytics</Button>
              </nav>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block">Admin</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                <DropdownMenuItem>System Settings</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-8">
        {/* Statistics Overview */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Dashboard Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <LineChart
                    data={userRegistrationData}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="var(--color-users)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
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
                  <BarChart
                    data={popularDestinationsData}
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
                    <YAxis fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="visits" fill="var(--color-visits)" />
                  </BarChart>
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
                  <AreaChart
                    data={tripPlansData}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="plans"
                      stroke="var(--color-plans)"
                      fill="var(--color-plans)"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
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
                  <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <Pie
                      data={reviewRatingsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {reviewRatingsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                  </PieChart>
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
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-3"
                    >
                      <div className={`p-2 rounded-full bg-gray-100`}>
                        <Icon className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.user}</span>{" "}
                          {activity.action}
                          {activity.status && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              {activity.status}
                            </Badge>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
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
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start h-auto p-3"
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-xs text-gray-500">
                          {action.description}
                        </div>
                      </div>
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
                  ${
                    alert.type === "warning"
                      ? "border-yellow-200 bg-yellow-50"
                      : ""
                  }
                  ${
                    alert.type === "success"
                      ? "border-green-200 bg-green-50"
                      : ""
                  }
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
    </div>
  );
}
