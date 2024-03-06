
sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "../model/formatter",
  "sap/ui/core/Fragment",
  "sap/m/MessageBox"
], function (Controller, JSONModel,formatter,Fragment,MessageBox) {
  "use strict";
  let hrReqID =null;

  return Controller.extend("assetmgtui.controller.TL1RaisedRequests", {
      formatter: formatter,
      onInit: function () {
          this.getView().setModel(new JSONModel(), "tl1RequestsModel");
       //   this.getView().setModel(new JSONModel(), "createHrRequestModel");
          
          this.fetchRequests();
      },
      

      fetchRequests: function () {
        let url = this.getOwnerComponent().getModel("oDaModel").getServiceUrl() + "Request";
        var that = this;
        var parentRequestID = '00000000-0000-0000-0000-000000000000'; // HR ID to filter requests
    
        $.ajax({
            url: url,
            method: "GET",
            dataType: "json",
            data: {
                $filter: "parentRequestID ne " + parentRequestID 
            },
            success: function (data) {
                var uniqueData = that.getUniqueRequests(data.value);
                var jsonModel = new sap.ui.model.json.JSONModel(uniqueData);
                that.getView().setModel(jsonModel, "tl1RequestsModel");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error fetching HR requests:", errorThrown);
            }
        });
    },
    
    getUniqueRequests: function (requests) {
        var uniqueRequests = [];
        var uniqueIds = [];
        requests.forEach(function (request) {
            if (!uniqueIds.includes(request.parentRequestID)) {
                uniqueRequests.push(request);
                uniqueIds.push(request.parentRequestID);
            }
        });
        return uniqueRequests;
    },
    
    



    onSelect: function(oEvent) {
        let parentReqID = oEvent.getSource().getBindingContext("tl1RequestsModel").getProperty("parentRequestID");
        console.log(parentReqID);
    
        let url = this.getOwnerComponent().getModel("oDaModel").getServiceUrl() + "Request";
        var that = this;
        $.ajax({
            url: url,
            method: "GET",
            dataType: "json",
            data: {
                $filter: "parentRequestID eq " + parentReqID
            },
            success: function(data) {
                var jsonModel = new JSONModel(data);
                that.getView().setModel(jsonModel, "tl1ParticularRequestModel");
                if (!that.pDialog) {
                    that.pDialog = Fragment.load({
                        id: that.getView().getId(),
                        name: "assetmgtui.fragment.TL1ViewParticularTL1Request",
                        controller: that,
                    }).then(function(oDialog) {
                        that.getView().addDependent(oDialog);
                        return oDialog;
                    });
                }
                that.pDialog.then(function(oDialog) {
                    oDialog.open();
                });
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error("Error fetching HR requests:", errorThrown);
            }
        });
    },
    


      
      RequestStatusUpdate: function (statusToUpdate) {
              let url = this.getOwnerComponent().getModel("oDaModel").getServiceUrl() + "Request";
              var that = this;
             // var parentRequestID = '00000000-0000-0000-0000-000000000000'; // HR ID to filter requests
          
              // Make an AJAX PATCH request to update the status
              $.ajax({
                  url: url + "(" + hrReqID + ")", // Append the hrReqID to the URL
                  method: "PATCH", // Use PATCH method to update the existing record
                  contentType: "application/json",
                  data: JSON.stringify({ status: statusToUpdate }), // Pass the new status in the request body
                  success: function (data) {
                      // If the request is successful, fetch the updated HR requests
                      that.fetchRequests(); 
                  },
                  error: function (jqXHR, textStatus, errorThrown) {
                      console.error("Error updating HR request status:", errorThrown);
                  }
              });
          },
          
      


     

      onCloseFragment: function () {
          this.byId("tl1HrRequestsAction").close();
        },

  });
});

