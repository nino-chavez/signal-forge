/**
 * Iteration Controller
 *
 * Manages the feedback loop between production and revision.
 * Tracks iteration state, detects improvement stalls, and determines
 * when to switch strategies or terminate.
 */

import type {
  EnhancedVoiceCheckResult,
  IterationConfig,
  IterationState,
  RevisionFeedback,
  RevisionStrategy,
} from '../../core/types/index.js';

// =============================================================================
// Default Configuration
// =============================================================================

const DEFAULT_CONFIG: IterationConfig = {
  maxIterations: 5,
  minScoreImprovement: 0.5,
  voiceScoreThreshold: 7,
  stallThreshold: 2,
};

// =============================================================================
// Iteration Controller
// =============================================================================

export class IterationController {
  private readonly config: IterationConfig;
  private state: IterationState;
  private readonly verbose: boolean;

  constructor(config?: Partial<IterationConfig>, verbose: boolean = false) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.verbose = verbose;
    this.state = this.createInitialState();
  }

  /**
   * Check if another iteration should be attempted
   */
  shouldContinue(currentScore: number): boolean {
    // Already passed threshold
    if (currentScore >= this.config.voiceScoreThreshold) {
      this.log(`Score ${currentScore} >= threshold ${this.config.voiceScoreThreshold}, stopping`);
      return false;
    }

    // Max iterations reached
    if (this.state.current >= this.config.maxIterations) {
      this.log(`Max iterations (${this.config.maxIterations}) reached, stopping`);
      return false;
    }

    // Check for stall
    if (this.state.stalled) {
      this.log('Iteration stalled, stopping');
      return false;
    }

    return true;
  }

  /**
   * Record a new iteration result
   */
  recordIteration(score: number): void {
    const previousScore = this.state.scores[this.state.scores.length - 1] ?? 0;
    const improvement = score - previousScore;

    this.state.current++;
    this.state.scores.push(score);
    this.state.improvements.push(improvement);

    // Check for stall
    this.detectStall();

    // Update strategy if needed
    this.updateStrategy(score, improvement);

    this.log(
      `Iteration ${this.state.current}: score ${score}, improvement ${improvement.toFixed(2)}`
    );
  }

  /**
   * Get the current iteration state
   */
  getState(): IterationState {
    return { ...this.state };
  }

  /**
   * Get the recommended revision strategy
   */
  getStrategy(): RevisionStrategy {
    return this.state.strategy;
  }

  /**
   * Build revision feedback for the revision agent
   */
  buildFeedback(voiceCheck: EnhancedVoiceCheckResult): RevisionFeedback {
    return {
      voiceCheck,
      strategicIssues: this.extractStrategicIssues(voiceCheck),
      preserveStrengths: voiceCheck.strengths,
      targetScore: this.config.voiceScoreThreshold,
    };
  }

  /**
   * Get a summary of the iteration history
   */
  getSummary(): {
    iterations: number;
    startScore: number;
    endScore: number;
    totalImprovement: number;
    stalled: boolean;
    finalStrategy: RevisionStrategy;
  } {
    const scores = this.state.scores;
    return {
      iterations: this.state.current,
      startScore: scores[0] ?? 0,
      endScore: scores[scores.length - 1] ?? 0,
      totalImprovement: scores.length > 1 ? scores[scores.length - 1] - scores[0] : 0,
      stalled: this.state.stalled,
      finalStrategy: this.state.strategy,
    };
  }

  /**
   * Reset the controller for a new task
   */
  reset(): void {
    this.state = this.createInitialState();
    this.log('Controller reset');
  }

  // ===========================================================================
  // Private Helpers
  // ===========================================================================

  private createInitialState(): IterationState {
    return {
      current: 0,
      max: this.config.maxIterations,
      scores: [],
      improvements: [],
      stalled: false,
      strategy: 'targeted',
    };
  }

  private detectStall(): void {
    const recentImprovements = this.state.improvements.slice(-this.config.stallThreshold);

    if (recentImprovements.length >= this.config.stallThreshold) {
      const allBelowThreshold = recentImprovements.every(
        (imp) => imp < this.config.minScoreImprovement
      );

      if (allBelowThreshold) {
        this.state.stalled = true;
        this.log(
          `Stall detected: last ${this.config.stallThreshold} improvements below ${this.config.minScoreImprovement}`
        );
      }
    }
  }

  private updateStrategy(score: number, improvement: number): void {
    // If improvement is negative or very low, escalate strategy
    if (improvement < 0) {
      this.escalateStrategy();
      this.log(`Negative improvement (${improvement}), escalating strategy`);
    } else if (improvement < this.config.minScoreImprovement && this.state.current > 1) {
      // Low improvement after first iteration - consider escalation
      this.maybeEscalateStrategy();
    }

    // If score is very low, use more aggressive strategy
    if (score < 3 && this.state.strategy !== 'rewrite') {
      this.state.strategy = 'rewrite';
      this.log(`Very low score (${score}), switching to rewrite strategy`);
    } else if (score < 5 && this.state.strategy === 'targeted') {
      this.state.strategy = 'strategic';
      this.log(`Low score (${score}), switching to strategic strategy`);
    }
  }

  private escalateStrategy(): void {
    switch (this.state.strategy) {
      case 'targeted':
        this.state.strategy = 'strategic';
        break;
      case 'strategic':
        this.state.strategy = 'rewrite';
        break;
      case 'rewrite':
        // Already at max - mark as stalled
        this.state.stalled = true;
        break;
    }
  }

  private maybeEscalateStrategy(): void {
    // Escalate if we've had multiple low-improvement iterations at the current strategy
    const recentImprovements = this.state.improvements.slice(-2);
    const avgImprovement =
      recentImprovements.reduce((a, b) => a + b, 0) / recentImprovements.length;

    if (avgImprovement < this.config.minScoreImprovement) {
      this.escalateStrategy();
    }
  }

  private extractStrategicIssues(voiceCheck: EnhancedVoiceCheckResult): string[] {
    // Extract issues that are structural rather than textual
    return voiceCheck.issues.filter(
      (issue) =>
        issue.includes('Missing') ||
        issue.includes('lacks') ||
        issue.includes('structure')
    );
  }

  private log(message: string): void {
    if (this.verbose) {
      console.log(`[IterationController] ${message}`);
    }
  }
}

// =============================================================================
// Factory Function
// =============================================================================

export function createIterationController(
  config?: Partial<IterationConfig>,
  verbose?: boolean
): IterationController {
  return new IterationController(config, verbose);
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Calculate expected iterations based on starting score
 */
export function estimateIterations(
  startScore: number,
  targetScore: number = 7,
  avgImprovementPerIteration: number = 1.5
): number {
  const gap = targetScore - startScore;
  if (gap <= 0) return 0;

  return Math.ceil(gap / avgImprovementPerIteration);
}

/**
 * Analyze iteration history for patterns
 */
export function analyzeIterationHistory(
  scores: number[]
): {
  trend: 'improving' | 'declining' | 'flat';
  volatility: number;
  avgImprovement: number;
} {
  if (scores.length < 2) {
    return { trend: 'flat', volatility: 0, avgImprovement: 0 };
  }

  const improvements: number[] = [];
  for (let i = 1; i < scores.length; i++) {
    improvements.push(scores[i] - scores[i - 1]);
  }

  const avgImprovement = improvements.reduce((a, b) => a + b, 0) / improvements.length;
  const variance =
    improvements.reduce((sum, imp) => sum + Math.pow(imp - avgImprovement, 2), 0) /
    improvements.length;
  const volatility = Math.sqrt(variance);

  let trend: 'improving' | 'declining' | 'flat';
  if (avgImprovement > 0.5) {
    trend = 'improving';
  } else if (avgImprovement < -0.5) {
    trend = 'declining';
  } else {
    trend = 'flat';
  }

  return { trend, volatility, avgImprovement };
}
