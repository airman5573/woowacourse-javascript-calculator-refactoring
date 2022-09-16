import "./css/index.css";
import Calculator, { isEnter, isOperand, isOperator } from "./Calculator";
import { OPERATOR_SIGN } from "./constants";

const resultTextForScreen = (calculator: Calculator) => {
  const left = calculator.left.join("");
  const operator =
    calculator.operator === null ? null : OPERATOR_SIGN[calculator.operator];
  const right = calculator.right.join("");
  const result = [left, operator, right].filter((val) => !!val).join("");
  return result;
};

const handleError = (error: Error) => {
  alert(error.message);
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
    try {
      if (!isOperand(digit)) {
        throw new Error("숫자는 0 ~ 10사이어야 합니다");
      }
      calculator.input(digit);
      $total.innerHTML = resultTextForScreen(calculator);
    } catch (e: any) {
      handleError(e);
    }
  });

  $modifier.addEventListener("click", () => {
    calculator.clear();
    $total.innerHTML = "0";
  });

  $operations.addEventListener("click", (e) => {
    if (!e.target) {
      throw new Error("event target이 존재하지 않습니다");
    }
    const target = e.target as HTMLButtonElement;
    const operator = target.getAttribute("data-operation");
    try {
      if (operator === null) {
        throw new Error("data operation이 존재하지 않습니다");
      }
      if (!isOperator(operator) && !isEnter(operator)) {
        throw new Error("올바른 operator를 입력해 주세요");
      }
      calculator.input(operator);
      if (isEnter(operator)) {
        $total.innerHTML = `${calculator.result}` ?? "";
      } else {
        $total.innerHTML = resultTextForScreen(calculator);
      }
    } catch (e: any) {
      handleError(e);
    }
  });
});
