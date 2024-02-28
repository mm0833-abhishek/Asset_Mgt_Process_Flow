
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
        //    this.getView().setModel(new JSONModel(), "hrRequestsModel");
            this.getView().setModel(new JSONModel({
                hrID:"HR345",
                item:"Laptop",
                status:"Progress with Team Lead 1",
                parentRequestID:"00000000-0000-0000-0000-000000000000"
            }), "createHrRequestModel");
            
            this.fetchRequests();
        },

        fetchRequests: function () {
            let url =this.getOwnerComponent().getModel("oDaModel").getServiceUrl() +"Request";
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


        // HR.controller.js
onAddCreateHrRequest: function () {
    var oNewHrRequestData = this.getView().getModel("createHrRequestModel").getData();
    var url = this.getOwnerComponent().getModel("oDaModel").getServiceUrl() + "Request";
  
    $.ajax({
        method: "POST",
        url: url,
        contentType: "application/json",
        data: JSON.stringify(oNewHrRequestData),
        success: function () {
            MessageBox.success("New Request Added");
            this.onCancelCreateHrRequest();
            // Trigger notification or popup for new HR request
            
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
        
        handleNavigation: function(){
            var oRouter= sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("TL1Home")
        }
    });
});

