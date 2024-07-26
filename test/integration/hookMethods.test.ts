import "mocha";
import { expect } from "chai";

describe('Hook methods sails.adminpanel...', function () {
  it("addModelConfig", async function () {
    let testModel = {
      test: {
        title: "test",
        model: "test",
        icon: "test"
      }
    }

    sails.hooks.adminpanel.addModelConfig(testModel);
    expect(sails.config.adminpanel.models.test.title).to.equal("test")
  })
})
