const customAssertions = (_chai, utils) => {
  function someCustomMethod() {
    new _chai.Assertion(this._obj).to.exist;
    utils.flag(this, "insideSomeCustomChain", true);
  }

  function orginalTargetBlank() {
    assert.fail("it should never be called");
  }

  function _someCustomMethodExtension(_super) {
    return function someCustomMethodExtension() {
      if (utils.flag(this, "insideSomeCustomChain")) {
        new _chai.Assertion(this._obj).to.have.property("target", "_blank");
      } else {
        _super.apply(this, arguments);
      }
    }
  }
  _chai.Assertion.addChainableMethod("customExist", someCustomMethod);
  _chai.Assertion.addMethod("targetBlank", orginalTargetBlank);
  _chai.Assertion.overwriteMethod(
    "targetBlank",
    _someCustomMethodExtension
  );
};

if (!customAssertions.applied) {
    chai.use(customAssertions);
    customAssertions.applied = true;
}

describe("template spec", () => {
  it("currently doesn't work", () => {
    cy.visit("https://example.cypress.io");
    cy.get('[href="https://www.cypress.io"]')
      .should("to.customExist")
      .and("have.targetBlank");
  });

  it("should work like this", () => {
    cy.visit("https://example.cypress.io");
    cy.get('[href="https://www.cypress.io"]')
      .should(($el) => {
        expect($el).to.customExist().and.have.targetBlank();
      })
  });
});
