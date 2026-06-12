import type { Answer, MatchMode, MatchResult, Winners } from "@types";

export const cleanText = (text: string) =>
  text.replace(/[^A-z0-9]/g, "").toLowerCase();

export const tokenize = (text: string) =>
  text
    .toLowerCase()
    .split(/[^A-z0-9]+/)
    .filter(Boolean);

//? True exact
export const trueExactText = (text1: string, text2: string) =>
  text1.trim() === text2.trim();

//? Clean Text Equals
export const sameBasicText = (text1: string, text2: string) =>
  cleanText(text1) === cleanText(text2);

//? Dice Coefficient
export const buildBigrams = (text: string) => {
  const found = new Set();
  for (let i = 0; i < text.length; i++) {
    const two = text.slice(i, i + 2);
    if (two.length === 2) found.add(two);
  }
  return found;
};

export const diceCoefficient = (text1: string, text2: string) => {
  if (text1.length < 2 || text2.length < 2) return 0.0;
  const s1Bigrams = buildBigrams(cleanText(text1));
  const s2Bigrams = buildBigrams(cleanText(text2));

  const intersections = s1Bigrams.intersection(s2Bigrams);
  const score = (2 * intersections.size) / (s1Bigrams.size + s2Bigrams.size);
  return score;
};

//? Fuzzy Matching
const isSep = (c: string) => c === " " || c === "-" || c === "_";

const tokenScorer = (look: string, inString: string) => {
  const lookTokens = new Set(tokenize(look));
  const inTokens = new Set(tokenize(inString));
  if (!lookTokens.size || !inTokens.size) return 0;

  let matches = 0;
  for (const token of lookTokens) {
    if (inTokens.has(token)) matches++;
  }

  //? token dice
  return (2 * matches) / (lookTokens.size + inTokens.size);

  //? token jaccard
  // return matches / (lookTokens.size + inTokens.size - matches)
};

export function fuzzyScorer(look: string, inString: string) {
  if (look === inString) return 1;
  let score = 1;
  const checkReg = new RegExp(look.slice(0).split("").join(".*?"));
  if (checkReg.test(inString)) score = 0;

  const lastMatch: [string, number, number] = ["", 0, 0];
  const maxPossible = 1 + (look.length - 1) * 2;

  for (let i = 0; i < look.length; i++) {
    const cLook = look[i];
    const start = i === 0 ? 0 : lastMatch[1] + 1;
    for (let j = start; j < inString.length; j++) {
      if (i === lastMatch[2]) continue;
      const cIn = inString[j];
      if (i !== 0) {
        if (cLook === cIn) {
          score += 1;
          const prevIn = inString[j - 1];
          // after separator match
          if (isSep(prevIn)) {
            score += 5;
          }
          // successive match
          if (lastMatch[1] === j - 1) {
            score += 1;
          }
          lastMatch[0] = cLook;
          lastMatch[1] = j;
          lastMatch[2] = i;
        } else {
          // Gap penalty
          score--;
        }
      } else {
        if (cLook === cIn) {
          score++;
          lastMatch[0] = cLook;
          lastMatch[1] = j;
        } else {
          score--;
        }
      }
    }
  }

  const tokenScore = tokenScorer(look, inString);

  return Math.max(tokenScore, Math.max(0, score / maxPossible));
}

export function fuzzy(source: string, targets: string[]) {
  let best = {
    target: "",
    score: 0,
  };
  for (const target of targets) {
    const score = fuzzyScorer(source.trim().toLowerCase(), target);
    if (score > best.score) {
      best = {
        target,
        score,
      };
    }
  }

  return best;
}

//* Likely a better way to do this but since there's only ever three things performance shouldn't be an issue.
//* May re-visit
const updateWinners = (winners: Winners, match: MatchResult): void => {
  const current = [winners.first, winners.second, winners.third];
  const existing = current.find(
    (winner) => winner?.answer.id === match.answer.id,
  );
  if (existing && existing.score >= match.score) return;
  const withoutSameAnswer = current.filter(
    (winner): winner is MatchResult =>
      Boolean(winner) && winner?.answer.id !== match.answer.id,
  );
  if (!withoutSameAnswer[0] || match.score > withoutSameAnswer[0].score) {
    winners.first = match;
    winners.second = withoutSameAnswer[0] ?? null;
    winners.third = withoutSameAnswer[1] ?? null;
    return;
  }
  if (!withoutSameAnswer[1] || match.score > withoutSameAnswer[1].score) {
    winners.first = withoutSameAnswer[0];
    winners.second = match;
    winners.third = withoutSameAnswer[1] ?? null;
    return;
  }
  if (!withoutSameAnswer[2] || match.score > withoutSameAnswer[2].score) {
    winners.first = withoutSameAnswer[0];
    winners.second = withoutSameAnswer[1];
    winners.third = match;
  }
};

export const findBestAnswer = (
  candidates: string[],
  answers: Answer[],
  mode: MatchMode,
): Winners => {
  const winners: Winners = {
    first: null,
    second: null,
    third: null,
  };

  for (const candidate of candidates) {
    if (candidate.length < 2) continue;

    for (const answer of answers) {
      let score = 0;
      if (mode === "exact") {
        if (trueExactText(candidate, answer.label)) {
          score = 1;
        }
      } else if (mode === "similar") {
        if (sameBasicText(candidate, answer.label)) {
          score = 1;
        }
      } else if (mode === "partial") {
        score = diceCoefficient(candidate, answer.label);
      } else if (mode === "fuzzy") {
        score = fuzzyScorer(candidate, answer.label);
      }

      const match: MatchResult = { answer, score, label: candidate };
      updateWinners(winners, match);
    }
  }

  return winners;
};
