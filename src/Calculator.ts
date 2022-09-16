import { ERROR_MESSAGES, MAX_DIGIT_SIZE } from "./constants";
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
    // 연속적으로 +를 입력한 경우
    if (this.operator !== null && isOperator(val)) {
      throw new Error(ERROR_MESSAGES.OPERATOR_IS_CONSECUTIVE);
    }

    // enter를 눌렀는데 왼쪽 피연산자가 없는 경우
    if (isEnter(val) && this.left.length === 0) {
      throw new Error(ERROR_MESSAGES.LEFT_OPERAND_IS_EMPTY);
    }

    // enter를 눌렀는데 연산자가 없는 경우
    if (isEnter(val) && this.operator === null) {
      throw new Error(ERROR_MESSAGES.OPERATOR_IS_EMPTY);
    }

    // enter를 눌렀는데 오른쪽 피연산자가 없는 경우
    if (isEnter(val) && this.right.length === 0) {
      throw new Error(ERROR_MESSAGES.RIGHT_OPERAND_IS_EMPTY);
    }

    // 이전 결과값이 없고 왼쪽 피연산자도 없는데 연산자를 누른 경우
    // 이전 결과값이 없는지는 왜 체크하는가? => 이전 결과깂이 있는 경우에는 왼쪽 피연산자가 없어도,
    // 연산자를 누르면 결과값이 왼쪽 피연산자로 가도록 설정해 놨기 떄문
    if (isOperator(val) && this.result === null && this.left.length === 0) {
      throw new Error(ERROR_MESSAGES.LEFT_OPERAND_IS_EMPTY);
    }

    // 피연산자를 입력 하려 하는데, 왼쪽 연산자가 이미 최대 값을 넘었다면 에러를 뿜는다
    if (
      isOperand(val) &&
      this.left.length === MAX_DIGIT_SIZE &&
      this.operator === null
    ) {
      throw new Error(ERROR_MESSAGES.OPERAND_OVER_MAX_DIGITS);
    }

    // 피연산자를 입력 하려 하는데, 오른쪽 연산자가 이미 최대 값을 넘었다면 에러를 뿜는다
    if (
      isOperand(val) &&
      this.left.length > 0 &&
      this.operator !== null &&
      this.right.length === MAX_DIGIT_SIZE
    ) {
      throw new Error(ERROR_MESSAGES.OPERAND_OVER_MAX_DIGITS);
    }

    // 피연산자를 입력하는 경우, 왼쪽에 넣는다
    if (isOperand(val) && this.operator === null && this.right.length === 0) {
      this.left.push(val);
      return;
    }

    // 피연산자를 입력하는 경우, 왼쪽이 다 찼고 연산자도 입력되어 있다면 오른쪽에 넣는다
    // TODO: 연산자를 입력하는 로직을 이 다음에 바로 넣는다
    if (isOperand(val) && this.operator !== null && this.left.length > 0) {
      this.right.push(val);
      return;
    }

    // 연산자를 입력하는 경우 왼쪽이 다 찼고 오른쪽이 비어있다면 연산자를 입력한다
    if (isOperator(val) && this.left.length > 0 && this.right.length === 0) {
      this.operator = val;
      return;
    }

    // Enter를 누른 경우 왼쪽 피연산자가 있고 연산자가 있고 오른쪽 피연산자가 있는 경우 계산을 한다
    if (isEnter(val) && this.left.length > 0 && this.right.length > 0) {
      // TODO: 연산자가 있는지도 체크한다
      this.compute();
      this.clearFormula();
      return;
    }

    // 이전에 계산된 결과가 있고, 왼쪽 피연산자, 연산자, 오른쪽 피연산자가 비어있는경우
    // 왼쪽에 피연산자를 넣고 결과는 비운다
    if (
      this.result !== null &&
      isOperand(val) &&
      this.left.length === 0 &&
      this.operator === null &&
      this.right.length === 0
    ) {
      this.left.push(val);
      this.result = null;
      return;
    }

    // 이전에 계산된 결과가 있고, 왼쪽 피연산자, 연산자, 오른쪽 피연산자가 비어있는 경우
    // 연산자를 입력한다
    if (
      this.result !== null &&
      isOperator(val) &&
      this.left.length === 0 &&
      this.operator === null &&
      this.right.length === 0
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
