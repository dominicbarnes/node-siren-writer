var mixin = require("./mixin"),
    extract = require("./utils").extract;

module.exports = Link;

function Link(rel, href) {
    if (!(this instanceof Link)) {
        return new Link(rel, href);
    }

    this.rel(rel);
    this.href(href);
}

Link.prototype.href = mixin.prop("href");

Link.prototype.rel = mixin.arrayProp("rel");

Link.prototype.toJSON = function () {
    return extract([ "rel", "href" ], this, {});
};
