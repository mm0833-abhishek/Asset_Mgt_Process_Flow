// sap.ui.define([
//     "sap/ui/core/mvc/Controller"
// ],
//     /**
//      * @param {typeof sap.ui.core.mvc.Controller} Controller
//      */
//     function (Controller) {
//         "use strict";

//         return Controller.extend("assetmgtui.controller.HR", {
//             onInit: function () {

//             }
//         });
//     });





// sap.ui.define([
//     "sap/ui/core/mvc/Controller",
//     "sap/ui/model/json/JSONModel",
//     "sap/ui/model/odata/v2/ODataModel"
// ], function (Controller, JSONModel, ODataModel) {
//     "use strict";

//     return Controller.extend("assetmgtui.controller.HR", {
//         onInit: function () {
//             this.getView().setModel(new JSONModel(), "hrRequestsModel");
//             this.fetchRequests();
//         },

//         fetchRequests: function () {
//             var oModel = new ODataModel("/odata/v4/catalog/", true); // Using the provided URI
//             var sPath = "/Request"; // Adjusted entity set name

//             var oFilter = new sap.ui.model.Filter("hrID", sap.ui.model.FilterOperator.EQ, "123");

//             oModel.read(sPath, {
//                 filters: [oFilter],
//                 success: function (oData) {
//                     this.getView().getModel("hrRequestsModel").setData(oData.results);
//                 }.bind(this),
//                 error: function (oError) {
//                     // Handle error
//                 }
//             });
//         }
//     });
// });




sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox"
], function (Controller, JSONModel,formatter,Fragment,MessageBox) {
    "use strict";

    return Controller.extend("assetmgtui.controller.HR", {
        formatter: formatter,
        onInit: function () {
            this.getView().setModel(new JSONModel(), "hrRequestsModel");
            this.getView().setModel(new JSONModel({
                hrID:"HR234",
                item:"Laptop",
                status:"Progress"
            }), "createHrRequestModel");
            
            this.fetchRequests();
        },

        fetchRequests: function () {
            let url =this.getOwnerComponent().getModel().getServiceUrl() +"Request";
            var that = this;
            var hrID = "HR123"; // HR ID to filter requests
            $.ajax({
                url: url,      //   "/odata/v4/catalog/Request",
                method: "GET",
                dataType: "json",
                data: {
                    $filter: "hrID eq '" + hrID + "'"
                },
                success: function (data) {
                    var jsonModel = new JSONModel(data.value);
                    that.getView().setModel(jsonModel, "hrRequestsModel");
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error("Error fetching HR requests:", errorThrown);
                }
            });
        },

        onCreateHrRequest: function () {
            if (!this.pDialog) {
              this.pDialog = Fragment.load({
                id: this.getView().getId(),
                name: "assetmgtui.fragment.AddHrRequest",
                controller: this,
              }).then(
                function (oDialog) {
                  this.getView().addDependent(oDialog);
                  return oDialog;
                }.bind(this) 
              ); 
            }
            this.pDialog.then((oDialog) => {
                oDialog.setBindingContext(
                  this.getView().getModel("createHrRequestModel").createBindingContext(),
                  "createHrRequestModel"
                );
                oDialog.open();
            });
        },


        onAddCreateHrRequest: function () {
            var oNewHrRequestData = this.getView().getModel("createHrRequestModel").getData();
            var url = this.getOwnerComponent().getModel().getServiceUrl() + "Request";
      
            $.ajax({
                method: "POST",
                url: url,
                contentType: "application/json",
                data: JSON.stringify(oNewHrRequestData),
                success: function () {
                    MessageBox.success("Employee Added ");
                }.bind(this),
                error: function (error) {
                    this.showMessagePopover([{
                        type: "Error",
                        title: "API Error",
                        description: error.responseJSON.error.message,
                    }]);
                }.bind(this),
            });
        }, 

        onCancelCreateHrRequest: function () {
            this.byId("createHrRequestDialog").close();
          },
        
        
    });
});

