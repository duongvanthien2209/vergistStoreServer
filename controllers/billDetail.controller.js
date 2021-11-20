const BillDetail = require("../models/BillDetail");

const Response = require("../helpers/response.helper");
const constant = require("../constants/index");

const {
  response: {
    createSuccessMessage,
    updateSuccessMessage,
    deleteSuccessMessage,
    failMessage,
  },
} = require("../constants");

exports.update = async (req, res, next) => {
  try {
    const {
      params: { billDetailId },
      body: { quantity, productId },
    } = req;

    if (!billDetailId || !quantity || !productId) throw new Error(failMessage);

    const billDetail = await BillDetail.findById(billDetailId);
    if (!billDetail) throw new Error(failMessage);

    const product = await Product.findById(productId);
    if (!product) throw new Error(failMessage);

    billDetail = await BillDetail.findByIdAndUpdate(billDetailId, {
      quantity: parseInt(quantity),
      productId,
    });
    billDetail._doc.id = billDetail._id;

    return Response.success(res, { message: updateSuccessMessage, billDetail });
  } catch (error) {
    return next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const {
      params: { billDetailId },
    } = req;

    if (!billDetailId) throw new Error(failMessage);

    const billDetail = await BillDetail.findById(billDetailId);
    if (!billDetail) throw new Error(failMessage);

    await BillDetail.findByIdAndDelete(billDetailId);

    return Response.success(res, { message: deleteSuccessMessage });
  } catch (error) {
    return next(error);
  }
};
