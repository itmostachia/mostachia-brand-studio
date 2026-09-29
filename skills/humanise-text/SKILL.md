---
name: humanise-text
description: >
  Transform AI-generated or robotic-sounding text into natural, human-written
  content. Use when the user asks to humanize text, make writing sound more
  natural, remove AI patterns, rewrite content to sound human, avoid AI
  detection, or make text less robotic. Also triggers on "humanizar texto",
  "que suene natural", "que no suene a robot", "reescribir como humano".
allowed-tools: Read, Write, Bash
---

# Humanise Text

Transform AI-generated or robotic text into natural, human-written content
by eliminating mechanical patterns and introducing realistic human writing
characteristics.

## Step 1: Read the Reference File

Before humanizing any text, read the reference file:

```bash
cat ~/.claude/skills/humanise-text/references/overused-ai-patterns.md
```

## Step 2: Analyze the Input Text

Identify AI patterns in the original:
- Rhetorical constructions (elliptical setups, revelation hooks)
- Overused transition words (Moreover, Furthermore, Additionally)
- Business jargon (leverage, synergy, paradigm shift, cutting-edge)
- Em-dashes (replace with periods, commas, or colons)
- "It's not X, but Y" constructions
- Perfectly balanced arguments

## Step 3: Apply Humanization

**Vary sentence structure:**
- Mix long and short sentences
- Break up smooth flows with occasional interruptions
- Avoid rhythmic patterns

**Add subtle imperfections:**
- Hesitation words: "perhaps", "I think", "seems like"
- Cautious qualifiers where natural
- Slight redundancy that feels human

**Avoid perfect symmetry:**
- Don't balance every argument equally
- Let thoughts trail off or shift direction
- Allow tangential observations

**Format naturally:**
- Break paragraphs where intuitive, not at rigid intervals
- Let content flow instead of forcing structure

## Step 4: Replace Prohibited Content

For every prohibited word/expression/construction from the reference file:
1. Identify it
2. Select replacement from provided alternatives
3. Rewrite the sentence naturally

**Critical: No em-dashes. Ever. Use periods, commas, or colons instead.**

## Step 5: Self-Audit

After drafting, scan line by line for:
- Rhetorical constructions from reference file
- Overused words from reference file
- Prohibited expressions
- Em-dashes
- Perfect balanced oppositions

For each flagged item: identify it, explain why it's problematic, provide correction.
Rewrite the complete text with all corrections applied.

**Do not deliver final output until self-audit is complete.**

## Content Type Adjustments

- **Casual**: Short, varied, natural. Skip lists and formal structure
- **Professional**: Clear and direct, no business jargon
- **Creative**: More personality and imperfection
- **Technical**: Accurate but naturally explained
- **Marketing**: Compelling without buzzwords
