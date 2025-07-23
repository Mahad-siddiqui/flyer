"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  FileText,
  QrCode,
  Eye,
  Plus,
  BarChart3,
  Settings,
  Crown,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface DashboardStats {
  totalFlyers: number;
  totalViews: number;
  totalScans: number;
  flyersThisMonth: number;
  planLimit: number;
  planName: string;
}

interface FlyerItem {
  id: string;
  title: string;
  category: string;
  viewCount: number;
  createdAt: string;
  generatedUrl: string;
  qrCodePath: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentFlyers, setRecentFlyers] = useState<FlyerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, flyersResponse] = await Promise.all([
          fetch("/api/dashboard/stats"),
          fetch("/api/flyers?limit=5"),
        ]);

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }

        if (flyersResponse.ok) {
          const flyersData = await flyersResponse.json();
          setRecentFlyers(flyersData.flyers);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchDashboardData();
    }
  }, [session]);

  const getUsagePercentage = () => {
    if (!stats) return 0;
    if (stats.planLimit === -1) return 0; // Unlimited
    return Math.min((stats.flyersThisMonth / stats.planLimit) * 100, 100);
  };

  const getPlanColor = (planName: string) => {
    switch (planName) {
      case "Free":
        return "bg-gray-100 text-gray-800";
      case "Pro":
        return "bg-blue-100 text-blue-800";
      case "Enterprise":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPlanIcon = (planName: string) => {
    switch (planName) {
      case "Free":
        return <Zap className="h-4 w-4" />;
      case "Pro":
        return <BarChart3 className="h-4 w-4" />;
      case "Enterprise":
        return <Crown className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {session?.user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your flyers today.
          </p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Link href="/dashboard/upload">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Flyer
            </Button>
          </Link>
          <Link href="/dashboard/settings">
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Flyers</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalFlyers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.flyersThisMonth || 0} created this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalViews || 0}</div>
            <p className="text-xs text-muted-foreground">
              Across all your flyers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">QR Scans</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalScans || 0}</div>
            <p className="text-xs text-muted-foreground">Total QR code scans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            {stats && getPlanIcon(stats.planName)}
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getPlanColor(stats?.planName || "Free")}>
                {stats?.planName || "Free"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.planLimit === -1
                ? "Unlimited"
                : `${stats?.planLimit || 0} flyers/month`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Progress */}
      {stats && stats.planLimit !== -1 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Monthly Usage</CardTitle>
            <CardDescription>
              {stats.flyersThisMonth} of {stats.planLimit} flyers used this
              month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={getUsagePercentage()} className="mb-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{stats.flyersThisMonth} used</span>
              <span>{stats.planLimit - stats.flyersThisMonth} remaining</span>
            </div>
            {getUsagePercentage() > 80 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  You're approaching your monthly limit. Consider upgrading to
                  Pro for unlimited flyers.
                </p>
                <Link href="/pricing">
                  <Button size="sm" variant="outline" className="mt-2">
                    Upgrade Plan
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs defaultValue="recent" className="space-y-6">
        <TabsList>
          <TabsTrigger value="recent">Recent Flyers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          {recentFlyers.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No flyers yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Create your first flyer to get started with FlyerWeb
                </p>
                <Link href="/dashboard/upload">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Flyer
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {recentFlyers.map((flyer) => {
                console.log("flyer.qrCodePath", flyer.qrCodePath);
                return (
                  <Card
                    key={flyer.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          {flyer.qrCodePath && flyer.qrCodePath.startsWith("data:image") && (
                            <img
                              src={flyer.qrCodePath}
                              alt={flyer.title}
                              className="h-20 w-2   0 rounded-lg object-cover"
                              style={{ objectFit: "contain" }}
                            />
                          )}

                          <div>
                            <h3 className="font-medium">{flyer.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {flyer.category} • Created{" "}
                              {formatDate(flyer.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {flyer.viewCount} views
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Total engagement
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" asChild>
                              <Link href={flyer.generatedUrl} target="_blank">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Link>
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/dashboard/flyers/${flyer.id}`}>
                                <Settings className="h-4 w-4 mr-1" />
                                Edit
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Track your flyer performance and engagement metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Analytics Coming Soon
                </h3>
                <p className="text-muted-foreground">
                  We're working on detailed analytics to help you understand
                  your audience better.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Template Library</CardTitle>
              <CardDescription>
                Choose from our collection of professional templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Template Gallery</h3>
                <p className="text-muted-foreground mb-4">
                  Browse and preview templates before creating your flyer
                </p>
                <Link href="/templates">
                  <Button>Browse Templates</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}