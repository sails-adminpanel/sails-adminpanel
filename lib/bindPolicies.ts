export default function bindPolicies() {

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
