/* eslint-disable radix */
const _ = require("lodash");
const CONSTANTS = require("../../helpers/Constants");

function fundprocesss(bucket, views, price, type) {
  if (type === CONSTANTS.PRICING_TYPES_ENUM.PAY_PER_VIEW) {
    const perView = price.amountPerView;
    const maxAmount = price.maxAmount;
    const baseAmount = parseInt(views) * parseInt(perView);
    const conditionAmount = baseAmount > maxAmount ? maxAmount : baseAmount;
    const bucketValue = CONSTANTS.QUALITY.METRICS[bucket] / 100;
    const qualifiedAmount = conditionAmount * bucketValue;
    const commission = qualifiedAmount * (CONSTANTS.COMMISSION.DEFAULT / 100);
    const finalAmount = qualifiedAmount - commission;
    return { commission, qualifiedAmount, finalAmount };
  }
  if (type === CONSTANTS.PRICING_TYPES_ENUM.PAY_PER_CLICK) {
    const perView = price.amountPerClick;
    const maxAmount = price.maxAmount;
    const baseAmount = parseInt(views) * parseInt(perView);
    const conditionAmount = baseAmount > maxAmount ? maxAmount : baseAmount;
    const bucketValue = CONSTANTS.QUALITY.METRICS[bucket] / 100;
    const qualifiedAmount = conditionAmount * bucketValue;
    const commission = qualifiedAmount * (CONSTANTS.COMMISSION.DEFAULT / 100);
    const finalAmount = qualifiedAmount - commission;
    return { commission, qualifiedAmount, finalAmount };
  }
  if (type === CONSTANTS.PRICING_TYPES_ENUM.PAY_PER_INFLUENCER) {
    const conditionAmount = price.maxAmount;
    const bucketValue = CONSTANTS.QUALITY.METRICS[bucket] / 100;
    const qualifiedAmount = conditionAmount * bucketValue;
    const commission = qualifiedAmount * (CONSTANTS.COMMISSION.DEFAULT / 100);
    const finalAmount = qualifiedAmount - commission;
    return { commission, qualifiedAmount, finalAmount };
  }
}

module.exports.calulateFund = (bucket, views, request, campaign) => {
  const pricingConfig = campaign.pricing;
  let amount;
  if (request.paymentTier === CONSTANTS.PRICING.ENUM.NORMAL) {
    const requesterType = request.requesterType;
    if (request.paymentTier === pricingConfig.tier) {
      const tierData = pricingConfig.normal;
      const keyBy = _.keyBy(tierData, "influencerType");
      amount = fundprocesss(
        bucket,
        views,
        keyBy[requesterType],
        pricingConfig.type
      );
    }
  }
  return amount;
};
