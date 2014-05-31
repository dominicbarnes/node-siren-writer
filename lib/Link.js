var mixin = require("./mixin"),
    extract = require("./utils").extract;

module.exports = Link;

function Link(rel, href, title) {
    if (!(this instanceof Link)) {
        return new Link(rel, href, title);
    }

    this.rel(rel);
    this.href(href);
    this.title(title);
}

Link.prototype.href = mixin.prop("href");

Link.prototype.rel = mixin.arrayProp("rel");

Link.prototype.title = mixin.prop("title");

Link.prototype.toJSON = function () {
    return extract([ "rel", "href", "title" ], this, {});
};
