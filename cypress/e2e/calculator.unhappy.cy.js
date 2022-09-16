import testid from "../support/index.js";
import { ERROR_MESSAGES } from "../../src/constants";

describe("계산기 실패 케이스 테스트", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("연산자를 연속으로 누를 수 없다", () => {
    cy.get(testid`digit-5`).click();
    cy.get(testid`plus`).click();
    cy.get(testid`minus`).click();
    cy.on("window:alert", (text) => {
      expect(text).to.contains(ERROR_MESSAGES.OPERATOR_IS_CONSECUTIVE);
    });
  });

  it("enter를 눌렀을때 왼쪽 피연산자가 있어야 한다", () => {
    cy.get(testid`enter`).click();
    cy.on("window:alert", (text) => {
      expect(text).to.contains(ERROR_MESSAGES.LEFT_OPERAND_IS_EMPTY);
    });
  });

  it("enter를 눌렀을때 연산자가 있어야 한다", () => {
    cy.get(testid`digit-5`).click();
    cy.get(testid`enter`).click();
    cy.on("window:alert", (text) => {
      expect(text).to.contains(ERROR_MESSAGES.OPERATOR_IS_EMPTY);
    });
  });

  it("enter를 눌렀을때 오른쪽 피연산자가 있어야 한다", () => {
    cy.get(testid`digit-5`).click();
    cy.get(testid`plus`).click();
    cy.get(testid`enter`).click();
    cy.on("window:alert", (text) => {
      expect(text).to.contains(ERROR_MESSAGES.RIGHT_OPERAND_IS_EMPTY);
    });
  });

  it("연산자를 누르기 전에 피연산자를 먼저 입력해야 한다", () => {
    cy.get(testid`plus`).click();
    cy.on("window:alert", (text) => {
      expect(text).to.contains(ERROR_MESSAGES.LEFT_OPERAND_IS_EMPTY);
    });
  });

  it("왼쪽 피연산자는 3자리를 넘어서는 안된다", () => {
    cy.get(testid`digit-1`).click();
    cy.get(testid`digit-2`).click();
    cy.get(testid`digit-3`).click();
    cy.get(testid`digit-4`).click();
    cy.on("window:alert", (text) => {
      expect(text).to.contains(ERROR_MESSAGES.OPERAND_OVER_MAX_DIGITS);
    });
  });

  it("오른쪽 피연산자는 3자리를 넘어서는 안된다", () => {
    cy.get(testid`digit-1`).click();
    cy.get(testid`plus`).click();
    cy.get(testid`digit-1`).click();
    cy.get(testid`digit-2`).click();
    cy.get(testid`digit-3`).click();
    cy.get(testid`digit-4`).click();
    cy.on("window:alert", (text) => {
      expect(text).to.contains(ERROR_MESSAGES.OPERATOR_IS_EMPTY);
    });
  });

  it("계산 결과를 받은 이후에 연산자를 또 입력하면 안된다", () => {
    cy.get(testid`digit-1`).click();
    cy.get(testid`digit-0`).click();
    cy.get(testid`plus`).click();
    cy.get(testid`digit-1`).click();
    cy.get(testid`digit-0`).click();
    cy.get(testid`enter`).click();
    cy.get(testid`plus`).click();
    cy.get(testid`plus`).click();
    cy.on("window:alert", (text) => {
      expect(text).to.contains(ERROR_MESSAGES.OPERATOR_IS_CONSECUTIVE);
    });
  });
});
