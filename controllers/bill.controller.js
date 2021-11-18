const Bill = require("../models/bill");
const User = require("../models/User");
const Cart = require("../models/Cart");
const CartDetail = require("../models/CartDetail");
const BillDetail = require("../models/BillDetail");
const Product = require("../models/Product");

const Response = require("../helpers/response.helper");
const constant = require("../constants/index");
const remove_Id = require("../utils/remove_Id");

const {
  response: {
    createSuccessMessage,
    updateSuccessMessage,
    deleteSuccessMessage,
    failMessage,
  },
} = require("../constants");

exports.getAll = async (req, res, next) => {
  try {
    const {
      query: { _limit, _page },
    } = req;

    _page = parseInt(_page) || 1;
    _limit = parseInt(_limit) || constant._limit;

    const total = await Bill.find().count();
    const bills = await Bill.find()
      .skip((_page - 1) * _limit)
      .limit(_limit);

    Response.success(res, { bills: remove_Id(bills), total });
  } catch (error) {
    return next(error);
  }
};

exports.getAllByUser = async (req, res, next) => {
  try {
    const {
      params: { userId },
      query: { _limit, _page },
      user,
    } = req;

    _page = parseInt(_page) || 1;
    _limit = parseInt(_limit) || constant._limit;

    if (!userId && user) userId = user._id;
    if (!userId) throw new Error(failMessage);
    const user = await User.find;

    const total = await Bill.find({ userId }).count();
    const bills = await Bill.find({ userId })
      .skip((_page - 1) * _limit)
      .limit(_limit);
    if (!bills) throw new Error(failMessage);

    Response.success(res, { bills: remove_Id(bills), total });
  } catch (error) {
    return next(error);
  }
};

exports.getDetail = async (req, res, next) => {
  try {
    const {
      query: { _limit, _page },
      params: { billId },
    } = req;

    _page = parseInt(_page) || 1;
    _limit = parseInt(_limit) || constant._limit;

    if (!billId) throw new Error(failMessage);

    const bill = await Bill.findById(billId);
    if (!bill) throw new Error(failMessage);
    bill._doc.id = bill._id;

    const total = await BillDetail.find({ billId: bill._id }).count();
    const billDetails = await BillDetail.find({ billId: bill._id })
      .skip((_page - 1) * _limit)
      .limit(_limit);

    return Response.success(res, {
      bill,
      billDetails: remove_Id(billDetails),
      total,
    });
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

    let bill = await Bill.create({});
    let total = 0;
    for (let cartDetail of cartDetails) {
      const product = await Product.findById(cartDetail.productId);
      if (!product) throw new Error(failMessage);
      total += product.price * cartDetail.quantity;

      const billDetail = await BillDetail.create({
        quantity: cartDetail.quantity,
        billId: bill._id,
        productId: product._id,
      });

      await CartDetail.findByIdAndDelete(cartDetail._id);
    }
    await Cart.findByIdAndDelete(cart._id);

    bill = await Bill.findByIdAndUpdate(bill._id, { total });
    bill._doc.id = bill._id;

    return Response.success(res, { message: createSuccessMessage, bill });
  } catch (error) {
    return next(error);
  }
};

exports.updateBillDetail = async (req, res, next) => {
  try {
    const {
      params: { billId },
      body: { billDetails },
    } = req;

    if (!billId || !billDetails) throw new Error(failMessage);

    let bill = await Bill.findById(billId);
    if (!bill) throw new Error(failMessage);

    const billDetails = await BillDetail.find({ billId: bill._id });
    for (let billDetail of billDetails)
      await BillDetail.findByIdAndDelete(billDetail._id);

    let total = 0;
    for (let billDetail of billDetails) {
      const product = await Product.findById(billDetail.productId);
      if (!product) throw new Error(failMessage);
      total += product.price * billDetail.quantity;

      const currentBillDetail = await BillDetail.create({
        quantity: billDetail.quantity,
        billId: bill._id,
        productId: product._id,
      });
    }
    bill = await Bill.findByIdAndUpdate(bill._id, { total });
    bill._doc.id = bill._id;

    return Response.success(res, { message: updateSuccessMessage, bill });
  } catch (error) {
    return next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const {
      params: { billId },
      body: { status },
    } = req;

    if (!billId || !status) throw new Error(failMessage);

    let bill = await Bill.findById(billId);
    if (!bill) throw new Error(failMessage);

    bill = await Bill.findByIdAndUpdate(bill._id, { status });
    bill._doc.id = bill._id;

    return Response.success(res, { message: updateSuccessMessage, bill });
  } catch (error) {
    return next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const {
      params: { billId },
    } = req;

    if (!billId) throw new Error(failMessage);

    const bill = await Bill.findById(billId);
    if (!bill) throw new Error(failMessage);

    const billDetails = await BillDetail.find({ billId: bill._id });
    for (let billDetail of billDetails)
      await BillDetail.findByIdAndDelete(billDetail._id);
    await Bill.findByIdAndDelete(bill._id);

    return Response.success(res, { message: deleteSuccessMessage });
  } catch (error) {
    return next(error);
  }
};
