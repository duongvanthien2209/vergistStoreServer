const DiscountCode = require("../models/DiscountCode");

const Response = require("../helpers/response.helper");
const remove_Id = require("../utils/remove_Id");
const uploadImage = require("../utils/uploadImage");

const {
  response: {
    createSuccessMessage,
    updateSuccessMessage,
    deleteSuccessMessage,
    failMessage,
  },
} = require("../constants");
const existCodeMessage = "Mã code đã tồn tại";

exports.create = async (req, res, next) => {
  try {
    const { codeName, title, description, total, sale, amount, dateExpire } =
      req.body;

    if (
      !codeName ||
      !title ||
      !description ||
      (!total && !isNaN(total)) ||
      !dateExpire
    )
      throw new Error(failMessage);

    let discountCode = await DiscountCode.findById({ codeName });
    if (discountCode) throw new Error(existCodeMessage);

    dateExpire = new Date(dateExpire);
    if (dateExpire <= Date.now())
      throw new Error("Ngày hết hạn phải lớn hơn ngày hiện tại");

    let obj = {
      codeName,
      title,
      description,
      total: parseInt(total),
      dateExpire,
    };

    if (!isNaN(sale)) obj = { ...obj, sale: parseInt(sale) };
    if (!isNaN(amount)) obj = { ...obj, amount: parseFloat(amount) };

    discountCode = await DiscountCode.create({ ...obj });
    discountCode._doc.id = discountCode._id;

    return Response.success(res, {
      message: createSuccessMessage,
      discountCode,
    });
  } catch (error) {
    return next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const {
      params: { discountCodeId },
      body: { codeName, title, description, total, sale, amount, dateExpire },
    } = req;

    if (!discountCodeId) throw new Error(failMessage);
    let discountCode = await DiscountCode.findById(discountCodeId);
    if (!discountCode) throw new Error(failMessage);

    let obj = {};

    if (codeName) {
      const currentDiscountCode = await DiscountCode.findOne({ codeName });
      if (currentDiscountCode) throw new Error(existCodeMessage);
      obj = { ...obj, codeName };
    }

    if (title) obj = { ...obj, title };

    if (description) obj = { ...obj, description };

    // Total cập nhật phải lớn hơn số lượng mã giảm giá đã được lấy
    if (!isNaN(total)) {
      if (parseInt(total) < discountCode.takenTotal)
        throw new Error(
          "Số lượng mã giảm giá được cập nhật phải lớn hơn số lượng mã giảm giá đã được lấy"
        );
      obj = { ...obj, total: parseInt(total) };
    }

    if (!isNaN(sale)) obj = { ...obj, sale: parseInt(sale) };

    if (!isNaN(amount)) obj = { ...obj, amount: parseFloat(amount) };

    if (dateExpire) {
      dateExpire = new Date(dateExpire);
      if (new Date(dateExpire) < Date.now())
        throw new Error("Ngày hết hạn phải lớn hơn hoặc bằng ngày hiện tại");
    }

    await DiscountCode.findByIdAndUpdate(discountCode._id, { ...obj });
    discountCode = await DiscountCode.findById(discountCode._id);
    discountCode._doc.id = discountCode._id;

    return Response.success(res, {
      message: updateSuccessMessage,
      discountCode,
    });
  } catch (error) {
    return next(error);
  }
};

exports.delete = async (req, res, next) => {};
