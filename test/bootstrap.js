"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
var Sails = require("./fixture/node_modules/sails").Sails;
require("dotenv").config();
process.env.BASE_ROUTE = "/admin";
process.env.HTTP_TEST_LOCALHOST = "http://127.0.0.1:42772";
before(function (done) {
    this.timeout(50000);
    require("./fixture/app-export");
    Sails().lift({}, function (err, _sails) {
        if (err)
            return done(err);
        global.sails = _sails;
        return done();
    });
});
after(function (done) {
    if (global.sails) {
        return global.sails.lower(function (err) {
            if (err) {
                done();
            }
            done();
        });
    }
    done();
});
