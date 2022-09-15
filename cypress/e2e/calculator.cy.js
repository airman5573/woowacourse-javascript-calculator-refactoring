import testid from "../support/index.js";

describe("구현 결과가 요구사항과 일치해야 한다.", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("2개의 숫자에 대해 덧셈이 가능하다.", () => {
    cy.get(testid`digit-1`).click();
    cy.get(testid`digit-0`).click();
    cy.get(testid`plus`).click();
    cy.get(testid`digit-2`).click();
    cy.get(testid`digit-0`).click();
    cy.get(testid`enter`).click();

    cy.get(testid`total`).should("have.text", "30");
  });

  it("2개의 숫자에 대해 뺄셈이 가능하다.", () => {
    cy.get(testid`digit-2`).click();
    cy.get(testid`digit-0`).click();
    cy.get(testid`minus`).click();
    cy.get(testid`digit-1`).click();
    cy.get(testid`digit-0`).click();
    cy.get(testid`enter`).click();

    cy.get(testid`total`).should("have.text", "10");
  });

  it("2개의 숫자에 대해 나눗셈이 가능하다.", () => {
    cy.get(testid`digit-2`).click();
    cy.get(testid`digit-0`).click();
    cy.get(testid`divide`).click();
    cy.get(testid`digit-1`).click();
    cy.get(testid`digit-0`).click();
    cy.get(testid`enter`).click();

    cy.get(testid`total`).should("have.text", "2");
  });

  it("2개의 숫자에 대해 곱셈이 가능하다.", () => {
    cy.get(testid`digit-2`).click();
    cy.get(testid`multiply`).click();
    cy.get(testid`digit-5`).click();
    cy.get(testid`enter`).click();

    cy.get(testid`total`).should("have.text", "10");
  });

  it("AC(All Clear) 버튼을 누르면 0으로 초기화 된다", () => {
    cy.get(testid`digit-2`).click();
    cy.get(testid`digit-2`).click();
    cy.get(testid`modifier`).click();

    cy.get(testid`total`).should("have.text", "0");
  });

  it("소수점은 표현하지 않는다", () => {
    cy.get(testid`digit-1`).click();
    cy.get(testid`digit-0`).click();
    cy.get(testid`divide`).click();
    cy.get(testid`digit-3`).click();
    cy.get(testid`enter`).click();

    cy.get(testid`total`).should("have.text", "3");
  });

  it("최대 3개의 숫자만 입력 가능하다", () => {
    cy.get(testid`digit-1`).click();
    cy.get(testid`digit-2`).click();
    cy.get(testid`digit-3`).click();
    cy.get(testid`digit-4`).click();

    cy.get(testid`total`).should("have.text", "123");
  });

  it("누적계산도 가능하다", () => {
    cy.get(testid`digit-1`).click();
    cy.get(testid`digit-0`).click();
    cy.get(testid`plus`).click();
    cy.get(testid`digit-2`).click();
    cy.get(testid`digit-0`).click();
    cy.get(testid`enter`).click();
    cy.get(testid`multiply`).click();
    cy.get(testid`digit-2`).click();
    cy.get(testid`enter`).click();

    cy.get(testid`total`).should("have.text", "60");
  });
});
