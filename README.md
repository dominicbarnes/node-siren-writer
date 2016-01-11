# node-siren-writer

> A generator for [siren](https://github.com/kevinswiber/siren) hypermedia API responses.

[![npm version](https://img.shields.io/npm/v/siren-writer.svg)](https://www.npmjs.com/package/siren-writer)
[![npm dependencies](https://img.shields.io/david/dominicbarnes/node-siren-writer.svg)](https://david-dm.org/dominicbarnes/node-siren-writer)
[![npm dev dependencies](https://img.shields.io/david/dev/dominicbarnes/node-siren-writer.svg)](https://david-dm.org/dominicbarnes/node-siren-writer#info=devDependencies)
[![build status](https://img.shields.io/travis/dominicbarnes/node-siren-writer.svg)](https://travis-ci.org/dominicbarnes/node-siren-writer)

## Example

````javascript
var writer = require('siren-writer');
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


## API

### writer(base)

Creates a new `siren` writer with the given `base` as the base URL for things
like `rel` and `href` throughout an entity.

### siren(options)

The returned function is the entire API. It returns an object that can be
serialized as a JSON response.

```js
// express
res.json(siren(/* options */));

// koa
this.body = siren(/* options */);
```

Generally-speaking, this API avoids performing magic. It wants you to be
explicit, only accepting objects instead of positional arguments. However,
there are a few ways that this API improves upon generating the response
entirely from scratch:

 - ensures that single values are converted into arrays where they're required
   (eg: `class`, `rel`, etc)
 - flattens nested arrays into a single array, particularly for things like
   `entities` where you could be merging several different types for a single
   response
 - automatically resolves URLs relative to the `base` URL (eg: `href` and any
   `rel` values that aren't [defined by IANA](https://github.com/dominicbarnes/iana-rels))
 - throws errors when you are missing things that are explicitly required, such
   as the `href` or `rel` for a link

The keys in `options` include everything in the [spec](https://github.com/kevinswiber/siren),
so use that as a reference when building your configuration options. Additional properties will be included, but their behavior with clients cannot be guaranteed. Some other
things to be aware of:

 - as mentioned before, don't be too concerned with arrays if you're only
   setting a single value
 - don't be afraid to nest arrays, they will be flattened
 - include the trailing `/` in your `base`, especially when using a pathname
 - avoid using a leading `/` in your relative URLs, as it will
   behave unexpectedly if your `base` has a pathname as part of it.
   (ie: `http://example.com/api/`)
 - this library will `throw` exceptions in the cases mentioned previously
