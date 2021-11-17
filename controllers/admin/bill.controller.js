const Bill = require("../../models/bill");
const User = require("../../models/User");
const Cart = require("../../models/Cart");

const Response = require("../../helpers/response.helper");
const constant = require("../../constants/index");
const remove_Id = require("../../utils/remove_Id");

const {
  response: {
    createSuccessMessage,
    updateSuccessMessage,
    deleteSuccessMessage,
    failMessage,
  },
} = require("../../constants");
const CartDetail = require("../../models/CartDetail");

exports.getAll = async (req, res, next) => {
  try {
    const {
      params: { userId },
      query: { _limit, _page },
    } = req;

    _page = parseInt(_page) || 1;
    _limit = parseInt(_limit) || constant._limit;

    if (!userId) throw new Error(failMessage);
    const user = await User.find;

    const bills = await Bill.find({ userId })
      .skip((_page - 1) * _limit)
      .limit(_limit);
    if (!bills) throw new Error(failMessage);

    Response.success(res, { bills: remove_Id(bills) });
  } catch (error) {
    return next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const {
      params: { cartId },
    } = req;

    if (!cartId) throw new Error(failMessage);
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error(failMessage);

    const cartDetails = CartDetail.find({ cartId });
    if (!cartDetails) throw new Error(failMessage);

    
  } catch (error) {
    return next(error);
  }
};

exports.update = async (req, res, next) => {};

exports.delete = async (req, res, next) => {};
