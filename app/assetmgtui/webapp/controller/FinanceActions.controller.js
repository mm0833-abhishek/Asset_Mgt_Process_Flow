
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",

], function (Controller, JSONModel) {
    "use strict";
    var jsonModel=null;

    return Controller.extend("assetmgtui.controller.FinanceActions", {
        onInit: function () {
            
            this.fetchRequests();
        },

        // fetchRequests: function () {
        //     let url = this.getOwnerComponent().getModel("oDaModel").getServiceUrl() + "Quotation";
        //     var that = this;
        //     var status = "selected";
        //     $.ajax({
        //         url: url,
        //         method: "GET",
        //         dataType: "json",
        //         data: {
        //             $filter: "status eq '" + status + "'"
        //         },
        //         success:async function (data) {
                    
        //             let res=[];
        //             let arr= data.value;
        //             let i=0;
        //              arr.forEach(async element => {
        //                 await that.fetchStatusAndItem(element.parentRequestID, function (datas) {
        //                    //console.log(data); // Handle retrieved data here
        //                 let prevData=arr[i++]
        //                 prevData.overallStatus=datas.status;
        //                 prevData.item=datas.item;
        //                 // console.log(prevData)
        //                 res.push(prevData)
        //                 if (res.length === arr.length) {
        //                     // All data has been processed, set model
        //                     jsonModel = new JSONModel(res);
        //                     that.getView().setModel(jsonModel, "thRequestsModel");
        //                 }

        //                 });
        //             });
        //             // console.log(res)
        //             // jsonModel = new JSONModel(res);
        //             // that.getView().setModel(jsonModel, "thRequestsModel");
        //             //await that.getView().getModel("thRequestsModel").setProperty("/",arr)
        
        //         },
        //         error: function (jqXHR, textStatus, errorThrown) {
        //             console.error("Error fetching Team Head requests:", errorThrown);
        //         }
        //     });
        // },
        
        // fetchStatusAndItem: function (parentRequestID, callback) {
        //     let url = this.getOwnerComponent().getModel("oDaModel").getServiceUrl() + "Request";
        //     var that = this;
        //     $.ajax({
        //         url: url,
        //         method: "GET",
        //         dataType: "json",
        //         data: {
        //             $filter: "parentRequestID eq " + parentRequestID+" and status eq 'Approved by Finance' or status eq 'Rejected by Finance'"
        //         },
        //         success: function (data) {
        //             callback(data.value[0]); // Call the callback function with the retrieved data
        //         },
        //         error: function (jqXHR, textStatus, errorThrown) {
        //             console.error("Error fetching Team Head requests:", errorThrown);
        //         }
        //     });
        
        // },


//================================================================================



        fetchRequests: function () {
            let url = this.getOwnerComponent().getModel("oDaModel").getServiceUrl() + "Request";
            var that = this;
            $.ajax({
                url: url,
                method: "GET",
                dataType: "json",
                data: {
                    $filter: "status eq 'Approved by Finance' or status eq 'Rejected by Finance'"
                },
                success:async function (data) {
                    let res=[];
                    let arr= data.value;
                    let i=0;
                     arr.forEach(async element => {
                        await that.fetchStatusAndItem(element.parentRequestID, function (datas) {
                           //console.log(data); // Handle retrieved data here
                        let prevData=arr[i++]
                        prevData.quotationDescription=datas.quotationDescription;
                        prevData.quotationPrice=datas.quotationPrice;
                        // console.log(prevData)
                        res.push(prevData)
                        if (res.length === arr.length) {
                            // All data has been processed, set model
                            jsonModel = new JSONModel(res);
                            that.getView().setModel(jsonModel, "thRequestsModel");
                        }

                        });
                    });
                    // console.log(res)
                    // jsonModel = new JSONModel(res);
                    // that.getView().setModel(jsonModel, "thRequestsModel");
                    //await that.getView().getModel("thRequestsModel").setProperty("/",arr)
        
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error("Error fetching Team Head requests:", errorThrown);
                }
            });
        
        

        },


        fetchStatusAndItem: function (parentRequestID, callback) {
            let url = this.getOwnerComponent().getModel("oDaModel").getServiceUrl() + "Quotation";
            var that = this;
            $.ajax({
                url: url,
                method: "GET",
                dataType: "json",
                data: {
                    $filter: "parentRequestID eq " + parentRequestID+" and status eq 'selected'"
                },
                success: function (data) {
                   // console.log(data.value)
                    callback(data.value[0]); // Call the callback function with the retrieved data
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error("Error fetching Team Head requests:", errorThrown);
                }
            });
        
        },
        

    });
});

