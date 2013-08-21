NPM ?= npm
JSCOV ?= ./node_modules/.bin/jscoverage

MOCHA ?= ./node_modules/.bin/mocha
MOCHA_FLAGS ?= --check-leaks
REPORTER ?= dot


node_modules: package.json
	$(NPM) install

lib-cov: node_modules
	rm -rf $@
	$(JSCOV) lib $@

test: node_modules
	$(MOCHA) --reporter $(REPORTER) $(MOCHA_FLAGS)

test-cov: lib-cov
	TEST_COV=1 $(MOCHA) --reporter html-cov > coverage.html

clean:
	rm -rf node_modules lib-cov coverage.html

.PHONY: test clean
