"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../interfaces/global.ts" />
require("mocha");
var Sails = require("./fixture/node_modules/sails").Sails;
require("dotenv").config();
process.env.BASE_ROUTE = "/admin";
process.env.HTTP_TEST_LOCALHOST = "http://127.0.0.1:42772";
let sails;
before(function (done) {
    this.timeout(50000);
    const rc = require("./fixture/app-export").rc;
    //@ts-ignore
    function waitForEvent(sails) {
        return new Promise((resolve) => {
            sails.on('adminpanel:router:binded', resolve);
        });
    }
    Sails().lift(rc, async function (err, _sails) {
        if (err)
            return done(err);
        sails = _sails;
        console.log("Waiting 'adminpanel:router:binded' event ...");
        await waitForEvent(sails);
        return done();
    });
});
after(function (done) {
    if (sails) {
        return sails.lower(function (err) {
            if (err) {
                done();
            }
            done();
        });
    }
    done();
});
