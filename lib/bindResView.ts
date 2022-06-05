import { ViewsHelper } from "../helper/viewsHelper";
import {AccessRightsHelper} from "../helper/accessRightsHelper";

export default function bindResView() {

    let bindResFunctions = function (req, res, next) {

        /**
         * Guess view name by request
         *
         * @param {IncomingMessage} req
         * @returns {string}
         */
        let guessViewName = function (req) {
            if (!req || !req.route || !req.route.path || typeof req.route.path !== "string") {
                return '';
            }

            let routeSplit = req.route.path.split('/');
            let viewName = routeSplit.pop();
            // :instance = list
            if (viewName === ':instance') {
                viewName = 'list';
            }
            // for id we need not last name
            if (viewName === ':id') {
                viewName = routeSplit.pop();
            }
            return viewName;
        };

        /**
         * Show admin panel view.
         */
        // !TODO rewrite arguments to strong queue, without universal redefined arguments
        res.viewAdmin = function (/* specifiedPath, locals, cb_view */) {
            let specifiedPath = arguments[0];
            let locals = arguments[1];
            let cb_view = arguments[2];

            

            if (typeof arguments[0] === "object") {
                locals = arguments[0];
            }
            if (typeof arguments[1] === "function") {
                cb_view = arguments[1];
            }
            if (!specifiedPath || typeof specifiedPath !== "string") {
                specifiedPath = guessViewName(res.req);
            }
            // Set local layout to view engine
            if (sails.config.views.extension == 'ejs') {
                if (!locals) {
                    locals = {...sails.config.views.locals};
                }
                locals.layout = false;
            }

            // set theme for admin panel
            if (!locals) {
                locals = {};
            }
            locals.theme = sails.config.adminpanel.theme || 'light';
            locals.button = sails.config.adminpanel.button || 'solid';
            locals.havePermission = AccessRightsHelper.havePermission;

            if (locals.section === undefined) locals.section = 'adminpanel';

            return res.view(ViewsHelper.getViewPath(specifiedPath), locals, cb_view);
        };

        next();
    };

    // Bind to /admin
    console.log('admin > route bind > ', sails.config.adminpanel.routePrefix);
    sails.router.bind(sails.config.adminpanel.routePrefix, bindResFunctions);
    // Bind to /admin/*
    sails.router.bind(sails.config.adminpanel.routePrefix + '\/*', bindResFunctions);
    sails.emit("adminpanel:viewadmin:loaded")
};
