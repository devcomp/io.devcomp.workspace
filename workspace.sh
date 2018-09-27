#!/usr/bin/env bash.origin.script

depend {
    "inception": {
        "@com.github/cadorn/Inception#s1": {
            "readme": "$__DIRNAME__/README.md",
            "variables": {
                "PACKAGE_NAME": "io.devcomp.workspace",
                "PACKAGE_GITHUB_URI": "github.com/devcomp/io.devcomp.workspace",
                "PACKAGE_WEBSITE_SOURCE_URI": "github.com/devcomp/io.devcomp.workspace/tree/master/workspace.sh",
                "PACKAGE_CIRCLECI_NAMESPACE": "devcomp/io.devcomp.workspace",
                "PACKAGE_NPM_PACKAGE_NAME": "io.devcomp.workspace",
                "PACKAGE_NPM_PACKAGE_URL": "https://www.npmjs.com/package/io.devcomp.workspace",
                "PACKAGE_WEBSITE_URI": "devcomp.github.io/io.devcomp.workspace",
                "PACKAGE_YEAR_CREATED": "2017",
                "PACKAGE_LICENSE_ALIAS": "MPL",
                "PACKAGE_SUMMARY": "$__DIRNAME__/GUIDE.md"
            },
            "routes": {
                "/dist/devcomp.app.js": {
                    "@it.pinf.org.browserify#s1": {
                        "src": "$__DIRNAME__/src/devcomp.app.js",
                        "dist": "$__DIRNAME__/dist/devcomp.app.js"
                    }
                },
                "/dist/devcomp.rep.js": {
                    "@it.pinf.org.browserify#s1": {
                        "src": "$__DIRNAME__/src/devcomp.rep.js",
                        "dist": "$__DIRNAME__/dist/devcomp.rep.js",
                        "format": "pinf"
                    }
                },
                "^/dist/golden-layout/": [
                    "$__DIRNAME__/node_modules/golden-layout/dist",
                    "$__DIRNAME__/node_modules/golden-layout/src/css"
                ],
                "^/dist/jquery/": "$__DIRNAME__/node_modules/jquery/dist"
            },
            "files": {
                "dist/golden-layout": [
                    "$__DIRNAME__/node_modules/golden-layout/dist",
                    "$__DIRNAME__/node_modules/golden-layout/src/css"
                ],
                "dist/jquery": "$__DIRNAME__/node_modules/jquery/dist"
            }
        }
    },
    "electron": {
        "@com.github/bash-origin/bash.origin.electron#s1": {
            "routes": {
                "/dist/devcomp.app.js": {
                    "@it.pinf.org.browserify#s1": {
                        "src": "$__DIRNAME__/src/devcomp.app.js",
                        "dist": "$__DIRNAME__/dist/devcomp.app.js"
                    }
                },
                "/dist/devcomp.rep.js": {
                    "@it.pinf.org.browserify#s1": {
                        "src": "$__DIRNAME__/src/devcomp.rep.js",
                        "dist": "$__DIRNAME__/dist/devcomp.rep.js",
                        "format": "pinf"
                    }
                },
                "^/dist/golden-layout/": [
                    "$__DIRNAME__/node_modules/golden-layout/dist",
                    "$__DIRNAME__/node_modules/golden-layout/src/css"
                ],
                "^/dist/jquery/": "$__DIRNAME__/node_modules/jquery/dist"
            }
        }
    },
    "process": {
        "@com.github/pinf-it/it.pinf.com.github.tj.mon#s1": {
        }
    }
}


BO_parse_args "ARGS" "$@"

if [ "$ARGS_1" == "publish" ]; then

    # TODO: Add option to track files and only publish if changed.
    CALL_inception website publish ${*:2}

elif [ "$ARGS_1" == "run" ] || [ "$ARGS_1" == "" ]; then

    if [ ! -z "$ARGS_OPT_debug" ]; then
        export DEVCOMP_DEBUG=1
    fi

    export DEVCOMP_PWD="$(pwd)"

    pushd "$__DIRNAME__/src" > /dev/null

        if [ ! -z "$ARGS_2" ]; then
            export DEVCOMP_ROOT_DOC="$ARGS_2"
        else
            export DEVCOMP_ROOT_DOC="$__DIRNAME__/src/ui/index.json"
        fi

        # TODO: Open new window only if not already exists
        # TODO: Open doc in existing window (or new window if '--new' is specified)

        if [ -z "$ARGS_OPT_daemonize" ]; then
            CALL_electron open
        else

            if [ ! -z "$ARGS_OPT_stop" ]; then

                pushd "$__DIRNAME__" > /dev/null

                    # TODO: Call devcomp API and tell it to stop.

                    # TODO: Only run stop below if '--kill' is specified (this will leave an electron window open!)
                    CALL_process stop

                popd > /dev/null

            else

                pushd "$__DIRNAME__" > /dev/null
                    CALL_process daemonize {
                        "run": (bash.origin.script () >>>

                            # TODO: Remove '--daemonize' from args (using BO_strip_arg helper) and pass args along
                            BO_requireModule "./workspace.sh" as "workspace" run
                            
                        <<<)
                        # TODO: Write message on error and show tail of mon launch log
                    }
                popd > /dev/null

            fi
        fi

    popd > /dev/null

fi
