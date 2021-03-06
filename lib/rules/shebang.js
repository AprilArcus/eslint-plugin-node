/**
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var path = require("path");
var getPackageJson = require("../util/get-package-json");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var NODE_SHEBANG = "#!/usr/bin/env node\n";
var SHEBANG_PATTERN = /^#\!.+?\n/;

/**
 * Checks whether or not a given path is a `bin` file.
 *
 * @param {string} filePath - A file path to check.
 * @param {function} convert - A converter for `bin` path.
 * @returns {boolean} `true` if the file is a `bin` file.
 */
function isBinFile(filePath, convert) {
    var packageInfo = getPackageJson(filePath);
    if (!packageInfo || !packageInfo.bin) {
        return false;
    }

    var packageDir = path.dirname(packageInfo.filePath);
    var binField = packageInfo.bin;
    if (typeof binField === "string") {
        return filePath === path.resolve(packageDir, convert(binField));
    }
    return Object.keys(binField).some(function(key) {
        return filePath === path.resolve(packageDir, convert(binField[key]));
    });
}

/**
 * Gets the shebang line (includes a line ending) from a given code.
 *
 * @param {SourceCode} sourceCode - A source code object to check.
 * @returns {string} shebang if exists. Otherwise an empty string.
 */
function getShebang(sourceCode) {
    var m = SHEBANG_PATTERN.exec(sourceCode.text);
    return (m && m[0]) || "";
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var sourceCode = context.getSourceCode();
    var options = context.options[0];
    var convertBinPathOpt = (options && options.convertBinPath) || null;
    var convertBinPath;

    if (!convertBinPathOpt) {
        convertBinPath = function(binPath) {
            return binPath;
        };
    } else if (!convertBinPathOpt[0]) {
        convertBinPath = function(binPath) {
            return path.join(convertBinPathOpt[1], binPath);
        };
    } else {
        convertBinPath = function(binPath) {
            return binPath.replace(convertBinPathOpt[0], convertBinPathOpt[1]);
        };
    }

    return {
        "Program": function(node) {
            var filePath = context.getFilename();
            if (filePath === "<input>") {
                return;
            }

            var needsShebang = isBinFile(filePath, convertBinPath);
            var shebang = getShebang(sourceCode);
            if (needsShebang ? shebang === NODE_SHEBANG : !shebang) {
                return;
            }

            if (needsShebang) {
                context.report({
                    node: node,
                    message: "This file needs shebang \"#!/usr/bin/env node\".",
                    fix: function(fixer) {
                        if (shebang) {
                            return fixer.replaceTextRange([0, shebang.length], NODE_SHEBANG);
                        } else {
                            return fixer.insertTextBefore(node, NODE_SHEBANG);
                        }
                    }
                });
            } else {
                context.report({
                    node: node,
                    message: "This file needs no shebang.",
                    fix: function(fixer) {
                        return fixer.removeRange([0, shebang.length]);
                    }
                });
            }
        }
    };
};

module.exports.schema = [
    {
        "type": "object",
        "properties": {
            "convertBinPath": {
                "type": "array",
                "items": {"type": "string"},
                "minItems": 2,
                "maxItems": 2,
                "uniqueItems": true
            }
        },
        "additionalProperties": false
    }
];
