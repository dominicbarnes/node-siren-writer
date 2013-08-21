Developer Notes
===============

## Running Tests

The `Makefile` is configured to automatically install dependencies in preparation
for running tests, so all you need is:

    $ make test

If you wish to test the code coverage, run:

    $ make test-cov

It generates `coverage.html` so you can review the coverage report.


## Test Frameworks

 * Assertion Library: [chai](http://chaijs.com/) - [BDD](http://chaijs.com/api/bdd/) - **expect** style.
 * Test Runner: [mocha](http://visionmedia.github.io/mocha/)
 * Code Coverage: [JSCoverage](http://siliconforks.com/jscoverage/) (via [npm:jscoverage](https://npmjs.org/package/jscoverage))


## Cleanup

If you need to remove all the "generated" files, simply use:

    $ make clean
