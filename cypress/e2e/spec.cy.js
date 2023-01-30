import chai from 'chai'

const customAssertions = (_chai, utils) => {
  function someCustomMethod(subject) {
    new _chai.Assertion(this._obj).to.exist;
    utils.flag("insideSomeCustomChain", true);
  }
  function _someCustomMethodExtension(_super) {
    function someCustomMethodExtension(subject) {
      if (utils.flag(this, "insideSomeCustomChain")) {
        new _chai.Assertion(this._obj).to.have.property("data-testid");
      } else {
        _super.apply(this, arguments);
      }
    }
  }
  _chai.Assertion.addChainableMethod("someCustomMethod", someCustomMethod);
  _chai.Assertion.overwriteMethod(
    "overwrittenMethod",
    _someCustomMethodExtension
  );
};

chai.use(customAssertions);

describe("template spec", () => {
  it("passes", () => {
    cy.visit("https://example.cypress.io");
    cy.get('[href="/commands/querying"]')
      .should("someCustomMethod")
      .and("overwrittenMethod");
  });
});
