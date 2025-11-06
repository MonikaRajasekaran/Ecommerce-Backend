const service = require("../services/category.service");
const product = require("../../products/services/product.service");
const _ = require("lodash");
const httpStatus = require("http-status");
const helpers = require("../../../helpers/helpers");
const APIError = require("../../../helpers/APIError.helper");
const logger = require("../../../../config/winston")(module);

module.exports.get = async (req, res, next) => {
    const { query, organisation } = req;
    const payload = { ...query }
    payload.orgId = organisation.orgId;
    try {
        const data = await service.fetch(payload, 0, 50);
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

module.exports.create = async (req, res, next) => {
    const { body, user, organisation } = req;
    body.orgId = organisation.orgId;
    body.alias = body.name.toLowerCase().replace(/ /g, '_');
    if (user['cognito:groups'].indexOf("OWNER") == -1) {
        return next(
            new APIError(
                "Not authorized to access",
                httpStatus.UNAUTHORIZED,
                true,
                "Not Authorized"
            )
        );
    }
    try {
        const response = await service.create(body)
        return res.status(httpStatus.CREATED).send(response);

    } catch (e) {
        return next(
            new APIError(e.message, e.status, true, res.__("system_error"))
        );
    }
}

module.exports.getById = async (req, res, next) => {
    const { user, params, organisation } = req;
    const payload = { ...params }
    payload.orgId = organisation.orgId;
    try {
        const data = await service.fetchOne(payload, 0, 50);
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

module.exports.patch = async (req, res, next) => {
    const { body, params } = req;
    const selective = _.pick(body, ['status', 'name'])
    try {
        const data = await service.patch(params, selective);
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

module.exports.delete = async (req, res, next) => {
    const { params, user, organisation } = req;
    if (user['cognito:groups'].indexOf("OWNER") == -1) {
        return next(
            new APIError(
                "Not authorized to access",
                httpStatus.UNAUTHORIZED,
                true,
                "Not Authorized"
            )
        );
    }
    try {
        const document = await service.fetchOne(params);
        if (document && document.orgId == organisation.orgId) {
            const response = await service.delete(params);
            return res.status(httpStatus.OK).send(response);
        }
        return next(
            new APIError(
                "Not authorized to access",
                httpStatus.UNAUTHORIZED,
                true,
                "Not Authorized"
            )
        );
    } catch (e) {
        return next(
            new APIError(e.message, e.status, true, res.__("system_error"))
        );
    }
};

module.exports.getDetailedProduct = async (req, res, next) => {
    const { query, organisation } = req;
    const payload = { ...query }
    payload.orgId = organisation.orgId;
    try {
        const data = await service.fetch(payload, 0, 50);
        if (data) {
            const keys = _.map(data, 'categoryId');
            const products = await product.fetch({ categoryId: { $in: keys } }, 0, 500)
            const groupBy = _.groupBy(products, 'categoryId');
            const processed = _.map(data, (value) => {
                const obj = value.toObject();
                if (value.categoryId in groupBy) {
                    obj.productList = groupBy[value.categoryId]
                }
                return obj;
            })
            return res
                .status(httpStatus.OK)
                .json(processed);
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