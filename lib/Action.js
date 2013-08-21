var Field = require("./Field"),
    mixin = require("./mixin"),
    utils = require("./utils");

module.exports = Action;

function Action(name, href) {
    if (!(this instanceof Action)) {
        return new Action(name, href);
    }

    this.name(name).href(href);
}

Action.prototype.name  = mixin.prop("name");
Action.prototype.href  = mixin.prop("href");
Action.prototype.title = mixin.prop("title");
Action.prototype.type  = mixin.prop("type");

Action.prototype.cls = Action.prototype["class"] = mixin.arrayProp("class");

Action.prototype.field = mixin.arrayPropProto("fields", Field);

Action.prototype.method = function (method) {
    this._method = method.toUpperCase();
    return this;
};

Action.prototype.toJSON = function () {
    var props = [ "name", "class", "method", "href", "title", "type" ],
        output = utils.extract(props, this, {});

    return utils.extractList("fields", this, output);
};
