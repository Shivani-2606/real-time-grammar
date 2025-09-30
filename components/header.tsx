import { Button } from "@/components/ui/button"
import { CheckCircle, Zap } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-8 w-8 text-accent" />
              <h1 className="text-2xl font-bold text-foreground">GrammarFlow</h1>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4" />
              <span>Real-time grammar checking</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              Export
            </Button>
            <Button size="sm">Get Premium</Button>
          </div>
        </div>
      </div>
    </header>
  )
}
