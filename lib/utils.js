exports.extract = function (props, src, dest) {
    props.forEach(function (prop) {
        if (src["_" + prop]) {
            dest[prop] = src["_" + prop];
        }
    });

    return dest;
};

exports.extractList = function (prop, src, dest) {
    if (Array.isArray(prop)) {
        prop.forEach(function (prop) {
            exports.extractList(prop, src, dest);
        });
    } else {
        var priv = src["_" + prop];

        if (priv && priv.length) {
            dest[prop] = priv.map(function (item) {
                return item.toJSON();
            });
        }
    }

    return dest;
};
