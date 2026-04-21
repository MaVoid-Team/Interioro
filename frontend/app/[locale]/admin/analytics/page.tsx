"use client"

import { useState, useEffect, useCallback } from "react"
import { useTranslations } from "next-intl"
import { AnalyticsSummary, useOrders } from "@/hooks/useOrders"
import { StatsGrid } from "@/components/admin/analytics/StatsGrid"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Calendar, TrendingUp } from "lucide-react"

export default function AnalyticsPage() {
    const t = useTranslations("AdminAnalytics")
    const { getAnalyticsSummary, isLoading } = useOrders()
    const [period, setPeriod] = useState<"month" | "year">("month")
    const [analyticsData, setAnalyticsData] = useState<AnalyticsSummary | null>(null)

    const fetchAnalytics = useCallback(() => {
        return getAnalyticsSummary({ period })
    }, [getAnalyticsSummary, period])

    useEffect(() => {
        let isMounted = true

        const loadAnalytics = async () => {
            const data = await fetchAnalytics()
            if (isMounted) {
                setAnalyticsData(data)
            }
        }

        void loadAnalytics()

        return () => {
            isMounted = false
        }
    }, [fetchAnalytics])

    const handleRefresh = useCallback(async () => {
        const data = await fetchAnalytics()
        setAnalyticsData(data)
    }, [fetchAnalytics])

    return (
        <div className="flex-1 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">{t("title")}</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">{t("description")}</p>
                </div>

                {/* Period Selector */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Calendar className="h-4 w-4 text-muted-foreground hidden sm:block" />
                    <Select value={period} onValueChange={(value) => setPeriod(value as "month" | "year")}>
                        <SelectTrigger className="flex-1 sm:w-[140px] md:w-[180px]">
                            <SelectValue placeholder={t("selectPeriod")} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="month">{t("lastMonth")}</SelectItem>
                            <SelectItem value="year">{t("lastYear")}</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={() => void handleRefresh()} variant="outline" size="sm">
                        {t("refresh")}
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <StatsGrid
                totalOrders={analyticsData?.totalOrders || 0}
                totalRevenue={analyticsData?.totalRevenue || 0}
                averageOrderValue={analyticsData?.averageOrderValue || 0}
                isLoading={isLoading}
            />

            {/* Additional Stats */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-primary/10">
                                <TrendingUp className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {t("itemsSold")}
                                </p>
                                <p className="text-2xl font-bold">{analyticsData?.itemsSold || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-primary/10">
                                <TrendingUp className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {t("totalProducts")}
                                </p>
                                <p className="text-2xl font-bold">{analyticsData?.totalProducts || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-primary/10">
                                <TrendingUp className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {t("totalCategories")}
                                </p>
                                <p className="text-2xl font-bold">{analyticsData?.totalCategories || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Empty State */}
            {!isLoading && !analyticsData && (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <p className="text-muted-foreground">{t("noData")}</p>
                        <Button onClick={() => void handleRefresh()} variant="outline" className="mt-4">
                            {t("tryAgain")}
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
