var mixin = require("./mixin"),
    extract = require("./utils").extract;

var types = [
    "hidden", "text", "search", "tel", "url", "email", "password",
    "datetime", "date", "month", "week", "time", "datetime-local",
    "number", "range", "color", "checkbox", "radio", "file",
    "submit", "image", "reset", "button"
];

module.exports = Field;

function Field(name, type, value) {
    if (!(this instanceof Field)) {
        return new Field(name, type, value);
    }

    this.name(name).type(type).value(value);
}

Field.prototype.name = mixin.prop("name");
Field.prototype.value = mixin.prop("value");

Field.prototype.type = function (type) {
    if (types.indexOf(type) === -1) {
        throw new Error("Unrecognized Type");
    }

    this._type = type;
    return this;
};

Field.prototype.toJSON = function () {
    return extract([ "name", "type", "value" ], this, {});
};
