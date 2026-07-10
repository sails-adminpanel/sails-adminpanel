'use strict';
// Migration to update schema for adminizer module
// This migration updates existing tables and creates new ones for adminizer models

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
    // Add new columns to userap
    (cb) => {
      db.addColumn('userap', 'avatar', {
        type: 'text'
      }, (err) => {
        // Ignore error if column already exists
        if (err && err.message && err.message.includes('already exists')) {
          cb();
        } else {
          cb(err);
        }
      });
    },
    (cb) => {
      db.addColumn('userap', 'isConfirmed', {
        type: 'boolean'
      }, (err) => {
        // Ignore error if column already exists
        if (err && err.message && err.message.includes('already exists')) {
          cb();
        } else {
          cb(err);
        }
      });
    },

    // Remove password column from userap (not used in adminizer models)
    (cb) => {
      db.removeColumn('userap', 'password', (err) => {
        // Ignore error if column doesn't exist
        if (err && err.message && (err.message.includes('does not exist') || err.message.includes('column') && err.message.includes('not found'))) {
          cb();
        } else {
          cb(err);
        }
      });
    },

    // Update navigationap id type from text to serial (need to recreate table)
    // First, check if we need to update by dropping and recreating
    (cb) => {
      // Drop the old navigationap table if it exists with text id
      db.runSql(`
        DO $$ 
        BEGIN
          IF EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name='navigationap' 
            AND column_name='id' 
            AND data_type='text'
          ) THEN
            DROP TABLE IF EXISTS navigationap CASCADE;
          END IF;
        END $$;
      `, cb);
    },

    // Recreate navigationap table with correct schema
    (cb) => db.createTable('navigationap', {
      columns: {
        "id": {
          "type": "serial",
          "autoIncrement": true,
          "primaryKey": true
        },
        "label": {
          "type": "text",
          "unique": true
        },
        "tree": {
          "type": "json"
        },
        "createdAt": {
          "type": "timestamptz"
        },
        "updatedAt": {
          "type": "timestamptz"
        }
      },
      ifNotExists: true
    }, cb),

    // Create notificationap table
    (cb) => db.createTable('notificationap', {
      columns: {
        "id": {
          "type": "serial",
          "autoIncrement": true,
          "primaryKey": true
        },
        "title": {
          "type": "text"
        },
        "message": {
          "type": "text"
        },
        "notificationClass": {
          "type": "text"
        },
        "channel": {
          "type": "text"
        },
        "metadata": {
          "type": "json"
        },
        "createdAt": {
          "type": "timestamptz"
        },
        "updatedAt": {
          "type": "timestamptz"
        }
      },
      ifNotExists: true
    }, cb),

    // Create usernotificationap table
    (cb) => db.createTable('usernotificationap', {
      columns: {
        "id": {
          "type": "serial",
          "autoIncrement": true,
          "primaryKey": true
        },
        "userId": {
          "type": "bigint",
          "notNull": true
        },
        "notificationId": {
          "type": "bigint"
        },
        "read": {
          "type": "boolean",
          "defaultValue": false
        },
        "createdAt": {
          "type": "timestamptz"
        },
        "updatedAt": {
          "type": "timestamptz"
        }
      },
      ifNotExists: true
    }, cb),

    // Add foreign key for usernotificationap.notificationId
    (cb) => {
      db.runSql(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'usernotificationap_notificationid_fkey'
            AND table_name = 'usernotificationap'
          ) THEN
            ALTER TABLE usernotificationap 
            ADD CONSTRAINT usernotificationap_notificationid_fkey 
            FOREIGN KEY ("notificationId") 
            REFERENCES notificationap(id) 
            ON DELETE SET NULL;
          END IF;
        END $$;
      `, cb);
    },

    // Create mediamanagerap table
    (cb) => db.createTable('mediamanagerap', {
      columns: {
        "id": {
          "type": "serial",
          "autoIncrement": true,
          "primaryKey": true
        },
        "parent": {
          "type": "bigint"
        },
        "mimeType": {
          "type": "text"
        },
        "path": {
          "type": "text"
        },
        "size": {
          "type": "bigint"
        },
        "group": {
          "type": "text"
        },
        "tag": {
          "type": "text"
        },
        "url": {
          "type": "text"
        },
        "filename": {
          "type": "text"
        },
        "createdAt": {
          "type": "timestamptz"
        },
        "updatedAt": {
          "type": "timestamptz"
        }
      },
      ifNotExists: true
    }, cb),

    // Add foreign key for mediamanagerap.parent (self-reference)
    (cb) => {
      db.runSql(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'mediamanagerap_parent_fkey'
            AND table_name = 'mediamanagerap'
          ) THEN
            ALTER TABLE mediamanagerap 
            ADD CONSTRAINT mediamanagerap_parent_fkey 
            FOREIGN KEY (parent) 
            REFERENCES mediamanagerap(id) 
            ON DELETE SET NULL;
          END IF;
        END $$;
      `, cb);
    },

    // Create mediamanagermetaap table
    (cb) => db.createTable('mediamanagermetaap', {
      columns: {
        "id": {
          "type": "serial",
          "autoIncrement": true,
          "primaryKey": true
        },
        "key": {
          "type": "text"
        },
        "value": {
          "type": "json"
        },
        "isPublic": {
          "type": "boolean"
        },
        "parent": {
          "type": "bigint"
        },
        "createdAt": {
          "type": "timestamptz"
        },
        "updatedAt": {
          "type": "timestamptz"
        }
      },
      ifNotExists: true
    }, cb),

    // Add foreign key for mediamanagermetaap.parent
    (cb) => {
      db.runSql(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'mediamanagermetaap_parent_fkey'
            AND table_name = 'mediamanagermetaap'
          ) THEN
            ALTER TABLE mediamanagermetaap 
            ADD CONSTRAINT mediamanagermetaap_parent_fkey 
            FOREIGN KEY (parent) 
            REFERENCES mediamanagerap(id) 
            ON DELETE CASCADE;
          END IF;
        END $$;
      `, cb);
    },

    // Create mediamanagerassociationsap table
    (cb) => db.createTable('mediamanagerassociationsap', {
      columns: {
        "id": {
          "type": "serial",
          "autoIncrement": true,
          "primaryKey": true
        },
        "mediaManagerId": {
          "type": "text"
        },
        "model": {
          "type": "json"
        },
        "modelId": {
          "type": "json"
        },
        "widgetName": {
          "type": "text"
        },
        "sortOrder": {
          "type": "bigint"
        },
        "file": {
          "type": "bigint"
        },
        "createdAt": {
          "type": "timestamptz"
        },
        "updatedAt": {
          "type": "timestamptz"
        }
      },
      ifNotExists: true
    }, cb),

    // Add foreign key for mediamanagerassociationsap.file
    (cb) => {
      db.runSql(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'mediamanagerassociationsap_file_fkey'
            AND table_name = 'mediamanagerassociationsap'
          ) THEN
            ALTER TABLE mediamanagerassociationsap 
            ADD CONSTRAINT mediamanagerassociationsap_file_fkey 
            FOREIGN KEY (file) 
            REFERENCES mediamanagerap(id) 
            ON DELETE CASCADE;
          END IF;
        END $$;
      `, cb);
    },

  ], callback);
}

exports.down = function(db, callback) {
  async.series([
    // Drop new tables in reverse order
    (cb) => db.dropTable('mediamanagerassociationsap', cb),
    (cb) => db.dropTable('mediamanagermetaap', cb),
    (cb) => db.dropTable('mediamanagerap', cb),
    (cb) => db.dropTable('usernotificationap', cb),
    (cb) => db.dropTable('notificationap', cb),
    
    // Remove new columns from userap
    (cb) => db.removeColumn('userap', 'isConfirmed', cb),
    (cb) => db.removeColumn('userap', 'avatar', cb),
    
    // Re-add password column
    (cb) => db.addColumn('userap', 'password', { type: 'text' }, cb),
  ], callback);
};

exports._meta = {
  "version": 1
};
