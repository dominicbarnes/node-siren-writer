exports.prop = function (prop) {
    return function (value) {
        this["_" + prop] = value;
        return this;
    };
};

exports.arrayProp = function (prop) {
    return function (value) {
        var priv = "_" + prop,
            args = [].slice.call(arguments);

        if (!this[priv]) {
            this[priv] = [];
        }

        this[priv] = this[priv].concat(Array.isArray(value) ? value : args);

        return this;
    };
};

exports.arrayPropProto = function (prop, proto) {
    return function (object) {
        var priv = "_" + prop;

        if (!this[priv]) {
            this[priv] = [];
        }

        if (object instanceof proto) {
            this[priv].push(object);
        } else {
            this[priv].push(proto.apply(null, arguments));
        }

        return this;
    };
};
