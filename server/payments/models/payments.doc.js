/**
@swagger
{
	"components": {
		"schemas": {
			 "processPaymentPayeeRequest": {
			      "type": "object",
			      "required": [
					"payeeId",
					"sourceAmount",
					"destinationAmount",
					"transferFee",
					"destinationCurrency", 
					"exchangeRate",
					"transactionType"
			      ],
			      "properties": {
			         "payeeId": {
			            "type": "string",
			            "description": "payeeId of the reciever's account"
			         },
			         "sourceAmount": {
			            "type": "string",
			            "description": "Amount to be deducted from senders account."
			         },
			         "destinationAmount": {
			            "type": "string",
			            "description": "Amount to be credited in recievers account."
			         },
			         "destinationCurrency": {
			            "type": "boolean",
			            "description": "Currency code of Currency needs to be credited in reciever's account."
			         },
			         "exchangeRate" :{
			            "type" : "string",
			            "description": "The exchange rate on which this transaction is happening. For same source and destination currency, it should be passed 1."
			         },
					"transactionType" :{
			            "type" : "string",
			            "description": "Pass OVERSEAS as transactionType for overseas transfer."
			         },
					"cardId" :{
			            "type" : "string",
			            "description": "cardId of sender for which transaction is happening. If not passed, it will pick up the default card."
			         },	
			      },
			      "example": {
					  "payeeId": "yfUYbUbfLX",
					  "sourceAmount": 1,
					  "destinationAmount": 0.7,
					  "transferFee": 0.3,
					  "destinationCurrency": "AUE", 
					  "exchangeRate" : 1.456,
					  "transactionType" : "OVERSEAS"
					}
		   },

		   "processPaymentPayeeResponse": {
		      "type": "object",
		      "required": [
				"paymentId",
				"message"
		      ],
		      "properties": {
		         "paymentId": {
		            "type": "string",
		            "description": "Payment id of the transaction."
		         },
		         "message": {
		            "type": "string",
		            "description": "Messsage denoting payment successfull.."
		         },

		      },
		      "example": {
				"paymentId": "I0P-vcl1t",
				"message": "Payment completed successfully."
		      }
			}
		}
	}
}
*/
