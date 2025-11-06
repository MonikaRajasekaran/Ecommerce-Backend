const _ = require("lodash");

const httpStatus = require("http-status");
const unitService = require("../services/units.service");
const APIError = require("../../helpers/APIError.helper");
const helpers = require("../../helpers/helpers");
const logger = require("../../../config/winston")(module);
module.exports.createUnit = async (req, res, next) => {
  const { body, user, organisation } = req;
  body.createdBy = user.sub;
  body.orgId = organisation.orgId;
  
  try {
    const existingUnit = await unitService.getSingleDoc({ categoryId: body.categoryId });
    console.log(existingUnit);
    if (existingUnit) {
      const existingUnitObj = existingUnit.toObject();
      const bodyObj = { ...body };
      
      // Merge units - combine existing and new units
      const allUnits = [...(existingUnitObj.units || []), ...(bodyObj.units || [])];
      
      // Clean units - remove duplicates based on id or name (case-insensitive)
      const cleanedUnits = allUnits.reduce((acc, unit) => {
        const existingUnitIndex = acc.findIndex(u => 
          u.id === unit.id || 
          (u.name && unit.name && u.name.toLowerCase() === unit.name.toLowerCase())
        );
        
        if (existingUnitIndex === -1) {
          acc.push(unit);
        }
        return acc;
      }, []);
      
      // Handle variants - merge existing and new variants
      const existingVariantObj = existingUnitObj.variants || new Map();
      const newVariantObj = bodyObj.variants || {};
     
      // Convert existing variants to object if it's a Map
      const mergedVariants = Array.from(existingVariantObj.entries()).reduce((acc, [key, value]) => {
        acc[key] = Array.isArray(value) ? value : [value];
        return acc;
      }, {});
      Object.entries(newVariantObj).forEach(([key, values]) => {
        if (Array.isArray(values)) {
          const existingValues = mergedVariants[key] || [];
          const combinedValues = [...existingValues, ...values];
          mergedVariants[key] = [...new Set(combinedValues.map(v => v.toLowerCase()))];
        }
      });
      
      // Update existing document
      const updateData = {
        ...bodyObj,
        units: cleanedUnits,
        variants: mergedVariants
      };
      
      const updatedUnit = await unitService.patch({ unitId: existingUnitObj.unitId }, updateData);
      if (updatedUnit) {
        return res.status(httpStatus.OK).json(updatedUnit);
      }
    } else {
    
      console.log(body);
      const data = await unitService.create(body);
      
      if (data) {
        return res.status(httpStatus.OK).json(data);
      }
    }
    
    logger.log({
      level: "info",
      message: `Failed to Create/Update`,
    });
    return next(
      new APIError(
        "Failed to Create/Update",
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
module.exports.getUnit = async (req, res, next) => {
  const { query, user, organisation } = req;

  try {
    const { limit, skip, page } = query;
    const payload = _.omit(query, ["limit", "skip", "page"]);
    
    if (organisation) {``
      payload.orgId = organisation.orgId;
    }    const counts = await helpers.pager(
      limit,
      skip,
      page,
      await unitService.getUnitCount(payload)
    );
    const { itemCount, currentPage, totalPages } = counts;

    unitService
      .get(payload, counts.skipTo, counts.limitUntil)
      .then((response) => {
        res.status(httpStatus.OK).send({
          success: true,
          response,
          itemCount,
          currentPage,
          totalPages,
        });
      })
      .catch((e) => {
        next(new APIError(e.message, e.status, true, "Error"));
      });
  } catch (e) {
    next(new APIError(e.message, e.status, true, "Error"));
  }
};

module.exports.getUnitById = async (req, res, next) => {
  const { user, params, organisation } = req;
  const payload = { ...params };
  if (organisation?.orgId) {
    payload.orgId = organisation.orgId;
  }
  try {
    const data = await unitService.getUnitbyId(payload, 0, 50);
    if (data) {
      return res.status(httpStatus.OK).json(data);
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

module.exports.patchUnit = async (req, res, next) => {
  const { user, params, body } = req;
  const query = { ...params };
  // query.createdBy = user.sub;
  try {
    const data = await unitService.patch(query, body);
    if (data) {
      return res.status(httpStatus.OK).json(data);
    }
    logger.log({
      level: "info",
      message: `Failed to Patch`,
    });
    return next(
      new APIError(
        "Failed to Patch",
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

module.exports.deleteUnit = async (req, res, next) => {
  const { user, params } = req;
  const payload = { ...params };
  payload.createdBy = user.sub;
  try {
    const data = await unitService.delete(payload);
    if (data) {
      return res.status(httpStatus.OK).json({
        success: true,
      });
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

  // unitService.delete(query).then((response) => {
  //   res.status(httpStatus.OK).send({
  //     success: true,
  //     response,
  //   });
  // }).catch((e) => {
  //   next(new APIError(e.message, e.status, true, 'Error'));
  // });
};