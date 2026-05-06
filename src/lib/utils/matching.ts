import type { Answer, MatchMode } from "@types";

export type MatchResult = {
  answer: Answer;
  score: number;
  label: string;
};

export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const buildBigrams = (text: string): Map<string, number> => {
  const bigrams = new Map<string, number>();
  for (let index = 0; index < text.length - 1; index += 1) {
    const bigram = text.slice(index, index + 2);
    bigrams.set(bigram, (bigrams.get(bigram) ?? 0) + 1);
  }
  return bigrams;
};

export const diceCoefficient = (left: string, right: string): number => {
  const leftNorm = normalizeText(left);
  const rightNorm = normalizeText(right);

  if (!leftNorm || !rightNorm) return 0;
  if (leftNorm === rightNorm) return 1;
  if (leftNorm.length < 2 || rightNorm.length < 2) return 0;

  const leftBigrams = buildBigrams(leftNorm);
  let intersection = 0;
  for (let index = 0; index < rightNorm.length - 1; index += 1) {
    const bigram = rightNorm.slice(index, index + 2);
    const count = leftBigrams.get(bigram) ?? 0;
    if (count > 0) {
      leftBigrams.set(bigram, count - 1);
      intersection += 1;
    }
  }

  const leftPairs = leftNorm.length - 1;
  const rightPairs = rightNorm.length - 1;
  return (2 * intersection) / (leftPairs + rightPairs);
};

const findBestAnswer = (
  candidates: string[],
  answers: Answer[],
): MatchResult | null => {
  let best: MatchResult | null = null;

  for (const candidate of candidates) {
    if (candidate.length < 2) continue;

    for (const answer of answers) {
      const score = diceCoefficient(candidate, answer.label);
      if (!best || score > best.score) {
        best = { answer, score, label: candidate };
      }
    }
  }

  return best;
};

export const findMatchingAnswer = (
  candidates: string[],
  answers: Answer[],
  mode: MatchMode,
): MatchResult | null => {
  if (mode === "exact") {
    for (const candidate of candidates) {
      const normalizedCandidate = normalizeText(candidate);
      if (!normalizedCandidate) continue;
      for (const answer of answers) {
        if (normalizedCandidate === normalizeText(answer.label)) {
          return { answer, score: 1, label: candidate };
        }
      }
    }

    return null;
  }

  return findBestAnswer(candidates, answers);
};
