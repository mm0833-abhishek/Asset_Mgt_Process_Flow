// sap.ui.define([
//     "sap/ui/core/mvc/Controller",
//     "sap/ui/model/json/JSONModel",
//     "../model/formatter",
//     "sap/ui/core/Fragment",
//     "sap/m/MessageBox"
// ], function (Controller, JSONModel,formatter,Fragment,MessageBox) {
//     "use strict";

//     return Controller.extend("assetmgtui.controller.TL1Home", {
//         formatter: formatter,
//         onInit: function () {
//             this.getView().setModel(new JSONModel(), "hrRequestsModel");
//             this.getView().setModel(new JSONModel({
//                 hrID:"HR234",
//                 item:"Laptop",
//                 status:"Progress"
//             }), "createHrRequestModel");
            
//             this.fetchRequests();
//         },

//         fetchRequests: function () {
//             let url =this.getOwnerComponent().getModel().getServiceUrl() +"Request";
//             var that = this;
//             var parentRequestID = "NULL"; // HR ID to filter requests
//             $.ajax({
//                 url: url,      //   "/odata/v4/catalog/Request",
//                 method: "GET",
//                 dataType: "json",
//                 data: {
//                     $filter: "parentRequestID eq '" + parentRequestID + "'"
//                 },
//                 success: function (data) {
//                     var jsonModel = new JSONModel(data.value);
//                     that.getView().setModel(jsonModel, "hrRequestsModel");
//                 },
//                 error: function (jqXHR, textStatus, errorThrown) {
//                     console.error("Error fetching HR requests:", errorThrown);
//                 }
//             });
//         },

//         onCreateHrRequest: function () {
//             if (!this.pDialog) {
//               this.pDialog = Fragment.load({
//                 id: this.getView().getId(),
//                 name: "assetmgtui.fragment.AddHrRequest",
//                 controller: this,
//               }).then(
//                 function (oDialog) {
//                   this.getView().addDependent(oDialog);
//                   return oDialog;
//                 }.bind(this) 
//               ); 
//             }
//             this.pDialog.then((oDialog) => {
//                 oDialog.setBindingContext(
//                   this.getView().getModel("createHrRequestModel").createBindingContext(),
//                   "createHrRequestModel"
//                 );
//                 oDialog.open();
//             });
//         },


//         onAddCreateHrRequest: function () {
//             var oNewHrRequestData = this.getView().getModel("createHrRequestModel").getData();
//             var url = this.getOwnerComponent().getModel().getServiceUrl() + "Request";
      
//             $.ajax({
//                 method: "POST",
//                 url: url,
//                 contentType: "application/json",
//                 data: JSON.stringify(oNewHrRequestData),
//                 success: function () {
//                     MessageBox.success("Employee Added ");
//                 }.bind(this),
//                 error: function (error) {
//                     this.showMessagePopover([{
//                         type: "Error",
//                         title: "API Error",
//                         description: error.responseJSON.error.message,
//                     }]);
//                 }.bind(this),
//             });
//         }, 

//         onCancelCreateHrRequest: function () {
//             this.byId("createHrRequestDialog").close();
//           },
        
        
//     });
// });



// sap.ui.define(
//     [
//         "sap/ui/core/mvc/Controller"
//     ],
//     function(BaseController) {
//       "use strict";
  
//       return BaseController.extend("assetmgtui.controller.TL1Home", {
//         onInit: function() {
//         },

//         handleNavigation: function(){
//             var oRouter= sap.ui.core.UIComponent.getRouterFor(this);
//             oRouter.navTo("TL1Home")
//         },

//         onStatusUpdatedRequestsPress: function(){
//             var oRouter= sap.ui.core.UIComponent.getRouterFor(this);
//             oRouter.navTo("TL1HrRequests")
//         },


//         onRaisedRequestsPress: function(){
//             var oRouter= sap.ui.core.UIComponent.getRouterFor(this);
//             oRouter.navTo("TL1RaisedRequests")
//         },


//         onFinanceResponcesPress: function(){
//             var oRouter= sap.ui.core.UIComponent.getRouterFor(this);
//             oRouter.navTo("TL1FinanceResponces")
//         },


//         onStatusUpdatedRequestsPress: function(){
//             var oRouter= sap.ui.core.UIComponent.getRouterFor(this);
//             oRouter.navTo("TL1StatusUpdatedRequests")
//         }
//       });
//     }
//   );





sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("assetmgtui.controller.TL1Home", {
        onInit: function() {
        },

        onFinanceResponcesPress: function(){
            var oRouter= sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("TL1FinanceResponces")
        },

        onHRRequestsPress: function(){
            var oRouter= sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("TL1HrRequests")
        },


        onRaisedRequestsPress: function(){
            var oRouter= sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("TL1RaisedRequests")
        },


        onStatusUpdatedRequestsPress: function(){
            var oRouter= sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("TL1StatusUpdatedRequests ")
        },


        onSuccRejRequestsPress: function(){ // Renamed the function to avoid conflict
            var oRouter= sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("TL1StatusUpdatedRequests")
        }
      });
    }
  );
