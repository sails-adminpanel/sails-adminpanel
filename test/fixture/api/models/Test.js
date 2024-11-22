/**
 * Price.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

	attributes: {
		title: {
			type: 'string',
			required: true
		},
		title_2: {
			type: 'string'
		},
		test_ck5_1: {
			type: 'string'
		},
		sort: {
			type: 'boolean'
		},
		sort_test: {
			type: 'boolean'
		},
		datatable: {
			type: 'json'
		},
		image: {
			type: 'json'
		},
		gallery: {
			type: 'json'
		},
		file: {
			type: 'json'
		},
		range: {
			type: "string",
		},
		json: {
			type: 'json'
		},
		ace: {
			type: 'json'
		},
		datetime: {
			type: 'string',
		},
		date: {
			type: 'string',
		},
		time: {
			type: 'string'
		},
		number: {
			type: 'number'
		},
		color: {
			type: 'string'
		},
		week: {
			type: 'string'
		},
		schedule: {
			type: 'json'
		},
		select: {
			type: 'string'
		},
		geojson: {
			type: 'json'
		},
		"guardedField": { "type": "string" },
		"selfAssociation": { "model": "test" }
	}
};

