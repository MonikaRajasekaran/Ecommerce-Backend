/**
@swagger
{
	"components": {
		"schemas": {
			"Wallet": {
				"type": "object",
				"required": [
					"walletId",
					"accountId",
					"currencyCode",
					"isDefault"
				],
				"properties": {
					"walletId": {
						"type": "string"
					},
					"accountId": {
						"type": "string",
						"description": "user's first Name."
					},
					"currencyCode": {
						"type": "string",
						"description": "user's last Name."
					},
					"isDefault": {
						"type": "boolean"
					}
				},
				"example": {
					"walletId": "U74yuf7",
					"accountId": "D24Acf6",
					"currencyCode": "SGD",
					"isDefault": false
				}
			},
			"WalletResponse": {
				"type": "object",
				"required": [
					"walletId",
					"accountId",
					"currencyCode",
					"isDefault",
					"availableFunds"
				],
				"properties": {
					"walletId": {
						"type": "string"
					},
					"accountId": {
						"type": "string"
					},
					"currencyCode": {
						"type": "string",
						"description": "Currency Code"
					},
					"isDefault": {
						"type": "string",
						"description": "Indicates if this is default wallet"
					},
					"availableFunds": {
						"type": "double"
					}
				},
				"example": {
					"walletId": "U74yuf7",
					"accountId": "D24Acf6",
					"currencyCode": "SGD",
					"isDefault": false,
					"availableFunds": 32.4
				}
			}
		}
	}
}
*/
