"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target, Zap, BookOpen } from "lucide-react"

export function StatsPanel() {
  const stats = [
    {
      label: "Grammar Score",
      value: 92,
      icon: Target,
      color: "text-success",
      description: "Overall writing quality",
    },
    {
      label: "Readability",
      value: 85,
      icon: BookOpen,
      color: "text-accent",
      description: "Easy to understand",
    },
    {
      label: "Engagement",
      value: 78,
      icon: TrendingUp,
      color: "text-warning",
      description: "Reader interest level",
    },
  ]

  const improvements = [
    { category: "Grammar", count: 3, trend: "down" },
    { category: "Style", count: 2, trend: "down" },
    { category: "Clarity", count: 1, trend: "up" },
    { category: "Tone", count: 0, trend: "stable" },
  ]

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-accent" />
          Writing Analytics
        </h3>

        <div className="space-y-6">
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-sm font-medium text-foreground">{stat.label}</span>
                </div>
                <span className="text-sm font-bold text-foreground">{stat.value}%</span>
              </div>
              <Progress value={stat.value} className="h-2" />
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Issue Categories</h3>

        <div className="space-y-3">
          {improvements.map((item) => (
            <div key={item.category} className="flex items-center justify-between">
              <span className="text-sm text-foreground">{item.category}</span>
              <div className="flex items-center gap-2">
                <Badge variant={item.count === 0 ? "outline" : "secondary"} className="text-xs">
                  {item.count}
                </Badge>
                <div
                  className={`w-2 h-2 rounded-full ${
                    item.trend === "down"
                      ? "bg-success"
                      : item.trend === "up"
                        ? "bg-destructive"
                        : "bg-muted-foreground"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Tips</h3>

        <div className="space-y-3 text-sm">
          <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
            <p className="text-accent font-medium mb-1">Pro Tip</p>
            <p className="text-muted-foreground">Use active voice to make your writing more engaging and direct.</p>
          </div>

          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-foreground font-medium mb-1">Writing Goal</p>
            <p className="text-muted-foreground">Aim for sentences under 20 words for better readability.</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
