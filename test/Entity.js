var expect = require("chai").expect,
    siren = require(".."),
    Entity = siren.entity,
    Action = siren.action,
    Link = siren.link;

describe("Entity", function () {
    describe("constructor", function () {
        it("should not require the new keyword", function () {
            expect(Entity()).to.be.an.instanceOf(Entity);
        });

        it("should initialize a link with a self href automatically", function () {
            var entity = Entity("a");
            expect(entity).to.have.deep.property("_links[0]._rel[0]", "self");
            expect(entity).to.have.deep.property("_links[0]._href", "a");
        });
    });

    describe("dynamic mixin methods", function () {
        [ "rel", "href", "title", "entity", "link", "action", "entity" ].forEach(function (prop) {
            it("should have a " + prop + " method", function () {
                expect(Entity).to.respondTo(prop);
            });
        });
    });

    describe("static mixin methods", function () {
        describe("#class()", function () {
            it("should have a class method", function () {
                expect(Entity).to.respondTo("class");
            });

            it("should have a 'cls' alias", function () {
                var proto = Entity.prototype;
                expect(proto.class).to.equal(proto.cls);
            });
        });
    });

    describe("#properties()", function () {
        it("should create a new object", function () {
            var entity = Entity().properties({ a: "A" });
            expect(entity).to.have.property("_properties").and.eql({ a: "A" });
        });
    });

    describe("#embed()", function () {
        it("should create a nested entity with: rel, href, class", function () {
            var entity = Entity("/");
            entity.embed("sub", "/sub-resource", "child");
            expect(entity._entities[0].toJSON()).to.eql({
                rel: [ "sub" ],
                href: "/sub-resource",
                class: [ "child" ]
            });
        });
    });

    describe("#toJSON()", function () {
        it("should extract simple properties", function () {
            var entity = Entity("a")
                .class("b")
                .properties({ c: "C" })
                .title("d");

            expect(entity.toJSON()).to.eql({
                class: [ "b" ],
                properties: { c: "C" },
                title: "d",
                links: [
                    { rel: [ "self" ], href: "a" }
                ]
            });
        });

        it("should extract list properties", function () {
            var entity = Entity("a")
                .link("b", "c")
                .link("d", "e")
                .action("f", "g")
                .action("h", "i");

            expect(entity.toJSON()).to.eql({
                actions: [
                    { name: "f", href: "g" },
                    { name: "h", href: "i" }
                ],
                links: [
                    { rel: [ "self" ], href: "a" },
                    { rel: [ "b" ], href: "c" },
                    { rel: [ "d" ], href: "e" }
                ]
            });
        });
    });
});
