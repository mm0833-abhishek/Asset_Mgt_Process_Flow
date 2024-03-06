// sap.ui.define(['sap/suite/ui/commons/library', 'sap/ui/core/mvc/Controller', 'sap/ui/model/json/JSONModel', 'sap/m/MessageToast'],
// 	function (SuiteLibrary, Controller, JSONModel, MessageToast) {
// 		"use strict";

// 		return Controller.extend("assetmgtui.controller.ProcessFlow", {
// 			onInit: function () {
// 				var oView = this.getView();
// 				this.oProcessFlow1 = oView.byId("processflow1");
// 			//	this.oProcessFlow2 = oView.byId("processflow2");

// 				var sDataPath = sap.ui.require.toUrl("assetmgtui/model/ProcessFlowLanesAndNodes.json");
// 				var oModelPf1 = new JSONModel(sDataPath);
// 				oView.setModel(oModelPf1);
// 				oModelPf1.attachRequestCompleted(this.oProcessFlow1.updateModel.bind(this.oProcessFlow1));

// 				// sDataPath = sap.ui.require.toUrl("sap/suite/ui/commons/sample/ProcessFlow/ProcessFlowLanesOnly.json");
// 				// var oModelPf2 = new JSONModel(sDataPath);
// 				// oView.setModel(oModelPf2, "pf2");
// 				// oModelPf2.attachRequestCompleted(this.oProcessFlow2.updateModel.bind(this.oProcessFlow2));
// 			},

// 			onOnError: function (event) {
// 				MessageToast.show("Exception occurred: " + event.getParameters().text);
// 			},

// 			// onHeaderPress: function (event) {
// 			// 	var sDataPath = sap.ui.require.toUrl("sap/suite/ui/commons/sample/ProcessFlow/ProcessFlowNodes.json");
// 			// 	this.getView().getModel("pf2").loadData(sDataPath);
// 			// },

// 			// onNodePress: function (event) {
// 			// 	MessageToast.show("Node " + event.getParameters().getNodeId() + " has been clicked.");
// 			// },

// 			onZoomIn: function () {
// 				this.oProcessFlow1.zoomIn();

// 				MessageToast.show("Zoom level changed to: " + this.oProcessFlow1.getZoomLevel());
// 			},

// 			onZoomOut: function () {
// 				this.oProcessFlow1.zoomOut();

// 				MessageToast.show("Zoom level changed to: " + this.oProcessFlow1.getZoomLevel());
// 			},


// 		});
// 	});



//=======================================================================






sap.ui.define(['sap/suite/ui/commons/library', 'sap/ui/core/mvc/Controller', 'sap/ui/model/json/JSONModel', 'sap/m/MessageToast',"sap/m/MessageBox"],
    function (SuiteLibrary, Controller, JSONModel, MessageToast) {
        "use strict";

        return Controller.extend("assetmgtui.controller.ProcessFlow", {
            onInit: function () {
                // var oJsonModel= new JSONModel("./model/ProcessFlowLanesAndNodes.json");
                // this.getView().setModel(oJsonModel);
                // console.log(oJsonModel);



                // var oView = this.getView();
                this.oProcessFlow1 = this.getView().byId("processflow1");

                // // Load the initial JSON data for process flow
                // var sDataPath = sap.ui.require.toUrl("assetmgtui/model/ProcessFlowLanesAndNodes.json");
                // var oModelPf1 = new JSONModel(sDataPath);

                // oView.setModel(oModelPf1);

                // // Attach request completed event handler to update the model in the view
                // oModelPf1.attachRequestCompleted(this.oProcessFlow1.updateModel.bind(this.oProcessFlow1));
            },

            onError: function (event) {
                MessageToast.show("Exception occurred: " + event.getParameters().text);
            },

            onZoomIn: function () {
                this.oProcessFlow1.zoomIn();
                MessageToast.show("Zoom level changed to: " + this.oProcessFlow1.getZoomLevel());
            },

            onZoomOut: function () {
                this.oProcessFlow1.zoomOut();
                MessageToast.show("Zoom level changed to: " + this.oProcessFlow1.getZoomLevel());
            },

            onSearch: function (oEvent) {
                const sQuery = oEvent.getParameter("query");
                let url = this.getOwnerComponent().getModel("oDaModel").getServiceUrl() + "Request";
                var that = this;
                $.ajax({
                    url: url,
                    method: "GET",
                    dataType: "json",
                    data: {
                        $filter: "parentRequestID eq " + sQuery
                    },
                    success: function (data) {
                        // Transform data to the desired format
                        let stat=data.value[0].status.split(" ");
                        let lastWordOfStatus=stat[stat.length-1]
                        let firstWordOfStatus=stat[0];
                        // console.log(lastWordOfStatus, firstWordOfStatus)
                        let state=null;
                        switch (firstWordOfStatus) {
                            case "Approved":
                              state = "Positive";
                              break;
                            case "Rejected":
                              state = "Negative";
                              break;
                            case "Reverted":
                              state = "Critical";
                              break;
                            case "Progress":
                              state = "Neutral";
                              break;
                        }
                        let currentPosition=null;
                        switch (lastWordOfStatus) {
                            case "1":
                              currentPosition = 20;
                              break;
                            case "2":
                              currentPosition = 30;
                              break;
                            case "Head":
                              currentPosition = 40;
                              break;
                            case "Finance":
                              currentPosition = 50;
                              break;
                        }
                    //    console.log(currentPosition,state)
                        
                        var formattedData = data.value.map(item => ({
                            "id": item.hrRequestID,
                            "lane": "0",
                            "title": item.item,
                            "titleAbbreviation": "HR Request",
                            "children": [20],
                            "isTitleClickable": false,
                            "state": "Positive",
                            "stateText": "OK Status",
                            "focused": false,
                            "highlighted": false
                        }));

                        var oModel = that.getView().getModel("locModel");
                        var existingNodes = oModel.getProperty("/nodes");

                        existingNodes.forEach(item => {
                            if (item.id < currentPosition) {
                                item.state="Positive"
                                item.stateText= "OK status"
                            } else if (item.id == currentPosition) {
                                if(state=='Critical'){
                                    item.stateText="AD Issue"
                                }
                                else if(state=="Negative"){
                                    item.stateText="NOT OK status"
                                }
                                else if(state=="Positive"){
                                    item.stateText="OK Status"
                                }
                                item.state=state;
                             }
                            else {
                                item.state="Planned" // Push the item unchanged if it doesn't meet any condition
                            }
                        });
                        //console.log(existingNodes)


                        // Concatenate the existing data with the new data
                        var newData = existingNodes.concat(formattedData);
                        oModel.setProperty("/nodes", newData);
                        oModel.setProperty("/VisbleProcessFlow", true);  // Setting already existing property in .json file to true
                        that.getView().setModel("locModel")

                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        sap.m.MessageBox.error("Please enter the valid Request ID");
                    }
                });
            },

        });
    });
