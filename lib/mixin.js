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
