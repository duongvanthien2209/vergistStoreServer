const Response = require("../helpers/response.helper");

exports.getAll = async (req, res, next) => {
  const { _limit, _page, q } = req.query;

  try {
    _page = parseInt(_page) || 1;
    _limit = parseInt(_limit) || constant._limit;
  } catch (error) {
    return next(error);
  }
};

exports.update = async (req, res, next) => {};

exports.delete = async (req, res, next) => {};
