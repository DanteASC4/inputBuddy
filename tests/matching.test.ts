import {
  buildBigrams,
  cleanText,
  diceCoefficient,
  fuzzyScorer,
} from "@u/matching";
import { describe, expect, it } from "vitest";

describe("dice coefficient matching", () => {
  it("should normalize text correctly", () => {
    expect(cleanText("   Hello World!   ")).toBe("helloworld");
    expect(cleanText("First Name")).toBe("firstname");
    expect(cleanText("Name (First)")).toBe("namefirst");
  });

  it("should build bigrams correctly", () => {
    expect(Array.from(buildBigrams("firstname"))).toEqual([
      "fi",
      "ir",
      "rs",
      "st",
      "tn",
      "na",
      "am",
      "me",
    ]);
  });

  it("should calculate the correct dice coefficient", () => {
    expect(diceCoefficient("First Name", "first-name")).toBe(1);
  });

  it("should handle inversions", () => {
    expect(diceCoefficient("First Name", "Name (First)")).toBeGreaterThan(0.4);
  });

  it("should return 0.0 for completely different pairs of strings", () => {
    expect(diceCoefficient("Phone Number", "Password")).toBe(0.0);
  });

  it("should return 0.0 for pairs of strings that are too short", () => {
    expect(diceCoefficient("A", "A")).toBe(0.0);
  });
});

describe("fuzzy matching", () => {
  it("should work", () => {
    console.log(fuzzyScorer("phone", "peohn"));
    console.log(fuzzyScorer('first name', 'legal name'));
    console.log(fuzzyScorer('first name', 'firgal name'));
    console.log(fuzzyScorer('name', 'firgal name'));
    expect(fuzzyScorer("phone", "peohn")).toBeLessThanOrEqual(0.2);
    expect(fuzzyScorer("phone", "phone")).toBeGreaterThanOrEqual(1);
  });
});
