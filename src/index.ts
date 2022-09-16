import "./css/index.css";
import Calculator, {
  divide,
  isEnter,
  isOperand,
  isOperator,
  Operand,
} from "./Calculator";
import { OPERATOR_SIGN } from "./constants";

const resultTextForScreen = (calculator: Calculator) => {
  const result = [
    calculator.left.join(""),
    calculator.operator === null ? null : OPERATOR_SIGN[calculator.operator],
    calculator.right.join(""),
  ]
    .filter((val) => !!val)
    .join("");
  return result;
};

document.addEventListener("DOMContentLoaded", () => {
  const calculator = new Calculator();

  const $app = document.querySelector("#app");
  const $total = $app?.querySelector("#total");
  const $digits = $app?.querySelector(".digits");
  const $modifier = $app?.querySelector(".modifier");
  const $operations = $app?.querySelector(".operations");

  if (!$app || !$total || !$digits || !$modifier || !$operations) {
    throw new Error("계산기 UI가 존재하지 않습니다");
  }

  $digits.addEventListener("click", (e: Event) => {
    if (!e.target) {
      throw new Error("event target이 존재하지 않습니다");
    }
    const target = e.target as HTMLButtonElement;

    const digit = parseInt(target.innerText, 10);
    if (!isOperand(digit)) {
      throw new Error("숫자는 0 ~ 10사이어야 합니다");
    }
    try {
      calculator.input(digit);
      $total.innerHTML = resultTextForScreen(calculator);
    } catch (e) {
      console.error(e);
    }
  });

  if (!$modifier) {
    throw new Error(".modifier 엘리먼트가 존재하지 않습니다");
  }
  $modifier.addEventListener("click", () => {
    calculator.clear();
    $total.innerHTML = "0";
  });

  if (!$operations) {
    throw new Error(".operations 엘리먼트가 존재하지 않습니다");
  }
  $operations.addEventListener("click", (e) => {
    if (!e.target) {
      throw new Error("event target이 존재하지 않습니다");
    }
    const target = e.target as HTMLButtonElement;
    const operator = target.getAttribute("data-operation");
    if (operator === null) {
      throw new Error("data operation이 존재하지 않습니다");
    }
    if (!isOperator(operator) && !isEnter(operator)) {
      throw new Error("올바른 operator를 입력해 주세요");
    }
    try {
      calculator.input(operator);
      if (isEnter(operator)) {
        $total.innerHTML = `${calculator.result}` ?? "";
      } else {
        $total.innerHTML = resultTextForScreen(calculator);
      }
    } catch (e) {
      console.error(e);
    }
  });
});
