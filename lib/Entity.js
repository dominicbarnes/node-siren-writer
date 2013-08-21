var extend = require("extend"),
    Action = require("./Action"),
    Link = require("./Link"),
    mixin = require("./mixin"),
    utils = require("./utils");

module.exports = Entity;

function Entity(href) {
    if (!(this instanceof Entity)) {
        return new Entity(href);
    }

    if (href) {
        this.link("self", href);
    }
}

Entity.prototype.rel = mixin.arrayProp("rel");
Entity.prototype.href = mixin.prop("href");
Entity.prototype.title = mixin.prop("title");
Entity.prototype.cls = Entity.prototype.class = mixin.arrayProp("class");

Entity.prototype.properties = function (properties) {
    this._properties = extend(this._properties || {}, properties);
    return this;
};

Entity.prototype.link = function (rel, href) {
    if (!this._links) {
        this._links = [];
    }

    if (rel instanceof Link) {
        this._links.push(rel);
    } else {
        this._links.push(new Link(rel, href));
    }

    return this;
};

Entity.prototype.action = function (name, href, options) {
    if (!this._actions) {
        this._actions = [];
    }

    if (name instanceof Action) {
        this._actions.push(name);
    } else {
        this._actions.push(new Action(name, href, options));
    }

    return this;
};

Entity.prototype.entity = mixin.arrayProp("entities");

Entity.prototype.embed = function (rel, href, cls) {
    var entity = Entity().rel(rel).href(href).class(cls);
    return this.entity(entity);
};

Entity.prototype.toJSON = function () {
    var output = {};

    utils.extract([ "class", "properties", "title", "rel", "href" ], this, output);
    utils.extractList([ "entities", "links", "actions" ], this, output);

    return output;
};
