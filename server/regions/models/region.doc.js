/**
@swagger
{
  "components": {
    "schemas": {
      "RegionCreateRequest": {
        "type": "object",
        "example": {
          "currency": {
            "currencyCode": "SGD",
            "displayAs": "SGD"
          },
          "bank": [
            {
              "bankName": "DBS",
              "logoUrl": "http://imageurl",
              "order": 1
            }
          ],
          "subscription": [
            {
              "subscriptionName": "Netflix",
              "logoUrl": "http://imageurl",
              "order": 1
            }
          ],
          "linkedAccount": [
            {
              "subscriptionName": "Google Home",
              "logoUrl": "http://imageurl",
              "order": 1
            }
          ],
          "payee": [
            {
              "payeeName": "Test User",
              "profileURL": "http://imageurl",
              "metaData": {
                "paymentTo": "CARD"
              }
            }
          ]
        }
      },
      "RegionCreateResponse": {
        "type": "object",
        "example": {
          "regionId": "FE$GF$#",
          "currency": {
            "currencyCode": "SGD",
            "displayAs": "SGD"
          },
          "bank": [
            {
              "bankName": "DBS",
              "logoUrl": "http://imageurl",
              "order": 1
            }
          ],
          "subscription": [
            {
              "subscriptionName": "Netflix",
              "logoUrl": "http://imageurl",
              "order": 1
            }
          ],
          "linkedAccount": [
            {
              "subscriptionName": "Google Home",
              "logoUrl": "http://imageurl",
              "order": 1
            }
          ],
          "payee": [
            {
              "payeeName": "Test User",
              "profileURL": "http://imageurl",
              "metaData": {
                "paymentTo": "CARD"
              }
            }
          ]
        }
      },
      "RegionUpdateRequest": {
        "type": "object",
        "example": {
          "currency": {
            "currencyCode": "SGD",
            "displayAs": "SGD"
          },
          "bank": {
            "bankName": "DBS",
            "logoUrl": "http://imageurl",
            "order": 1
          },
          "subscription": {
            "subscriptionName": "Netflix",
            "logoUrl": "http://imageurl",
            "order": 1
          },
          "linkedAccount": {
            "subscriptionName": "Google Home",
            "logoUrl": "http://imageurl",
            "order": 1
          },
          "payee": {
            "payeeName": "Test User",
            "profileURL": "http://imageurl",
            "metaData": {
              "paymentTo": "CARD"
            }
          }
        }
      },
      "RegionUpdateResponse": {
        "type": "object",
        "example": {
          "message": "Regional Data has been updated successfully"
        }
      }
    }
  }
}
*/

/**
@swagger
{
  "components": {
    "schemas": {
      "FullConfigurationResponse": {
        "type": "object",
        "example": {
          "regionId": "uf6c642OjN",
          "currency": {
            "currencyCode": "SGD",
            "displayAs": "SGD"
          },
          "banks": [
            {
              "status": "INACTIVE",
              "bankId": "lpmH2btC-",
              "bankName": "UOB",
              "logoUrl": "https://experience.staging.visainnovation.com/resources/experiences/development/bank-logo/Q10PcvCp7.png",
              "order": 1
            },
            {
              "status": "INACTIVE",
              "bankId": "tCQrFBjtH",
              "bankName": "OCBC",
              "logoUrl": "https://experience.staging.visainnovation.com/resources/experiences/development/bank-logo/fpfSWLhLK.png",
              "order": 2
            }
          ],
          "subscriptions": [
            {
              "status": "ACTIVE",
              "subscriptionId": "AghmmZf9R",
              "subscriptionName": "Prudential",
              "logoUrl": "https://sg-config-resource.s3.ap-southeast-1.amazonaws.com/experiences/qa/subscriptions/y9PkJdx5I.png",
              "order": 1
            },
            {
              "status": "ACTIVE",
              "subscriptionId": "H1yEJ5rI5",
              "subscriptionName": "Singtel",
              "logoUrl": "https://sg-config-resource.s3.ap-southeast-1.amazonaws.com/experiences/qa/subscriptions/5_BnUWGp5.png",
              "order": 2
            }
          ],
          "linkedAccounts": [
            {
              "status": "ACTIVE",
              "linkedAccountId": "UFG-8cBPV",
              "linkedAccountName": "Click to Pay with Visa",
              "logoUrl": "https://sg-config-resource.s3.ap-southeast-1.amazonaws.com/experiences/qa/linked-accounts/oRVhawhFU.png",
              "order": 1
            },
            {
              "status": "ACTIVE",
              "linkedAccountId": "U-aI81baK",
              "linkedAccountName": "Apple Pay",
              "logoUrl": "https://sg-config-resource.s3.ap-southeast-1.amazonaws.com/experiences/qa/linked-accounts/6evJ_S4Gq.png",
              "order": 2
            }
          ],
          "payees": [
            {
              "metaData": {
                "referenceId": "GlOHZ86yj5U",
                "paymentTo": "BANK",
                "referenceNumber": "20206221000002"
              },
              "status": "ACTIVE",
              "payeeId": "KfLqKQVR4",
              "payeeName": "Nurul Fatimah",
              "profileURL": "https://experience.staging.visainnovation.com/resources/experiences/qa/profile/6VaxZrurJ.png"
            },
            {
              "metaData": {
                "referenceId": "wcfUFHmrsRB",
                "paymentTo": "CARD",
                "referenceNumber": "4316482076099317"
              },
              "status": "ACTIVE",
              "payeeId": "hczSLiBKy",
              "payeeName": "Audrey Li",
              "profileURL": "https://experience.staging.visainnovation.com/resources/experiences/qa/profile/c6UPqj3GP.png"
            },
            {
              "metaData": {
                "referenceId": "thT_0XaHxa5",
                "paymentTo": "CARD",
                "referenceNumber": "4004909901202812"
              },
              "status": "ACTIVE",
              "payeeId": "pmL2MhOPi",
              "payeeName": "Charles Li",
              "profileURL": "https://experience.staging.visainnovation.com/resources/experiences/qa/profile/NYxpzQTUc.png"
            }
          ]
        }
      },
      "BanksConfigurationResponse": {
        "type": "object",
        "example": [
          {
            "status": "INACTIVE",
            "bankId": "lpmH2btC-",
            "bankName": "UOB",
            "logoUrl": "https://experience.staging.visainnovation.com/resources/experiences/development/bank-logo/Q10PcvCp7.png",
            "order": 1
          },
          {
            "status": "INACTIVE",
            "bankId": "tCQrFBjtH",
            "bankName": "OCBC",
            "logoUrl": "https://experience.staging.visainnovation.com/resources/experiences/development/bank-logo/fpfSWLhLK.png",
            "order": 2
          }
        ]
      },
      "CardsConfigurationResponse": {
        "type": "object",
        "example": {
          "subscriptions": [
            {
              "status": "ACTIVE",
              "subscriptionId": "AghmmZf9R",
              "subscriptionName": "Prudential",
              "logoUrl": "https://sg-config-resource.s3.ap-southeast-1.amazonaws.com/experiences/qa/subscriptions/y9PkJdx5I.png",
              "order": 1
            },
            {
              "status": "ACTIVE",
              "subscriptionId": "H1yEJ5rI5",
              "subscriptionName": "Singtel",
              "logoUrl": "https://sg-config-resource.s3.ap-southeast-1.amazonaws.com/experiences/qa/subscriptions/5_BnUWGp5.png",
              "order": 2
            }
          ],
          "linkedAccounts": [
            {
              "status": "ACTIVE",
              "linkedAccountId": "UFG-8cBPV",
              "linkedAccountName": "Click to Pay with Visa",
              "logoUrl": "https://sg-config-resource.s3.ap-southeast-1.amazonaws.com/experiences/qa/linked-accounts/oRVhawhFU.png",
              "order": 1
            },
            {
              "status": "ACTIVE",
              "linkedAccountId": "U-aI81baK",
              "linkedAccountName": "Apple Pay",
              "logoUrl": "https://sg-config-resource.s3.ap-southeast-1.amazonaws.com/experiences/qa/linked-accounts/6evJ_S4Gq.png",
              "order": 2
            }
          ]
        }
      },
      "CurrencyConfigurationResponse": {
        "type": "object",
        "example": {
          "currency": {
            "currencyCode": "SGD",
            "displayAs": "SGD"
          }
        }
      },
      "PayeeConfigurationResponse": {
        "type": "object",
        "example": [
          {
            "metaData": {
              "referenceId": "GlOHZ86yj5U",
              "paymentTo": "BANK",
              "referenceNumber": "20206221000002"
            },
            "status": "ACTIVE",
            "payeeId": "KfLqKQVR4",
            "payeeName": "Nurul Fatimah",
            "profileURL": "https://experience.staging.visainnovation.com/resources/experiences/qa/profile/6VaxZrurJ.png"
          },
          {
            "metaData": {
              "referenceId": "wcfUFHmrsRB",
              "paymentTo": "CARD",
              "referenceNumber": "4316482076099317"
            },
            "status": "ACTIVE",
            "payeeId": "hczSLiBKy",
            "payeeName": "Audrey Li",
            "profileURL": "https://experience.staging.visainnovation.com/resources/experiences/qa/profile/c6UPqj3GP.png"
          },
          {
            "metaData": {
              "referenceId": "thT_0XaHxa5",
              "paymentTo": "CARD",
              "referenceNumber": "4004909901202812"
            },
            "status": "ACTIVE",
            "payeeId": "pmL2MhOPi",
            "payeeName": "Charles Li",
            "profileURL": "https://experience.staging.visainnovation.com/resources/experiences/qa/profile/NYxpzQTUc.png"
          }
        ]
      }
    }
  }
}
*/
