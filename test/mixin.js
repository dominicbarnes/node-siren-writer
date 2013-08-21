var expect = require("chai").expect,
    mixin = require("..").mixin;

describe("mixin", function () {
    describe(".prop()", function () {
        it("should return a Function", function () {
            expect(mixin.prop()).to.be.a("function");
        });

        it("should set a value to a prefixed property name", function () {
            var test = { name: mixin.prop("name") };
            test.name("test");
            expect(test).to.have.property("_name", "test");
        });

        it("should return this so it can be chainable", function () {
            var test = { name: mixin.prop("name") };
            expect(test.name("test")).to.equal(test);
        });
    });

    describe(".arrayProp()", function () {
        var test = { rel: mixin.arrayProp("rel") };

        beforeEach(function () {
            delete test._rel;
        });

        it("should return a Function", function () {
            expect(mixin.arrayProp()).to.be.a("function");
        });

        it("should create a prefixed property after first call", function () {
            expect(test).to.not.have.property("_rel");
            test.rel("a");
            expect(test).to.have.property("_rel").and.eql([ "a" ]);
        });

        it("should append all arguments to the internal array", function () {
            test.rel("a", "b", "c");
            expect(test).to.have.property("_rel").and.eql([ "a", "b", "c" ]);
        });

        it("should concat the first argument if it is an array", function () {
            test.rel([ "a", "b" ]);
            expect(test).to.have.property("_rel").and.eql([ "a", "b" ]);
        });

        it("should only append", function () {
            test.rel("a").rel("b", "c").rel([ "d", "e" ]);
            expect(test).to.have.property("_rel").and.eql([ "a", "b", "c", "d", "e" ]);
        });
    });
});
