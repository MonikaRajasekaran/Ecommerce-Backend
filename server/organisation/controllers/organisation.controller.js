const httpStatus = require("http-status");
const _ = require("lodash");
const $ = require("mongo-dot-notation");
const helpers = require("../../helpers/helpers");
const APIError = require("../../helpers/APIError.helper");
const logger = require("../../../config/winston")(module);
const service = require('../services/organisation.service.js');
const staffService = require("../../employee/services/employee.service.js");

const profileService = require("../../userProfile/services/profile.service.js");
const subscription = require('../../subscription/services/subscription.service');
const constants = require('../../helpers/Constants');
const licenseKey = require('license-key-gen');

module.exports.get = async (req, res, next) => {
    const { query, user } = req;
    query.ownedBy = { $in: user.sub }
    const payload = _.omit(query, ['user'])
    try {
        const data = await service.fetch(payload, 0, 100);
        if (data) {
            return res
                .status(httpStatus.OK)
                .json(data);
        }
        logger.log({
            level: "info",
            message: `Failed to Get`,
        });
        return next(
            new APIError(
                "Failed to Get",
                httpStatus.BAD_REQUEST,
                true,
                res.__("failed_to_get")
            )
        );
    } catch (e) {
        return next(
            new APIError(e.message, e.status, true, res.__("system_error"))
        );
    }
};

module.exports.getMine = async (req, res, next) => {
    const { query, user } = req;
    query.ownedBy = { $in: user.sub }
    const payload = _.omit(query, ['user'])
    try {
        const data = await service.fetchOne(payload);
        if (data) {

            const response = await subscription.fetchOne({ orgId: data.orgId, status: "ACTIVE" });
            return res
                .status(httpStatus.OK)
                .json({ ...data.toObject(), subscriptionDetail: response.toObject() });
        }
        else {
            return res
                .status(httpStatus.OK)
                .json({ error: "No Organisation found" });
        }

    } catch (e) {
        return next(
            new APIError(e.message, e.status, true, res.__("system_error"))
        );
    }
};

module.exports.create = async (req, res, next) => {
    const { body, user } = req;
    try {
        body.ownedBy = [user.sub]
        const org = await service.fetchOne({ ownedBy: { $in: body.ownedBy } });
        if (org) {
            return res.status(httpStatus.OK).send(org);
        }
        const data = await service.create(body);
        if (data) {

            const payload = {
                userId: user.sub,
                orgId: data.orgId,
                orgRole: "OWNER",
                dateOfJoining: new Date()
            }
            await staffService.create(payload)

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
            return res
                .status(httpStatus.CREATED)
                .json(data);
        }
        logger.log({
            level: "info",
            message: `Failed to Create`,
        });
        return next(
            new APIError(
                "Failed to Create",
                httpStatus.BAD_REQUEST,
                true,
                res.__("failed_to_create")
            )
        );
    } catch (e) {
        return next(
            new APIError(e.message, e.status, true, res.__("system_error"))
        );
    }
};

module.exports.patch = async (req, res, next) => {
    const { body, query, user } = req;
    try {

    } catch (e) {
        return next(
            new APIError(e.message, e.status, true, res.__("system_error"))
        );
    }
};

module.exports.delete = async (req, res, next) => {
    const { body, query, user } = req;
    try {

    } catch (e) {
        return next(
            new APIError(e.message, e.status, true, res.__("system_error"))
        );
    }
};