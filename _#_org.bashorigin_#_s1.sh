#!/usr/bin/env bash.origin.script

depend {
    "app": "@com.github/pinf-to/to.pinf.com.apple.osx.app#s1"
}

function EXPORTS_ensureOnDesktop {

    config=$(BO_run_recent_node --eval '
        const PATH = require("path");
        const config = JSON.parse(process.argv[1]);

        config.iconPath = PATH.join("'$__DIRNAME__'", "src/assets/Logo_265.png");

        process.stdout.write(JSON.stringify(config));
    ' "$1")

    CALL_app ensureOnDesktop "${config}"

}
