sap.ui.define([], function () {
    "use strict";

    return {

        /**
         * Rounds the number unit value to 2 digits
         * @public
         * @param {string} sValue the number string to be rounded
         * @returns {string} sValue with 2 digits rounded
         */
        numberUnit : function (sValue) {
            if (!sValue) {
                return "";
            }
            return parseFloat(sValue).toFixed(2);
        },
        value: function (valu) {
			if (valu === "" || valu === null) {
				return true;
			} else if (valu !== "") {
				return false;
			}

		},
        edit: function(data){
            if(data === "Shipped" || data === "SHIPPED"){
                return false;
            }
        },

        switch: function(flag , flagg , ship){
            if(flag === true && flagg === true || ship === "Shipped" || ship === "SHIPPED"){
                return false;
            }
        },

       AmountCurrencyFormat : function(amount, currency) {
            if ((!currency) && (amount === 0)) {
                return "";
            }
            var FormattedAmount = sap.ui.core.format.NumberFormat.getCurrencyInstance({showMeasure: false, groupingEnabled: false}).format(amount, currency);
            return FormattedAmount +" " + currency;
        }

    // formatPRItmNum: function (vPRNum, vPRItmNum) {
    //     return vPRNum + "/" + (vPRItmNum);
    // }
    };

});
