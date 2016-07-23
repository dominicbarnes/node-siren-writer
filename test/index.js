
'use strict';

var assert = require('assert');
var path = require('path');
var writer = require('..');

var fixture = path.resolve.bind(path, __dirname, 'fixtures');


describe('writer(base)', function () {
  var siren = writer('http://localhost');

  it('should return a function', function () {
    assert.equal(typeof siren, 'function');
  });

  it('should render an empty object', function () {
    assert.deepEqual(siren(), {});
    assert.deepEqual(siren({}), {});
    assert.deepEqual(siren(null), {});
  });

  it('should include extra properties', function () {
    assert.deepEqual(siren({ a: 1 }), { a: 1 });
  });

  describe('entity.class', function () {
    it('should be included', function () {
      var cls = [ 'a', 'b' ];
      var result = siren({ class: cls });
      assert.deepEqual(result.class, cls);
    });

    it('should normalize a single item into an array', function () {
      var result = siren({ class: 'a' });
      assert.deepEqual(result.class, [ 'a' ]);
    });

    it('should flatten nested arrays', function () {
      var result = siren({ class: [ 'a', [ 'b', [ 'c' ] ] ] });
      assert.deepEqual(result.class, [ 'a', 'b', 'c' ]);
    });
  });

  describe('entity.properties', function () {
    it('should be included', function () {
      var props = { a: 1, b: 2 };
      var result = siren({ properties: props });
      assert.deepEqual(result.properties, props);
    });

    it('should clone the input', function () {
      var props = { a: 1, b: 2 };
      var result = siren({ properties: props });
      assert.notStrictEqual(result.properties, props);
    });

    it('should merge arrays of input objects', function () {
      var props = [ { a: 1 }, { b: 2, c: 3 } ];
      var result = siren({ properties: props });
      assert.deepEqual(result.properties, { a: 1, b: 2, c: 3 });
    });

    it('should flatten arrays of input objects', function () {
      var props = [ { a: 1 }, [ { b: 2 }, { c: 3 } ] ];
      var result = siren({ properties: props });
      assert.deepEqual(result.properties, { a: 1, b: 2, c: 3 });
    });
  });

  describe('entity.entities', function () {
    it('should be included', function () {
      var entities = [ { rel: [ 'item' ] } ];
      var result = siren({ entities: entities });
      assert.deepEqual(result.entities, entities);
    });

    it('should normalize a single item into an array', function () {
      var entity = { rel: [ 'item' ] };
      var result = siren({ entities: entity });
      assert.deepEqual(result.entities, [ entity ]);
    });

    it('should filter out falsy values', function () {
      var result = siren({ entities: [ false, null ] });
      assert.deepEqual(result.entities, []);
    });

    it('should not use the input objects', function () {
      var entity = { rel: [ 'item' ] };
      var result = siren({ entities: [ entity ] });
      assert.notStrictEqual(result.entities[0], entity);
    });

    it('should flatten nested arrays', function () {
      var entity = { rel: [ 'item' ] };
      var result = siren({ entities: [ entity, [ entity ] ] });
      assert.deepEqual(result.entities, [ entity, entity ]);
    });

    it('should include extra properties', function () {
      var entity = { rel: [ 'item' ], a: 1 };
      var result = siren({ entities: entity });
      assert.deepEqual(result.entities[0], entity);
    });

    describe('.rel', function () {
      it('should throw if no rel is defined', function () {
        assert.throws(function () {
          siren({ entities: {} });
        });
      });

      it('should normalize a single item into an array', function () {
        var entity = { rel: 'item' };
        var result = siren({ entities: entity });
        assert.deepEqual(result.entities[0].rel, [ 'item' ]);
      });

      it('should flatten nested arrays', function () {
        var entity = { rel: 'item' };
        var result = siren({ entities: entity });
        assert.deepEqual(result.entities[0].rel, [ 'item' ]);
      });

      it('should resolve non-IANA rels as urls relative to base', function () {
        var entity = { rel: 'rels/test' };
        var result = siren({ entities: entity });
        assert.strictEqual(result.entities[0].rel[0], 'http://localhost/rels/test');
      });

      it('should allow rels that include hyphens (#3)', function () {
        var entity = { rel: 'next-archive' };
        var result = siren({ entities: entity });
        assert.strictEqual(result.entities[0].rel[0], 'next-archive');
      });
    });

    describe('.href', function () {
      it('should be included', function () {
        var entity = { rel: 'item', href: '/' };
        var result = siren({ entities: entity });
        assert(result.entities[0].href, 'should have an href');
      });

      it('should be resolved relative to base', function () {
        var entity = { rel: 'item', href: '/' };
        var result = siren({ entities: entity });
        assert.strictEqual(result.entities[0].href, 'http://localhost/');
      });
    });

    describe('.class', function () {
      it('should be included', function () {
        var cls = [ 'a', 'b' ];
        var entity = { rel: 'item', class: cls };
        var result = siren({ entities: entity });
        assert.deepEqual(result.entities[0].class, cls);
      });

      it('should normalize a single item into an array', function () {
        var entity = { rel: 'item', class: 'a' };
        var result = siren({ entities: entity });
        assert.deepEqual(result.entities[0].class, [ 'a' ]);
      });

      it('should flatten nested arrays', function () {
        var entity = { rel: 'item', class: [ 'a', [ 'b', [ 'c' ] ] ] };
        var result = siren({ entities: entity });
        assert.deepEqual(result.entities[0].class, [ 'a', 'b', 'c' ]);
      });
    });

    describe('.properties', function () {
      it('should be included', function () {
        var props = { a: 1, b: 2 };
        var entity = { rel: 'item', properties: props };
        var result = siren({ entities: entity });
        assert.deepEqual(result.entities[0].properties, props);
      });

      it('should clone the input', function () {
        var props = { a: 1, b: 2 };
        var entity = { rel: 'item', properties: props };
        var result = siren({ entities: entity });
        assert.notStrictEqual(result.entities[0].properties, props);
      });
    });

    describe('.links', function () {
      it('should be included', function () {
        var links = [ { rel: [ 'item' ], href: 'http://localhost/' } ];
        var entity = { rel: 'item', links: links };
        var result = siren({ entities: entity });
        assert.deepEqual(result.entities[0].links, links);
      });

      it('should normalize a single item into an array', function () {
        var link = { rel: [ 'item' ], href: 'http://localhost/' };
        var entity = { rel: 'item', links: link };
        var result = siren({ entities: entity });
        assert.deepEqual(result.entities[0].links, [ link ]);
      });

      it('should not use the input objects', function () {
        var link = { rel: [ 'item' ], href: 'http://localhost/' };
        var entity = { rel: 'item', links: link };
        var result = siren({ entities: entity });
        assert.deepEqual(result.entities[0].links, [ link ]);
      });

      it('should flatten nested arrays', function () {
        var link = { rel: [ 'item' ], href: 'http://localhost/' };
        var entity = { rel: 'item', links: [ link, [ link ] ] };
        var result = siren({ entities: entity });
        assert.deepEqual(result.entities[0].links, [ link, link ]);
      });

      describe('.rel', function () {
        it('should throw if not defined', function () {
          assert.throws(function () {
            siren({ entities: { rel: 'item', links: { href: 'http://localhost/' } } });
          });
        });

        it('should normalize a single item into an array', function () {
          var link = { rel: 'self', href: 'http://localhost/' };
          var entity = { rel: 'item', links: link };
          var result = siren({ entities: entity });
          assert.deepEqual(result.entities[0].links[0].rel, [ 'self' ]);
        });

        it('should flatten nested arrays', function () {
          var link = { rel: [ 'self', [ 'item' ] ], href: 'http://localhost/' };
          var entity = { rel: 'item', links: link };
          var result = siren({ entities: entity });
          assert.deepEqual(result.entities[0].links[0].rel, [ 'self', 'item' ]);
        });

        it('should resolve non-IANA rels as urls relative to base', function () {
          var link = { rel: 'rels/test', href: 'http://localhost/' };
          var entity = { rel: 'item', links: link };
          var result = siren({ entities: entity });
          assert.strictEqual(result.entities[0].links[0].rel[0], 'http://localhost/rels/test');
        });

        it('should allow rels that include hyphens (#3)', function () {
          var link = { rel: 'next-archive', href: 'http://localhost/' };
          var entity = { rel: 'item', links: link };
          var result = siren({ entities: entity });
          assert.strictEqual(result.entities[0].links[0].rel[0], 'next-archive');
        });
      });

      describe('.href', function () {
        it('should throw if not defined', function () {
          assert.throws(function () {
            siren({ entities: { rel: 'item', links: { rel: 'self' } } });
          });
        });

        it('should resolve relative to base', function () {
          var link = { rel: 'self', href: '/products/1' };
          var entity = { rel: 'item', links: link };
          var result = siren({ entities: entity });
          assert.strictEqual(result.entities[0].links[0].href, 'http://localhost/products/1');
        });
      });

      describe('.class', function () {
        it('should be included', function () {
          var cls = [ 'a', 'b' ];
          var link = { rel: 'item', href: '/', class: cls };
          var entity = { rel: 'item', links: link };
          var result = siren({ entities: entity });
          assert.deepEqual(result.entities[0].links[0].class, cls);
        });

        it('should normalize a single item into an array', function () {
          var link = { rel: 'item', href: '/', class: 'a' };
          var entity = { rel: 'item', links: link };
          var result = siren({ entities: entity });
          assert.deepEqual(result.entities[0].links[0].class, [ 'a' ]);
        });

        it('should flatten nested arrays', function () {
          var link = { rel: 'item', href: '/', class: [ 'a', [ 'b', [ 'c' ] ] ] };
          var entity = { rel: 'item', links: link };
          var result = siren({ entities: entity });
          assert.deepEqual(result.entities[0].links[0].class, [ 'a', 'b', 'c' ]);
        });
      });

      describe('.title', function () {
        it('should be included', function () {
          var title = 'hello world';
          var link = { rel: 'item', href: '/', title: title };
          var entity = { rel: 'item', links: link };
          var result = siren({ entities: entity });
          assert.strictEqual(result.entities[0].links[0].title, title);
        });
      });

      describe('.type', function () {
        it('should be included', function () {
          var type = 'application/json';
          var link = { rel: 'item', href: '/', type: type };
          var entity = { rel: 'item', links: link };
          var result = siren({ entities: entity });
          assert.strictEqual(result.entities[0].links[0].type, type);
        });
      });
    });

    describe('.actions', function () {
      it('should be included', function () {
        var actions = [ { name: 'add', href: 'http://localhost/products' } ];
        var entity = { rel: 'item', actions: actions };
        var result = siren({ entities: entity });
        assert.deepEqual(result.entities[0].actions, actions);
      });

      it('should normalize a single item into an array', function () {
        var action = { name: 'add', href: 'http://localhost/products' };
        var entity = { rel: 'item', actions: action };
        var result = siren({ entities: entity });
        assert.deepEqual(result.entities[0].actions, [ action ]);
      });

      it('should not use the input objects', function () {
        var action = { name: 'add', href: 'http://localhost/products' };
        var entity = { rel: 'item', actions: action };
        var result = siren({ entities: entity });
        assert.notStrictEqual(result.entities[0].actions[0], action);
      });

      it('should flatten nested arrays', function () {
        var action = { name: 'add', href: 'http://localhost/products' };
        var entity = { rel: 'item', actions: [ action, [ action ] ] };
        var result = siren({ entities: entity });
        assert.deepEqual(result.entities[0].actions, [ action, action ]);
      });

      describe('.name', function () {
        it('should throw if not defined', function () {
          assert.throws(function () {
            siren({ entities: { rel: 'item', actions: { href: '/products' } } });
          });
        });
      });

      describe('.href', function () {
        it('should throw if not defined', function () {
          assert.throws(function () {
            siren({ entities: { rel: 'item', actions: { name: 'add' } } });
          });
        });

        it('should resolve relative to base', function () {
          var action = { name: 'add', href: '/products' };
          var entity = { rel: 'item', actions: action };
          var result = siren({ entities: entity });
          assert.strictEqual(result.entities[0].actions[0].href, 'http://localhost/products');
        });
      });

      describe('.method', function () {
        it('should be included', function () {
          var method = 'POST';
          var action = { name: 'add', href: '/products', method: method };
          var entity = { rel: 'item', actions: action };
          var result = siren({ entities: entity });
          assert.strictEqual(result.entities[0].actions[0].method, method);
        });

        it('should uppercase the input method name', function () {
          var action = { name: 'add', href: '/products', method: 'post' };
          var entity = { rel: 'item', actions: action };
          var result = siren({ entities: entity });
          assert.strictEqual(result.entities[0].actions[0].method, 'POST');
        });
      });

      describe('.class', function () {
        it('should be included', function () {
          var cls = [ 'a', 'b' ];
          var action = { name: 'add', href: '/products', class: cls };
          var entity = { rel: 'item', actions: action };
          var result = siren({ entities: entity });
          assert.deepEqual(result.entities[0].actions[0].class, cls);
        });

        it('should normalize a single item into an array', function () {
          var action = { name: 'add', href: '/products', class: 'a' };
          var entity = { rel: 'item', actions: action };
          var result = siren({ entities: entity });
          assert.deepEqual(result.entities[0].actions[0].class, [ 'a' ]);
        });

        it('should flatten nested arrays', function () {
          var action = { name: 'add', href: '/products', class: [ 'a', [ 'b', [ 'c' ] ] ] };
          var entity = { rel: 'item', actions: action };
          var result = siren({ entities: entity });
          assert.deepEqual(result.entities[0].actions[0].class, [ 'a', 'b', 'c' ]);
        });
      });

      describe('.title', function () {
        it('should be included', function () {
          var title = 'hello world';
          var action = { name: 'add', href: '/products', title: title };
          var entity = { rel: 'item', actions: action };
          var result = siren({ entities: entity });
          assert.strictEqual(result.entities[0].actions[0].title, title);
        });
      });

      describe('.type', function () {
        it('should be included', function () {
          var type = 'application/json';
          var action = { name: 'add', href: '/products', type: type };
          var entity = { rel: 'item', actions: action };
          var result = siren({ entities: entity });
          assert.strictEqual(result.entities[0].actions[0].type, type);
        });
      });

      describe('.fields', function () {
        it('should be included', function () {
          var fields = [ { name: 'id' } ];
          var action = { name: 'add', href: 'http://localhost/products', fields: fields };
          var entity = { rel: 'item', actions: action };
          var result = siren({ entities: entity });
          assert.deepEqual(result.entities[0].actions[0].fields, fields);
        });

        it('should normalize a single item into an array', function () {
          var field = { name: 'id' };
          var action = { name: 'add', href: 'http://localhost/products', fields: field };
          var entity = { rel: 'item', actions: action };
          var result = siren({ entities: entity });
          assert.deepEqual(result.entities[0].actions[0].fields, [ field ]);
        });

        it('should not use the input objects', function () {
          var field = { name: 'id' };
          var action = { name: 'add', href: 'http://localhost/products', fields: field };
          var entity = { rel: 'item', actions: action };
          var result = siren({ entities: entity });
          assert.deepEqual(result.entities[0].actions[0].fields[0], field);
        });

        it('should flatten nested arrays', function () {
          var field = { name: 'id' };
          var action = { name: 'add', href: 'http://localhost/products', fields: [ field, [ field ] ] };
          var entity = { rel: 'item', actions: action };
          var result = siren({ entities: entity });
          assert.deepEqual(result.entities[0].actions[0].fields, [ field, field ]);
        });

        it('should include custom fields', function () {
          var field = { name: 'color', type: 'select', options: [ 'red', 'blue' ] };
          var action = { name: 'add', href: 'http://localhost/products', fields: [ field ] };
          var entity = { rel: 'item', actions: action };
          var result = siren({ entities: entity });
          assert.deepEqual(result.entities[0].actions[0].fields[0], field);
        });

        describe('.name', function () {
          it('should throw when not specified', function () {
            assert.throws(function () {
              siren({ entities: { rel: 'item', actions: { name: 'add', href: 'http://localhost/products', fields: {} } } });
            });
          });
        });

        describe('.class', function () {
          it('should be included', function () {
            var cls = [ 'a', 'b' ];
            var action = { name: 'add', href: '/products', fields: { name: 'add', class: cls } };
            var entity = { rel: 'item', actions: action };
            var result = siren({ entities: entity });
            assert.deepEqual(result.entities[0].actions[0].fields[0].class, cls);
          });

          it('should normalize a single item into an array', function () {
            var action = { name: 'add', href: '/products', fields: { name: 'add', class: 'a' } };
            var entity = { rel: 'item', actions: action };
            var result = siren({ entities: entity });
            assert.deepEqual(result.entities[0].actions[0].fields[0].class, [ 'a' ]);
          });

          it('should flatten nested arrays', function () {
            var action = { name: 'add', href: '/products', fields: { name: 'add', class: [ 'a', [ 'b', [ 'c' ] ] ] } };
            var entity = { rel: 'item', actions: action };
            var result = siren({ entities: entity });
            assert.deepEqual(result.entities[0].actions[0].fields[0].class, [ 'a', 'b', 'c' ]);
          });
        });

        describe('.type', function () {
          it('should be included', function () {
            var type = 'number';
            var action = { name: 'add', href: '/products', fields: { name: 'quantity', type: type } };
            var entity = { rel: 'item', actions: action };
            var result = siren({ entities: entity });
            assert.strictEqual(result.entities[0].actions[0].fields[0].type, type);
          });
        });

        describe('.value', function () {
          it('should be included', function () {
            var value = 'hello world';
            var action = { name: 'add', href: '/products', fields: { name: 'add', value: value } };
            var entity = { rel: 'item', actions: action };
            var result = siren({ entities: entity });
            assert.strictEqual(result.entities[0].actions[0].fields[0].value, value);
          });
        });

        describe('.title', function () {
          it('should be included', function () {
            var title = 'hello world';
            var action = { name: 'add', href: '/products', fields: { name: 'add', title: title } };
            var entity = { rel: 'item', actions: action };
            var result = siren({ entities: entity });
            assert.strictEqual(result.entities[0].actions[0].fields[0].title, title);
          });
        });
      });
    });

    describe('.title', function () {
      it('should be included', function () {
        var title = 'hello world';
        var entity = { rel: 'item', title: title };
        var result = siren({ entities: entity });
        assert.strictEqual(result.entities[0].title, title);
      });
    });
  });

  describe('entity.links', function () {
    it('should be included', function () {
      var links = [ { rel: [ 'item' ], href: 'http://localhost/' } ];
      var result = siren({ links: links });
      assert.deepEqual(result.links, links);
    });

    it('should normalize a single item into an array', function () {
      var link = { rel: [ 'item' ], href: 'http://localhost/' };
      var result = siren({ links: link });
      assert.deepEqual(result.links, [ link ]);
    });

    it('should filter out falsy values', function () {
      var result = siren({ links: [ false, null ] });
      assert.deepEqual(result.links, []);
    });

    it('should not use the input objects', function () {
      var link = { rel: [ 'item' ], href: 'http://localhost/' };
      var result = siren({ links: [ link ] });
      assert.notStrictEqual(result.links[0], link);
    });

    it('should flatten nested arrays', function () {
      var link = { rel: [ 'item' ], href: 'http://localhost/' };
      var result = siren({ links: [ link, [ link ] ] });
      assert.deepEqual(result.links, [ link, link ]);
    });

    it('should include extra properties', function () {
      var link = { rel: [ 'item' ], href: 'http://localhost/', a: 1 };
      var result = siren({ links: link });
      assert.deepEqual(result.links[0], link);
    });

    describe('.rel', function () {
      it('should throw if not defined', function () {
        assert.throws(function () {
          siren({ links: { href: 'http://localhost/' } });
        });
      });

      it('should normalize a single item into an array', function () {
        var link = { rel: 'self', href: 'http://localhost/' };
        var result = siren({ links: link });
        assert.deepEqual(result.links[0].rel, [ 'self' ]);
      });

      it('should flatten nested arrays', function () {
        var link = { rel: [ 'self', 'item' ], href: 'http://localhost/' };
        var result = siren({ links: link });
        assert.deepEqual(result.links[0].rel, [ 'self', 'item' ]);
      });

      it('should resolve non-IANA rels as urls relative to base', function () {
        var link = { rel: 'rels/test', href: 'http://localhost/' };
        var result = siren({ links: link });
        assert.strictEqual(result.links[0].rel[0], 'http://localhost/rels/test');
      });

      it('should allow rels that include hyphens (#3)', function () {
        var link = { rel: 'next-archive', href: 'http://localhost/' };
        var result = siren({ links: link });
        assert.strictEqual(result.links[0].rel[0], 'next-archive');
      });
    });

    describe('.href', function () {
      it('should throw if not defined', function () {
        assert.throws(function () {
          siren({ links: { rel: 'self' } });
        });
      });

      it('should resolve relative to base', function () {
        var link = { rel: 'self', href: '/products/1' };
        var result = siren({ links: link });
        assert.strictEqual(result.links[0].href, 'http://localhost/products/1');
      });
    });

    describe('.class', function () {
      it('should be included', function () {
        var cls = [ 'a', 'b' ];
        var link = { rel: 'item', href: '/', class: cls };
        var result = siren({ links: link });
        assert.deepEqual(result.links[0].class, cls);
      });

      it('should normalize a single item into an array', function () {
        var link = { rel: 'item', href: '/', class: 'a' };
        var result = siren({ links: link });
        assert.deepEqual(result.links[0].class, [ 'a' ]);
      });

      it('should flatten nested arrays', function () {
        var link = { rel: 'item', href: '/', class: [ 'a', [ 'b', [ 'c' ] ] ] };
        var result = siren({ links: link });
        assert.deepEqual(result.links[0].class, [ 'a', 'b', 'c' ]);
      });
    });

    describe('.title', function () {
      it('should be included', function () {
        var title = 'hello world';
        var link = { rel: 'item', href: '/', title: title };
        var result = siren({ links: link });
        assert.strictEqual(result.links[0].title, title);
      });
    });

    describe('.type', function () {
      it('should be included', function () {
        var type = 'application/json';
        var link = { rel: 'item', href: '/', type: type };
        var result = siren({ links: link });
        assert.strictEqual(result.links[0].type, type);
      });
    });
  });

  describe('entity.actions', function () {
    it('should be included', function () {
      var actions = [ { name: 'add', href: 'http://localhost/products' } ];
      var result = siren({ actions: actions });
      assert.deepEqual(result.actions, actions);
    });

    it('should normalize a single item into an array', function () {
      var action = { name: 'add', href: 'http://localhost/products' };
      var result = siren({ actions: action });
      assert.deepEqual(result.actions, [ action ]);
    });

    it('should filter out falsy values', function () {
      var result = siren({ actions: [ false, null ] });
      assert.deepEqual(result.actions, []);
    });

    it('should not use the input objects', function () {
      var action = { name: 'add', href: 'http://localhost/products' };
      var result = siren({ actions: action });
      assert.notStrictEqual(result.actions[0], action);
    });

    it('should flatten nested arrays', function () {
      var action = { name: 'add', href: 'http://localhost/products' };
      var result = siren({ actions: [ action, [ action ] ] });
      assert.deepEqual(result.actions, [ action, action ]);
    });

    it('should include extra properties', function () {
      var action = { name: 'add', href: 'http://localhost/products', a: 1 };
      var result = siren({ actions: action });
      assert.deepEqual(result.actions[0], action);
    });

    describe('.name', function () {
      it('should throw if not defined', function () {
        assert.throws(function () {
          siren({ actions: { href: '/products' } });
        });
      });
    });

    describe('.href', function () {
      it('should throw if not defined', function () {
        assert.throws(function () {
          siren({ actions: { name: 'add' } });
        });
      });

      it('should resolve relative to base', function () {
        var action = { name: 'add', href: '/products' };
        var result = siren({ actions: action });
        assert.strictEqual(result.actions[0].href, 'http://localhost/products');
      });
    });

    describe('.method', function () {
      it('should be included', function () {
        var method = 'POST';
        var action = { name: 'add', href: '/products', method: method };
        var result = siren({ actions: action });
        assert.strictEqual(result.actions[0].method, method);
      });

      it('should uppercase the input method name', function () {
        var action = { name: 'add', href: '/products', method: 'post' };
        var result = siren({ actions: action });
        assert.strictEqual(result.actions[0].method, 'POST');
      });
    });

    describe('.class', function () {
      it('should be included', function () {
        var cls = [ 'a', 'b' ];
        var action = { name: 'add', href: '/products', class: cls };
        var result = siren({ actions: action });
        assert.deepEqual(result.actions[0].class, cls);
      });

      it('should normalize a single item into an array', function () {
        var action = { name: 'add', href: '/products', class: 'a' };
        var result = siren({ actions: action });
        assert.deepEqual(result.actions[0].class, [ 'a' ]);
      });

      it('should flatten nested arrays', function () {
        var action = { name: 'add', href: '/products', class: [ 'a', [ 'b', [ 'c' ] ] ] };
        var result = siren({ actions: action });
        assert.deepEqual(result.actions[0].class, [ 'a', 'b', 'c' ]);
      });
    });

    describe('.title', function () {
      it('should be included', function () {
        var title = 'hello world';
        var action = { name: 'add', href: '/products', title: title };
        var result = siren({ actions: action });
        assert.strictEqual(result.actions[0].title, title);
      });
    });

    describe('.type', function () {
      it('should be included', function () {
        var type = 'application/json';
        var action = { name: 'add', href: '/products', type: type };
        var result = siren({ actions: action });
        assert.strictEqual(result.actions[0].type, type);
      });
    });

    describe('.fields', function () {
      it('should be included', function () {
        var fields = [ { name: 'id' } ];
        var actions = [
          { name: 'add', href: 'http://localhost/products', fields: fields }
        ];

        var result = siren({ actions: actions });
        assert.deepEqual(result.actions[0].fields, fields);
      });

      it('should normalize a single item into an array', function () {
        var field = { name: 'id' };
        var actions = [
          { name: 'add', href: 'http://localhost/products', fields: field }
        ];

        var result = siren({ actions: actions });
        assert.deepEqual(result.actions[0].fields, [ field ]);
      });

      it('should filter out falsy values', function () {
        var actions = [
          { name: 'add', href: 'http://localhost/products', fields: [ false, null ] }
        ];

        var result = siren({ actions: actions });
        assert.deepEqual(result.actions[0].fields, []);
      });

      it('should not use the input objects', function () {
        var field = { name: 'id' };
        var actions = [
          { name: 'add', href: 'http://localhost/products', fields: field }
        ];

        var result = siren({ actions: actions });
        assert.deepEqual(result.actions[0].fields[0], field);
      });

      it('should flatten nested arrays', function () {
        var field = { name: 'id' };
        var action = { name: 'add', href: 'http://localhost/products', fields: [ field, [ field ] ] };
        var result = siren({ actions: action });
        assert.deepEqual(result.actions[0].fields, [ field, field ]);
      });

      it('should include custom fields', function () {
        var field = { name: 'color', type: 'select', options: [ 'red', 'blue' ] };
        var action = { name: 'add', href: 'http://localhost/products', fields: [ field ] };
        var result = siren({ actions: action });
        assert.deepEqual(result.actions[0].fields[0], field);
      });

      describe('.name', function () {
        it('should throw when not specified', function () {
          assert.throws(function () {
            siren({ actions: { name: 'add', href: 'http://localhost/products', fields: {} } });
          });
        });
      });

      describe('.class', function () {
        it('should be included', function () {
          var cls = [ 'a', 'b' ];
          var action = { name: 'add', href: '/products', fields: { name: 'add', class: cls } };
          var result = siren({ actions: action });
          assert.deepEqual(result.actions[0].fields[0].class, cls);
        });

        it('should normalize a single item into an array', function () {
          var action = { name: 'add', href: '/products', fields: { name: 'add', class: 'a' } };
          var result = siren({ actions: action });
          assert.deepEqual(result.actions[0].fields[0].class, [ 'a' ]);
        });

        it('should flatten nested arrays', function () {
          var action = { name: 'add', href: '/products', fields: { name: 'add', class: [ 'a', [ 'b', [ 'c' ] ] ] } };
          var result = siren({ actions: action });
          assert.deepEqual(result.actions[0].fields[0].class, [ 'a', 'b', 'c' ]);
        });
      });

      describe('.type', function () {
        it('should be included', function () {
          var type = 'number';
          var action = { name: 'add', href: '/products', fields: { name: 'quantity', type: type } };
          var result = siren({ actions: action });
          assert.strictEqual(result.actions[0].fields[0].type, type);
        });
      });

      describe('.value', function () {
        it('should be included', function () {
          var value = 'hello world';
          var action = { name: 'add', href: '/products', fields: { name: 'add', value: value } };
          var result = siren({ actions: action });
          assert.strictEqual(result.actions[0].fields[0].value, value);
        });
      });

      describe('.title', function () {
        it('should be included', function () {
          var title = 'hello world';
          var action = { name: 'add', href: '/products', fields: { name: 'add', title: title } };
          var result = siren({ actions: action });
          assert.strictEqual(result.actions[0].fields[0].title, title);
        });
      });
    });
  });

  describe('entity.title', function () {
    it('should be included', function () {
      var title = 'hello world';
      var result = siren({ title: title });
      assert.strictEqual(result.title, title);
    });
  });

  it('should render the homepage example', function () {
    var siren = writer('http://api.x.io');
    var actual = siren({
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
    var expected = require(fixture('siren-homepage'));

    assert.deepEqual(actual, expected);
  });
});
