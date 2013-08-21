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

Entity.prototype.href = mixin.prop("href");
Entity.prototype.title = mixin.prop("title");

Entity.prototype.rel = mixin.arrayProp("rel");
Entity.prototype.cls = Entity.prototype.class = mixin.arrayProp("class");

Entity.prototype.link = mixin.arrayPropProto("links", Link);
Entity.prototype.action = mixin.arrayPropProto("actions", Action);
Entity.prototype.entity = mixin.arrayPropProto("entities", Entity);

Entity.prototype.properties = function (properties) {
    this._properties = extend(this._properties || {}, properties);
    return this;
};

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
