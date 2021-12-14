const DiscountCode = require("../models/DiscountCode");
const DiscountCodeDetail = require("../models/DiscountCodeDetail");

const {
  response: {
    createSuccessMessage,
    updateSuccessMessage,
    deleteSuccessMessage,
    failMessage,
  },
} = require("../constants");
const Response = require("../helpers/response.helper");
const remove_Id = require("../utils/remove_Id");

// Lấy danh sách mã giảm giá
exports.getAllByUser = async (req, res, next) => {
  try {
    let {
      query: { _limit, _page, q },
      user,
    } = req;

    if (!user) throw new Error(failMessage);

    _page = parseInt(_page) || 1;
    _limit = parseInt(_limit) || constant._limit;
  } catch (error) {
    return next(error);
  }
};

// Lấy mã giảm giá
exports.create = async (req, res, next) => {
  try {
    const {
      body: { discountCodeId, total },
      user,
    } = req;

    if (!user || !discountCodeId) throw new Error(failMessage);
    total = parseInt(total) || 1;

    const discountCode = await DiscountCode.findById(discountCodeId);
    if (!discountCode) throw new Error(failMessage);

    if (discountCode.total < total)
      throw new Error("Xin lỗi mã giảm giá hiện không đủ");
    await DiscountCode.findByIdAndUpdate(discountCode._id, {
      $inc: { total: -total },
    });

    const discountCodeDetail = await DiscountCodeDetail.create({
      total,
      userId: user._id,
      discountCodeId: discountCode._id,
    });
    discountCodeDetail._doc.id = discountCodeDetail._id;

    return Response.success(res, {
      message: "Lấy mã thành công",
      discountCodeDetail,
    });
  } catch (error) {
    return next(error);
  }
};
