import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text, language = "en-US", style } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ matches: [] })
    }

    console.log("[v0] Grammar API: Checking text with LanguageTool:", text.substring(0, 50) + "...")

    const languageToolUrl = "https://api.languagetool.org/v2/check"

    const params = new URLSearchParams()
    params.append("text", text)
    params.append("language", language)

    // Add style-specific rules
    if (style === "formal" || style === "academic" || style === "business") {
      params.append("enabledRules", "STYLE,GRAMMAR,TYPOS,PUNCTUATION")
    } else {
      params.append("enabledRules", "GRAMMAR,TYPOS")
    }

    const response = await fetch(languageToolUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: params.toString(),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] LanguageTool API error:", response.status, errorText)
      throw new Error(`LanguageTool API error: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] LanguageTool API success:", data.matches?.length || 0, "issues found")

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Grammar API error:", error)

    // Return empty result on error so the fallback grammar checker can be used
    return NextResponse.json(
      {
        matches: [],
        error: "API temporarily unavailable, using fallback grammar checker",
      },
      { status: 200 },
    )
  }
}
