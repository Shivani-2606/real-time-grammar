"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { SettingsIcon, Bell, Palette, Shield, Save } from "lucide-react"

export default function Settings() {
  const [settings, setSettings] = useState({
    // Grammar Settings
    realTimeChecking: true,
    autoCorrect: false,
    showSuggestions: true,
    checkSpelling: true,
    checkGrammar: true,
    checkStyle: true,

    // Writing Style
    defaultWritingStyle: "formal",
    strictMode: false,

    // Notifications
    emailNotifications: true,
    browserNotifications: false,
    weeklyReports: true,

    // Interface
    theme: "light",
    language: "en",
    fontSize: "medium",

    // Privacy
    saveHistory: true,
    shareAnalytics: false,
  })

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = () => {
    // In a real app, this would save to the database
    console.log("Saving settings:", settings)
    // Show success message
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-lg text-muted-foreground">Customize your GrammarPro experience</p>
        </div>

        <div className="space-y-8">
          {/* Grammar & Writing Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Grammar & Writing
              </CardTitle>
              <CardDescription>Configure how grammar checking works for your writing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Real-time Checking</Label>
                      <p className="text-sm text-muted-foreground">Check grammar as you type</p>
                    </div>
                    <Switch
                      checked={settings.realTimeChecking}
                      onCheckedChange={(checked) => updateSetting("realTimeChecking", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-correct</Label>
                      <p className="text-sm text-muted-foreground">Automatically fix common errors</p>
                    </div>
                    <Switch
                      checked={settings.autoCorrect}
                      onCheckedChange={(checked) => updateSetting("autoCorrect", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Suggestions</Label>
                      <p className="text-sm text-muted-foreground">Display writing improvement suggestions</p>
                    </div>
                    <Switch
                      checked={settings.showSuggestions}
                      onCheckedChange={(checked) => updateSetting("showSuggestions", checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Spelling Check</Label>
                      <p className="text-sm text-muted-foreground">Check for spelling errors</p>
                    </div>
                    <Switch
                      checked={settings.checkSpelling}
                      onCheckedChange={(checked) => updateSetting("checkSpelling", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Grammar Check</Label>
                      <p className="text-sm text-muted-foreground">Check for grammar errors</p>
                    </div>
                    <Switch
                      checked={settings.checkGrammar}
                      onCheckedChange={(checked) => updateSetting("checkGrammar", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Style Check</Label>
                      <p className="text-sm text-muted-foreground">Check for style improvements</p>
                    </div>
                    <Switch
                      checked={settings.checkStyle}
                      onCheckedChange={(checked) => updateSetting("checkStyle", checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Default Writing Style</Label>
                  <Select
                    value={settings.defaultWritingStyle}
                    onValueChange={(value) => updateSetting("defaultWritingStyle", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="formal">Formal Writing</SelectItem>
                      <SelectItem value="casual">Casual Writing</SelectItem>
                      <SelectItem value="academic">Academic Writing</SelectItem>
                      <SelectItem value="business">Business Writing</SelectItem>
                      <SelectItem value="creative">Creative Writing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Strict Mode</Label>
                    <p className="text-sm text-muted-foreground">More rigorous grammar checking</p>
                  </div>
                  <Switch
                    checked={settings.strictMode}
                    onCheckedChange={(checked) => updateSetting("strictMode", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Manage how you receive updates and reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Browser Notifications</Label>
                  <p className="text-sm text-muted-foreground">Show notifications in your browser</p>
                </div>
                <Switch
                  checked={settings.browserNotifications}
                  onCheckedChange={(checked) => updateSetting("browserNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">Get weekly writing statistics</p>
                </div>
                <Switch
                  checked={settings.weeklyReports}
                  onCheckedChange={(checked) => updateSetting("weeklyReports", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Interface */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Interface
              </CardTitle>
              <CardDescription>Customize the look and feel of GrammarPro</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select value={settings.theme} onValueChange={(value) => updateSetting("theme", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={settings.language} onValueChange={(value) => updateSetting("language", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <Select value={settings.fontSize} onValueChange={(value) => updateSetting("fontSize", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Data
              </CardTitle>
              <CardDescription>Control how your data is used and stored</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Save Writing History</Label>
                  <p className="text-sm text-muted-foreground">Keep a history of your checked texts</p>
                </div>
                <Switch
                  checked={settings.saveHistory}
                  onCheckedChange={(checked) => updateSetting("saveHistory", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Share Analytics</Label>
                  <p className="text-sm text-muted-foreground">Help improve GrammarPro with anonymous usage data</p>
                </div>
                <Switch
                  checked={settings.shareAnalytics}
                  onCheckedChange={(checked) => updateSetting("shareAnalytics", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} size="lg">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
