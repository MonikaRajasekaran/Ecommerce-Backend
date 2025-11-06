const _ = require('lodash');
const mongoose = require("mongoose");

module.exports.save = (Model, payload) => {
  const collection = new Model(payload);
  return collection.save();
};

module.exports.getDoc = (Model, query) =>
  Model.find(query).select("-__v").exec();

module.exports.deleteOne = (Model, query) => Model.deleteOne(query);

module.exports.deleteMany = (Model, query) => Model.deleteMany(query);

module.exports.getOneDoc = (Model, query, filter = {}, populate = []) => {
  let model = Model.findOne(query, filter)
  populate.map((value) => {
    model = model.populate(value)
  })
  return model.exec();
}


module.exports.list = (
  Model,
  query,
  { skip = 0, limit = 50 } = {},
  sort = {
    createdAt: -1,
  },
  populate = []
) => {
  let model = Model.find(query)
    .select("-__v -hashedPassword -salt -_id")
    .sort(sort)
    .skip(skip)
    .limit(limit)
  populate.map((value) => {
    model = model.populate(value)
  })
  return model.exec();
}



module.exports.updateDoc = (
  Model,
  condition,
  set,
  options = {
    safe: false,
    upsert: false,
    new: true,
  }
) => Model.findOneAndUpdate(condition, set, options).exec();

module.exports.many = (Model, data) =>
  new Promise((resolve, reject) => {
    Model.insertMany(data).then((docs) => resolve(docs)
    ).catch((err) => reject(err)
    );
  });

module.exports.updateMany = (Model, filter, data) =>
  Model.updateMany(filter, data, (error, docs) => {
    if (error) {
      return Promise.reject(error);
    }
    return Promise.resolve(docs);
  });

module.exports.search = (Model, query) =>
  Model.find(query, { score: { $meta: "textScore" } })
    .sort({ score: { $meta: "textScore" } })
    .exec();

module.exports.regSearch = (Model, query) => Model.find(query).exec();

module.exports.getTheLastEntry = (Model, query) =>
  Model.findOne(query).sort({ createdAt: -1 }).exec();

module.exports.aggregateGroup = (
  Model,
  query,
  lookup,
  group,
  project,
  skipLimit = true,
  { skip = 0, limit = 50 } = {}
) => {
  const aggregate = Model.aggregate(query);
  if (lookup) {
    lookup.forEach((element) => {
      aggregate.lookup(element);
    });
  }
  if (group) {
    aggregate.group(group);
  }
  if (project) {
    aggregate.project(project);
  }
  if (skipLimit) {
    aggregate.skip(skip).limit(limit);
  }
  return aggregate.exec();
};

module.exports.aggregateAdv = (
  Model,
  query,
  list,
  { skip = 0, limit = 50 } = {}
) => {
  const aggregate = Model.aggregate(query);
  list.forEach((ele) => {
    if (ele.type === "lookup") {
      ele.value.forEach((element) => {
        aggregate.lookup(element);
      });
    } else if (ele.type === "unwind") {
      aggregate.unwind(ele.value);
    } else if (ele.type === "group") {
      aggregate.group(ele.value);
    } else if (ele.type === "project") {
      aggregate.project(ele.value);
    }
  });

  return aggregate.skip(skip).limit(limit).exec();
};

module.exports.getUnique = (Model, unique, query) =>
  Model.distinct(unique, query, (error, docs) => {
    if (error) {
      return Promise.reject(error);
    }
    return Promise.resolve(docs);
  });
