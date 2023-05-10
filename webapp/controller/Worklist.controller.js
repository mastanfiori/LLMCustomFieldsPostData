sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (BaseController, JSONModel, formatter, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("com.nttdata.lakeshore.r300poconfirmation.controller.Worklist", {

        formatter: formatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the worklist controller is instantiated.
         * @public
         */
        onInit : function () {
            var oViewModel;

            // Model used to manipulate control states
            oViewModel = new JSONModel({
                worklistTableTitle : this.getResourceBundle().getText("worklistTableTitle"),
                shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
                shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
                tableNoDataText : this.getResourceBundle().getText("tableNoDataText")
            });
            this.setModel(oViewModel, "worklistView");

        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        /**
         * Triggered by the table's 'updateFinished' event: after new table
         * data is available, this handler method updates the table counter.
         * This should only happen if the update was successful, which is
         * why this handler is attached to 'updateFinished' and not to the
         * table's list binding's 'dataReceived' method.
         * @param {sap.ui.base.Event} oEvent the update finished event
         * @public
         */
        onUpdateFinished : function (oEvent) {
            // update the worklist's object counter after the table update
            var sTitle,
                oTable = oEvent.getSource(),
                iTotalItems = oEvent.getParameter("total");
            // only update the counter if the length is final and
            // the table is not empty
            if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
                sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
            } else {
                sTitle = this.getResourceBundle().getText("worklistTableTitle");
            }
            this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
        },

        /**
         * Event handler when a table item gets pressed
         * @param {sap.ui.base.Event} oEvent the table selectionChange event
         * @public
         */
        onPress : function (oEvent) {
            // The source is the list item that got pressed
            this._showObject(oEvent.getSource());
        },

        /**
         * Event handler for navigating back.
         * Navigate back in the browser history
         * @public
         */
        onNavBack : function() {
            // eslint-disable-next-line sap-no-history-manipulation
            history.go(-1);
        },


        onSearch : function (oEvent) {
            if (oEvent.getParameters().refreshButtonPressed) {
                // Search field's 'refresh' button has been pressed.
                // This is visible if you select any main list item.
                // In this case no new search is triggered, we only
                // refresh the list binding.
                this.onRefresh();
            } else {
                var aTableSearchState = [];
                var sQuery = oEvent.getParameter("query");

                if (sQuery && sQuery.length > 0) {
                    aTableSearchState = [new Filter("PurchaseOrder", FilterOperator.Contains, sQuery)];
                }
                this._applySearch(aTableSearchState);
            }

        },

        /**
         * Event handler for refresh event. Keeps filter, sort
         * and group settings and refreshes the list binding.
         * @public
         */
        onRefresh : function () {
            var oTable = this.byId("table");
            oTable.getBinding("items").refresh();
        },

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        /**
         * Shows the selected item on the object page
         * @param {sap.m.ObjectListItem} oItem selected Item
         * @private
         */
        _showObject : function (oItem) {
            this.getRouter().navTo("object", {
                objectId: oItem.getBindingContext().getPath().substring("/ZC_300_PURCHASEORDERDETAILS".length)
            });
        },

        /**
         * Internal helper method to apply both filter and search state together on the list binding
         * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
         * @private
         */
        _applySearch: function(aTableSearchState) {
            // var oTable = this.byId("table"),
            //     oViewModel = this.getModel("worklistView");
            // oTable.getBinding("items").filter(aTableSearchState, "Application");
            // // changes the noDataText of the list in case there are no filter results
            if (aTableSearchState.length !== 0) {
                oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
            }
        },
        onRebindTable: function (oEvent) {
			var mBindingParams = oEvent.getParameter("bindingParams");
			
			
		},
        onRowSelection:function(oEvent){
            // var selectedItems = oEvent.getSource().getObject();
            var selectedItems = oEvent.getSource().getSelectedIndices();

        },

        onSave: function(oEvent){
            var oSelectedData = this.getView().byId("table").getSelectedIndices(),
                items = [];
                var sPath = "/POHeadSet"
                // var payload = {
                //     "PurchaseOrder":"",
                //     "PurchaseOrderItem":"",
                //     "POItemSet":[{
                //         "PurchaseOrder":"",
                //         "PurchaseOrderItem":"",
                //         "POStatus":"",
                //         "POReuestedShipDate":"",
                //         "SupplierInitialShipDate":"",
                //         "SupplierEstimatedShipDate":"",
                //         "FollowUpDate":"",
                //         "ConfimedPOQty":"",
                //         "ConfirmedNetPrice":""                
                //      }]
                // };

                var payload = {},
                    itemset=[];
                    
                payload.PurchaseOrder = "10000012";
                // payload.PurchaseOrderItem = "0010";
                for (var i = 0; i < oSelectedData.length; i++){
                    var arr = {};
                        var obj = this.getView().byId("table").getContextByIndex(oSelectedData[i]).getObject();
                        // payload.PurchaseOrder = obj.PurchaseOrder;
                        // payload.PurchaseOrderItem = obj.PurchaseOrderItem;
                        arr.PurchaseOrder = obj.PurchaseOrder;
                        arr.PurchaseOrderItem = obj.PurchaseOrderItem;
                        arr.POStatus = obj.POStatus;
                        arr.POReuestedShipDate = obj.POReuestedShipDate;
                        arr.SupplierInitialShipDate = obj.SupplierInitialShipDate;
                        arr.SupplierEstimatedShipDate = obj.SupplierEstimatedShipDate;
                        arr.FollowUpDate = obj.FollowUpDate;
                        
                        var ConfimedPOQty = obj.ConfimedPOQty;
                        if(ConfimedPOQty === false){
                            arr.ConfimedPOQty = ""
                        }
                        else{
                            arr.ConfimedPOQty = "X" 
                        }
                        // arr.ConfimedPOQty = obj.ConfimedPOQty;
                        // arr.ConfirmedNetPrice = obj.ConfirmedNetPrice;
                        var ConfirmedNetPrice = obj.ConfirmedNetPrice;
                        if(ConfirmedNetPrice === false){
                            arr.ConfirmedNetPrice = ""
                        }
                        else{
                            arr.ConfirmedNetPrice = "X" 
                        } 
                        itemset.push(arr);
                    }
                    payload.NP_PODET = itemset;

                    // for(var j = 0; j<itemset.length; j++){
                    //     if(itemset[j].POStatus === "" ||
                    //         itemset[j].POReuestedShipDate === null ||
                    //         itemset[j].SupplierInitialShipDate === null ||
                    //         itemset[j].SupplierEstimatedShipDate === null ||
                    //         itemset[j].FollowUpDate === null){
                    //             sap.m.MessageBox.error("Please fill the required fields");
                    //             return;
                    //     }
                    // }


                    var oSuccess = function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        sap.m.MessageBox.show("Updated Successfully");
                        that.getView().byId("ProductionOrderDetails").rebindTable();
                        // this.byId("table").getBinding().refresh(true);
                    }.bind(this);
                    var oError = function (error) {
                        sap.ui.core.BusyIndicator.hide();
                    }.bind(this);
                    this.getOwnerComponent().getModel().create(sPath,payload, {
                        success: oSuccess,
                        error: oError
                    });
         
        }

    });
});
