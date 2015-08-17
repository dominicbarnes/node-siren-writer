# node-siren-writer

> A generator for [siren](https://github.com/kevinswiber/siren) hypermedia API responses.


## Example

````javascript
var writer = require("siren-writer");
var siren = writer('http://api.x.io');

var entity = siren({
  class: 'order',
  properties: {
    orderNumber: 42,
    itemCount: 3,
    status: 'pending'
  },
  entities: [
    {
      class: [ 'items', 'collection' ],
      rel: 'http://x.io/rels/order-items',
      href: 'orders/42/items'
    },
    {
      class: [ 'info', 'customer' ],
      rel: 'http://x.io/rels/customer',
      properties: {
        customerId: 'pj123',
        name: 'Peter Joseph'
      },
      links: {
        rel: 'self',
        href: 'customers/pj123'
      }
    }
  ],
  actions: {
    name: 'add-item',
    title: 'Add Item',
    method: 'POST',
    href: 'orders/42/items',
    type: 'application/x-www-form-urlencoded',
    fields: [
      { name: 'orderNumber', type: 'hidden', value: '42' },
      { name: 'productCode', type: 'text' },
      { name: 'quantity', type: 'number' }
    ]
  },
  links: [
    {
      rel: 'self',
      href: 'orders/42'
    },
    {
      rel: 'previous',
      href: 'orders/41'
    },
    {
      rel: 'next',
      href: 'orders/43'
    }
  ]
});

console.log(entity);
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


## Usage

The internals just got a huge rewrite, docs will be coming soon. In short, the old fluent API
is now gone in favor of a simpler, single function. (with a large configuration object)

The main reason for this decision is because, in practice, the fluent API was just too hard
to work with. I could _never_ remember exactly how the methods worked, and I wrote the darn
thing!
