sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox"
], function (Controller, JSONModel, formatter, Fragment, MessageBox) {
    "use strict";

    return Controller.extend("assetmgtui.controller.FinanceTHRequests", {
        formatter: formatter,
        onInit: function () {
            this.getView().setModel(new JSONModel(), "thRequestsModel");
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
                    $filter: "parentRequestID ne " + parentRequestID + " and (status eq 'Progress with Finance' )"
                },
                success: function (data) {
                    var uniqueData = that.getUniqueRequests(data.value);
                    //  console.log(data.value)
                    var jsonModel = new sap.ui.model.json.JSONModel(uniqueData);
                    that.getView().setModel(jsonModel, "thRequestsModel");
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





        onSelect: function (oEvent) {
            let parentReqID = oEvent.getSource().getBindingContext("thRequestsModel").getProperty("parentRequestID");
            let item=oEvent.getSource().getBindingContext("thRequestsModel").getProperty("item");
            // console.log(parentReqID);
            // console.log(item)

            let url = this.getOwnerComponent().getModel("oDaModel").getServiceUrl() + "Quotation";
            var that = this;
            let status="selected"
            $.ajax({
                url: url,
                method: "GET",
                dataType: "json",
                data: {
                    $filter: "parentRequestID eq " + parentReqID +" and status eq '"+status+"'"
                },
                success: function (data) {
                    //var tl2ParticularRequestdata=data.value
                    //console.log(tl1ParticularRequestdata)
                    var jsonModel = new JSONModel(data.value[0]);
                    that.getView().setModel(jsonModel, "thParticularRequestModel");
                    
                    that.getView().getModel("thParticularRequestModel").setProperty("/item",item)
                
                    if (!that.pDialog) {
                        that.pDialog = Fragment.load({
                            id: that.getView().getId(),
                            name: "assetmgtui.fragment.FinanceViewParticularTHRequest",
                            controller: that,
                        }).then(function (oDialog) {
                            that.getView().addDependent(oDialog);
                            return oDialog;
                        });
                    }
                    that.pDialog.then(function (oDialog) {
                        oDialog.open();
                    });
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error("Error fetching HR requests:", errorThrown);
                }
            });
        },




        RequestStatusUpdate: function (statusToUpdate,parentReqID) {
            let url = this.getOwnerComponent().getModel("oDaModel").getServiceUrl() + "Request";
            var that = this;
            //var parentReqID =oEvent.getSource().getBindingContext("thParticularRequestModel").getProperty("parentRequestID");
            // var parentReqID = this.byId("thRequests").getSelectedItem().getBindingContext("thParticularRequestModel").getObject().parentRequestID
            console.log(parentReqID)

            $.ajax({
                url: url, // Append the hrReqID to the URL
                method: "GET", // Use PATCH method to update the existing record
                dataType: "json",
                data: {
                    $filter: "parentRequestID eq " + parentReqID
                },
                success: function (data) {
                    var HrReqIDsForSelectedQuotation = data.value.map(item => (
                        item.hrRequestID));

                    HrReqIDsForSelectedQuotation.forEach((item) => {
                        that.updateStatus(statusToUpdate, item, url)
                    })
                    that.fetchRequests(); // You may need to pass parameters here depending on your requirement
                    MessageBox.success("Request "+statusToUpdate.split(" ")[0]+ " Successfully")
                    that.onCloseFragment();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error("Error updating HR request status:", errorThrown);
                }
            });
        },

        updateStatus: function (statusToUpdate, hrReqID, url) {
            $.ajax({
                url: url + "(" + hrReqID + ")",
                method: "PATCH",
                contentType: "application/json",
                data: JSON.stringify({ status: statusToUpdate }), // Pass the new status in the request body
                success: function (data) {
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error("Error updating HR request status:", errorThrown);
                }
            });

        },

        onRejectRequest:function(oEvent){
           var parentReqID=this.getView().getModel("thParticularRequestModel").getProperty("/parentRequestID")
           this.RequestStatusUpdate("Rejected by Finance",parentReqID)            
        },

        onApprove:function(oEvent){
            var parentReqID=this.getView().getModel("thParticularRequestModel").getProperty("/parentRequestID")
           this.RequestStatusUpdate("Approved by Finance",parentReqID)     
        },


        onCloseFragment: function () {
            this.byId("thRequests").close();
        },

    });
});

