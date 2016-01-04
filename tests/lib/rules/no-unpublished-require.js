/**
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var path = require("path"),
    RuleTester = require("eslint").RuleTester,
    rule = require("../../../lib/rules/no-unpublished-require");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Makes a file path to a fixture.
 * @param {string} name - A name.
 * @returns {string} A file path to a fixture.
 */
function fixture(name) {
    return path.resolve(__dirname, "../../fixtures/no-unpublished", name);
}

//------------------------------------------------------------------------------
// Test
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-unpublished-require", rule, {
    valid: [
        {
            filename: fixture("1/test.js"),
            code: "require('aaa');",
            env: {node: true}
        },
        {
            filename: fixture("1/test.js"),
            code: "require('aaa/a/b/c');",
            env: {node: true}
        },
        {
            filename: fixture("1/test.js"),
            code: "require('./a');",
            env: {node: true}
        },
        {
            filename: fixture("1/test.js"),
            code: "require('./a.js');",
            env: {node: true}
        },
        {
            filename: fixture("2/ignore1.js"),
            code: "require('./test');",
            env: {node: true}
        },
        {
            filename: fixture("2/ignore1.js"),
            code: "require('bbb');",
            env: {node: true}
        },
        {
            filename: fixture("2/ignore1.js"),
            code: "require('bbb/a/b/c');",
            env: {node: true}
        },
        {
            filename: fixture("2/ignore1.js"),
            code: "require('./ignore2');",
            env: {node: true}
        },
        {
            filename: fixture("3/test.js"),
            code: "require('./pub/a');",
            env: {node: true}
        },
        {
            filename: fixture("3/test.js"),
            code: "require('./test2');",
            env: {node: true}
        },
        {
            filename: fixture("3/test.js"),
            code: "require('aaa');",
            env: {node: true}
        },
        {
            filename: fixture("3/test.js"),
            code: "require('bbb');",
            env: {node: true}
        },
        {
            filename: fixture("3/pub/ignore1.js"),
            code: "require('bbb');",
            env: {node: true}
        },

        // Ignores it if not callee.
        {
            filename: fixture("1/test.js"),
            code: "require;",
            env: {node: true}
        },

        // Ignores it if the global variable of `require` is not defined.
        {
            filename: fixture("1/test.js"),
            code: "require('no-exist-package-0');"
        },

        // Ignores it if the filename is unknown.
        {
            code: "require('no-exist-package-0');",
            env: {node: true}
        },
        {
            code: "require('./b');",
            env: {node: true}
        },

        // Ignores it if the target is not string.
        {
            filename: fixture("1/test.js"),
            code: "require();",
            env: {node: true}
        },
        {
            filename: fixture("1/test.js"),
            code: "require(foo);",
            env: {node: true}
        },
        {
            filename: fixture("1/test.js"),
            code: "require(777);",
            env: {node: true}
        },
        {
            filename: fixture("1/test.js"),
            code: "require(`foo${bar}`);",
            env: {node: true, es6: true}
        }
    ],
    invalid: [
        {
            filename: fixture("1/test.js"),
            code: "require('no-deps');",
            env: {node: true},
            errors: ["\"no-deps\" is not published."]
        },
        {
            filename: fixture("1/test.js"),
            code: "require('no-deps/a/b/c');",
            env: {node: true},
            errors: ["\"no-deps\" is not published."]
        },
        {
            filename: fixture("2/test.js"),
            code: "require('./ignore1.js');",
            env: {node: true},
            errors: ["\"./ignore1.js\" is not published."]
        },
        {
            filename: fixture("2/test.js"),
            code: "require('./ignore1');",
            env: {node: true},
            errors: ["\"./ignore1\" is not published."]
        },
        {
            filename: fixture("2/ignore1.js"),
            code: "require('no-deps');",
            env: {node: true},
            errors: ["\"no-deps\" is not published."]
        },
        {
            filename: fixture("3/test.js"),
            code: "require('no-deps');",
            env: {node: true},
            errors: ["\"no-deps\" is not published."]
        },
        {
            filename: fixture("3/pub/test.js"),
            code: "require('bbb');",
            env: {node: true},
            errors: ["\"bbb\" is not published."]
        },
        {
            filename: fixture("3/pub/test.js"),
            code: "require('./ignore1');",
            env: {node: true},
            errors: ["\"./ignore1\" is not published."]
        },
        {
            filename: fixture("3/pub/test.js"),
            code: "require('../test');",
            env: {node: true},
            errors: ["\"../test\" is not published."]
        }
    ]
});
