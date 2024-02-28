
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox"
], function (Controller, JSONModel,formatter,Fragment,MessageBox) {
    "use strict";
    let hrReqID =null;

    return Controller.extend("assetmgtui.controller.TL1HrRequests", {
        formatter: formatter,
        onInit: function () {
            this.getView().setModel(new JSONModel(), "hrRequestsModel");
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
                    $filter: "parentRequestID eq " + parentRequestID + " and (status ne 'Success' and status ne 'Rejected')"
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
        
        onSelect: function (oEvent) {
            hrReqID = oEvent.getSource().getBindingContext("hrRequestsModel").getProperty("hrRequestID");
            //this.fetchRequests(hrReqID);

            let url =this.getOwnerComponent().getModel("oDaModel").getServiceUrl() +"Request";
            var that = this;
            $.ajax({
                url: url,      
                method: "GET",
                dataType: "json",
                // data: {
                //     $filter: "parentRequestID eq '" + parentRequestID + "'"  // for string data
                // },
                data: {
                    $filter: "hrRequestID eq " + hrReqID   // for UUID data
                },
               
                success: function (data) {
                    var jsonModel = new JSONModel(data.value[0]);
                    that.getView().setModel(jsonModel, "tl1ParticularHrRequestModel");
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error("Error fetching HR requests:", errorThrown);
                }
            });
        

            if (!this.pDialog) {
            //    console.log(this.getView().getId())
                this.pDialog = Fragment.load({
                  id: this.getView().getId(),
                  name: "assetmgtui.fragment.TL1HrRequestAction",
                  controller: this,
                }).then(
                  function (oDialog) {
                    this.getView().addDependent(oDialog);
                    return oDialog;
                  }.bind(this) 
                ); 
            } 
            this.pDialog.then((oDialog) => {
                oDialog.open();
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
                        if(statusToUpdate==='Success'){
                            MessageBox.success("HR Request Approved");
                        }
                        else{
                            MessageBox.success("HR Request Rejected");
                        }
                         that.onCloseFragment();   
                        // If the request is successful, fetch the updated HR requests
                        that.fetchRequests(); // You may need to pass parameters here depending on your requirement
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error("Error updating HR request status:", errorThrown);
                    }
                });
            },
            
        


        onApprove: function(){
            this.RequestStatusUpdate('Approved by TeamLead 1');
        },


        onReject: function(){
            this.RequestStatusUpdate('Rejected by TeamLead 1');
        },

        onCloseFragment: function () {
            this.byId("tl1HrRequestsAction").close();
          },

    });
});

