#!/usr/bin/env npx tsx
/**
 * AI Council Red Team Audit
 *
 * Uses multiple LLM providers (Anthropic, OpenAI, Google) to audit strategy documents
 * with different perspectives, then synthesizes findings through a judge panel.
 *
 * Architecture:
 * - 3 Reviewer Models (parallel, independent analysis)
 * - 2 Judge Models (synthesis + devil's advocate)
 * - Structured scoring rubric with aggregate scores
 */

import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ============================================================================
// CONFIGURATION
// ============================================================================

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const google = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

// Model configuration for the council
const MODELS = {
  // Reviewer Panel - 3 specialists with different perspectives
  reviewers: [
    {
      id: 'strategic-analyst',
      provider: 'anthropic',
      model: 'claude-sonnet-4-20250514',
      role: 'Strategic Analyst',
      focus: 'strategic coherence, logical consistency, and gap analysis',
      persona: `You are a senior management consultant with 20 years experience in enterprise strategy.
You evaluate documents for strategic coherence, logical flow, and completeness of recommendations.
You are skeptical of unsupported claims and look for gaps in reasoning.`
    },
    {
      id: 'operations-critic',
      provider: 'openai',
      model: 'gpt-4o',
      role: 'Operations Critic',
      focus: 'actionability, feasibility, and risk coverage',
      persona: `You are a VP of Operations who has led multiple enterprise migrations.
You evaluate whether recommendations are actually executable with real-world constraints.
You focus on hidden risks, resource requirements, and operational feasibility.`
    },
    {
      id: 'technical-auditor',
      provider: 'google',
      model: 'gemini-2.5-flash',
      role: 'Technical Auditor',
      focus: 'technical accuracy, vendor claims, and implementation details',
      persona: `You are a principal engineer specializing in e-commerce platforms and migrations.
You verify technical claims about WooCommerce, Magento, Shopify, and hosting providers.
You look for outdated information, incorrect technical statements, and missing technical details.`
    }
  ],

  // Judge Panel - synthesizer + devil's advocate
  judges: [
    {
      id: 'chief-judge',
      provider: 'anthropic',
      model: 'claude-sonnet-4-20250514',
      role: 'Chief Judge',
      persona: `You are the Chief Judge synthesizing findings from multiple reviewers.
Your job is to:
1. Identify areas of consensus across reviewers
2. Resolve conflicting assessments with reasoned judgment
3. Produce a balanced final verdict with aggregate scores
4. Highlight the most critical findings that require action`
    },
    {
      id: 'devils-advocate',
      provider: 'openai',
      model: 'gpt-4o',
      role: "Devil's Advocate",
      persona: `You are the Devil's Advocate on the judge panel.
Your job is to:
1. Challenge the consensus findings - what did reviewers miss?
2. Identify potential blind spots in the analysis
3. Raise uncomfortable questions the reviewers avoided
4. Ensure the final verdict isn't too lenient or too harsh`
    }
  ]
};

// Scoring dimensions with descriptions
const SCORING_RUBRIC = {
  strategic_coherence: {
    name: 'Strategic Coherence',
    description: 'Do recommendations align across documents? Is there a clear, consistent strategy?',
    weight: 1.5
  },
  technical_accuracy: {
    name: 'Technical Accuracy',
    description: 'Are WooCommerce, hosting, and migration claims factually correct?',
    weight: 1.2
  },
  risk_coverage: {
    name: 'Risk Coverage',
    description: 'Are all significant migration risks identified and addressed?',
    weight: 1.3
  },
  actionability: {
    name: 'Actionability',
    description: 'Can recommendations be executed? Are steps clear and resources defined?',
    weight: 1.4
  },
  internal_consistency: {
    name: 'Internal Consistency',
    description: 'Do documents agree with each other? Are there contradictions?',
    weight: 1.0
  },
  completeness: {
    name: 'Completeness',
    description: 'What critical topics are missing? Are there gaps in coverage?',
    weight: 1.1
  },
  bias_detection: {
    name: 'Bias Detection',
    description: 'Are there unstated assumptions, vendor biases, or conflicts of interest?',
    weight: 1.0
  }
};

// ============================================================================
// TYPES
// ============================================================================

interface Document {
  filename: string;
  path: string;
  content: string;
  wordCount: number;
}

interface Score {
  dimension: string;
  score: number; // 1-10
  confidence: number; // 0-1
  reasoning: string;
}

interface ReviewerFinding {
  reviewerId: string;
  role: string;
  model: string;
  provider: string;
  scores: Score[];
  keyFindings: string[];
  criticalIssues: string[];
  recommendations: string[];
  rawResponse?: string;
}

interface JudgeVerdict {
  judgeId: string;
  role: string;
  model: string;
  synthesis: string;
  challenges?: string[];
  finalScores?: Score[];
}

interface AuditReport {
  timestamp: string;
  documentsAudited: string[];
  totalWordCount: number;
  reviewerFindings: ReviewerFinding[];
  judgeVerdicts: JudgeVerdict[];
  aggregateScores: {
    dimension: string;
    weightedScore: number;
    confidence: number;
    consensus: 'strong' | 'moderate' | 'weak' | 'contested';
  }[];
  overallScore: number;
  overallGrade: string;
  executiveSummary: string;
  criticalActions: string[];
}

// ============================================================================
// DOCUMENT LOADING
// ============================================================================

function loadDocuments(basePath: string): Document[] {
  const documents: Document[] = [];

  const htmlFiles = [
    'INDEX.html',
    'strategy/00_UNBIASED_BASELINE.html',
    'strategy/01_TIGER_TEAM_GTM.html',
    'strategy/02_WPENGINE_PARTNERSHIP.html',
    'strategy/04_TIGER_TEAM_PITCH_DECK.html',
    'strategy/05_RED_TEAM.html',
    'strategy/08_PROJECT_PLAN.html',
    'architecture/03_REFERENCE_ARCHITECTURE.html',
    'architecture/07_TECHNICAL_ARCHITECTURE.html',
    'collateral/06_IMPLEMENTATION_PLAYBOOK.html'
  ];

  for (const file of htmlFiles) {
    const fullPath = path.join(basePath, file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      // Strip HTML tags for cleaner text analysis
      const textContent = content
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      documents.push({
        filename: file,
        path: fullPath,
        content: textContent,
        wordCount: textContent.split(/\s+/).length
      });
    } else {
      console.warn(`⚠️  Document not found: ${file}`);
    }
  }

  return documents;
}

// ============================================================================
// PROMPTS
// ============================================================================

function buildReviewerPrompt(reviewer: typeof MODELS.reviewers[0], documents: Document[]): string {
  const docSummaries = documents.map(d =>
    `### ${d.filename} (${d.wordCount} words)\n${d.content.substring(0, 3000)}...`
  ).join('\n\n---\n\n');

  const scoringInstructions = Object.entries(SCORING_RUBRIC)
    .map(([key, val]) => `- **${val.name}** (${key}): ${val.description}`)
    .join('\n');

  return `${reviewer.persona}

## YOUR TASK

You are conducting a red team audit of a WooCommerce migration strategy kit. These documents were created to help a consulting firm win and execute WooCommerce migration projects for enterprise merchants.

Your focus area: **${reviewer.focus}**

## DOCUMENTS TO AUDIT

${docSummaries}

## SCORING RUBRIC (Score each 1-10)

${scoringInstructions}

## OUTPUT FORMAT

Respond with valid JSON only (no markdown code blocks, no explanation outside JSON):

{
  "scores": [
    {
      "dimension": "strategic_coherence",
      "score": 8,
      "confidence": 0.85,
      "reasoning": "Brief explanation..."
    },
    {
      "dimension": "technical_accuracy",
      "score": 7,
      "confidence": 0.8,
      "reasoning": "Brief explanation..."
    },
    {
      "dimension": "risk_coverage",
      "score": 6,
      "confidence": 0.75,
      "reasoning": "Brief explanation..."
    },
    {
      "dimension": "actionability",
      "score": 7,
      "confidence": 0.8,
      "reasoning": "Brief explanation..."
    },
    {
      "dimension": "internal_consistency",
      "score": 8,
      "confidence": 0.9,
      "reasoning": "Brief explanation..."
    },
    {
      "dimension": "completeness",
      "score": 7,
      "confidence": 0.75,
      "reasoning": "Brief explanation..."
    },
    {
      "dimension": "bias_detection",
      "score": 6,
      "confidence": 0.7,
      "reasoning": "Brief explanation..."
    }
  ],
  "keyFindings": [
    "Finding 1: Brief observation",
    "Finding 2: Another key observation",
    "Finding 3: Third key observation"
  ],
  "criticalIssues": [
    "Issue 1: Something that must be fixed"
  ],
  "recommendations": [
    "Recommendation 1: Specific action to improve",
    "Recommendation 2: Another improvement",
    "Recommendation 3: Third suggestion"
  ]
}`;
}

function buildChiefJudgePrompt(findings: ReviewerFinding[], documents: Document[]): string {
  const findingsSummary = findings.map(f => `
### ${f.role} (${f.provider}/${f.model})

**Scores:**
${f.scores.map(s => `- ${s.dimension}: ${s.score}/10 (${Math.round(s.confidence * 100)}% confidence) - ${s.reasoning}`).join('\n')}

**Key Findings:**
${f.keyFindings.map(kf => `- ${kf}`).join('\n')}

**Critical Issues:**
${f.criticalIssues.length > 0 ? f.criticalIssues.map(ci => `- ⚠️ ${ci}`).join('\n') : '- None identified'}

**Recommendations:**
${f.recommendations.map(r => `- ${r}`).join('\n')}
`).join('\n---\n');

  return `${MODELS.judges[0].persona}

## REVIEWER FINDINGS TO SYNTHESIZE

${findingsSummary}

## YOUR TASK

Synthesize these three independent reviews into a unified verdict. You must:

1. Calculate consensus scores (weighted average where reviewers agree, your judgment where they conflict)
2. Identify the 3-5 most critical findings across all reviewers
3. Determine which recommendations are most urgent
4. Produce an executive summary suitable for senior leadership

## OUTPUT FORMAT

Respond with valid JSON only (no markdown code blocks):

{
  "synthesis": "2-3 paragraph executive summary of the audit findings...",
  "consensusAreas": [
    "Area where reviewers strongly agreed"
  ],
  "conflictResolutions": [
    {
      "topic": "Where reviewers disagreed",
      "resolution": "Your reasoned judgment",
      "rationale": "Why you sided with one view"
    }
  ],
  "finalScores": [
    {
      "dimension": "strategic_coherence",
      "score": 7.5,
      "confidence": 0.9,
      "reasoning": "Synthesis of reviewer perspectives..."
    },
    {
      "dimension": "technical_accuracy",
      "score": 7.0,
      "confidence": 0.85,
      "reasoning": "..."
    },
    {
      "dimension": "risk_coverage",
      "score": 6.5,
      "confidence": 0.8,
      "reasoning": "..."
    },
    {
      "dimension": "actionability",
      "score": 7.0,
      "confidence": 0.85,
      "reasoning": "..."
    },
    {
      "dimension": "internal_consistency",
      "score": 8.0,
      "confidence": 0.9,
      "reasoning": "..."
    },
    {
      "dimension": "completeness",
      "score": 7.0,
      "confidence": 0.8,
      "reasoning": "..."
    },
    {
      "dimension": "bias_detection",
      "score": 6.0,
      "confidence": 0.75,
      "reasoning": "..."
    }
  ],
  "criticalActions": [
    "Top priority action 1",
    "Top priority action 2"
  ],
  "overallGrade": "B+",
  "overallScore": 78
}`;
}

function buildDevilsAdvocatePrompt(chiefVerdict: JudgeVerdict, findings: ReviewerFinding[]): string {
  return `${MODELS.judges[1].persona}

## CHIEF JUDGE'S VERDICT

${chiefVerdict.synthesis}

## ORIGINAL REVIEWER FINDINGS

${findings.map(f => `**${f.role}:** ${f.keyFindings.join('; ')}`).join('\n\n')}

## YOUR TASK

Challenge the Chief Judge's verdict. Identify:
1. What did ALL reviewers miss? (blind spots)
2. Is the overall score too lenient or too harsh?
3. What uncomfortable questions should be raised?
4. Are there hidden assumptions in the analysis?

## OUTPUT FORMAT

Respond with valid JSON only (no markdown code blocks):

{
  "challenges": [
    "Challenge 1: Specific critique of the verdict or blind spot",
    "Challenge 2: Another important challenge",
    "Challenge 3: Third challenge"
  ],
  "blindSpots": [
    "Something important that no reviewer mentioned"
  ],
  "scoreAdjustment": {
    "direction": "lower",
    "magnitude": 5,
    "rationale": "Why the score should be adjusted"
  },
  "uncomfortableQuestions": [
    "Question 1: Something the reviewers avoided",
    "Question 2: Another uncomfortable truth"
  ]
}`;
}

// ============================================================================
// API CALLS
// ============================================================================

async function callAnthropic(model: string, prompt: string): Promise<string> {
  const response = await anthropic.messages.create({
    model: model,
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: prompt + '\n\nIMPORTANT: Respond with valid JSON only. No markdown code blocks or backticks.'
      }
    ]
  });

  const content = response.content[0];
  if (content.type === 'text') {
    return content.text;
  }
  throw new Error('Unexpected response type from Anthropic');
}

async function callOpenAI(model: string, prompt: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: model,
    messages: [
      {
        role: 'system',
        content: 'You are a precise AI auditor. Always respond with valid JSON only. No markdown formatting, no code blocks, no explanations outside the JSON structure.'
      },
      { role: 'user', content: prompt }
    ],
    max_tokens: 4000,
    temperature: 0.3
  });

  return response.choices[0]?.message?.content || '';
}

async function callGoogle(model: string, prompt: string): Promise<string> {
  const genModel = google.getGenerativeModel({ model });
  const result = await genModel.generateContent(
    prompt + '\n\nIMPORTANT: Respond with valid JSON only. No markdown code blocks or backticks.'
  );
  return result.response.text();
}

async function callModel(provider: string, model: string, prompt: string): Promise<string> {
  switch (provider) {
    case 'anthropic':
      return callAnthropic(model, prompt);
    case 'openai':
      return callOpenAI(model, prompt);
    case 'google':
      return callGoogle(model, prompt);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

function parseJSON(text: string): any {
  // Clean up common issues
  let cleaned = text
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();

  // Try to extract JSON from response
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error('Failed to parse JSON:', cleaned.substring(0, 500));
      throw new Error('Invalid JSON in model response');
    }
  }
  throw new Error('No JSON found in response');
}

// ============================================================================
// AUDIT PIPELINE
// ============================================================================

async function runReviewer(
  reviewer: typeof MODELS.reviewers[0],
  documents: Document[]
): Promise<ReviewerFinding> {
  console.log(`\n📋 ${reviewer.role} (${reviewer.provider}/${reviewer.model}) reviewing...`);

  const prompt = buildReviewerPrompt(reviewer, documents);
  const response = await callModel(reviewer.provider, reviewer.model, prompt);
  const parsed = parseJSON(response);

  return {
    reviewerId: reviewer.id,
    role: reviewer.role,
    model: reviewer.model,
    provider: reviewer.provider,
    scores: parsed.scores || [],
    keyFindings: parsed.keyFindings || [],
    criticalIssues: parsed.criticalIssues || [],
    recommendations: parsed.recommendations || [],
    rawResponse: response
  };
}

async function runChiefJudge(
  findings: ReviewerFinding[],
  documents: Document[]
): Promise<JudgeVerdict> {
  console.log(`\n⚖️  Chief Judge (${MODELS.judges[0].provider}/${MODELS.judges[0].model}) synthesizing findings...`);

  const prompt = buildChiefJudgePrompt(findings, documents);
  const judge = MODELS.judges[0];
  const response = await callModel(judge.provider, judge.model, prompt);
  const parsed = parseJSON(response);

  return {
    judgeId: judge.id,
    role: judge.role,
    model: judge.model,
    synthesis: parsed.synthesis || '',
    finalScores: parsed.finalScores || [],
    challenges: parsed.criticalActions
  };
}

async function runDevilsAdvocate(
  chiefVerdict: JudgeVerdict,
  findings: ReviewerFinding[]
): Promise<JudgeVerdict> {
  console.log(`\n😈 Devil's Advocate (${MODELS.judges[1].provider}/${MODELS.judges[1].model}) challenging verdict...`);

  const prompt = buildDevilsAdvocatePrompt(chiefVerdict, findings);
  const judge = MODELS.judges[1];
  const response = await callModel(judge.provider, judge.model, prompt);
  const parsed = parseJSON(response);

  return {
    judgeId: judge.id,
    role: judge.role,
    model: judge.model,
    synthesis: parsed.scoreAdjustment?.rationale || '',
    challenges: [
      ...(parsed.challenges || []),
      ...(parsed.uncomfortableQuestions || [])
    ]
  };
}

function calculateAggregateScores(findings: ReviewerFinding[]): AuditReport['aggregateScores'] {
  const dimensions = Object.keys(SCORING_RUBRIC);

  return dimensions.map(dim => {
    const dimScores = findings
      .flatMap(f => f.scores)
      .filter(s => s.dimension === dim);

    if (dimScores.length === 0) {
      return {
        dimension: dim,
        weightedScore: 0,
        confidence: 0,
        consensus: 'weak' as const
      };
    }

    const avgScore = dimScores.reduce((sum, s) => sum + s.score, 0) / dimScores.length;
    const avgConfidence = dimScores.reduce((sum, s) => sum + s.confidence, 0) / dimScores.length;
    const scoreVariance = dimScores.reduce((sum, s) => sum + Math.pow(s.score - avgScore, 2), 0) / dimScores.length;

    let consensus: 'strong' | 'moderate' | 'weak' | 'contested';
    if (scoreVariance < 0.5) consensus = 'strong';
    else if (scoreVariance < 1.5) consensus = 'moderate';
    else if (scoreVariance < 3) consensus = 'weak';
    else consensus = 'contested';

    const weight = SCORING_RUBRIC[dim as keyof typeof SCORING_RUBRIC]?.weight || 1;

    return {
      dimension: dim,
      weightedScore: avgScore * weight,
      confidence: avgConfidence,
      consensus
    };
  });
}

function determineGrade(score: number): string {
  if (score >= 93) return 'A';
  if (score >= 90) return 'A-';
  if (score >= 87) return 'B+';
  if (score >= 83) return 'B';
  if (score >= 80) return 'B-';
  if (score >= 77) return 'C+';
  if (score >= 73) return 'C';
  if (score >= 70) return 'C-';
  if (score >= 67) return 'D+';
  if (score >= 63) return 'D';
  if (score >= 60) return 'D-';
  return 'F';
}

// ============================================================================
// REPORT GENERATION
// ============================================================================

function generateReport(
  documents: Document[],
  reviewerFindings: ReviewerFinding[],
  chiefVerdict: JudgeVerdict,
  devilsAdvocate: JudgeVerdict
): AuditReport {
  const aggregateScores = calculateAggregateScores(reviewerFindings);
  const totalWeight = Object.values(SCORING_RUBRIC).reduce((sum, r) => sum + r.weight, 0);
  const overallScore = (aggregateScores.reduce((sum, s) => sum + s.weightedScore, 0) / totalWeight) * 10;

  const allCriticalIssues = reviewerFindings
    .flatMap(f => f.criticalIssues)
    .filter(Boolean);

  const criticalActions = [
    ...allCriticalIssues,
    ...(devilsAdvocate.challenges || []).slice(0, 2)
  ];

  return {
    timestamp: new Date().toISOString(),
    documentsAudited: documents.map(d => d.filename),
    totalWordCount: documents.reduce((sum, d) => sum + d.wordCount, 0),
    reviewerFindings,
    judgeVerdicts: [chiefVerdict, devilsAdvocate],
    aggregateScores,
    overallScore: Math.round(overallScore * 10) / 10,
    overallGrade: determineGrade(overallScore),
    executiveSummary: chiefVerdict.synthesis,
    criticalActions: criticalActions.slice(0, 5)
  };
}

function formatReportAsMarkdown(report: AuditReport): string {
  const rubricNames = Object.fromEntries(
    Object.entries(SCORING_RUBRIC).map(([k, v]) => [k, v.name])
  );

  return `# AI Council Red Team Audit Report

**Generated:** ${new Date(report.timestamp).toLocaleString()}
**Documents Audited:** ${report.documentsAudited.length}
**Total Word Count:** ${report.totalWordCount.toLocaleString()}

---

## Overall Score: ${report.overallScore}/100 (Grade: ${report.overallGrade})

### Score Breakdown

| Dimension | Score | Confidence | Consensus |
|-----------|-------|------------|-----------|
${report.aggregateScores.map(s =>
  `| ${rubricNames[s.dimension] || s.dimension} | ${(s.weightedScore / (SCORING_RUBRIC[s.dimension as keyof typeof SCORING_RUBRIC]?.weight || 1)).toFixed(1)}/10 | ${Math.round(s.confidence * 100)}% | ${s.consensus} |`
).join('\n')}

---

## Executive Summary

${report.executiveSummary}

---

## Critical Actions Required

${report.criticalActions.map((a, i) => `${i + 1}. ${a}`).join('\n')}

---

## Reviewer Analysis

${report.reviewerFindings.map(f => `
### ${f.role} (${f.provider}/${f.model})

**Key Findings:**
${f.keyFindings.map(kf => `- ${kf}`).join('\n')}

**Critical Issues:**
${f.criticalIssues.length > 0 ? f.criticalIssues.map(ci => `- ⚠️ ${ci}`).join('\n') : '- None identified'}

**Recommendations:**
${f.recommendations.map(r => `- ${r}`).join('\n')}

**Scores:**
${f.scores.map(s => `- ${rubricNames[s.dimension] || s.dimension}: ${s.score}/10 — ${s.reasoning}`).join('\n')}
`).join('\n---\n')}

---

## Devil's Advocate Challenges

${(report.judgeVerdicts.find(v => v.role === "Devil's Advocate")?.challenges || [])
  .map(c => `- 🔥 ${c}`)
  .join('\n')}

---

*This report was generated by the AI Council using multiple LLM providers.*
*Models used: ${[...MODELS.reviewers, ...MODELS.judges].map(m => `${m.provider}/${m.model}`).join(', ')}*
`;
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log('🏛️  AI Council Red Team Audit');
  console.log('════════════════════════════════════════\n');

  const basePath = process.argv[2] || process.cwd();
  if (!process.argv[2]) {
    console.log('Usage: npx tsx scripts/ai-council-audit.ts <project-directory>\n');
    console.log(`No directory specified, using current directory: ${basePath}\n`);
  }

  // Load documents
  console.log('📂 Loading documents...');
  const documents = loadDocuments(basePath);
  console.log(`   Found ${documents.length} documents (${documents.reduce((s, d) => s + d.wordCount, 0).toLocaleString()} words)\n`);

  if (documents.length === 0) {
    console.error('❌ No documents found to audit');
    process.exit(1);
  }

  // Run reviewers in parallel
  console.log('👥 Convening Reviewer Panel...');
  const reviewerPromises = MODELS.reviewers.map(r => runReviewer(r, documents));
  const reviewerFindings = await Promise.all(reviewerPromises);

  console.log('\n✅ All reviewers completed\n');

  // Run Chief Judge
  const chiefVerdict = await runChiefJudge(reviewerFindings, documents);

  // Run Devil's Advocate
  const devilsAdvocate = await runDevilsAdvocate(chiefVerdict, reviewerFindings);

  // Generate report
  console.log('\n📊 Generating final report...\n');
  const report = generateReport(documents, reviewerFindings, chiefVerdict, devilsAdvocate);

  // Save JSON report
  const jsonPath = path.join(basePath, 'audit-report.json');
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  console.log(`📄 JSON report saved: ${jsonPath}`);

  // Save Markdown report
  const mdPath = path.join(basePath, 'AUDIT_REPORT.md');
  const mdReport = formatReportAsMarkdown(report);
  fs.writeFileSync(mdPath, mdReport);
  console.log(`📝 Markdown report saved: ${mdPath}`);

  // Print summary
  console.log('\n════════════════════════════════════════');
  console.log(`🎯 OVERALL SCORE: ${report.overallScore}/100 (${report.overallGrade})`);
  console.log('════════════════════════════════════════\n');

  console.log('📌 Critical Actions:');
  report.criticalActions.forEach((a, i) => console.log(`   ${i + 1}. ${a}`));

  console.log('\n✅ Audit complete!\n');
}

main().catch(console.error);
