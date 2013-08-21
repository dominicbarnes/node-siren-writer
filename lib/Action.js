var Field = require("./Field"),
    mixin = require("./mixin"),
    utils = require("./utils");

module.exports = Action;

function Action(name, href, options) {
    if (!(this instanceof Action)) {
        return new Action(name, href, options);
    }

    this.name(name).href(href);

    for (var key in options) {
        if (key in this) {
            this[key](options[key]);
        }
    }
}

Action.prototype.name  = mixin.prop("name");
Action.prototype.href  = mixin.prop("href");
Action.prototype.title = mixin.prop("title");
Action.prototype.type  = mixin.prop("type");

Action.prototype.cls = Action.prototype["class"] = mixin.arrayProp("class");

Action.prototype.method = function (method) {
    this._method = method.toUpperCase();
    return this;
};

Action.prototype.field = function (name, type, val) {
    if (!this._fields) {
        this._fields = [];
    }

    this._fields.push(new Field(name, type, val));
    return this;
};

Action.prototype.toJSON = function () {
    var props = [ "name", "class", "method", "href", "title", "type" ],
        output = utils.extract(props, this, {});

    return utils.extractList("fields", this, output);
};
