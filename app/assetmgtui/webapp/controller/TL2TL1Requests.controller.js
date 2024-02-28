
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox"
  ], function (Controller, JSONModel,formatter,Fragment,MessageBox) {
    "use strict";
    let hrReqID =null;
  
    return Controller.extend("assetmgtui.controller.TL2TL1Requests", {
        formatter: formatter,
        onInit: function () {
            this.getView().setModel(new JSONModel(), "tl1RequestsModel");
       
        var oData = {
            rows: [
                { 
                    "quotationDescription": "", 
                    "quotationPrice": "" ,
                    "status": "false"
                }
            ]
        };
        var oModel = new JSONModel(oData);
        this.getView().setModel(oModel);
         
        
            
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
                  $filter: "parentRequestID ne " + parentRequestID + " and (status eq 'Progress with Team Lead 2' )"
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
          
          let url = this.getOwnerComponent().getModel("oDaModel").getServiceUrl() + "Request" //+ "?$expand=quotations";
          var that = this;
          $.ajax({
              url: url,
              method: "GET",
              dataType: "json",
              data: {
                  $filter: "parentRequestID eq " + parentReqID
              },
              success: function(data) {
                  var tl1ParticularRequestdata=data.value
                  console.log(tl1ParticularRequestdata)
                  var jsonModel = new JSONModel(data);
                  that.getView().setModel(jsonModel, "tl1ParticularRequestModel");
                  that.getView().getModel("dataModel").setProperty("/TL2TL1SelectedDatas",data.value)
                  if (!that.pDialog) {
                      that.pDialog = Fragment.load({
                          id: that.getView().getId(),
                          name: "assetmgtui.fragment.TL2ViewParticularTL1Request",
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
                        that.fetchRequests(); // You may need to pass parameters here depending on your requirement
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error("Error updating HR request status:", errorThrown);
                    }
                });
            },

            // onRejectPress: function(){
            //     this.RequestStatusUpdate('Rejected');
            // },
            

            // Assuming that the fragment is being opened and closed using methods like openFragment and closeFragment

            onRejectPress: function () {
                let hrRequests=this.getView().getModel("dataModel").getProperty("/TL2TL1SelectedDatas");
                var url = this.getOwnerComponent().getModel("oDaModel").getServiceUrl() + "Request/";
                var that = this;

                hrRequests.forEach(function(hrRequest) {
                var request = {
                    hrRequestID: hrRequest.hrRequestID,
                    status: 'Rejected by TeamLead 2'
                };

                $.ajax({
                    url: url +   hrRequest.hrRequestID ,
                    method: "PATCH",
                    contentType: "application/json",
                    data: JSON.stringify(request),
                    success: function(data) {
                        console.log("Status updated to 'Rejected' for HR request with ID:", hrRequest.hrRequestID);
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.error("Error updating status for HR request with ID:", hrRequest.hrRequestID, "Error:", errorThrown);
                    }
                });
            });

              that.onCloseFragment();    
              that.fetchRequests();
        },
            
        
        
  


        openCreateQuotations: function() {
            var oView = this.getView();
            var oModel = oView.getModel("tl1ParticularRequestModel");
            var sParentRequestID = oModel.getProperty("/value/0/parentRequestID");

            if (!this._oCreateQuotationDialog) {
                this._oCreateQuotationDialog = Fragment.load({
                    id: oView.getId(),
                    name: "assetmgtui.fragment.AddQuotations",
                    controller: this
                }).then(function(oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this._oCreateQuotationDialog.then(function(oDialog) {
                oDialog.open();
                // Set the parentRequestID value in the fragment
                oDialog.byId("parentRequestIdText").setText("Parent Request ID: " + sParentRequestID);
                // Set font size
                oDialog.byId("parentRequestIdText").addStyleClass("sapUiLargeMargin");
            });
        },


        
         onCloseAddQuotationDialog: function (oController) {
            if (oController._addQuotationDialog) {
               oController._addQuotationDialog.close();
            }
         },
   



onAddRowPress: function() {
    var oModel = this.getView().getModel();
    var aRows = oModel.getProperty("/rows");
    aRows.push({ "description": "", "price": "" });
    oModel.setProperty("/rows", aRows);
},

onRemoveRowPress: function(oEvent) {
    var oModel = this.getView().getModel();
    var sPath = oEvent.getSource().getBindingContext().getPath();
    var index = parseInt(sPath.split("/").pop());
    var aRows = oModel.getProperty("/rows");
    aRows.splice(index, 1);
    oModel.setProperty("/rows", aRows);
},

onSubmitPress: function() {
    var oModel = this.getView().getModel();
    var aData = oModel.getProperty("/rows");
    var sParentRequestID = this.byId("requestIdText").getText().split(":")[1].trim(); // Extracting parentRequestID from the text

    // Prepare data for submission with parentRequestID included
   
    var aQuotationData = aData.map(function(quotation) {
        return {
            "quotationDescription": quotation.description,
            "quotationPrice": quotation.price,
            "status": "false", // Assuming status is initially set to "false"
            "parentRequestID": sParentRequestID // Assigning the parentRequestID
        };
    });
    

    var url = this.getOwnerComponent().getModel("oDaModel").getServiceUrl() + "Quotation"; // Adjust this URL according to your backend endpoint
    aQuotationData.forEach(function (arrayItem) {

        $.ajax({
            url: url , // Append the hrReqID to the URL
            method: "POST", // Use PATCH method to update the existing record
            contentType: "application/json",
            data: JSON.stringify(arrayItem), // Pass the new status in the request body
            success: function (data) {
                // If the request is successful, fetch the updated HR requests
                // MessageBox.success("New Request Added"); // You may need to pass parameters here depending on your requirement
                // this.onClosePress();
                // this.onCloseFragment();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error updating HR request status:", errorThrown);
            }
        });
})
},

onClosePress: function() {
    this.byId("addQuotation").close();
},


     

  
        onCloseFragment: function () {
            this.byId("tl2tl1RequestsAction").close();
          },
  
    });
  });
  
  