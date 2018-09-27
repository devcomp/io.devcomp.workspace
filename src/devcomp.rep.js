
const JQUERY = require("jquery");
window.$ = JQUERY;
const GOLDEN_LAYOUT = require("golden-layout");


const ipcRenderer = window.API.ELECTRON.ipcRenderer;


exports.main = function (JSONREP, node) {

    return JSONREP.markupNode(node).then(function (html) {

        return JSONREP.makeRep(
            '<div style="width: 100%; height: 100%;"></div>',
            {
                on: {
                    mount: function (el) {
                        var helpers = this;

try {

    window.onbeforeunload = (e) => {

        ipcRenderer.send('exit');
    }


    var layout = new GOLDEN_LAYOUT({
        settings: {
            showPopoutIcon: false,
            showMaximiseIcon: false,
            showCloseIcon: true
        },
        content: [{
            type: 'stack',
            content:[{
                type: 'component',
                componentName: 'doc',
                componentState: { text: 'Document' },
                isClosable: true
            }]
        }]
    }, el);

    layout.registerComponent( 'doc', function( container, componentState ) {


        function setHTML (html) {

            container.getElement().html([
                '<div style="padding: 2px; height: 100%; box-sizing: border-box;">',
                '<div style="background-color: white; height: 100%; box-sizing: border-box; padding: 5px;">',
                html,
                '</div>',
                '</div>'
            ].join("\n"));


            setTimeout(function () {

                // TODO: Relocate to helpers
                Array.from(el.querySelectorAll('[_repid]')).forEach(function (el) {

                    var rep = JSONREP.getRepForId(el.getAttribute("_repid"));
                    if (
                        rep &&
                        rep.on &&
                        rep.on.mount
                    ) {
                        rep.on.mount(el);
                    }
                });   

            }, 0);
        }


        ipcRenderer.on('doc', function (event, doc) {


            return JSONREP.markupNode(JSON.parse(doc)).then(function (html) {
            
                setHTML(html);

            }).catch(console.error);

        });

        setHTML(html);

    });

    layout.init();



    ipcRenderer.send('ready');

} catch (err) {
    console.error(err);
}

                    }
                }
            }
        );
    });
}

