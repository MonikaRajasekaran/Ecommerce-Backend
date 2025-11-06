module.exports = {
  SEGMENT: 3,
  ACCBASE: 1000000,
  DURATION: {
    TRIAL: 14,
    SUBSCRIBED: 365,
    FREE: 365
  },
  TYPE: {
    TRIAL: "TRIAL",
    SUBSCRIBED: "SUBSCRIBED",
    FREE: "FREE"
  },
  UPLOAD_ACL: "public-read",
  RESOURCE: {
    DELIMITER: "resources",
  },
  HOURS: 2,
  MINIMUM_TOP: 1000,
  STRIPE_URL: "https://api.stripe.com",
  FOREX_BASEURL: "https://fcsapi.com/api-v2/forex/base_latest",
  FOREX_BASE_CURRENCY: "USD",
  FOREX_BASE_UNIT: 1,
  CURRENCY_DECIMAL: 2,
  MOBILE_NUMBER: "+18142059661",
  TOKEN_EXPIRES_IN: {
    SIGNIN: "10d",
    REFRESH: "90d",
  },
  ROLE: {
    VISTIORS: "VISTIORS",
    DOCTORS: "DOCTORS",
    ADMIN: "ADMIN",
    MODERATOR: "MODERATOR",
  },
  FINANCIAL_ACCOUNT: {
    DEFAULT_ACCOUNT_TYPE: "SAVINGS",
  },
  FIREBASE: {
    SEND_API_ERROR_CODES: {
      REGTOKEN_NOT_REGISTERED: "messaging/registration-token-not-registered",
    },
    NOTIFICATION_TYPE: {
      SILENT: "silent",
      NORMAL: "normal",
    },
  },
  UPLOAD_MAX_FILESIZE: 1000 * 1000 * 12,
  COMMISSION: {
    DEFAULT: 15,
    METRIC: "PERCENT",
  },
  PLANS: {
    YEARLY: {
      PREMIUM: {
        id: "plan_M0sfa0xArxOQpW",
        period: "yearly"
      },
      BUSINESS: {
        id: "plan_M0sde8a7B9fRDB",
        period: "yearly"
      },
      BASIC: {
        id: "plan_M0sccJLRsPf2HI",
        period: "yearly"
      }
    },
    MONTHLY: {
      PREMIUM: {
        id: "plan_M0sbubw1ntD2Rs",
        period: "monthly"
      },
      BUSINESS: {
        id: "plan_M0sbRH0tehJAlI",
        period: "monthly"
      },
      BASIC: {
        id: "plan_M0saze3vCgZYcQ",
        period: "monthly"
      }
    }
  }
};
