var expect = require("chai").expect,
    utils = require("..").utils;

describe("utils", function () {
    describe(".extract()", function () {
        it("should copy a prefixed property from a src to a dest (w/o prefix)", function () {
            var src = { _a: "A", _b: "B", _c: "C" },
                dest = {};

            utils.extract([ "a", "b", "c" ], src, dest);

            expect(dest).to.eql({
                a: "A",
                b: "B",
                c: "C"
            });
        });

        it("should return the dest object", function () {
            var dest = {};
            expect(utils.extract([], {}, dest)).to.equal(dest);
        });

        it("should ignore properties that are not found", function () {
            var src = { _a: "A" },
                dest = utils.extract([ "a", "b" ], src, {});

            expect(dest).to.eql({ a: "A" });
        });
    });

    describe(".extractList()", function () {
        var item = {
            toJSON: function () {
                return {};
            }
        };

        it("should call transform each member of an array w/ .toJSON()", function () {
            var src = { _links: [ item, item ] },
                dest = utils.extractList("links", src, {});

            expect(dest).to.eql({
                links: [ {}, {} ]
            });
        });

        it("should allow an array to be passed as the proplist", function () {
            var src = { _links: [ item, item ], _actions: [ item ] },
                dest = utils.extractList([ "links", "actions" ], src, {});

            expect(dest).to.eql({
                links: [ {}, {} ],
                actions: [ {} ]
            });
        });
    });
});
