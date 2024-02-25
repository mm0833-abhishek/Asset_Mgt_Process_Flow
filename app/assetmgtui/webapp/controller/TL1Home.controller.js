// sap.ui.define([
//     "sap/ui/core/mvc/Controller",
//     "sap/ui/model/json/JSONModel",
//     "../model/formatter",
//     "sap/ui/core/Fragment",
//     "sap/m/MessageBox"
// ], function (Controller, JSONModel,formatter,Fragment,MessageBox) {
//     "use strict";

//     return Controller.extend("assetmgtui.controller.TL1Home", {
//         formatter: formatter,
//         onInit: function () {
//             this.getView().setModel(new JSONModel(), "hrRequestsModel");
//             this.getView().setModel(new JSONModel({
//                 hrID:"HR234",
//                 item:"Laptop",
//                 status:"Progress"
//             }), "createHrRequestModel");
            
//             this.fetchRequests();
//         },

//         fetchRequests: function () {
//             let url =this.getOwnerComponent().getModel().getServiceUrl() +"Request";
//             var that = this;
//             var parentRequestID = "NULL"; // HR ID to filter requests
//             $.ajax({
//                 url: url,      //   "/odata/v4/catalog/Request",
//                 method: "GET",
//                 dataType: "json",
//                 data: {
//                     $filter: "parentRequestID eq '" + parentRequestID + "'"
//                 },
//                 success: function (data) {
//                     var jsonModel = new JSONModel(data.value);
//                     that.getView().setModel(jsonModel, "hrRequestsModel");
//                 },
//                 error: function (jqXHR, textStatus, errorThrown) {
//                     console.error("Error fetching HR requests:", errorThrown);
//                 }
//             });
//         },

//         onCreateHrRequest: function () {
//             if (!this.pDialog) {
//               this.pDialog = Fragment.load({
//                 id: this.getView().getId(),
//                 name: "assetmgtui.fragment.AddHrRequest",
//                 controller: this,
//               }).then(
//                 function (oDialog) {
//                   this.getView().addDependent(oDialog);
//                   return oDialog;
//                 }.bind(this) 
//               ); 
//             }
//             this.pDialog.then((oDialog) => {
//                 oDialog.setBindingContext(
//                   this.getView().getModel("createHrRequestModel").createBindingContext(),
//                   "createHrRequestModel"
//                 );
//                 oDialog.open();
//             });
//         },


//         onAddCreateHrRequest: function () {
//             var oNewHrRequestData = this.getView().getModel("createHrRequestModel").getData();
//             var url = this.getOwnerComponent().getModel().getServiceUrl() + "Request";
      
//             $.ajax({
//                 method: "POST",
//                 url: url,
//                 contentType: "application/json",
//                 data: JSON.stringify(oNewHrRequestData),
//                 success: function () {
//                     MessageBox.success("Employee Added ");
//                 }.bind(this),
//                 error: function (error) {
//                     this.showMessagePopover([{
//                         type: "Error",
//                         title: "API Error",
//                         description: error.responseJSON.error.message,
//                     }]);
//                 }.bind(this),
//             });
//         }, 

//         onCancelCreateHrRequest: function () {
//             this.byId("createHrRequestDialog").close();
//           },
        
        
//     });
// });



// sap.ui.define(
//     [
//         "sap/ui/core/mvc/Controller"
//     ],
//     function(BaseController) {
//       "use strict";
  
//       return BaseController.extend("assetmgtui.controller.TL1Home", {
//         onInit: function() {
//         },

//         handleNavigation: function(){
//             var oRouter= sap.ui.core.UIComponent.getRouterFor(this);
//             oRouter.navTo("TL1Home")
//         },

//         onStatusUpdatedRequestsPress: function(){
//             var oRouter= sap.ui.core.UIComponent.getRouterFor(this);
//             oRouter.navTo("TL1HrRequests")
//         },


//         onRaisedRequestsPress: function(){
//             var oRouter= sap.ui.core.UIComponent.getRouterFor(this);
//             oRouter.navTo("TL1RaisedRequests")
//         },


//         onFinanceResponcesPress: function(){
//             var oRouter= sap.ui.core.UIComponent.getRouterFor(this);
//             oRouter.navTo("TL1FinanceResponces")
//         },


//         onStatusUpdatedRequestsPress: function(){
//             var oRouter= sap.ui.core.UIComponent.getRouterFor(this);
//             oRouter.navTo("TL1StatusUpdatedRequests")
//         }
//       });
//     }
//   );



//=================================================================================================================================



// sap.ui.define(
//     [
//         "sap/ui/core/mvc/Controller"
//     ],
//     function(BaseController) {
//       "use strict";
  
//       return BaseController.extend("assetmgtui.controller.TL1Home", {
//         onInit: function() {
//         },

//         onFinanceResponcesPress: function(){
//             var oRouter= sap.ui.core.UIComponent.getRouterFor(this);
//             oRouter.navTo("TL1FinanceResponces")
//         },

//         onHRRequestsPress: function(){
//             var oRouter= sap.ui.core.UIComponent.getRouterFor(this);
//             oRouter.navTo("TL1HrRequests")
//         },


//         onRaisedRequestsPress: function(){
//             var oRouter= sap.ui.core.UIComponent.getRouterFor(this);
//             oRouter.navTo("TL1RaisedRequests")
//         },


//         onStatusUpdatedRequestsPress: function(){
//             var oRouter= sap.ui.core.UIComponent.getRouterFor(this);
//             oRouter.navTo("TL1StatusUpdatedRequests ")
//         },


//         onSuccRejRequestsPress: function(){ // Renamed the function to avoid conflict
//             var oRouter= sap.ui.core.UIComponent.getRouterFor(this);
//             oRouter.navTo("TL1StatusUpdatedRequests")
//         }
//       });
//     }
//   );


//=================================================================================================================================


// sap.ui.define([
// 	"sap/ui/model/json/JSONModel",
// 	"sap/ui/core/mvc/Controller",
// 	"sap/m/Button",
// 	"sap/m/Dialog",
// 	"sap/m/MessageToast",
// 	"sap/m/Text",
// 	"sap/ui/core/Fragment"
// ], function (JSONModel, Controller, Button, Dialog, MessageToast, Text, Fragment) {
// 	"use strict";
// 	return Controller.extend("assetmgtui.controller.TL1Home", {
// 		onInit: function () {
			
// 		},
        
// 			onCreateTL1Request: function () {
// 				let url =this.getOwnerComponent().getModel("oDaModel").getServiceUrl() +"Request";
// 				var that = this;
// 			  var parentRequestID = '00000000-0000-0000-0000-000000000000'; // HR ID to filter requests
// 			//       var hrID='HR123'
// 				$.ajax({
// 					url: url,      //   "/odata/v4/catalog/Request",
// 					method: "GET",
// 					dataType: "json",
// 					// data: {
// 					//     $filter: "parentRequestID eq '" + parentRequestID + "'"  // for string data
// 					// },
// 					data: {
// 						$filter: "parentRequestID eq " + parentRequestID   // for UUID data
// 					},
				   
// 					success: function (data) {
// 						var jsonModel = new JSONModel(data.value);
// 						that.getView().setModel(jsonModel, "hrRequestsModel");
// 					},
// 					error: function (jqXHR, textStatus, errorThrown) {
// 						console.error("Error fetching HR requests:", errorThrown);
// 					}
// 				});

// 				if (!this.pDialog) {
// 					//    console.log(this.getView().getId())
// 						this.pDialog = Fragment.load({
// 						  id: this.getView().getId(),
// 						  name: "assetmgtui.fragment.CreateNewTL1Request",
// 						  controller: this,
// 						}).then(
// 						  function (oDialog) {
// 							this.getView().addDependent(oDialog);
// 							return oDialog;
// 						  }.bind(this) 
// 						); 
// 					} 
// 					this.pDialog.then((oDialog) => {
// 						oDialog.open();
// 					});
					
// 			},
        
// 	});
// });





sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"
], function (JSONModel, Controller, Fragment) {
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
                    $filter: "parentRequestID eq " + parentRequestID
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

        // _onValueHelpConfirmPress: function (oEvent) {
        //     var oSelectedItem = oEvent.getParameter("selectedItem");
        //     let empDepartment = this.getView().byId("empDepartmentId");
    
        //     if (oSelectedItem) {
        //       var sSelectedDepartmentId = oSelectedItem.getTitle();
    
        //       empDepartment.setValue(sSelectedDepartmentId);
    
        //       console.log("Selected Department ID:", sSelectedDepartmentId);
        //     }
        //   },
    


// _onValueHelpConfirmPress: function (oEvent) {
//     var aSelectedItems = oEvent.getParameter("selectedItems");
//     var sDescription = "";
//     aSelectedItems.forEach(function (oItem) {
//         sDescription += "Request ID: " + oItem.getTitle() + ", Item: " + oItem.getDescription() + "\n";
//     });
//     // Do something with the selected items
//     console.log(sDescription);
// },
        



// _onValueHelpConfirmPress: function (oEvent) {
//     var aSelectedItems = oEvent.getParameter("selectedItems");
//     if (aSelectedItems) {
//         var sDescription = "";
//         aSelectedItems.forEach(function (oItem) {
//             sDescription += "Request ID: " + oItem.getTitle() + ", Item: " + oItem.getDescription() + "\n";
//         });
//         // Do something with the selected items
//         console.log(sDescription);
//     } else {
//         // Handle the case when no item is selected (e.g., cancel button clicked)
//         console.log("No items selected.");
//     }
// },



_onValueHelpConfirmPress: function (oEvent) {
    var aSelectedItems = oEvent.getParameter("selectedItems");
    if (aSelectedItems && aSelectedItems.length > 0) {
        var sDescription = "";
        aSelectedItems.forEach(function (oItem) {
            sDescription += "Request ID: " + oItem.getTitle() + ", Item: " + oItem.getDescription() + "\n";
        });
        // Do something with the selected items
        console.log(sDescription);
    } else {
        // Handle the case when no item is selected (e.g., cancel button clicked)
        console.log("No items selected.");
    }
},




        onSubmitPress: function () {
            // Add your submit logic here
        },
        onClosePress: function () {
            this.pDialog.then(function (oDialog) {
                oDialog.close();
            });
        },
        // formatter: {
        //     formatRequest: function (sRequestID, sItem) {
        //         return "Request ID: " + sRequestID + ", Item: " + sItem;
        //     }
        //}
    });
});

