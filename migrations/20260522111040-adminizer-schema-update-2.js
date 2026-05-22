'use strict';
// Migration to add missing adminizer entities:
// - userap.userApiKey column (mapped from model field "apiKey")
// - historyactionsap table
// - filterap table
// - filtercolumnap table

var async = require('async')
var dbm;
var type;
var seed;

/**
* We receive the dbmigrate dependency from dbmigrate initially.
* This enables us to not have to rely on NODE_PATH.
*/
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db, callback) {
  async.series([
    (cb) => db.addColumn('userap', 'userApiKey', {"type":"text"}, cb),

    (cb) => db.createTable('historyactionsap', {
    columns: {
    "id": {
        "type": "serial",
        "autoIncrement": true,
        "primaryKey": true
    },
    "modelId": {
        "type": "text",
        "notNull": true
    },
    "modelName": {
        "type": "text",
        "notNull": true
    },
    "action": {
        "type": "text"
    },
    "data": {
        "type": "json"
    },
    "diff": {
        "type": "json"
    },
    "user": {
        "type": "bigint"
    },
    "isCurrent": {
        "type": "boolean"
    },
    "preview": {
        "type": "boolean"
    },
    "createdAt": {
        "type": "bigint"
    },
    "updatedAt": {
        "type": "bigint"
    }
},
    ifNotExists: true
  }, cb),

    (cb) => db.addForeignKey(
      'historyactionsap', 'userap',
      'historyactionsap_user_fkey',
      { 'user': 'id' },
      { onDelete: 'SET NULL' },
      cb
    ),

    (cb) => db.createTable('filterap', {
    columns: {
    "id": {
        "type": "text",
        "primaryKey": true,
        "notNull": true
    },
    "name": {
        "type": "text",
        "notNull": true
    },
    "description": {
        "type": "text"
    },
    "modelName": {
        "type": "text",
        "notNull": true
    },
    "conditions": {
        "type": "json"
    },
    "sortField": {
        "type": "text"
    },
    "sortDirection": {
        "type": "text"
    },
    "visibility": {
        "type": "text"
    },
    "ownerId": {
        "type": "bigint"
    },
    "groupIds": {
        "type": "json"
    },
    "apiEnabled": {
        "type": "boolean"
    },
    "apiKey": {
        "type": "text"
    },
    "icon": {
        "type": "text"
    },
    "color": {
        "type": "text"
    },
    "version": {
        "type": "bigint"
    },
    "createdAt": {
        "type": "bigint"
    },
    "updatedAt": {
        "type": "bigint"
    }
},
    ifNotExists: true
  }, cb),

    (cb) => db.addForeignKey(
      'filterap', 'userap',
      'filterap_ownerid_fkey',
      { 'ownerId': 'id' },
      { onDelete: 'SET NULL' },
      cb
    ),

    (cb) => db.createTable('filtercolumnap', {
    columns: {
    "id": {
        "type": "serial",
        "autoIncrement": true,
        "primaryKey": true
    },
    "filter": {
        "type": "text"
    },
    "fieldName": {
        "type": "text",
        "notNull": true
    },
    "order": {
        "type": "bigint"
    },
    "createdAt": {
        "type": "bigint"
    },
    "updatedAt": {
        "type": "bigint"
    }
},
    ifNotExists: true
  }, cb),

    (cb) => db.addForeignKey(
      'filtercolumnap', 'filterap',
      'filtercolumnap_filter_fkey',
      { 'filter': 'id' },
      { onDelete: 'CASCADE' },
      cb
    ),

  ], callback);
}

exports.down = function (db, callback) {
  async.series([
    (cb) => db.dropTable('filtercolumnap', cb),
    (cb) => db.dropTable('filterap', cb),
    (cb) => db.dropTable('historyactionsap', cb),
    (cb) => db.removeColumn('userap', 'userApiKey', cb),
  ], callback);
};

exports._meta = {
  "version": 1
};
