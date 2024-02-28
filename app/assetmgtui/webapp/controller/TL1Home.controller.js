
sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/base/util/uid"
], function (JSONModel, Controller, Fragment, uid) {
    "use strict";
    return Controller.extend("assetmgtui.controller.TL1Home", {
        onInit: function () {
            
        },
        onCreateTL1Request: function () {
            var parentRequestID = '00000000-0000-0000-0000-000000000000'; // HR ID to filter requests
            var url = this.getOwnerComponent().getModel("oDaModel").getServiceUrl() + "Request";
            var that = this;
            $.ajax({
                url: url,
                method: "GET",
                dataType: "json",
                data: {
                    $filter: "parentRequestID eq " + parentRequestID + " and (status ne 'Success' and status ne 'Rejected')"
                },
                success: function (data) {
                    var jsonModel = new JSONModel(data.value);
					//console.log(jsonModel)
                    that.getView().setModel(jsonModel, "hrRequestsModel");
                    that.openDialog();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error("Error fetching HR requests:", errorThrown);
                }
            });
        },
        openDialog: function () {
            if (!this.pDialog) {
                this.pDialog = Fragment.load({
                    id: this.getView().getId(),
                    name: "assetmgtui.fragment.CreateNewTL1Request",
                    controller: this
                }).then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    return oDialog;
                }.bind(this));
            }
            this.pDialog.then(function (oDialog){
               
                oDialog.open();
            });
        },

        onRequest: function () {
            if (!this._oValueHelpDialog) {
              this._oValueHelpDialog = Fragment.load({
                id: this.getView().getId(),
                name: "assetmgtui.fragment.TL1AddReqValueHelp",
                controller: this,
              }).then(
                function (oDialog) {
                  this.getView().addDependent(oDialog);
                  return oDialog;
                }.bind(this)
              );
            }
            this._oValueHelpDialog.then((oDialog) => {
              oDialog.open();
            });
          },
        onSelectionChange: function (oEvent) {
            var aSelectedItems = oEvent.getParameter("selectedItems");
            var sDescription = "";
            aSelectedItems.forEach(function (oItem) {
                sDescription += "Request ID: " + oItem.getKey() + ", Item: " + oItem.getText() + "\n";
            });
            this.getView().byId("description").setValue(sDescription);
        },

 


onSaveTL1Requests: function(oEvent) {
    var oDialog = this.byId("createNewTL1Request");
    var oMultiComboBox = this.byId("selectHrRequests");
    var oDescriptionInput = this.byId("descriptionInput");
    if (!oMultiComboBox.getSelectedItems().length || !oDescriptionInput.getValue()) {
        // Show error message
        sap.m.MessageToast.show("Please fill in all required fields.");
        return;
    }
    let arr=[]

    var aSelectedItems = oMultiComboBox.getSelectedItems().map(function(oItem) {
        return {
            hrReq: oItem.getText(),
          //  additionalText: oItem.getAdditionalText()
          
        };
    });
    var sDescription = oDescriptionInput.getValue();

    // Process the selected items and description
    console.log("Selected Items: ", aSelectedItems);
    console.log("Description: ", sDescription);

  //aSelectedItems= [ {hrReq: '084bce71-1fae-47e3-810e-b31eeac8186e'}, {hrReq: '1297b16b-1fae-47e3-810e-b31eeac8186e'}]



    // Assuming data is already defined as [{age:123},{age:1234},{age:111}]
//var data = [{age:123},{age:1234},{age:111}];

// Iterate through the data array and create an AJAX PATCH request for each item

let url=this.getOwnerComponent().getModel("oDaModel").getServiceUrl() + "Request/"
aSelectedItems.forEach(function(item) {
    var hrRequestID = item.hrReq;
    var parentReqID = globalThis.crypto.randomUUID()
    let status='Progress with Team Lead 2'
    

    // Create the AJAX PATCH request
    $.ajax({
        url: url+hrRequestID,
        method: "PATCH",
        contentType: "application/json",
        data: JSON.stringify({
            "parentRequestID": parentReqID,
            "status":status
        }),
        success: function(response) {
            // Handle success response
            console.log("Employee ID updated for age " + hrRequestID);
        },
        error: function(xhr, status, error) {
            // Handle error response
            console.error("Error updating employee ID for age " + hrRequestID + ": " + error);
        }
    });
});


    // Close the dialog if needed
    oDialog.close();
},


        
        onClosePress: function () {
            this.pDialog.then(function (oDialog) {
                oDialog.close();
            });
        },


        NavToTL2: function(){
            var oRouter= sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("TL2Home")
        }
    });
});

