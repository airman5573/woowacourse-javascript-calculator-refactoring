import "./css/index.css";
import Calculator, { isEnter } from "./Calculator";
import { OPERATOR_SIGN } from "./constants";

const resultTextForScreen = (calculator) => {
  const result = [
    calculator.left.join(""),
    OPERATOR_SIGN[calculator.operator],
    calculator.right.join(""),
  ]
    .filter((val) => !!val)
    .join("");
  return result;
};

document.addEventListener("DOMContentLoaded", () => {
  const calculator = new Calculator();

  const $app = document.querySelector("#app");
  const $total = $app.querySelector("#total");
  const $digits = $app.querySelector(".digits");
  $digits.addEventListener("click", (e) => {
    const digit = parseInt(e.target.innerText, 10);
    try {
      calculator.input(digit);
      $total.innerHTML = resultTextForScreen(calculator);
    } catch (e) {
      console.error(e);
    }
  });

  const $modifier = $app.querySelector(".modifier");
  $modifier.addEventListener("click", () => {
    calculator.clear();
    $total.innerHTML = "0";
  });

  const $operations = $app.querySelector(".operations");
  $operations.addEventListener("click", (e) => {
    const operation = e.target.getAttribute("data-operation");
    try {
      calculator.input(operation);
      if (isEnter(operation)) {
        $total.innerHTML = calculator.result;
      } else {
        $total.innerHTML = resultTextForScreen(calculator);
      }
    } catch (e) {
      console.error(e);
    }
  });
});
