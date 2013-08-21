var expect = require("chai").expect,
    Link = require("..").link;

describe("Link", function () {
    describe("constructor", function () {
        var link = Link("self", "/");

        it("should not require the new keyword", function () {
            expect(link).to.be.an.instanceOf(Link);
        });

        it("should initialize rel automatically", function () {
            expect(link).to.have.property("_rel").and.eql([ "self" ]);
        });

        it("should initialize href automatically", function () {
            expect(link).to.have.property("_href", "/");
        });
    });

    describe("dynamic mixin methods", function () {
        [ "rel", "href" ].forEach(function (prop) {
            it("should have a " + prop + " method", function () {
                expect(Link).to.respondTo(prop);
            });
        });
    });

    describe("#toJSON()", function () {
        it("should extract simple properties", function () {
            var link = Link("self", "/");

            expect(link.toJSON()).to.eql({
                rel: [ "self" ],
                href: "/"
            });
        });
    });
});
