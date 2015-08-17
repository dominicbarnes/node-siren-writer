
var clone = require('clone');
var iana = require('iana-rels');
var flatten = require('array-flatten');
var url = require('url');


module.exports = function (base) {
  return function (input) {
    return normalizeEntity(base, input);
  };
};

function normalizeEntity(base, input) {
  if (!input) return {};

  var ret = {};

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

function normalizeRel(base, input) {
  if (!input) return;
  if (!Array.isArray(input)) input = [ input ];

  return flatten(input).map(function (rel) {
    return rel in iana ? rel : url.resolve(base, rel);
  });
}

function normalizeHref(base, input) {
  if (!input) return;
  return url.resolve(base, input);
}

function normalizeClass(input) {
  if (!input) return;
  return flatten(arguments);
}

function normalizeProperties(input) {
  if (!input) return;
  return clone(input);
}

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

function normalizeLink(base, input) {
  if (!input.rel) throw new TypeError('links must have a rel');
  if (!input.href) throw new TypeError('links must have an href');

  var ret = {
    rel: normalizeRel(base, input.rel),
    href: normalizeHref(base, input.href)
  };

  var cls = normalizeClass(input.class);
  if (cls) ret.class = cls;

  if (input.title) ret.title = input.title;
  if (input.type) ret.type = input.type;

  return ret;
}

function normalizeLinks(base, input) {
  if (!input) return;
  if (!Array.isArray(input)) input = [ input ];

  return flatten(input).map(function (link) {
    return normalizeLink(base, link);
  });
}

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

function normalizeAction(base, input) {
  if (!input.name) throw new TypeError('actions must have a name');
  if (!input.href) throw new TypeError('actions must have an href');

  var ret = {
    name: input.name,
    href: normalizeHref(base, input.href)
  };

  var cls = normalizeClass(input.class);
  if (cls) ret.class = cls;

  if (input.method) ret.method = normalizeMethod(input.method);
  if (input.title) ret.title = input.title;
  if (input.type) ret.type = input.type;

  var fields = normalizeFields(input.fields);
  if (fields) ret.fields = fields;

  return ret;
}

function normalizeActions(base, input) {
  if (!input) return;
  if (!Array.isArray(input)) input = [ input ];

  return flatten(input).map(function (action) {
    return normalizeAction(base, action);
  });
}

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

function normalizeField(input) {
  if (!input.name) throw new TypeError('fields must have a name');

  var ret = { name: input.name };

  var cls = normalizeClass(input.class);
  if (cls) ret.class = cls;

  if (input.type) ret.type = normalizeType(input.type);
  if (input.value) ret.value = input.value;
  if (input.title) ret.title = input.title;

  return ret;
}

function normalizeFields(input) {
  if (!input) return;
  if (!Array.isArray(input)) input = [ input ];

  return flatten(input).map(normalizeField);
}
