// sap.ui.define([
//     "sap/ui/model/json/JSONModel",
//     "sap/ui/core/mvc/Controller",
//     "sap/ui/core/Fragment",
//     "sap/base/util/uid"
// ], function (JSONModel, Controller, Fragment, uid) {
//     "use strict";
//     return Controller.extend("assetmgtui.controller.TL2Home", {
//         onInit: function () {
            
//         },
//     }
// },);


sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("assetmgtui.controller.TL2Home", {
            onInit: function () {

            },
            NavToTH: function(){
                var oRouter= sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("THHome")
            }
        });
    });