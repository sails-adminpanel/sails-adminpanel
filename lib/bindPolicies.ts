import * as fs from "fs";
import * as path from "path";


sails.after(["hook:policies:loaded"], () => {
  // write out policies to config
  try {
    let policiesDir = fs.readdirSync(__dirname + "/../policies");
    for (let policy of policiesDir) {
      if (path.extname(policy).toLowerCase() === ".js") {
        let policyFile = require(__dirname + "/../policies/" + policy);
        if (typeof policyFile === "function" && Array.isArray(sails.config.adminpanel.policies)) {
          sails.config.adminpanel.policies.push(policyFile);
        } else {
          sails.log.error(`Adminpanel > Policy ${policyFile} is not a function`);
        }
      }
    }
  } catch (e) {
    sails.log.error("Adminpanel > Could not load policies", e);
  }
})


export default function bindPolicies(policies: string | string[] | Function | Function[], action: Function): Function | Function[] {

  /**
   * Bind policy to action
   *
   * @param {string|function} policy
   */
  function bindPolicy (policy: Function | string) {
    if (typeof policy === "function") {
      result.push(policy);
      return;
    } else if(typeof policy === "string"){
      //Check for policy existence
      if (!sails.hooks.policies.middleware[policy.toLowerCase()]) {
        sails.log.error("AdminPanel: No policy exist: " + policy);
      } else {
        result.push(sails.hooks.policies.middleware[policy.toLowerCase()]);
      }
    } else {
      sails.log.error("AdminPanel: Policy format unknown: " + policy);
    } 
  };

  let result = [];
  if (Array.isArray(policies)) {
    policies.forEach(bindPolicy);
  } else {
    bindPolicy(policies);
  }
  if (result.length === 0) {
    return action;
  }
  result.push(action);
  return result;
}
