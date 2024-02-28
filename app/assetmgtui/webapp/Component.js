/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "assetmgtui/model/models"
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("assetmgtui.Component", {
            metadata: {
                manifest: "json",
                // dependencies: {
                //     libs: [
                //         "sap.m",
                //         "sap.ui.layout",
                //         "sap.ui.core",
                //         "sap.suite.ui.commons"
                //     ]
                // },
                // config: {
                //     sample: {
                //         files: [
                //             "ProcessFlow.view.xml",
                //             "ProcessFlow.controller.js",
                //             "ProcessFlowLanesAndNodes.json",
                //             "ProcessFlowLanesOnly.json",
                //             "ProcessFlowNodes.json",
                //             "ProcessFlowNodesHighlightedNodes.json",
                //             "ProcessFlowUpdateModel.json"
                //         ]
                //     }
                // }
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
            }
        });
    }
);



// sap.ui.define([
//     "sap/ui/core/UIComponent",
//     "sap/ui/Device",
//     "assetmgtui/model/models"
// ], function(UIComponent, Device, models) {
//     "use strict";

//     return UIComponent.extend("assetmgtui.Component", {
//         metadata: {
//             manifest: "json"
//         },

//         init: function() {
//             // Call the init function of the parent
//             UIComponent.prototype.init.apply(this, arguments);

//             // Create the router
//             this.getRouter().initialize();
//         },

//         // Configure routing
//         createContent: function() {
//             // create a new root view with a given name
//             var oView = sap.ui.view({
//                 id: "app",
//                 viewName: "assetmgtui.view.App",
//                 type: "XML",
//                 viewData: {
//                     component: this
//                 }
//             });

//             // Set the model
//             var oModel = models.createDeviceModel();
//             oView.setModel(oModel, "device");

//             // Set the root view
//             return oView;
//         }
//     });
// });
