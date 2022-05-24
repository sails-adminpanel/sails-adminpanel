import * as fs from "fs";
import * as path from "path";

export default function bindPolicies() {

    //write out policies to config
    try {
        let policiesDir = fs.readdirSync(__dirname + "./../policies");
        for (let policy of policiesDir) {
            if (path.extname(policy).toLowerCase() === ".js") {
                let policyFile = require(__dirname + "./../policies/" + policy);
                if (typeof policyFile === "function") {
                    sails.config.adminpanel.policies.push(policyFile);
                } else {
                    sails.log.error(`Adminpanel > Policy ${policyFile} is not a function`)
                }
            }
        }
    } catch (e) {
        sails.log.error("Adminpanel > Could not load policies", e)
    }

    return function (policies, action) {
        if (typeof policies === "function" && !action) {
            action = policies;
            policies = '';
        }

        if (!policies) {
            return action;
        }

        let result = [];
        /**
         * Bind policy to action
         *
         * @param {string|function} policy
         */
        let bindPolicy = function (policy) {
            if (typeof policy === "function") {
                result.push(policy);
                return;
            }
            //Check for policy existence
            if (!sails.hooks.policies.middleware[policy.toLowerCase()]) {
                sails.log.error('AdminPanel: No policy exist: ' + policy);
            } else {
                result.push(sails.hooks.policies.middleware[policy.toLowerCase()]);
            }
        };
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
    };
};
