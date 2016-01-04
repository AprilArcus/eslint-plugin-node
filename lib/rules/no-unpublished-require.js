/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var checkPublish = require("../util/check-publish");
var getRequireTargets = require("../util/get-require-targets");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var filePath = context.getFilename();
    if (filePath === "<input>") {
        return {};
    }

    return {
        "Program:exit": function() {
            checkPublish(
                context,
                filePath,
                getRequireTargets(context)
            );
        }
    };
};

module.exports.schema = [];
