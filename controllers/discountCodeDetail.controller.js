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

// Lấy danh sách mã giảm giá của người dùng
exports.getAllByUser = async (req, res, next) => {
  try {
    let {
      query: { _limit, _page, q },
      user,
    } = req;

    if (!user) throw new Error(failMessage);

    _page = parseInt(_page) || 1;
    _limit = parseInt(_limit) || constant._limit;

    let discountCodes = await DiscountCodeDetail.find({
      userId: user._id,
    })
      .sort({ dateCreate: -1 })
      .populate("discountCodeId")
      .array.forEach((item) => {
        item.discountCodeId._doc.id = item.discountCodeId._doc._id;
        item.discountCodeId._doc.total = item.total;
        return item.discountCodeId._doc;
      });

    const total = discountCodes.length;

    return Response.success(res, {
      discountCodes: discountCodes.slice(
        (_page - 1) * _limit,
        (_page - 1) * _limit + _limit
      ),
      total,
    });
  } catch (error) {
    return next(error);
  }
};

// Lấy mã giảm giá
// Nếu đã có mã giảm giá thì không được thêm
exports.create = async (req, res, next) => {
  try {
    let {
      params: { discountCodeId },
      body: { total },
      user,
    } = req;

    if (!user || !discountCodeId) throw new Error(failMessage);
    total = total && !isNaN(total) ? parseInt(total) : 1;

    const discountCode = await DiscountCode.findById(discountCodeId);
    if (!discountCode) throw new Error(failMessage);

    let discountCodeDetail = await DiscountCodeDetail.findOne({
      userId: user._id,
      discountCodeId,
    });
    if (discountCodeDetail) throw new Error("Bạn đã nhận mã giảm giá này rồi");

    if (discountCode.total < total)
      throw new Error("Xin lỗi mã giảm giá hiện không đủ");
    await DiscountCode.findByIdAndUpdate(discountCode._id, {
      $inc: { total: -total },
    });

    discountCodeDetail = await DiscountCodeDetail.create({
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
