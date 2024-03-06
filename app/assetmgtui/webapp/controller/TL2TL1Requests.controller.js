
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
                //   var tl1ParticularRequestdata=data.value
                  //console.log(tl1ParticularRequestdata)
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
      
  
  
        
        // RequestStatusUpdate: function (statusToUpdate) {
        //         let url = this.getOwnerComponent().getModel("oDaModel").getServiceUrl() + "Request/";
        //         var that = this;
        //        // var parentRequestID = '00000000-0000-0000-0000-000000000000'; // HR ID to filter requests
            
        //         // Make an AJAX PATCH request to update the status
        //         $.ajax({
        //             url: url +  hrReqID , // Append the hrReqID to the URL
        //             method: "PATCH", // Use PATCH method to update the existing record
        //             contentType: "application/json",
        //             data: JSON.stringify({ status: statusToUpdate }), // Pass the new status in the request body
        //             success: function (data) {
        //                 // If the request is successful, fetch the updated HR requests
        //                 that.fetchRequests(); // You may need to pass parameters here depending on your requirement
        //             },
        //             error: function (jqXHR, textStatus, errorThrown) {
        //                 console.error("Error updating HR request status:", errorThrown);
        //             }
        //         });
        //     },

            onRejectPress: function(){
                this.RequestStatusUpdate('Rejected by Team Lead 2',"Request Rejected");
            },
            

            // Assuming that the fragment is being opened and closed using methods like openFragment and closeFragment

            RequestStatusUpdate: function (status,message) {
                let hrRequests=this.getView().getModel("dataModel").getProperty("/TL2TL1SelectedDatas");
                console.log(hrRequests);
                var url = this.getOwnerComponent().getModel("oDaModel").getServiceUrl() + "Request/";
                var that = this;
                let flag=null

                hrRequests.forEach(function(hrRequest) {
                var request = {
                    hrRequestID: hrRequest.hrRequestID,
                    status: status
                };

                $.ajax({
                    url: url +   hrRequest.hrRequestID ,
                    method: "PATCH",
                    contentType: "application/json",
                    data: JSON.stringify(request),
                    success: function(data) {
                        flag=true
                        console.log("Status updated to 'Rejected' for HR request with ID:", hrRequest.hrRequestID);
                        
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        flag=false;
                        console.error("Error updating status for HR request with ID:", hrRequest.hrRequestID, "Error:", errorThrown);
                    }
                });
            });
            setTimeout(()=>{
                if(flag){
                    MessageBox.success(message);
                    that.onCloseFragment();    
                    that.fetchRequests();
                }
                else{
                    console.log(flag)
                    MessageBox.error("Something went wrong");
                }
            },1000)
            
            
             
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
                // oDialog.byId("parentRequestIdText").setText("Parent Request ID: " + sParentRequestID);
                // // Set font size
                // oDialog.byId("parentRequestIdText").addStyleClass("sapUiLargeMargin");
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

// onSubmitPress:async function() {
//     var oModel = this.getView().getModel();
//     var aData = oModel.getProperty("/rows");
//     var sParentRequestID = this.byId("requestIdText").getText().split(":")[1].trim(); // Extracting parentRequestID from the text

//     // Prepare data for submission with parentRequestID included
   
//     var aQuotationData = aData.map(function(quotation) {
//         return {
//             "quotationDescription": quotation.description,
//             "quotationPrice": quotation.price,
//             "status": "false", // Assuming status is initially set to "false"
//             "parentRequestID": sParentRequestID // Assigning the parentRequestID
//         };
//     });
    
//     let flag=0;
//     var url = this.getOwnerComponent().getModel("oDaModel").getServiceUrl() + "Quotation"; // Adjust this URL according to your backend endpoint
//     aQuotationData.forEach(function (arrayItem) {

//         $.ajax({
//             url: url , // Append the hrReqID to the URL
//             method: "POST", // Use PATCH method to update the existing record
//             contentType: "application/json",
//             data: JSON.stringify(arrayItem), // Pass the new status in the request body
//             success: function (data) {
//                 flag++;
//                 // If the request is successful, fetch the updated HR requests
//                 // MessageBox.success("New Request Added"); // You may need to pass parameters here depending on your requirement
//                 // this.onClosePress();
//                 // this.onCloseFragment();
//             },
//             error: function (jqXHR, textStatus, errorThrown) {
//                 flag--;
//                 console.error("Error updating HR request status:", errorThrown);
//             }
//         });
// })
// if(flag==aQuotationData.length){
//     this.onClosePress();
//     this.onCloseFragment();
//     MessageBox.success("Quotation Added Successfully"); 
// }
// else{
//     MessageBox.error("Something went wrong"); 
// }
// },


onSubmitPress: async function() {
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

    try {
        var flag = 0;
        var url = this.getOwnerComponent().getModel("oDaModel").getServiceUrl() + "Quotation"; // Adjust this URL according to your backend endpoint

        for (const arrayItem of aQuotationData) {
            await new Promise((resolve, reject) => {
                $.ajax({
                    url: url,
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(arrayItem),
                    success: function(data) {
                        flag++;
                        resolve();
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        flag--;
                        console.error("Error updating HR request status:", errorThrown);
                        reject(errorThrown);
                    }
                });
            });
        }

        if (flag === aQuotationData.length) {
            this.RequestStatusUpdate('Progress with Team Head',"Quotation Added Successfully");
            this.onClosePress();
            this.onCloseFragment();
            //MessageBox.success("Quotation Added Successfully");

        } else {
            MessageBox.error("Something went wrong");
        }
    } catch (error) {
        MessageBox.error("Error occurred: " + error);
    }
},


onClosePress: function() {
    this.byId("addQuotation").close();
},


     

  
        onCloseFragment: function () {
            this.byId("tl2tl1RequestsAction").close();
          },
  
    });
  });
  
  