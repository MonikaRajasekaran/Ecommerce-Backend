/* eslint-disable eqeqeq */
const httpStatus = require('http-status');
const licenseKey = require('license-key-gen');
const _ = require('lodash');

const APIError = require('../helpers/APIError.helper');
const logger = require('../../config/winston')(module);
const subscription = require('../subscription/services/subscription.service');
const organisation = require('../organisation/services/organisation.service');

exports.verify = (data) => async (req, res, next) => {
  const { path, method, user } = req;

  const index = _.findIndex(data, (o) => {
    if (o.regex) {
      return path.match(o.url);
    }
    return path === o.url;
  });
  if (index == -1 || data[index].method.indexOf(method) == -1) {
    const { sub } = user;
    const orgQuery = {
      $or: [
        { ownedBy: { $in: [sub] } },
        { managers: { $in: [sub] } },
        { staffs: { $in: [sub] } },
        
      ],
      status: { $nin: ['DELETED', 'CANCELED'] }
    };
    const orgDetails = await organisation.fetchOne(orgQuery);
    if (!orgDetails) {
      return next(
        new APIError(
          'You are not subscribed',
          httpStatus.PAYMENT_REQUIRED,
          true,
          'Subscription Required',
        ),
      );
    }
    req.organisation = orgDetails.toObject();
    const subDetails = await subscription.fetchOne({ orgId: orgDetails.orgId, status: 'ACTIVE' });
    if (!subDetails) {
      return next(
        new APIError(
          'You are not subscribed',
          httpStatus.PAYMENT_REQUIRED,
          true,
          'Subscription Required',
        ),
      );
    }
    req.subscription = subDetails;

    const licenseObj = {
      duration: subDetails.duration,
      date: {
        start: new Date(subDetails.date.start),
        end: new Date(subDetails.date.end),
      },
      type: subDetails.type,
      orgId: orgDetails.orgId,
    };
    const licenseData = {
      info: licenseObj, prodCode: 'LEN100120', appVersion: '1.5', osType: 'IOS8',
    };

    try {
      const license = licenseKey.validateLicense(licenseData, subDetails.key);
      const start = new Date(subDetails.date.start).getTime();
      const end = new Date(subDetails.date.end).getTime();
      const current = Date.now();
      if (current <= start && current >= end) {
        return next(
          new APIError(
            'You are not subscribed',
            httpStatus.PAYMENT_REQUIRED,
            true,
            'Subscription Required',
          ),
        );
      }
      return next();
    } catch (err) {
      return next(
        new APIError(err.message, err.status, true, 'Invalid License'),
      );
    }

    return next();
  }
  return next();

  // const staffDetail = await staff.fetchOne({ userId: user.sub });
  // console.log(staffDetail)
};
