import { ERROR_MESSAGES } from "./constants";
import arrayToNumber from "./utils/arrayToNumber";
import numberToArray from "./utils/numberToArray";

const PLUS = "plus";
const MINUS = "minus";
const MULTIPLY = "multiply";
const DIVIDE = "divide";
export const ENTER = "enter" as const;
export const OPERATORS = [PLUS, MINUS, MULTIPLY, DIVIDE] as const;
export const OPERANDS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
export const COMPUTE_STATUS = {
  SUCCESS: {
    LEFT_INPUT: 201,
    OPERATOR_INPUT: 202,
    RIGHT_INPUT: 203,
  },
  FAIL: {
    CONSECUTIVE_OPERATOR: 401,
  },
};
export type Enter = typeof ENTER;
export type Operator = typeof OPERATORS[number];
export type Operand = typeof OPERANDS[number];
export type ValueType = Operator | Operand | Enter;

export const add = (a: number, b: number): number => {
  return a + b;
};
export const minus = (a: number, b: number): number => {
  return a - b;
};
export const multiply = (a: number, b: number): number => {
  return a * b;
};
export const divide = (a: number, b: number): number => {
  if (b === 0) {
    throw new Error(ERROR_MESSAGES.DIVIDE_BY_ZERO);
  }
  return Math.floor(a / b);
};
export const isOperator = (val: number | string): val is Operator => {
  return OPERATORS.findIndex((value) => value === val) > -1;
};
export const isOperand = (val: number | string): val is Operand => {
  return OPERANDS.findIndex((value) => value === val) > -1;
};
export const isEnter = (val: number | string): val is Enter => {
  return val === ENTER;
};

class Calculator {
  left: Array<number> = [];
  right: Array<number> = [];
  operator: Operator | null = null;
  result: number | null = null;

  compute() {
    if (this.operator === null) {
      throw new Error(ERROR_MESSAGES.OPERATOR_IS_EMPTY);
    }
    if (this.left.length === 0) {
      throw new Error(ERROR_MESSAGES.LEFT_OPERAND_IS_EMPTY);
    }
    if (this.right.length === 0) {
      throw new Error(ERROR_MESSAGES.RIGHT_OPERAND_IS_EMPTY);
    }

    const leftNum = arrayToNumber(this.left);
    const rightNum = arrayToNumber(this.right);
    let result = this.result ?? 0;
    switch (this.operator) {
      case PLUS:
        result += add(leftNum, rightNum);
        break;
      case MINUS:
        result += minus(leftNum, rightNum);
        break;
      case MULTIPLY:
        result += multiply(leftNum, rightNum);
        break;
      case DIVIDE:
        result += divide(leftNum, rightNum);
        break;
    }
    this.result = Math.floor(result);
    return this.result;
  }

  input(val: ValueType) {
    // error handling
    if (this.operator !== null && isOperator(val)) {
      throw new Error(ERROR_MESSAGES.OPERATOR_IS_CONSECUTIVE);
    }

    if (isEnter(val) && this.left.length === 0) {
      throw new Error(ERROR_MESSAGES.LEFT_OPERAND_IS_EMPTY);
    }

    if (isEnter(val) && this.operator === null) {
      throw new Error(ERROR_MESSAGES.OPERATOR_IS_EMPTY);
    }

    if (isEnter(val) && this.right.length === 0) {
      throw new Error(ERROR_MESSAGES.RIGHT_OPERAND_IS_EMPTY);
    }

    if (isOperand(val) && this.left.length > 2 && this.operator === null) {
      throw new Error(ERROR_MESSAGES.OPERAND_OVER_MAX_DIGITS);
    }

    if (this.result === null && this.left.length === 0 && isOperator(val)) {
      throw new Error(ERROR_MESSAGES.LEFT_OPERAND_IS_EMPTY);
    }

    if (
      isOperand(val) &&
      this.left.length > 0 &&
      this.operator !== null &&
      this.right.length > 2
    ) {
      throw new Error(ERROR_MESSAGES.OPERAND_OVER_MAX_DIGITS);
    }

    // normal process
    if (isOperand(val) && this.operator === null && this.right.length === 0) {
      this.left.push(val);
      return;
    }

    if (isOperand(val) && this.operator !== null && this.left.length > 0) {
      this.right.push(val);
      return;
    }

    if (isOperator(val) && this.left.length > 0 && this.right.length === 0) {
      this.operator = val;
      return;
    }

    if (isEnter(val) && this.left.length > 0 && this.right.length > 0) {
      this.compute();
      this.clearFormula();
      return;
    }

    // consecutive calculate process
    if (
      this.result !== null &&
      this.left.length === 0 &&
      this.operator === null &&
      this.right.length === 0 &&
      isOperand(val)
    ) {
      this.left.push(val);
      this.result = null;
      return;
    }

    if (
      this.result !== null &&
      this.left.length === 0 &&
      this.operator === null &&
      this.right.length === 0 &&
      isOperator(val)
    ) {
      this.left = numberToArray(this.result);
      this.result = null;
      this.operator = val;
      return;
    }
  }

  clearFormula() {
    this.left = [];
    this.operator = null;
    this.right = [];
  }

  clear() {
    this.clearFormula();
    this.result = null;
  }
}

export default Calculator;
