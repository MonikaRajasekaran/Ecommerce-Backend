const httpStatus = require("http-status");
const _ = require("lodash");
const $ = require("mongo-dot-notation");
const helpers = require("./helpers");
const APIError = require("./APIError.helper");
const logger = require("../../config/winston")(module);
const service = require('../organisation/services/organisation.service.js');
// const staffService = require('../staffs/services/staff.service');
const subscription = require('../subscription/services/subscription.service');
const constants = require('./Constants');
const licenseKey = require('license-key-gen');

module.exports.create = async (body, userId) => {
    try {
        body.ownedBy = [userId]
        const org = await service.fetchOne({ ownedBy: { $in: body.ownedBy } });
        if (org) {
            return org;
        }
        const data = await service.create(body);
        if (data) {
            const payload = {
                userId: userId,
                orgId: data.orgId,
                orgRole: "OWNER"
            }
            // await staffService.create(payload)

            const licenseObj = {
                duration: constants.DURATION.TRIAL,
                date: {
                    start: new Date(),
                    end: new Date(Date.now() + 12096e5),
                },
                type: constants.TYPE.TRIAL,
                orgId: data.orgId
            }
            var licenseData = { info: licenseObj, prodCode: "LEN100120", appVersion: "1.5", osType: 'IOS8' }

            const licenseResponse = licenseKey.createLicense(licenseData);
            licenseObj.key = licenseResponse.license;
            licenseObj.orgId = data.orgId;
            const subscriptionObj = { key: licenseResponse.license }
            await service.patch({ orgId: data.orgId }, { $set: { subscription: subscriptionObj } })
            await subscription.create(licenseObj);
            return data;
        }
        logger.log({
            level: "info",
            message: `Failed to Create`,
        });
        return new APIError(
            "Failed to Create",
            httpStatus.BAD_REQUEST,
            true,
            res.__("failed_to_create")
        )
    } catch (e) {
        return new APIError(e.message, e.status, true, res.__("system_error"))

    }
};