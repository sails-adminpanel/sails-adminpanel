'use strict';

var async = require('async');
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

// Fix: groupap_users__userap_groups was created without "primaryKey: true" on id column,
// so no PRIMARY KEY constraint and no sequence DEFAULT were set.
// Waterline's replace-collection fails with "null value in column id" when assigning groups to users.

exports.up = function (db, callback) {
  async.series([
    (cb) => db.runSql(
      `DO $$
       DECLARE
         primary_key_constraint RECORD;
       BEGIN
         IF EXISTS (
           SELECT 1
           FROM information_schema.tables
           WHERE table_schema = current_schema()
             AND table_name = 'groupap_users__userap_groups'
         ) THEN

           FOR primary_key_constraint IN
             SELECT tc.constraint_name
             FROM information_schema.table_constraints tc
             WHERE tc.table_schema = current_schema()
               AND tc.table_name = 'groupap_users__userap_groups'
               AND tc.constraint_type = 'PRIMARY KEY'
           LOOP
             EXECUTE format(
               'ALTER TABLE groupap_users__userap_groups DROP CONSTRAINT %I',
               primary_key_constraint.constraint_name
             );
           END LOOP;

           IF NOT EXISTS (
             SELECT 1
             FROM information_schema.columns
             WHERE table_schema = current_schema()
               AND table_name = 'groupap_users__userap_groups'
               AND column_name = 'id'
           ) THEN
             ALTER TABLE groupap_users__userap_groups ADD COLUMN id SERIAL;
             PERFORM setval(
               'groupap_users__userap_groups_id_seq',
               COALESCE((SELECT MAX(id) FROM groupap_users__userap_groups), 0) + 1,
               false
             );
           ELSE
             CREATE SEQUENCE IF NOT EXISTS groupap_users__userap_groups_id_seq;
             UPDATE groupap_users__userap_groups
             SET id = nextval('groupap_users__userap_groups_id_seq')
             WHERE id IS NULL;
             ALTER TABLE groupap_users__userap_groups
               ALTER COLUMN id SET DEFAULT nextval('groupap_users__userap_groups_id_seq');
             ALTER TABLE groupap_users__userap_groups ALTER COLUMN id SET NOT NULL;
             PERFORM setval(
               'groupap_users__userap_groups_id_seq',
               COALESCE((SELECT MAX(id) FROM groupap_users__userap_groups), 0) + 1,
               false
             );
           END IF;

           ALTER TABLE groupap_users__userap_groups ADD PRIMARY KEY (id);
         END IF;
       END $$;`,
      cb
    ),
  ], callback);
};

exports.down = function(db, callback) {
  async.series([
    (cb) => db.removeColumn('groupap_users__userap_groups', 'id', cb),
  ], callback);
};

exports._meta = {
  "version": 1
};
