"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { FileText, AlertTriangle, Lightbulb, Settings, Copy, RotateCcw, CheckCircle, RefreshCw } from "lucide-react"

type WritingStyle = "formal" | "casual" | "academic" | "business" | "creative"
type IssueType = "grammar" | "spelling" | "style" | "tone" | "passive" | "clarity" | "punctuation"

interface CorrectionOption {
  text: string
  explanation: string
  confidence: number
}

interface GrammarIssue {
  id: string
  type: IssueType
  text: string
  corrections: CorrectionOption[]
  explanation: string
  position: { start: number; end: number }
  sentence?: string
  severity: "high" | "medium" | "low"
}

interface SentenceAnalysis {
  sentence: string
  issues: GrammarIssue[]
  toneScore: number
  clarityScore: number
  grammarScore: number
  isPassive: boolean
  wordCount: number
  complexity: "simple" | "moderate" | "complex"
}

const writingStyles = {
  formal: "Formal Writing",
  casual: "Casual Writing",
  academic: "Academic Writing",
  business: "Business Writing",
  creative: "Creative Writing",
}

export default function GrammarChecker() {
  const [text, setText] = useState("")
  const [writingStyle, setWritingStyle] = useState<WritingStyle>("formal")
  const [issues, setIssues] = useState<GrammarIssue[]>([])
  const [sentenceAnalysis, setSentenceAnalysis] = useState<SentenceAnalysis[]>([])
  const [isChecking, setIsChecking] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null)

  const checkGrammarWithAPI = async (inputText: string, style: WritingStyle): Promise<GrammarIssue[]> => {
    console.log("[v0] Starting LanguageTool API grammar check for text:", inputText)

    if (!inputText.trim()) return []

    try {
      // Use LanguageTool API for real grammar checking
      const response = await fetch("/api/grammar-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
          language: "en-US",
          style: style,
        }),
      })

      if (!response.ok) {
        console.error("[v0] LanguageTool API error:", response.status)
        // Fallback to basic grammar checking if API fails
        return checkGrammarBasic(inputText, style)
      }

      const data = await response.json()
      console.log("[v0] LanguageTool API response:", data)

      const foundIssues: GrammarIssue[] =
        data.matches?.map((match: any, index: number) => {
          const corrections: CorrectionOption[] =
            match.replacements?.slice(0, 3).map((replacement: any) => ({
              text: replacement.value,
              explanation: `Suggested replacement`,
              confidence: 95,
            })) || []

          // Determine issue type based on LanguageTool category
          let issueType: IssueType = "grammar"
          let severity: "high" | "medium" | "low" = "medium"

          if (match.rule?.category?.id === "TYPOS") {
            issueType = "spelling"
            severity = "high"
          } else if (match.rule?.category?.id === "GRAMMAR") {
            issueType = "grammar"
            severity = "high"
          } else if (match.rule?.category?.id === "STYLE") {
            issueType = "style"
            severity = "medium"
          } else if (match.rule?.category?.id === "PUNCTUATION") {
            issueType = "punctuation"
            severity = "medium"
          }

          return {
            id: `api-issue-${index}`,
            type: issueType,
            text: inputText.substring(match.offset, match.offset + match.length),
            corrections,
            explanation: match.message || "Grammar or style issue detected",
            position: { start: match.offset, end: match.offset + match.length },
            severity,
          }
        }) || []

      console.log("[v0] LanguageTool API found", foundIssues.length, "issues")
      return foundIssues
    } catch (error) {
      console.error("[v0] LanguageTool API error:", error)
      // Fallback to basic grammar checking
      return checkGrammarBasic(inputText, style)
    }
  }

  const checkGrammarBasic = (inputText: string, style: WritingStyle): GrammarIssue[] => {
    console.log("[v0] Using fallback basic grammar check for text:", inputText)
    const foundIssues: GrammarIssue[] = []
    let issueId = 0

    const grammarRules = [
      {
        pattern:
          /\b(is|are|am|was|were)\s+not\s+(work|go|come|run|play|study|learn|eat|sleep|think|write|read|speak|listen|watch|look|see|hear|feel|know|understand|believe|remember|forget|help|try|start|stop|finish|begin|end|continue|practice|exercise|dance|sing|cook|clean|wash|drive|walk|talk|laugh|cry|smile|jump|sit|stand|lie|rest|relax|travel|visit|move|live|stay|leave|arrive|return|wait|search|find|lose|win|fail|succeed|improve|change|grow|develop|create|build|make|produce|design|plan|organize|manage|control|lead|follow|teach|learn|explain|describe|discuss|argue|agree|disagree|decide|choose|select|pick|buy|sell|pay|spend|save|earn|invest|borrow|lend|give|take|receive|send|deliver|carry|bring|fetch|pull|push|lift|drop|throw|catch|hit|kick|touch|hold|grab|release|open|close|lock|unlock|turn|twist|bend|stretch|press|squeeze|rub|scratch|cut|break|fix|repair|replace|install|remove|add|subtract|multiply|divide|count|measure|weigh|compare|contrast|analyze|examine|investigate|explore|discover|invent|create|imagine|dream|hope|wish|want|need|like|love|hate|prefer|enjoy|appreciate|admire|respect|trust|doubt|worry|fear|surprise|shock|amaze|confuse|puzzle|bore|interest|excite|entertain|amuse|please|satisfy|disappoint|upset|anger|annoy|irritate|frustrate|stress|relax|calm|comfort|encourage|motivate|inspire|influence|persuade|convince|warn|advise|suggest|recommend|propose|offer|promise|threaten|challenge|compete|cooperate|collaborate|share|communicate|connect|contact|meet|greet|welcome|introduce|present|represent|perform|act|behave|react|respond|answer|question|ask|request|demand|require|insist|refuse|accept|reject|approve|disapprove|support|oppose|defend|attack|protect|guard|save|rescue|escape|avoid|prevent|stop|block|interrupt|disturb|bother|trouble|worry|concern|matter|care|mind|notice|observe|recognize|identify|distinguish|differentiate|separate|divide|unite|join|connect|link|attach|detach|include|exclude|involve|participate|contribute|donate|volunteer|serve|assist|aid|support|encourage|motivate|inspire|guide|direct|instruct|train|educate|inform|notify|announce|declare|state|claim|assert|maintain|argue|prove|demonstrate|show|display|exhibit|present|reveal|expose|hide|conceal|cover|uncover|discover|find|locate|position|place|put|set|lay|arrange|organize|sort|classify|categorize|group|collect|gather|accumulate|store|keep|preserve|maintain|sustain|continue|persist|endure|last|remain|stay|exist|survive|live|die|kill|murder|destroy|damage|harm|hurt|injure|wound|heal|cure|treat|recover|improve|progress|advance|develop|evolve|change|transform|convert|adapt|adjust|modify|alter|edit|revise|correct|fix|solve|resolve|settle|handle|deal|cope|manage|control|regulate|govern|rule|command|order|direct|guide|lead|follow|obey|comply|conform|adapt|fit|match|suit|belong|own|possess|have|hold|contain|include|consist|comprise|involve|require|need|want|desire|wish|hope|expect|anticipate|predict|forecast|estimate|calculate|compute|figure|determine|decide|conclude|assume|suppose|believe|think|consider|regard|view|see|perceive|understand|comprehend|realize|recognize|acknowledge|admit|confess|deny|refuse|reject|accept|agree|disagree|approve|disapprove|like|dislike|love|hate|prefer|choose|select|pick|decide|determine|resolve|settle|solve|fix|repair|mend|restore|renew|refresh|update|upgrade|improve|enhance|increase|decrease|reduce|lower|raise|lift|drop|fall|rise|climb|descend|ascend|enter|exit|leave|arrive|depart|return|come|go|move|travel|journey|visit|explore|discover|find|search|look|seek|hunt|chase|follow|track|trace|investigate|examine|inspect|check|test|try|attempt|effort|struggle|fight|battle|war|peace|calm|quiet|silent|loud|noisy|sound|hear|listen|music|sing|dance|play|game|sport|exercise|run|walk|jog|swim|bike|drive|ride|fly|sail|boat|ship|plane|train|bus|car|truck|motorcycle|bicycle|horse|animal|pet|dog|cat|bird|fish|insect|plant|tree|flower|grass|garden|farm|field|forest|mountain|hill|valley|river|lake|ocean|sea|beach|desert|island|city|town|village|country|nation|world|earth|planet|space|star|sun|moon|sky|cloud|rain|snow|wind|storm|weather|season|spring|summer|autumn|winter|hot|cold|warm|cool|temperature|degree|measure|size|big|small|large|little|huge|tiny|enormous|gigantic|massive|miniature|microscopic|tall|short|high|low|wide|narrow|thick|thin|fat|skinny|heavy|light|strong|weak|hard|soft|rough|smooth|sharp|dull|bright|dark|light|shadow|color|red|blue|green|yellow|orange|purple|pink|brown|black|white|gray|grey)\b/gi,
        type: "grammar" as IssueType,
        severity: "high" as const,
        corrections: [
          { text: "working", explanation: "Use progressive form (-ing) after 'be' verbs", confidence: 100 },
          { text: "going", explanation: "Progressive form", confidence: 100 },
          { text: "coming", explanation: "Progressive form", confidence: 100 },
        ],
        explanation:
          "Verb form error: After 'be' verbs (is/are/am/was/were), use the progressive form (-ing) of the verb",
        replacement: (match: string) => {
          console.log("[v0] Applying progressive verb replacement to:", match)

          // Extract the base verb from the match
          const verbMatch = match.match(
            /\b(work|go|come|run|play|study|learn|eat|sleep|think|write|read|speak|listen|watch|look|see|hear|feel|know|understand|believe|remember|forget|help|try|start|stop|finish|begin|end|continue|practice|exercise|dance|sing|cook|clean|wash|drive|walk|talk|laugh|cry|smile|jump|sit|stand|lie|rest|relax|travel|visit|move|live|stay|leave|arrive|return|wait|search|find|lose|win|fail|succeed|improve|change|grow|develop|create|build|make|produce|design|plan|organize|manage|control|lead|follow|teach|learn|explain|describe|discuss|argue|agree|disagree|decide|choose|select|pick|buy|sell|pay|spend|save|earn|invest|borrow|lend|give|take|receive|send|deliver|carry|bring|fetch|pull|push|lift|drop|throw|catch|hit|kick|touch|hold|grab|release|open|close|lock|unlock|turn|twist|bend|stretch|press|squeeze|rub|scratch|cut|break|fix|repair|replace|install|remove|add|subtract|multiply|divide|count|measure|weigh|compare|contrast|analyze|examine|investigate|explore|discover|invent|create|imagine|dream|hope|wish|want|need|like|love|hate|prefer|enjoy|appreciate|admire|respect|trust|doubt|worry|fear|surprise|shock|amaze|confuse|puzzle|bore|interest|excite|entertain|amuse|please|satisfy|disappoint|upset|anger|annoy|irritate|frustrate|stress|relax|calm|comfort|encourage|motivate|inspire|influence|persuade|convince|warn|advise|suggest|recommend|propose|offer|promise|threaten|challenge|compete|cooperate|collaborate|share|communicate|connect|contact|meet|greet|welcome|introduce|present|represent|perform|act|behave|react|respond|answer|question|ask|request|demand|require|insist|refuse|accept|reject|approve|disapprove|support|oppose|defend|attack|protect|guard|save|rescue|escape|avoid|prevent|stop|block|interrupt|disturb|bother|trouble|worry|concern|matter|care|mind|notice|observe|recognize|identify|distinguish|differentiate|separate|divide|unite|join|connect|link|attach|detach|include|exclude|involve|participate|contribute|donate|volunteer|serve|assist|aid|support|encourage|motivate|inspire|guide|direct|instruct|train|educate|inform|notify|announce|declare|state|claim|assert|maintain|argue|prove|demonstrate|show|display|exhibit|present|reveal|expose|hide|conceal|cover|uncover|discover|find|locate|position|place|put|set|lay|arrange|organize|sort|classify|categorize|group|collect|gather|accumulate|store|keep|preserve|maintain|sustain|continue|persist|endure|last|remain|stay|exist|survive|live|die|kill|murder|destroy|damage|harm|hurt|injure|wound|heal|cure|treat|recover|improve|progress|advance|develop|evolve|change|transform|convert|adapt|adjust|modify|alter|edit|revise|correct|fix|solve|resolve|settle|handle|deal|cope|manage|control|regulate|govern|rule|command|order|direct|guide|lead|follow|obey|comply|conform|adapt|fit|match|suit|belong|own|possess|have|hold|contain|include|consist|comprise|involve|require|need|want|desire|wish|hope|expect|anticipate|predict|forecast|estimate|calculate|compute|figure|determine|decide|conclude|assume|suppose|believe|think|consider|regard|view|see|perceive|understand|comprehend|realize|recognize|acknowledge|admit|confess|deny|refuse|reject|accept|agree|disagree|approve|disapprove|like|dislike|love|hate|prefer|choose|select|pick|decide|determine|resolve|settle|solve|fix|repair|mend|restore|renew|refresh|update|upgrade|improve|enhance|increase|decrease|reduce|lower|raise|lift|drop|fall|rise|climb|descend|ascend|enter|exit|leave|arrive|depart|return|come|go|move|travel|journey|visit|explore|discover|find|search|look|seek|hunt|chase|follow|track|trace|investigate|examine|inspect|check|test|try|attempt|effort|struggle|fight|battle|war|peace|calm|quiet|silent|loud|noisy|sound|hear|listen|music|sing|dance|play|game|sport|exercise|run|walk|jog|swim|bike|drive|ride|fly|sail|boat|ship|plane|train|bus|car|truck|motorcycle|bicycle|horse|animal|pet|dog|cat|bird|fish|insect|plant|tree|flower|grass|garden|farm|field|forest|mountain|hill|valley|river|lake|ocean|sea|beach|desert|island|city|town|village|country|nation|world|earth|planet|space|star|sun|moon|sky|cloud|rain|snow|wind|storm|weather|season|spring|summer|autumn|winter|hot|cold|warm|cool|temperature|degree|measure|size|big|small|large|little|huge|tiny|enormous|gigantic|massive|miniature|microscopic|tall|short|high|low|wide|narrow|thick|thin|fat|skinny|heavy|light|strong|weak|hard|soft|rough|smooth|sharp|dull|bright|dark|light|shadow|color|red|blue|green|yellow|orange|purple|pink|brown|black|white|gray|grey)\b/gi,
          )

          if (verbMatch) {
            const baseVerb = verbMatch[0].toLowerCase()
            const verbMap: { [key: string]: string } = {
              work: "working",
              go: "going",
              come: "coming",
              run: "running",
              play: "playing",
              study: "studying",
              learn: "learning",
              eat: "eating",
              sleep: "sleeping",
              think: "thinking",
              write: "writing",
              read: "reading",
              speak: "speaking",
              listen: "listening",
              watch: "watching",
              look: "looking",
              see: "seeing",
              hear: "hearing",
              feel: "feeling",
              know: "knowing",
              understand: "understanding",
              believe: "believing",
              remember: "remembering",
              forget: "forgetting",
              help: "helping",
              try: "trying",
              start: "starting",
              stop: "stopping",
              finish: "finishing",
              begin: "beginning",
              end: "ending",
              continue: "continuing",
              practice: "practicing",
              exercise: "exercising",
              dance: "dancing",
              sing: "singing",
              cook: "cooking",
              clean: "cleaning",
              wash: "washing",
              drive: "driving",
              walk: "walking",
              talk: "talking",
              laugh: "laughing",
              cry: "crying",
              smile: "smiling",
              jump: "jumping",
              sit: "sitting",
              stand: "standing",
              lie: "lying",
              rest: "resting",
              relax: "relaxing",
              travel: "traveling",
              visit: "visiting",
              move: "moving",
              live: "living",
              stay: "staying",
              leave: "leaving",
              arrive: "arriving",
              return: "returning",
              wait: "waiting",
            }

            const progressiveForm = verbMap[baseVerb] || baseVerb + "ing"
            const result = match.replace(new RegExp(`\\b${baseVerb}\\b`, "gi"), progressiveForm)
            console.log("[v0] Progressive verb replacement result:", result)
            return result
          }

          return match
        },
      },

      // Basic subject-verb agreement errors - "he are", "she are", "it are"
      {
        pattern: /\b(he|she|it|[A-Z][a-z]+)\s+(are|were)\b/gi,
        type: "grammar" as IssueType,
        severity: "high" as const,
        corrections: [
          { text: "is", explanation: "Singular subject requires 'is'", confidence: 100 },
          { text: "was", explanation: "Past tense singular form", confidence: 95 },
        ],
        explanation: "Subject-verb disagreement: Singular subjects (he/she/it) require singular verbs",
        replacement: (match: string) => match.replace(/are/gi, "is").replace(/were/gi, "was"),
      },

      // Plural subjects with singular verbs - "they is", "we is"
      {
        pattern: /\b(they|we|you)\s+(is|was)\b/gi,
        type: "grammar" as IssueType,
        severity: "high" as const,
        corrections: [
          { text: "are", explanation: "Plural subject requires 'are'", confidence: 100 },
          { text: "were", explanation: "Past tense plural form", confidence: 95 },
        ],
        explanation: "Subject-verb disagreement: Plural subjects require plural verbs",
        replacement: (match: string) => match.replace(/is/gi, "are").replace(/was/gi, "were"),
      },

      // "She don't" -> "She doesn't"
      {
        pattern: /\b(he|she|it|[A-Z][a-z]+)\s+(don't)\b/gi,
        type: "grammar" as IssueType,
        severity: "high" as const,
        corrections: [
          { text: "doesn't", explanation: "Third person singular uses 'doesn't'", confidence: 100 },
          { text: "does not", explanation: "Formal alternative", confidence: 95 },
        ],
        explanation: "Subject-verb disagreement: Third person singular requires 'doesn't', not 'don't'",
        replacement: (match: string) => match.replace(/don't/gi, "doesn't"),
      },

      // Double verb after doesn't: "doesn't likes" -> "doesn't like"
      {
        pattern:
          /\b(doesn't|don't)\s+(likes|goes|does|has|says|thinks|wants|needs|makes|takes|gives|gets|comes|runs|walks|talks|works|plays|lives|loves|hates|knows|sees|hears|feels|looks|seems|appears)\b/gi,
        type: "grammar" as IssueType,
        severity: "high" as const,
        corrections: [{ text: "like", explanation: "Use base form after 'doesn't/don't'", confidence: 100 }],
        explanation: "Verb form error: After 'doesn't' or 'don't', use the base form of the verb (without -s)",
        replacement: (match: string) => {
          return match.replace(
            /(likes|goes|does|has|says|thinks|wants|needs|makes|takes|gives|gets|comes|runs|walks|talks|works|plays|lives|loves|hates|knows|sees|hears|feels|looks|seems|appears)/gi,
            (verb) => {
              const baseVerbs: { [key: string]: string } = {
                likes: "like",
                goes: "go",
                does: "do",
                has: "have",
                says: "say",
                thinks: "think",
                wants: "want",
                needs: "need",
                makes: "make",
                takes: "take",
                gives: "give",
                gets: "get",
                comes: "come",
                runs: "run",
                walks: "walk",
                talks: "talk",
                works: "work",
                plays: "play",
                lives: "live",
                loves: "love",
                hates: "hate",
                knows: "know",
                sees: "see",
                hears: "hear",
                feels: "feel",
                looks: "look",
                seems: "seem",
                appears: "appear",
              }
              return baseVerbs[verb.toLowerCase()] || verb.replace(/s$/, "")
            },
          )
        },
      },

      // Weather expressions: "it's rain" -> "it's raining"
      {
        pattern: /\bit's\s+(rain|snow|sun)\b/gi,
        type: "grammar" as IssueType,
        severity: "high" as const,
        corrections: [
          { text: "it's raining", explanation: "Use progressive form for weather", confidence: 100 },
          { text: "it's snowing", explanation: "Progressive form for weather", confidence: 100 },
          { text: "it's sunny", explanation: "Use adjective form", confidence: 100 },
        ],
        explanation: "Weather expression error: Use progressive form (raining) or adjective (sunny) for weather",
        replacement: (match: string) => {
          if (match.includes("rain")) return "it's raining"
          if (match.includes("snow")) return "it's snowing"
          if (match.includes("sun")) return "it's sunny"
          return match
        },
      },

      // Common spelling errors
      {
        pattern: /\b(alot)\b/gi,
        type: "spelling" as IssueType,
        severity: "high" as const,
        corrections: [
          { text: "a lot", explanation: "Two separate words", confidence: 100 },
          { text: "many", explanation: "More concise alternative", confidence: 80 },
        ],
        explanation: "Spelling error: 'A lot' should be written as two words",
        replacement: () => "a lot",
      },

      {
        pattern: /\b(recieve)\b/gi,
        type: "spelling" as IssueType,
        severity: "high" as const,
        corrections: [{ text: "receive", explanation: "I before E except after C", confidence: 100 }],
        explanation: "Spelling error: Remember 'i before e except after c'",
        replacement: () => "receive",
      },
    ]

    // Apply grammar rules
    grammarRules.forEach((rule, ruleIndex) => {
      console.log("[v0] Applying basic rule", ruleIndex, ":", rule.pattern.source)
      let match
      const regex = new RegExp(rule.pattern.source, rule.pattern.flags)

      while ((match = regex.exec(inputText)) !== null) {
        console.log("[v0] Found match:", match[0], "at position", match.index)

        const correctedOptions = rule.corrections.map((correction) => {
          let correctedText = correction.text

          // Use replacement function if available
          if ("replacement" in rule && typeof rule.replacement === "function") {
            correctedText = rule.replacement(match[0])
          }

          return {
            ...correction,
            text: correctedText,
          }
        })

        foundIssues.push({
          id: `basic-issue-${issueId++}`,
          type: rule.type,
          text: match[0],
          corrections: correctedOptions,
          explanation: rule.explanation,
          position: { start: match.index, end: match.index + match[0].length },
          severity: rule.severity,
        })

        // Prevent infinite loops
        if (regex.lastIndex === match.index) {
          regex.lastIndex++
        }
      }
    })

    console.log("[v0] Basic grammar check found", foundIssues.length, "issues")
    return foundIssues
  }

  const analyzeSentences = (inputText: string, style: WritingStyle): SentenceAnalysis[] => {
    const sentences = inputText.split(/[.!?]+/).filter((s) => s.trim().length > 10)

    return sentences.map((sentence, index) => {
      const trimmedSentence = sentence.trim()
      const words = trimmedSentence.split(/\s+/).filter((w) => w.length > 0)
      const wordCount = words.length

      // Complexity analysis
      const complexity = wordCount < 10 ? "simple" : wordCount < 20 ? "moderate" : "complex"

      // Passive voice detection
      const passivePatterns = [
        /\b(was|were|is|are|am|be|been|being)\s+(\w+ed|\w+en|given|taken|made|done|seen|heard|found|lost|broken|written|spoken|chosen|driven|eaten|forgotten|hidden|known|shown|thrown|worn)\b/gi,
      ]

      let isPassive = false
      passivePatterns.forEach((pattern) => {
        if (pattern.test(trimmedSentence)) {
          isPassive = true
        }
      })

      // Grammar score calculation
      const sentenceIssues = issues.filter(
        (issue) =>
          issue.position.start >= inputText.indexOf(trimmedSentence) &&
          issue.position.end <= inputText.indexOf(trimmedSentence) + trimmedSentence.length,
      )

      const grammarErrors = sentenceIssues.filter((i) => i.type === "grammar" || i.type === "spelling").length
      const grammarScore = Math.max(0, 100 - grammarErrors * 25)

      // Tone analysis based on style
      let toneScore = 100
      if (style === "formal") {
        const casualWords = /(gonna|wanna|yeah|ok|stuff|things|guys)/gi
        const casualMatches = (trimmedSentence.match(casualWords) || []).length
        toneScore = Math.max(0, 100 - casualMatches * 30)
      }

      // Clarity score
      const ambiguousWords = /(this|that|it|they|things|stuff|something|someone)/gi
      const ambiguousMatches = (trimmedSentence.match(ambiguousWords) || []).length
      const clarityScore = Math.max(0, 100 - ambiguousMatches * 15)

      return {
        sentence: trimmedSentence,
        issues: sentenceIssues,
        toneScore,
        clarityScore,
        grammarScore,
        isPassive,
        wordCount,
        complexity,
      }
    })
  }

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (text.trim()) {
        console.log("[v0] Starting grammar analysis...")
        setIsChecking(true)

        try {
          const newIssues = await checkGrammarWithAPI(text, writingStyle)
          const sentences = analyzeSentences(text, writingStyle)

          setIssues(newIssues)
          setSentenceAnalysis(sentences)
          console.log("[v0] Grammar analysis complete. Issues found:", newIssues.length)
        } catch (error) {
          console.error("[v0] Grammar check error:", error)
        } finally {
          setIsChecking(false)
        }
      } else {
        setIssues([])
        setSentenceAnalysis([])
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [text, writingStyle])

  const renderHighlightedText = () => {
    if (issues.length === 0 || !text) return text

    let result = text
    const sortedIssues = [...issues].sort((a, b) => b.position.start - a.position.start)

    console.log("[v0] Rendering highlights for", sortedIssues.length, "issues")

    sortedIssues.forEach((issue) => {
      const before = result.substring(0, issue.position.start)
      const highlighted = result.substring(issue.position.start, issue.position.end)
      const after = result.substring(issue.position.end)

      const className = `grammar-${issue.type} grammar-${issue.severity}`
      result = `${before}<span class="${className}" data-issue-id="${issue.id}" title="${issue.explanation}">${highlighted}</span>${after}`
    })

    return result
  }

  const getStats = () => {
    const words = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
    const characters = text.length
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 10).length

    const grammarErrors = issues.filter((i) => i.type === "grammar").length
    const spellingErrors = issues.filter((i) => i.type === "spelling").length
    const styleIssues = issues.filter((i) => i.type === "style").length
    const toneIssues = issues.filter((i) => i.type === "tone").length
    const passiveVoice = issues.filter((i) => i.type === "passive").length
    const clarityIssues = issues.filter((i) => i.type === "clarity").length

    const totalErrors = grammarErrors + spellingErrors
    const totalIssues = issues.length

    return {
      words,
      characters,
      sentences,
      grammarErrors,
      spellingErrors,
      styleIssues,
      toneIssues,
      passiveVoice,
      clarityIssues,
      totalErrors,
      totalIssues,
    }
  }

  const stats = getStats()
  const overallScore =
    text.length > 0 ? Math.max(0, 100 - (stats.totalIssues / Math.max(stats.words / 10, 1)) * 100) : 100

  const handleCopyText = () => {
    navigator.clipboard.writeText(text)
  }

  const handleClearText = () => {
    setText("")
    setIssues([])
    setSentenceAnalysis([])
    setSelectedIssue(null)
  }

  const applyCorrection = (issue: GrammarIssue, correctionIndex: number) => {
    const correction = issue.corrections[correctionIndex]
    const before = text.substring(0, issue.position.start)
    const after = text.substring(issue.position.end)

    let newText
    if (correction.text === "Active voice alternative") {
      // For passive voice, provide a more specific transformation
      const passiveText = text.substring(issue.position.start, issue.position.end)
      newText = before + `[Rewrite: ${passiveText} → Active voice]` + after
    } else {
      newText = before + correction.text + after
    }

    setText(newText)
    setIssues((prev) => prev.filter((i) => i.id !== issue.id))
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Advanced Grammar & Writing Coach</h1>
          <p className="text-lg text-muted-foreground">
            Professional grammar checking with multiple correction options and real-time analysis
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Column - Text Input */}
          <div className="space-y-6">
            {/* Settings Bar */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Writing Style:</span>
                    </div>
                    <Select value={writingStyle} onValueChange={(value: WritingStyle) => setWritingStyle(value)}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(writingStyles).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopyText} disabled={!text}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleClearText} disabled={!text}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Text Editor */}
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Your Text
                  {isChecking && (
                    <Badge variant="secondary" className="ml-2">
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      Analyzing...
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Textarea
                    placeholder="Type your text here. Try: 'She don't likes to go outside when it's rain.' to test the grammar checker..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-[500px] text-base leading-relaxed resize-none"
                  />
                  {/* Enhanced highlighting overlay */}
                  {text && issues.length > 0 && (
                    <div
                      className="absolute top-0 left-0 w-full h-full pointer-events-none p-3 text-base leading-relaxed whitespace-pre-wrap break-words overflow-hidden"
                      style={{ color: "transparent" }}
                    >
                      <div dangerouslySetInnerHTML={{ __html: renderHighlightedText() }} className="text-transparent" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Real-time Feedback */}
          <div className="space-y-6">
            {/* Enhanced Writing Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Writing Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{stats.words}</div>
                    <div className="text-sm text-muted-foreground">Words</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{stats.sentences}</div>
                    <div className="text-sm text-muted-foreground">Sentences</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-destructive">{stats.totalErrors}</div>
                    <div className="text-sm text-muted-foreground">Errors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{Math.round(overallScore)}%</div>
                    <div className="text-sm text-muted-foreground">Quality Score</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Overall Quality</span>
                    <span className="text-sm font-medium">{Math.round(overallScore)}%</span>
                  </div>
                  <Progress value={overallScore} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Issues Panel with Multiple Corrections */}
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Grammar & Style Issues
                  {issues.length > 0 && <Badge variant="secondary">{issues.length}</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {issues.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {text ? "Excellent! No issues found in your text." : "Start typing to see real-time feedback."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto">
                    {issues.map((issue) => (
                      <div
                        key={issue.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedIssue === issue.id ? "bg-muted" : "hover:bg-muted/50"
                        }`}
                        onClick={() => setSelectedIssue(selectedIssue === issue.id ? null : issue.id)}
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge
                                  variant={
                                    issue.severity === "high"
                                      ? "destructive"
                                      : issue.severity === "medium"
                                        ? "default"
                                        : "secondary"
                                  }
                                >
                                  {issue.type}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {issue.severity}
                                </Badge>
                                <span className="font-medium text-sm">"{issue.text}"</span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">{issue.explanation}</p>
                            </div>
                          </div>

                          {/* Multiple Correction Options */}
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Correction Options:</p>
                            <div className="grid gap-2">
                              {issue.corrections.map((correction, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-2 bg-muted/50 rounded border"
                                >
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-sm">"{correction.text}"</span>
                                      <Badge variant="outline" className="text-xs">
                                        {correction.confidence}% confidence
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">{correction.explanation}</p>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      applyCorrection(issue, index)
                                    }}
                                  >
                                    Apply
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Enhanced Issue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Issue Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-destructive rounded-full"></div>
                      <span className="text-sm">Grammar</span>
                    </div>
                    <Badge variant="destructive">{stats.grammarErrors}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Spelling</span>
                    </div>
                    <Badge variant="destructive">{stats.spellingErrors}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Style</span>
                    </div>
                    <Badge variant="outline">{stats.styleIssues}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Tone</span>
                    </div>
                    <Badge variant="outline">{stats.toneIssues}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm">Passive Voice</span>
                    </div>
                    <Badge variant="outline">{stats.passiveVoice}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Clarity</span>
                    </div>
                    <Badge variant="outline">{stats.clarityIssues}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Writing Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Writing Tips for {writingStyles[writingStyle]}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  {writingStyle === "formal" && (
                    <>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="font-medium mb-1">Subject-Verb Agreement</p>
                        <p className="text-muted-foreground">
                          Ensure singular subjects use singular verbs (is, was) and plural subjects use plural verbs
                          (are, were)
                        </p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="font-medium mb-1">Avoid Contractions</p>
                        <p className="text-muted-foreground">
                          Use "cannot" instead of "can't", "do not" instead of "don't"
                        </p>
                      </div>
                    </>
                  )}

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium mb-1">Active Voice</p>
                    <p className="text-muted-foreground">
                      Use active voice to make your writing more direct and engaging
                    </p>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium mb-1">Pronoun Clarity</p>
                    <p className="text-muted-foreground">
                      Make sure pronouns clearly refer to specific nouns to avoid confusion
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
