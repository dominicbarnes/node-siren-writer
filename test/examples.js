var expect = require("chai").expect,
    siren = require("..");

describe("examples", function () {
    it("should correctly generate the example from the siren homepage", function () {
        var example = siren.entity("http://api.x.io/orders/42")
            .cls("order")
            .properties({
                orderNumber: 42,
                itemCount: 3,
                status: "pending"
            })
            .embed("http://x.io/rels/order-items", "http://api.x.io/orders/42/items", [ "items", "collection" ])
            .entity(siren.entity("http://api.x.io/customers/pj123")
                .cls("info", "customer")
                .rel("http://x.io/rels/customer")
                .properties({
                    customerId: "pj123",
                    name: "Peter Joseph"
                }))
            .action(siren.action("add-item", "http://api.x.io/orders/42/items")
                .title("Add Item")
                .method("POST")
                .type("application/x-www-form-urlencoded")
                .field("orderNumber", "hidden", "42")
                .field("productCode", "text")
                .field("quantity", "number"))
            .link("previous", "http://api.x.io/orders/41")
            .link("next", "http://api.x.io/orders/43");

        expect(example.toJSON()).to.eql(require("./support/siren-homepage.json"));
    });
});
