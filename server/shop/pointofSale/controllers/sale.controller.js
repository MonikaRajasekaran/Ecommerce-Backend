const service = require("../services/sale.service");
const products = require("../../products/services/product.service");
const stocks = require("../../stocks/services/stock.service");
const items = require("../services/item.service");
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
    const { body, organisation } = req;
    body.orgId = organisation.orgId;
    try {
        const payload = { ...body }
        const itemList = []
        const productIds = _.map(body.products, 'productId');
        const productsDetails = await products.fetch({ productId: { $in: productIds } })
        const stocksDetails = await stocks.fetch({ productId: { $in: productIds } })
        if (productsDetails) {
            const keyBy = _.keyBy(productsDetails, 'productId')
            const stockBy = _.keyBy(stocksDetails, 'productId')
            _.map(body.products, (value) => {
                if (value.productId in keyBy && value.productId in stockBy && stockBy[value.productId].quantity >= value.quantity) {
                    const product = keyBy[value.productId]
                    const itemObj = {
                        name: product.name,
                        productId: product.productId,
                        amount: product.amount,
                        quantity: value.quantity,
                        pdtDesc: product.pdtSpec,
                        meta: product.toObject()
                    }
                    itemList.push(itemObj)
                }
            })
            if (itemList.length > 0) {
                payload.products = itemList

                const response = await service.create(payload)
                if (response) {
                    const processed = _.map(itemList, (value) => {
                        const itemObj = { productId: value.productId, amount: value.amount, quantity: value.quantity, name: value.name }
                        itemObj.saleId = response.saleId;
                        itemObj.orgId = organisation.orgId;
                        itemObj.stationId = body.stationId;
                        return itemObj;
                    })

                    await items.addBulk(processed)
                    // reduce the stock
                    _.map(itemList, (value) => {
                        stocks.patch({ productId: value.productId }, {
                            $inc: {
                                quantity: value.quantity * -1,
                            }
                        })
                    })
                    return res.status(httpStatus.CREATED).send({ message: "Successfully Created Order" });
                }
                return next(
                    new APIError(
                        "Failed to create order",
                        httpStatus.BAD_REQUEST,
                        true,
                        "Failed to create order",
                    )
                );
            }
            return next(
                new APIError(
                    "Stock Not available",
                    httpStatus.BAD_REQUEST,
                    true,
                    "Stock Not available",
                )
            );
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
}


module.exports.getById = async (req, res, next) => {
    const { user, params, organisation } = req;
    const payload = { ...params }
    payload.orgId = organisation.orgId;
    try {
        const response = await service.fetchOne(payload, 0, 50);
        if (response) {
            const data = { ...response.toObject() }
            if (response.station && response.station[0]) {
                data.station = response.station[0]
            }
            if (response.organisation && response.organisation[0]) {
                data.organisation = response.organisation[0]
            }
            const productList = await items.fetch(params);
            const finalList = _.map(productList, (value) => {
                const obj = { ...value.toObject() }
                if (value.products && value.products[0]) {
                    obj.product = value.products[0]
                }

                return obj
            })
            return res
                .status(httpStatus.OK)
                .json({ sales: data, productList: finalList });
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
    const selective = _.pick(body, ['quantity']);
    const payload = { $inc: selective }
    try {
        const data = await service.patch(params, payload);
        if (data) {
            await entryService.create({ productId: data.productId, ...selective })
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