import arrayToNumber from "./utils/arrayToNumber.js";
import numberToArray from "./utils/numberToArray.js";

const PLUS = "plus";
const MINUS = "minus";
const MULTIPLY = "multiply";
const DIVIDE = "divide";
export const OPERATORS = [PLUS, MINUS, MULTIPLY, DIVIDE];
export const ENTER = "enter";
export const OPERANDS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
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

export const add = (a, b) => {
  return a + b;
};
export const minus = (a, b) => {
  return a - b;
};
export const multiply = (a, b) => {
  return a * b;
};
export const divide = (a, b) => {
  if (b === 0) {
    throw new Error("0으로 나눌 수 없습니다!");
  }
  return Math.floor(a / b);
};
export const isOperator = (val) => {
  return OPERATORS.includes(val);
};
export const isOperand = (val) => {
  return OPERANDS.includes(val);
};
export const isEnter = (val) => {
  return val === ENTER;
};

class Calculator {
  left = [];
  right = [];
  operator = null;
  result = null;

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

    switch (this.operator) {
      case PLUS:
        this.result += add(leftNum, rightNum);
        break;
      case MINUS:
        this.result += minus(leftNum, rightNum);
        break;
      case MULTIPLY:
        this.result += multiply(leftNum, rightNum);
        break;
      case DIVIDE:
        this.result += divide(leftNum, rightNum);
        break;
    }

    return this.result;
  }

  input(val) {
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

    // normal process
    if (isOperand(val) && this.operator === null && this.right.length === 0) {
      this.left.push(val);
      return;
    }

    if (isOperand(val) && isOperator(this.operator) && this.left.length > 0) {
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
