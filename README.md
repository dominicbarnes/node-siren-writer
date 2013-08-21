node-siren-writer
=================

A Siren Hypermedia Object Generator for Node

   $ npm install siren-writer

# Example

````javascript
var siren = require("siren-writer");

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

console.log(example.toJSON());
````

will produce the [example](https://github.com/kevinswiber/siren#example) from
the [Siren homepage](https://github.com/kevinswiber/siren):

````json
{
  "class": [ "order" ],
  "properties": {
      "orderNumber": 42,
      "itemCount": 3,
      "status": "pending"
  },
  "entities": [
    {
      "class": [ "items", "collection" ],
      "rel": [ "http://x.io/rels/order-items" ],
      "href": "http://api.x.io/orders/42/items"
    },
    {
      "class": [ "info", "customer" ],
      "rel": [ "http://x.io/rels/customer" ],
      "properties": {
        "customerId": "pj123",
        "name": "Peter Joseph"
      },
      "links": [
        { "rel": [ "self" ], "href": "http://api.x.io/customers/pj123" }
      ]
    }
  ],
  "actions": [
    {
      "name": "add-item",
      "title": "Add Item",
      "method": "POST",
      "href": "http://api.x.io/orders/42/items",
      "type": "application/x-www-form-urlencoded",
      "fields": [
        { "name": "orderNumber", "type": "hidden", "value": "42" },
        { "name": "productCode", "type": "text" },
        { "name": "quantity", "type": "number" }
      ]
    }
  ],
  "links": [
    { "rel": [ "self" ], "href": "http://api.x.io/orders/42" },
    { "rel": [ "previous" ], "href": "http://api.x.io/orders/41" },
    { "rel": [ "next" ], "href": "http://api.x.io/orders/43" }
  ]
}
````


# API

## Object Creation

### siren.entity(href)

Creates a new [`Entity`](https://github.com/kevinswiber/siren#entity) object.
Allows for setting `href` during initialization.

### siren.link(rel, href)

Creates a new [`Link`](https://github.com/kevinswiber/siren#links-1) object.
Allows for setting `rel` and `href` during initialization.

### siren.action(name, href)

Creates a new [`Action`](https://github.com/kevinswiber/siren#actions-1) object.
Allows for setting `name` and `href` during initialization.

### siren.field(name, type, value)

Creates a new [`Field`](https://github.com/kevinswiber/siren#fields-1) object.
Allows for setting all properties (`name`, `type` and `value`) during
initialization.


## Object Methods

All object types will have a `toJSON()` method that turns the objet into a
valid `application/vnd.siren+json` object.

The vast majority of the methods available on all object types can be put into
1 of 3 categories:

 1. Property Modifiers
 2. Simple List Builders
 3. Complex List Builders

Property Modifiers are a single value, such as an `href`. Calling the method
multiple times on the same object simply overwrite the previous value.

Simple List Builders create an `Array` of simple values, such as a `class`
or `rel`. The first call creates the array, subsequent calls append to that
same array. For these methods, if an `Array` is passed as the first argument,
then than `Array` is used and other arguments end up being ignored. (rather
than flattened)

````javascript
siren.entity()
    .rel("a")           // create: adds a single value ("a")
    .rel("b", "c")      // appends: adding "b" and "c"
    .rel([ "d", "e" ]); // appends: adding "d" and "e"

// resulting rel value: [ "a", "b", "c", "d", "e" ]
````

Complex List Builders also create an `Array`, however instead of simple values,
this list is composed of nested objects. (such as a collection of links or
actions within an entity) The arguments used in this function are passed to the
constructor for that object type.

````javascript
siren.entity()
    // both of these methods have the same effect
    .link("self", "/")
    .link(siren.link("self", "/"));
````

### [Entity](https://github.com/kevinswiber/siren#entities)

**Property Modifiers:**

 * `href(href)`: [`href`](https://github.com/kevinswiber/siren#href)
 * `title(title)`: [`title`](https://github.com/kevinswiber/siren#title)

**Simple List Builders**

 * `rel(...rel)`: [`rel`](https://github.com/kevinswiber/siren#rel)
 * `class(...class)` or `cls(...class)`: [`class`](https://github.com/kevinswiber/siren#class-1)

**Complex List Builders**

 * `link(rel, href)`: [`links`](https://github.com/kevinswiber/siren#links)
 * `action(name, href)`: [`actions`](https://github.com/kevinswiber/siren#actions)
 * `entity(href)`: [`entities`](https://github.com/kevinswiber/siren#entities-1)

**Other Methods**

 * `properties(props)`: Uses [extend](https://npmjs.org/package/extend) to set [properties](https://github.com/kevinswiber/siren#properties)
 * `embed(rel, href, cls)`: Adds an [Embedded Link](https://github.com/kevinswiber/siren#embedded-link) to `entities`


### [Link](https://github.com/kevinswiber/siren#links-1)

**Property Modifiers:**

 * `href(href)`: [`href`](https://github.com/kevinswiber/siren#href-1)

**Simple List Builders**

 * `rel(...rel)`: [`rel`](https://github.com/kevinswiber/siren#rel-1)


### [Action](https://github.com/kevinswiber/siren#actions-1)

**Property Modifiers:**

 * `name(name)`: [`name`](https://github.com/kevinswiber/siren#name)
 * `href(href)`: [`href`](https://github.com/kevinswiber/siren#href-2)
 * `title(title)`: [`title`](https://github.com/kevinswiber/siren#title-1)
 * `type(type)`: [`type`](https://github.com/kevinswiber/siren#type)

**Simple List Builders**

 * `class(...class)` or `cls(...class)`: [`class`](https://github.com/kevinswiber/siren#class-2)

**Complex List Builders**

 * `field(name, type, value)`: [`fields`](https://github.com/kevinswiber/siren#fields)

**Other Methods**

 * `method(method)`: Uppercases the input value before setting [`method`](https://github.com/kevinswiber/siren#method)


### [Field](https://github.com/kevinswiber/siren#fields-1)

**Property Modifiers:**

 * `name(name)`: [`name`](https://github.com/kevinswiber/siren#name-1)
 * `value(value)`: [`value`](https://github.com/kevinswiber/siren#value)

**Other Methods**

 * `type(type)`: Checks that the input [`type`](https://github.com/kevinswiber/siren#type-1) is an allowed value before setting.
