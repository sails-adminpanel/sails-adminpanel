import { AdminUtil } from "../lib/adminUtil";
let requestProcessor = require('../lib/requestProcessor');
import { FieldsHelper } from "../helper/fieldsHelper";

export default async function list(req, res) {
    let instance = AdminUtil.findInstanceObject(req);
    if (!instance.model) {
        return res.notFound();
    }

    //Limit check
    if (typeof instance.config.list.limit !== "number") {
        req._sails.log.error('Admin list error: limit option should be a number. Received: ', instance.config.list.limit);
        instance.config.list.limit = 15;
    }

    //Check page
    let page = req.param('page') || 1;
    if (isFinite(page)) {
        page = parseInt(page) || 1;
    }

    if (!sails.adminpanel.havePermission(req, instance.config, __filename)) {
        return res.redirect('/admin/userap/login');
    }

    if (sails.config.adminpanel.auth) {
        req.locals.user = req.session.UserAP;
    }

    let total = 0;
    let records = [];
    let fields = FieldsHelper.getFields(req, instance, 'list');

    //Processing sorting
    //Fetch total records for page
    try {
        total = await instance.model.count();
        console.log('admin > list > count > ', total);

        // Loading list of records for page
        let query = await instance.model.find();

        if (req.sort) {
            await query.sort(req.sort.key + ' ' + req.sort.order);
        }

        FieldsHelper.getFieldsToPopulate(fields).forEach(function(val) {
            query.populate(val);
        });

        console.log('admin > list > page / limit ', page, instance.config.list.limit);
        records = await query.paginate(page - 1, instance.config.list.limit || 15)
    } catch (e) {
        req._sails.log.error('Admin list error: ');
        req._sails.log.error(e);
        return res.serverError(e);
    }

    console.log("Fields: ", fields);
    res.viewAdmin({
        requestProcessor: requestProcessor,
        instance: instance,
        list: records,
        fields: fields,
        config: sails.adminpanel
    });

};
