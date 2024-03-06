sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox"
], function (Controller, JSONModel, formatter, Fragment, MessageBox) {
    "use strict";

    return Controller.extend("assetmgtui.controller.THTL2Requests", {
        formatter: formatter,
        onInit: function () {
            this.getView().setModel(new JSONModel(), "tl2RequestsModel");
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
                    $filter: "parentRequestID ne " + parentRequestID + " and (status eq 'Progress with Team Head' )"
                },
                success: function (data) {
                    var uniqueData = that.getUniqueRequests(data.value);
                    //  console.log(data.value)
                    var jsonModel = new sap.ui.model.json.JSONModel(uniqueData);
                    that.getView().setModel(jsonModel, "tl2RequestsModel");
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
            let parentReqID = oEvent.getSource().getBindingContext("tl2RequestsModel").getProperty("parentRequestID");
            console.log(parentReqID);

            let url = this.getOwnerComponent().getModel("oDaModel").getServiceUrl() + "Quotation";
            var that = this;
            $.ajax({
                url: url,
                method: "GET",
                dataType: "json",
                data: {
                    $filter: "parentRequestID eq " + parentReqID
                },
                success: function (data) {
                    //var tl2ParticularRequestdata=data.value
                    //console.log(tl1ParticularRequestdata)
                    var jsonModel = new JSONModel(data);
                    that.getView().setModel(jsonModel, "tl2ParticularRequestModel");
                    that.getView().getModel("dataModel").setProperty("/TL2SelectedDatas", data.value)
                    if (!that.pDialog) {
                        that.pDialog = Fragment.load({
                            id: that.getView().getId(),
                            name: "assetmgtui.fragment.THViewParticularTL2Request",
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




        RequestStatusUpdate: function (statusToUpdate) {
            let url = this.getOwnerComponent().getModel("oDaModel").getServiceUrl() + "Request";
            var that = this;
            var parentReqID = this.byId("selectingQuotation").getSelectedItem().getBindingContext("tl2ParticularRequestModel").getObject().parentRequestID

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


        onConfirmQuotationPress: function () {
            // Get the selected item from the Select control
            var oSelect = this.byId("selectingQuotation");
            var oSelectedItem = oSelect.getSelectedItem();

            // Check if an item is selected
            if (!oSelectedItem) {
                MessageBox.error("Please select a quotation.");
                return;
            }

            // Get the data of the selected item
            var oSelectedItemContext = oSelectedItem.getBindingContext("tl2ParticularRequestModel");
            var oSelectedQuotation = oSelectedItemContext.getObject();


            let selectedQuotationID = oSelectedQuotation.quotationID
            this.updateQuotationStatus("selected", selectedQuotationID)
        },


        updateQuotationStatus: function (status, selectedQuotationID) {
            let url = this.getOwnerComponent().getModel("oDaModel").getServiceUrl() + "Quotation/";
            // AJAX call to save data
            jQuery.ajax({
                url: url + selectedQuotationID,
                method: "PATCH",
                contentType: "application/json",
                data: JSON.stringify({ "status": status }),
                success: function (data, textStatus, jqXHR) {
                    this.onCloseFragment()
                    this.RequestStatusUpdate("Progress with Finance")
                    MessageBox.success("Quotation saved successfully.");

                }.bind(this),
                error: function (jqXHR, textStatus, errorThrown) {
                    MessageBox.error("Error while saving quotation: " + errorThrown);
                }
            });
        },

        onRejectRequest:function(){
            this.RequestStatusUpdate("Rejected by Team Head")            
        },

        onRevertRequest:function(){
            this.RequestStatusUpdate("Reverted Back by Team Head")            
        },

        onCloseFragment: function () {
            this.byId("tl2Requests").close();
        },

    });
});

