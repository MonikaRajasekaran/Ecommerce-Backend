module.exports = {
  database: {
    db_url: "mongodb://localhost/vesdb-test",
  },
  aws: {
    key: process.env.AWS_KEY,
    secret: process.env.AWS_SECRET,
  },
  sk_config: ["aws.key", "aws.secret"],
};
