"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle, Lightbulb, Copy, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface GrammarIssue {
  id: string
  type: "error" | "suggestion" | "improvement"
  message: string
  start: number
  end: number
  replacement?: string
  category: string
}

export function GrammarChecker() {
  const [text, setText] = useState("")
  const [issues, setIssues] = useState<GrammarIssue[]>([])
  const [isChecking, setIsChecking] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState<GrammarIssue | null>(null)
  const { toast } = useToast()

  // Mock grammar checking function
  const checkGrammar = useCallback((inputText: string): GrammarIssue[] => {
    if (!inputText.trim()) return []

    const mockIssues: GrammarIssue[] = []

    // Check for common grammar issues
    const patterns = [
      {
        regex: /\bthere\s+is\s+\w+\s+\w+s\b/gi,
        type: "error" as const,
        message: 'Subject-verb disagreement. Use "there are" with plural nouns.',
        category: "Grammar",
        replacement: (match: string) => match.replace(/there\s+is/i, "there are"),
      },
      {
        regex: /\bits\s+important\s+to\s+\w+/gi,
        type: "suggestion" as const,
        message: "Consider using more specific language.",
        category: "Style",
        replacement: (match: string) => match.replace(/its\s+important/i, "it's crucial"),
      },
      {
        regex: /\bvery\s+\w+/gi,
        type: "improvement" as const,
        message: 'Consider using a stronger adjective instead of "very".',
        category: "Style",
      },
      {
        regex: /\b(can not|cannot)\b/gi,
        type: "suggestion" as const,
        message: 'Use "cannot" as one word.',
        category: "Spelling",
        replacement: "cannot",
      },
    ]

    patterns.forEach((pattern) => {
      let match
      while ((match = pattern.regex.exec(inputText)) !== null) {
        mockIssues.push({
          id: Math.random().toString(36).substr(2, 9),
          type: pattern.type,
          message: pattern.message,
          start: match.index,
          end: match.index + match[0].length,
          replacement: pattern.replacement
            ? typeof pattern.replacement === "function"
              ? pattern.replacement(match[0])
              : pattern.replacement
            : undefined,
          category: pattern.category,
        })
      }
    })

    return mockIssues
  }, [])

  // Real-time grammar checking with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (text) {
        setIsChecking(true)
        const newIssues = checkGrammar(text)
        setIssues(newIssues)
        setIsChecking(false)
      } else {
        setIssues([])
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [text, checkGrammar])

  const applyFix = (issue: GrammarIssue) => {
    if (issue.replacement) {
      const newText = text.slice(0, issue.start) + issue.replacement + text.slice(issue.end)
      setText(newText)
      toast({
        title: "Fix applied",
        description: "Grammar correction has been applied to your text.",
      })
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied to clipboard",
        description: "Your text has been copied to the clipboard.",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy text to clipboard.",
        variant: "destructive",
      })
    }
  }

  const clearText = () => {
    setText("")
    setIssues([])
    setSelectedIssue(null)
  }

  const renderTextWithHighlights = () => {
    if (!text || issues.length === 0) {
      return text
    }

    const result = []
    let lastIndex = 0

    // Sort issues by start position
    const sortedIssues = [...issues].sort((a, b) => a.start - b.start)

    sortedIssues.forEach((issue, index) => {
      // Add text before the issue
      if (issue.start > lastIndex) {
        result.push(<span key={`text-${index}`}>{text.slice(lastIndex, issue.start)}</span>)
      }

      // Add highlighted issue
      const issueText = text.slice(issue.start, issue.end)
      const className =
        issue.type === "error"
          ? "grammar-error"
          : issue.type === "suggestion"
            ? "grammar-suggestion"
            : "grammar-correct"

      result.push(
        <span
          key={`issue-${issue.id}`}
          className={`${className} cursor-pointer hover:bg-accent/20 rounded px-1`}
          onClick={() => setSelectedIssue(issue)}
          title={issue.message}
        >
          {issueText}
        </span>,
      )

      lastIndex = issue.end
    })

    // Add remaining text
    if (lastIndex < text.length) {
      result.push(<span key="text-end">{text.slice(lastIndex)}</span>)
    }

    return result
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Grammar Checker</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={!text}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={clearText} disabled={!text}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>

          <div className="relative">
            <Textarea
              placeholder="Start typing your text here. Grammar checking will happen in real-time..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[300px] text-base leading-relaxed resize-none"
            />
            {text && (
              <div className="absolute inset-0 p-3 pointer-events-none text-base leading-relaxed whitespace-pre-wrap break-words overflow-hidden">
                <div className="pointer-events-auto">{renderTextWithHighlights()}</div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>{text.length} characters</span>
              <span>
                {
                  text
                    .trim()
                    .split(/\s+/)
                    .filter((word) => word.length > 0).length
                }{" "}
                words
              </span>
              {isChecking && <span className="text-accent">Checking...</span>}
            </div>
            <div className="flex items-center gap-2">
              {issues.length > 0 && (
                <Badge variant={issues.some((i) => i.type === "error") ? "destructive" : "secondary"}>
                  {issues.length} issue{issues.length !== 1 ? "s" : ""} found
                </Badge>
              )}
              {issues.length === 0 && text.length > 0 && !isChecking && (
                <Badge variant="outline" className="text-success border-success">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  No issues found
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      {issues.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Grammar Issues</h3>
          <div className="space-y-3">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedIssue?.id === issue.id
                    ? "bg-accent/10 border-accent"
                    : "bg-card border-border hover:bg-muted/50"
                }`}
                onClick={() => setSelectedIssue(issue)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {issue.type === "error" && <AlertCircle className="h-4 w-4 text-destructive" />}
                    {issue.type === "suggestion" && <Lightbulb className="h-4 w-4 text-warning" />}
                    {issue.type === "improvement" && <CheckCircle className="h-4 w-4 text-success" />}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {issue.category}
                      </Badge>
                      <Badge
                        variant={
                          issue.type === "error" ? "destructive" : issue.type === "suggestion" ? "secondary" : "outline"
                        }
                        className="text-xs"
                      >
                        {issue.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground">{issue.message}</p>
                    <div className="text-xs text-muted-foreground">
                      <span className="font-mono bg-muted px-2 py-1 rounded">
                        "{text.slice(issue.start, issue.end)}"
                      </span>
                      {issue.replacement && (
                        <>
                          <span className="mx-2">→</span>
                          <span className="font-mono bg-success/20 text-success px-2 py-1 rounded">
                            "{issue.replacement}"
                          </span>
                        </>
                      )}
                    </div>
                    {issue.replacement && (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          applyFix(issue)
                        }}
                        className="mt-2"
                      >
                        Apply Fix
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
