
'use strict';

var clone = require('clone');
var iana = require('iana-rels');
var flatten = require('array-flatten');
var url = require('url');


/**
 * Initializes a function that uses `base` for all the internal normalize
 * methods.
 *
 * @param {String} base  The base URL for this API.
 * @return {Function}
 */
module.exports = function (base) {
  return function (input) {
    return normalizeEntity(base, input);
  };
};

/**
 * Takes the `input` entity object and normalizes it into a valid siren object.
 *
 * @param {String} base   The base URL for this API.
 * @param {Object} input  The entity object to normalize.
 * @return {Object}
 */
function normalizeEntity(base, input) {
  if (!input) return {};

  var ret = clone(input);

  var cls = normalizeClass(input.class);
  if (cls) ret.class = cls;

  var props = normalizeProperties(input.properties);
  if (props) ret.properties = props;

  var entities = normalizeEntities(base, input.entities);
  if (entities) ret.entities = entities;

  var links = normalizeLinks(base, input.links);
  if (links) ret.links = links;

  var actions = normalizeActions(base, input.actions);
  if (actions) ret.actions = actions;

  if (input.title) ret.title = input.title;

  return ret;
}

/**
 * Takes the `input` rel value and normalizes it into a valid array.
 *
 * @param {String} base  The base URL for this API.
 * @param {Mixed} input  The rel value to normalize.
 * @return {Array}
 */
function normalizeRel(base, input) {
  if (!input) return;
  if (!Array.isArray(input)) input = [ input ];

  return flatten(input).map(function (rel) {
    return rel in iana ? rel : url.resolve(base, rel);
  });
}

/**
 * Takes the `input` href value and normalizes it into an absolute url.
 *
 * @param {String} base  The base URL for this API.
 * @param {Mixed} input  The href value to normalize.
 * @return {String}
 */
function normalizeHref(base, input) {
  if (!input) return;
  return url.resolve(base, input);
}

/**
 * Takes the `input` class value and normalizes it into a single array.
 *
 * @param {Object} input  The href value to normalize.
 * @return {String}
 */
function normalizeClass(input) {
  if (!input) return;
  return flatten.from(arguments);
}

/**
 * Takes the `input` properties value and normalizes it into a single object.
 *
 * @param {Mixed} input  The properties value to normalize.
 * @return {Object}
 */
function normalizeProperties(input) {
  if (!input) return;

  if (Array.isArray(input)) {
    return flatten(input).reduce(function (acc, o) {
      return Object.assign(acc, o);
    }, {});
  }

  return clone(input);
}

/**
 * Takes the `input` entities value and normalizes it into a single array.
 *
 * @param {String} base  The base URL for this API.
 * @param {Mixed} input  The entities value to normalize.
 * @return {Array}
 */
function normalizeEntities(base, input) {
  if (!input) return;
  if (!Array.isArray(input)) input = [ input ];

  return flatten(input).map(function (entity) {
    if (!entity.rel) throw new TypeError('sub-entities must have a rel');

    var ret = normalizeEntity(base, entity);
    ret.rel = normalizeRel(base, entity.rel);
    if (entity.href) ret.href = normalizeHref(base, entity.href);

    return ret;
  });
}

/**
 * Takes the `input` link value and normalizes it into a single object.
 *
 * @param {String} base   The base URL for this API.
 * @param {Object} input  The link value to normalize.
 * @return {Object}
 */
function normalizeLink(base, input) {
  if (!input.rel) throw new TypeError('links must have a rel');
  if (!input.href) throw new TypeError('links must have an href');

  var ret = clone(input);

  ret.rel = normalizeRel(base, input.rel);
  ret.href = normalizeHref(base, input.href);

  var cls = normalizeClass(input.class);
  if (cls) ret.class = cls;

  return ret;
}

/**
 * Takes the `input` links value and normalizes it into a single array.
 *
 * @param {String} base   The base URL for this API.
 * @param {Object} input  The links value to normalize.
 * @return {Array}
 */
function normalizeLinks(base, input) {
  if (!input) return;
  if (!Array.isArray(input)) input = [ input ];

  return flatten(input).map(function (link) {
    return normalizeLink(base, link);
  });
}

/**
 * Takes the `input` method value and normalizes it into a consistent string.
 *
 * @param {String} input  The method value to normalize.
 * @return {String}
 */
function normalizeMethod(input) {
  if (!input) return;

  var method = input.toUpperCase();

  switch (method) {
  case 'GET':
  case 'POST':
  case 'PUT':
  case 'PATCH':
  case 'DELETE':
    return method;

  default:
    throw new RangeError('http method ' + input + ' not supported');
  }
}

/**
 * Takes the `input` action value and normalizes it into a single object.
 *
 * @param {String} base   The base URL for this API.
 * @param {Object} input  The action value to normalize.
 * @return {Object}
 */
function normalizeAction(base, input) {
  if (!input.name) throw new TypeError('actions must have a name');
  if (!input.href) throw new TypeError('actions must have an href');

  var ret = clone(input);

  ret.href = normalizeHref(base, input.href);
  if (input.method) ret.method = normalizeMethod(input.method);

  var cls = normalizeClass(input.class);
  if (cls) ret.class = cls;

  var fields = normalizeFields(input.fields);
  if (fields) ret.fields = fields;

  return ret;
}

/**
 * Takes the `input` actions value and normalizes it into a single array.
 *
 * @param {String} base  The base URL for this API.
 * @param {Mixed} input  The links value to normalize.
 * @return {Array}
 */
function normalizeActions(base, input) {
  if (!input) return;
  if (!Array.isArray(input)) input = [ input ];

  return flatten(input).map(function (action) {
    return normalizeAction(base, action);
  });
}

/**
 * Takes the `input` type value and ensures it is a valid value.
 *
 * @param {String} input  The type value to normalize.
 * @return {String}
 */
function normalizeType(input) {
  if (!input) return;

  switch (input) {
  case 'hidden':
  case 'text':
  case 'search':
  case 'tel':
  case 'url':
  case 'email':
  case 'password':
  case 'datetime':
  case 'date':
  case 'month':
  case 'week':
  case 'time':
  case 'datetime-local':
  case 'number':
  case 'range':
  case 'color':
  case 'checkbox':
  case 'radio':
  case 'file':
    return input;

  default:
    throw new RangeError('field type ' + input + ' not supported');
  }
}

/**
 * Takes the `input` link value and normalizes it into a single object.
 *
 * @param {Object} input  The field value to normalize.
 * @return {Object}
 */
function normalizeField(input) {
  if (!input.name) throw new TypeError('fields must have a name');

  var ret = clone(input);

  if (input.type) ret.type = normalizeType(input.type);

  var cls = normalizeClass(input.class);
  if (cls) ret.class = cls;

  return ret;
}

/**
 * Takes the `input` fields value and normalizes it into a single array.
 *
 * @param {Mixed} input  The links value to normalize.
 * @return {Array}
 */
function normalizeFields(input) {
  if (!input) return;
  if (!Array.isArray(input)) input = [ input ];

  return flatten(input).map(normalizeField);
}
