var expect = require("chai").expect,
    Field = require("..").field;

describe("Field", function () {
    describe("constructor", function () {
        var field = Field("name", "text", "value");

        it("should not require the new keyword", function () {
            expect(field).to.be.an.instanceOf(Field);
        });

        it("should initialize name automatically", function () {
            expect(field).to.have.property("_name", "name");
        });

        it("should initialize type automatically", function () {
            expect(field).to.have.property("_type", "text");
        });

        it("should initialize value automatically", function () {
            expect(field).to.have.property("_value", "value");
        });
    });

    describe("dynamic mixin methods", function () {
        [ "name", "value" ].forEach(function (prop) {
            it("should have a " + prop + " method", function () {
                expect(Field).to.respondTo(prop);
            });
        });
    });

    describe("#type()", function () {
        it("should throw Error for input types not defined in HTML5", function () {
            expect(function () {
                Field("a", "b", "c");
            }).to.throw(Error);
        });
    });

    describe("#toJSON()", function () {
        it("should extract simple properties", function () {
            var field = Field("name", "text", "value");

            expect(field.toJSON()).to.eql({
                name: "name",
                type: "text",
                value: "value"
            });
        });
    });
});
