const Response = require("../helpers/response.helper");
const remove_Id = require("../utils/remove_Id");

exports.getAll = async (req, res, next) => {
  const { _limit, _page, q } = req.query;

  try {
    _page = parseInt(_page) || 1;
    _limit = parseInt(_limit) || constant._limit;

    let total = await User.find().count();
    let users = await User.find();

    if (q) {
      users = user.filter((item) => {
        const index = item._doc.fullName.toLowerCase().indexOf(q.toLowerCase());
        return index > -1;
      });
      total = users.length;
    }

    return Response.success(res, {
      users: remove_Id(
        users.slice((_page - 1) * _limit, (_page - 1) * _limit + _limit)
      ),
      total,
    });
  } catch (error) {
    return next(error);
  }
};

exports.update = async (req, res, next) => {
  const {
    params: { userId },
    body: {
      email,
      firstName,
      lastName,
      // fullName,
      phoneNumber,
      address,
      birthday,
      gender,
    },
  } = req;

  try {
  } catch (error) {
    return next(error);
  }
};

exports.delete = async (req, res, next) => {};
