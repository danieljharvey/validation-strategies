import { left, right } from "fp-ts/lib/Either";
import { Validator } from "./FormLib";
import { Tagged } from "./Newtype";

export type ValidPassword = Tagged<"ValidPassword", string>;

const stringToChars = (str: string): string[] => {
  let chars = [];
  for (let i = 0, len = str.length; i < len; i++) {
    chars.push(str[i]);
  }
  return chars;
};

const between = (value: number, min: number, max: number): boolean =>
  value > min && value < max;

const countBetween = (min: number, max: number, str: string): number =>
  stringToChars(str).filter(char => between(char.charCodeAt(0), min, max))
    .length;

const countNumbers = (str: string) => countBetween(47, 58, str);

const countLower = (str: string) => countBetween(96, 123, str);

const countUpper = (str: string) => countBetween(64, 91, str);

export const validation: Validator<string, ValidPassword> = (val: string) => {
  let errs: string[] = [];
  if (val.length < 6) {
    errs.push("Length should be at least 6 characters");
  }
  if (val.length > 20) {
    errs.push("Should be under 20 chars");
  }
  if (countNumbers(val) < 1) {
    errs.push("Should contain at least one number");
  }
  if (countLower(val) < 3) {
    errs.push("Should contain at least 3 lower case character");
  }
  if (countUpper(val) < 1) {
    errs.push("Should contain at least 1 upper case character");
  }
  return errs.length > 0 ? left(errs) : right(val as ValidPassword);
};
