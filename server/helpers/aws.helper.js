const AWS = require("aws-sdk");

AWS.config.update({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
    region: "ap-southeast-1"
});

const COGNITO_CLIENT = new AWS.CognitoIdentityServiceProvider({
    apiVersion: "2022-10-03",
    region: "ap-southeast-1"
});


module.exports.createUser = (username, attributes, password, role) => {
    return new Promise((resolve, reject) => {
        var poolData = {
            // UserPoolId: process.env.COGNITO_USER_POOL_ID,
            Username: username,
            TemporaryPassword: password,
            UserAttributes: [
                {
                    Name: "email",
                    Value: attributes.email
                },
                {
                    Name: 'name',
                    Value: attributes.name,
                },
                {
                    Name: "email_verified",
                    Value: "true"
                }
            ],
            ClientMetadata: {
                role: role,
            }
        };
        COGNITO_CLIENT.adminCreateUser(poolData, (error, data) => {
            if (error) {
                console.log(error)
                return reject(error);
            }
            console.log(data)
            return resolve(data);
        });
    })

}

module.exports.deleteUser = (username) => {
    return new Promise((resolve, reject) => {
        var poolData = {
            // UserPoolId: process.env.COGNITO_USER_POOL_ID,
            Username: username,
        };
        COGNITO_CLIENT.adminDeleteUser(poolData, (error, data) => {
            if (error) {
                return reject(error);
            }
            return resolve(data);
        });
    })

}


module.exports.updateGroup = (username, groupName) => {
    return new Promise((resolve, reject) => {
        var poolData = {
            GroupName: groupName,
            Username: username,
            // UserPoolId: process.env.COGNITO_USER_POOL_ID
        };
        console.log(poolData);
        COGNITO_CLIENT.adminAddUserToGroup(poolData, (error, data) => {
            if (error) {
                return reject(error);
            }
            return resolve(data);
        });
    })

}
