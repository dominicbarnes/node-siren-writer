NPM ?= npm
JSCOV ?= jscoverage

MOCHA ?= ./node_modules/.bin/mocha
MOCHA_FLAGS ?= --check-leaks
REPORTER ?= dot


node_modules: package.json
	$(NPM) install

lib-cov: lib
	rm -rf $@
	$(JSCOV) $< $@

test: node_modules
	$(MOCHA) --reporter $(REPORTER) $(MOCHA_FLAGS)

test-cov: lib-cov
	TEST_COV=1 $(MOCHA) --reporter html-cov > coverage.html

clean:
	rm -rf node_modules lib-cov coverage.html

.PHONY: test clean
