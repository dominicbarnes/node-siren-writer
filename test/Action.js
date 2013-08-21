var expect = require("chai").expect,
    siren = require(".."),
    Action = siren.action,
    Field = siren.field;

describe("Action", function () {
    describe("constructor", function () {
        it("should not require the new keyword", function () {
            expect(Action()).to.be.an.instanceOf(Action);
        });

        it("should initialize name automatically", function () {
            expect(new Action("a")).to.have.property("_name", "a");
        });

        it("should initialize href automatically", function () {
            expect(new Action("a", "b")).to.have.property("_href", "b");
        });

        it("should initialize other options automatically", function () {
            var action = new Action("a", "b", {
                method: "post",
                title: "hello world"
            });

            expect(action).to.have.property("_method", "POST");
            expect(action).to.have.property("_title", "hello world");
        });

        it("should not throw an error for unrecognized options", function () {
            expect(function () {
                new Action("a", "b", {
                    foo: "bar"
                });
            }).to.not.throw(Error);
        });
    });

    describe("dynamic mixin methods", function () {
        [ "name", "href", "title", "type" ].forEach(function (prop) {
            it("should have a " + prop + " method", function () {
                expect(Action).to.respondTo(prop);
            });
        });
    });

    describe("static mixin methods", function () {
        describe("#class()", function () {
            it("should have a class method", function () {
                expect(Action).to.respondTo("class");
            });

            it("should have a 'cls' alias", function () {
                var proto = Action.prototype;
                expect(proto.class).to.equal(proto.cls);
            });
        });
    });

    describe("#method()", function () {
        var action = Action();

        it("should uppercase the input value", function () {
            action.method("get");
            expect(action).to.have.property("_method", "GET");
        });

        it("should return this and be chainable", function () {
            expect(action.method("post")).to.equal(action);
        });
    });

    describe("#field()", function () {
        var action = Action();

        beforeEach(function () {
            delete action._fields;
        });

        it("should create a _fields property", function () {
            action.field("birthday", "datetime");
            expect(action).to.have.property("_fields");
        });

        it("should append a new Field object to _fields", function () {
            action.field("email", "email");
            expect(action).to.have.deep.property("_fields[0]").that.is.an.instanceOf(Field);
        });

        it("should return this and be chainable", function () {
            expect(action.field("name", "text")).to.equal(action);
        });
    });

    describe("#toJSON()", function () {
        it("should extract simple properties", function () {
            var action = Action("a", "b")
                .class("c")
                .method("d")
                .title("e")
                .type("f");

            expect(action.toJSON()).to.eql({
                name: "a",
                href: "b",
                class: [ "c" ],
                method: "D",
                title: "e",
                type: "f"
            });
        });

        it("should extract list/object properties", function () {
            var action = Action("update", "/")
                .field("name", "text")
                .field("email", "email");

            expect(action.toJSON()).to.eql({
                name: "update",
                href: "/",
                fields: [
                    { name: "name", type: "text" },
                    { name: "email", type: "email" }
                ]
            });
        });
    });
});
