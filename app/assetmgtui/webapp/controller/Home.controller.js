sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("assetmgtui.controller.Home", {
            onInit: function () {

            }
        });
    });




// sap.ui.define([
//     "sap/ui/core/mvc/Controller",
//     "sap/ui/model/json/JSONModel",
//     "../model/formatter",
//     "sap/ui/core/Fragment",
//     "sap/m/MessageBox"
// ], function (Controller, JSONModel,formatter,Fragment,MessageBox) {

//     "use strict";

//     return Controller.extend("assetmgtui.controller.HR", {
//         formatter: formatter,
//         onInit: function () {

//     // Load HR requests when TL1 page is loaded
//     this.loadHRRequests();
// },

// loadHRRequests: function() {
//     // Dummy data for HR requests (replace with actual data retrieval)
//     var hrRequests = [
//         { hrRequestID: "HR001" },
//         { hrRequestID: "HR002" },
//         { hrRequestID: "HR003" }
//     ];
    
//     // Set HR requests data to the model
//     var oModel = new JSONModel({
//         hrRequests: hrRequests
//     });
//     this.getView().setModel(oModel, "tl1Model");
// }
//     })})



 
