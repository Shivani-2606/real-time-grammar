"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Filter, Mail, Calendar, User, MessageSquare, Trash2, Eye, Shield } from "lucide-react"
import { createClient } from "@/lib/supabase"

interface Feedback {
  id: string
  name: string
  email: string
  subject: string
  message: string
  created_at: string
}

export default function AdminFeedback() {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  const supabase = createClient()

  useEffect(() => {
    const checkAdminAccess = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      const adminEmails = ["admin@grammarpro.com"]
      const isUserAdmin = adminEmails.includes(user.email || "") || user.user_metadata?.role === "admin"

      if (!isUserAdmin) {
        router.push("/")
        return
      }

      setUser(user)
      setIsAdmin(true)
      fetchFeedback()
    }

    checkAdminAccess()
  }, [router])

  const fetchFeedback = async () => {
    try {
      const { data, error } = await supabase.from("feedback").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching feedback:", error)
        return
      }

      setFeedback(data || [])
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteFeedback = async (id: string) => {
    try {
      const { error } = await supabase.from("feedback").delete().eq("id", id)

      if (error) {
        console.error("Error deleting feedback:", error)
        return
      }

      setFeedback((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const filteredFeedback = feedback.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.message.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSubject = subjectFilter === "all" || item.subject === subjectFilter

    return matchesSearch && matchesSubject
  })

  const getSubjectBadgeVariant = (subject: string) => {
    switch (subject) {
      case "technical":
        return "destructive"
      case "bug":
        return "destructive"
      case "feature":
        return "default"
      case "billing":
        return "secondary"
      case "account":
        return "outline"
      default:
        return "secondary"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-lg">Verifying admin access...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
            <Button className="mt-4" onClick={() => router.push("/")}>
              Go Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-lg text-muted-foreground">Manage user feedback and contact form submissions</p>
          <div className="flex items-center gap-2 mt-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Logged in as: {user?.email}</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <MessageSquare className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{feedback.length}</div>
                  <div className="text-sm text-muted-foreground">Total Messages</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <User className="h-8 w-8 text-success" />
                <div>
                  <div className="text-2xl font-bold">{new Set(feedback.map((f) => f.email)).size}</div>
                  <div className="text-sm text-muted-foreground">Unique Users</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Mail className="h-8 w-8 text-warning" />
                <div>
                  <div className="text-2xl font-bold">
                    {feedback.filter((f) => f.subject === "technical" || f.subject === "bug").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Technical Issues</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Calendar className="h-8 w-8 text-accent" />
                <div>
                  <div className="text-2xl font-bold">
                    {
                      feedback.filter((f) => new Date(f.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
                        .length
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">This Week</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or message..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="technical">Technical Support</SelectItem>
                    <SelectItem value="account">Account Help</SelectItem>
                    <SelectItem value="billing">Billing Question</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="bug">Bug Report</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Table */}
        <Card>
          <CardHeader>
            <CardTitle>Feedback Messages ({filteredFeedback.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFeedback.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>
                        <Badge variant={getSubjectBadgeVariant(item.subject)}>
                          {item.subject.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate">
                          {item.message.length > 50 ? `${item.message.substring(0, 50)}...` : item.message}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(item.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedFeedback(item)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Feedback Details</DialogTitle>
                              </DialogHeader>
                              {selectedFeedback && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">Name</label>
                                      <p className="text-sm text-muted-foreground">{selectedFeedback.name}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Email</label>
                                      <p className="text-sm text-muted-foreground">{selectedFeedback.email}</p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">Subject</label>
                                      <Badge
                                        variant={getSubjectBadgeVariant(selectedFeedback.subject)}
                                        className="mt-1"
                                      >
                                        {selectedFeedback.subject
                                          .replace(/([A-Z])/g, " $1")
                                          .replace(/^./, (str) => str.toUpperCase())}
                                      </Badge>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Date</label>
                                      <p className="text-sm text-muted-foreground">
                                        {formatDate(selectedFeedback.created_at)}
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Message</label>
                                    <div className="mt-2 p-4 bg-muted/50 rounded-lg">
                                      <p className="text-sm whitespace-pre-wrap">{selectedFeedback.message}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteFeedback(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredFeedback.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No feedback found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || subjectFilter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "No feedback messages have been submitted yet."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
