export const OPERATOR_SIGN = {
  plus: "+",
  minus: "-",
  multiply: "*",
  divide: "/",
};

export const MAX_DIGIT_SIZE = 3;

export const ERROR_MESSAGES = {
  OPERATOR_IS_EMPTY: "연산자를 입력해주세요",
  LEFT_OPERAND_IS_EMPTY: "왼쪽 피연산자를 먼저 입력해 주세요",
  RIGHT_OPERAND_IS_EMPTY: "오른쪽 피연산자를 입력해 주세요",
  ALL_INPUT_VALUES_ARE_INVALID: "올바른 값을 입력해 주세요",
  OPERATOR_IS_CONSECUTIVE: "연산자를 연속으로 입력할 수 없습니다",
  INSUFFICIENT_INPUT_VALUE_FOR_OPERATION: "계산에 필요한 요소가 부족합니다",
  OPERAND_OVER_MAX_DIGITS: `피연산자는 ${MAX_DIGIT_SIZE}자리 까지만 입력 가능합니다`,
  DIVIDE_BY_ZERO: "0으로 나눌 수 없습니다!",
};
