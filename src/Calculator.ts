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
    throw new Error("0으로 나눌 수 없습니다!");
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
      throw new Error("Operator가 null입니다");
    }
    if (this.left.length === 0) {
      throw new Error("왼쪽 피연산자가 없습니다");
    }
    if (this.right.length === 0) {
      throw new Error("오른쪽 피연산자가 없습니다");
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
    if (!isOperator(val) && !isOperand(val) && !isEnter(val)) {
      throw new Error(
        "연산자도 아니고 피연산자도 아니고 Enter도 아닙니다. 입력값을 다시 확인해 주세요."
      );
    }

    if (this.operator !== null && isOperator(val)) {
      throw new Error("연산자를 연속으로 입력할 수 없습니다");
    }

    if (
      isEnter(val) &&
      (this.left.length === 0 ||
        this.operator === null ||
        this.right.length === 0)
    ) {
      throw new Error("연산에 필요한 요소가 부족합니다");
    }

    if (this.result === null && this.left.length === 0 && isOperator(val)) {
      throw new Error("피연산자를 먼저 입력해 주세요");
    }

    if (isOperand(val) && this.left.length > 2 && this.operator === null) {
      throw new Error("세자리 까지만 입력 가능합니다");
    }

    if (
      isOperand(val) &&
      this.left.length > 0 &&
      this.operator !== null &&
      this.right.length > 2
    ) {
      throw new Error("세자리 까지만 입력 가능합니다");
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

    throw new Error("어떤 경우에도 해당되지 않는 입력입니다");
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
