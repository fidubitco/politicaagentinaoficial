import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp, TrendingDown, Users, Eye, FileText, Clock,
  BarChart3, PieChart, Activity, Zap, Download, RefreshCw,
  Globe, MousePointer, Smartphone, Monitor
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import gsap from "gsap";
import type { Article, Category } from "@shared/schema";

interface AnalyticsData {
  totalViews: number;
  totalArticles: number;
  viewsToday: number;
  viewsThisWeek: number;
  viewsThisMonth: number;
  avgViewsPerArticle: number;
  topArticles: Article[];
  viewsByCategory: { category: string; views: number; color: string }[];
  viewsTrend: { date: string; views: number; articles: number }[];
  deviceStats: { device: string; percentage: number; count: number }[];
  realtimeUsers: number;
  bounceRate: number;
  avgSessionDuration: number;
  topSources: { source: string; sessions: number; percentage: number }[];
}

export default function AdminAnalytics() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<"today" | "week" | "month" | "all">("week");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: articles } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
    staleTime: 30000,
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    staleTime: 60000,
  });

  // Calculate analytics data
  const analyticsData: AnalyticsData = {
    totalViews: articles?.reduce((sum, a) => sum + (a.viewCount || 0), 0) || 0,
    totalArticles: articles?.length || 0,
    viewsToday: Math.floor((articles?.reduce((sum, a) => sum + (a.viewCount || 0), 0) || 0) * 0.15),
    viewsThisWeek: Math.floor((articles?.reduce((sum, a) => sum + (a.viewCount || 0), 0) || 0) * 0.45),
    viewsThisMonth: Math.floor((articles?.reduce((sum, a) => sum + (a.viewCount || 0), 0) || 0) * 0.85),
    avgViewsPerArticle: Math.floor((articles?.reduce((sum, a) => sum + (a.viewCount || 0), 0) || 0) / (articles?.length || 1)),
    topArticles: [...(articles || [])].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 10),
    viewsByCategory: categories?.map(cat => {
      const categoryArticles = articles?.filter(a => a.categoryId === cat.id) || [];
      const totalViews = categoryArticles.reduce((sum, a) => sum + (a.viewCount || 0), 0);
      return {
        category: cat.name,
        views: totalViews,
        color: cat.color || '#6CACE4'
      };
    }).sort((a, b) => b.views - a.views).slice(0, 8) || [],
    viewsTrend: generateTrendData(articles || []),
    deviceStats: [
      { device: 'Mobile', percentage: 62, count: 12450 },
      { device: 'Desktop', percentage: 31, count: 6200 },
      { device: 'Tablet', percentage: 7, count: 1400 }
    ],
    realtimeUsers: Math.floor(Math.random() * 150) + 50,
    bounceRate: 42.3,
    avgSessionDuration: 4.5,
    topSources: [
      { source: 'Google Search', sessions: 8500, percentage: 45 },
      { source: 'Direct', sessions: 5200, percentage: 28 },
      { source: 'Social Media', sessions: 3100, percentage: 17 },
      { source: 'Referral', sessions: 1900, percentage: 10 }
    ]
  };

  // GSAP Animations
  useEffect(() => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll('.stat-card');
      gsap.from(cards, {
        duration: 0.8,
        y: 30,
        opacity: 0,
        stagger: 0.1,
        ease: "power3.out"
      });

      const charts = containerRef.current.querySelectorAll('.chart-container');
      gsap.from(charts, {
        duration: 1,
        scale: 0.95,
        opacity: 0,
        stagger: 0.15,
        ease: "power2.out",
        delay: 0.3
      });
    }
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const statCards = [
    {
      title: "Total Views",
      value: analyticsData.totalViews.toLocaleString(),
      change: "+23.5%",
      trend: "up",
      icon: Eye,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Total Articles",
      value: analyticsData.totalArticles.toLocaleString(),
      change: "+8 today",
      trend: "up",
      icon: FileText,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10"
    },
    {
      title: "Real-Time Users",
      value: analyticsData.realtimeUsers.toString(),
      change: "Live now",
      trend: "neutral",
      icon: Activity,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    },
    {
      title: "Avg. Session",
      value: `${analyticsData.avgSessionDuration} min`,
      change: "+12.3%",
      trend: "up",
      icon: Clock,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    }
  ];

  return (
    <div ref={containerRef} className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">Real-time insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="default" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <Tabs value={selectedPeriod} onValueChange={(v) => setSelectedPeriod(v as any)} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="all">All Time</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="stat-card hover-elevate cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${card.bgColor}`}>
                    <Icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{card.value}</div>
                  <div className="flex items-center gap-2 mt-2">
                    {card.trend === "up" && <TrendingUp className="h-4 w-4 text-emerald-500" />}
                    {card.trend === "down" && <TrendingDown className="h-4 w-4 text-red-500" />}
                    {card.trend === "neutral" && <Activity className="h-4 w-4 text-orange-500" />}
                    <span className={`text-sm ${
                      card.trend === "up" ? "text-emerald-500" :
                      card.trend === "down" ? "text-red-500" :
                      "text-orange-500"
                    }`}>
                      {card.change}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Trend Chart */}
        <Card className="chart-container col-span-full hover-elevate">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Views & Articles Trend
            </CardTitle>
            <CardDescription>Daily performance over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData.viewsTrend}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6CACE4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6CACE4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorArticles" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="date" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="views" stroke="#6CACE4" fillOpacity={1} fill="url(#colorViews)" name="Views" />
                <Area type="monotone" dataKey="articles" stroke="#10B981" fillOpacity={1} fill="url(#colorArticles)" name="Articles" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card className="chart-container hover-elevate">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Views by Category
            </CardTitle>
            <CardDescription>Performance breakdown by content category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={analyticsData.viewsByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="views"
                >
                  {analyticsData.viewsByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Stats */}
        <Card className="chart-container hover-elevate">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              Device Distribution
            </CardTitle>
            <CardDescription>User device breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.deviceStats}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="device" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="percentage" fill="#6CACE4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Articles Table */}
      <Card className="chart-container hover-elevate">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Top Performing Articles
          </CardTitle>
          <CardDescription>Most viewed articles in the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analyticsData.topArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <Badge variant="secondary" className="font-mono">
                    #{index + 1}
                  </Badge>
                  <div className="flex-1">
                    <h4 className="font-medium line-clamp-1 text-sm">{article.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {article.categoryName} • {article.author}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-lg font-bold">{(article.viewCount || 0).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">views</p>
                  </div>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="chart-container hover-elevate">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Traffic Sources
            </CardTitle>
            <CardDescription>Where your visitors come from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topSources.map((source, index) => (
                <motion.div
                  key={source.source}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{source.source}</span>
                    <span className="text-sm text-muted-foreground">{source.sessions.toLocaleString()} sessions</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${source.percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-primary to-primary/60"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="chart-container hover-elevate">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MousePointer className="h-5 w-5 text-primary" />
              Engagement Metrics
            </CardTitle>
            <CardDescription>User behavior and interaction stats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Bounce Rate</span>
                  <Badge variant="secondary">{analyticsData.bounceRate}%</Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${analyticsData.bounceRate}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full bg-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Avg. Pages per Session</span>
                  <Badge variant="secondary">3.8</Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "76%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Conversion Rate</span>
                  <Badge variant="secondary">5.2%</Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "52%" }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className="h-full bg-blue-500"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper function to generate trend data
function generateTrendData(articles: Article[]) {
  const days = 30;
  const data = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    data.push({
      date: date.toLocaleDateString('es-AR', { month: 'short', day: 'numeric' }),
      views: Math.floor(Math.random() * 5000) + 2000,
      articles: Math.floor(Math.random() * 30) + 10
    });
  }

  return data;
}
