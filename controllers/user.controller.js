const Response = require("../helpers/response.helper");
const remove_Id = require("../utils/remove_Id");
const constant = require("../constants/index");

const User = require("../models/User");
const Cart = require("../models/Cart");
const CartDetail = require("../models/CartDetail");
const Bill = require("../models/Bill");

const uploadImage = require("../utils/uploadImage");

const {
  response: {
    createSuccessMessage,
    updateSuccessMessage,
    deleteSuccessMessage,
    failMessage,
  },
} = require("../constants");
const BillDetail = require("../models/BillDetail");

// Find Users
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

// Update User Information
exports.update = async (req, res, next) => {
  let {
    file,
    body: { firstName, lastName, phoneNumber, address, birthday, gender },
    user,
  } = req;
  try {
    if (
      !user
      // !firstName &&
      // !lastName
      // phoneNumber &&
      // address &&
      // birthday &&
      // !(gender === "true" || gender === "false")
    )
      throw new Error(failMessage);

    let obj = {
      // firstName,
      // lastName,
    };

    if (firstName)
      obj = { ...obj, firstName, fullName: `${firstName} ${user.lastName}` };
    if (lastName)
      obj = { ...obj, lastName, fullName: `${user.firstName} ${lastName}` };
    if (phoneNumber) obj = { ...obj, phoneNumber };
    if (address) obj = { ...obj, address };
    if (birthday) obj = { ...obj, birthday: new Date(birthday) };
    if (gender === "true" || gender === "false")
      obj = { ...obj, gender: gender === "true" };

    if (file) {
      const result = await uploadImage(file);
      obj = { ...obj, avatar: result.url };
    }

    user = await User.findByIdAndUpdate(user._id, { ...obj });
    user._doc.id = user._id;

    return Response.success(res, { message: updateSuccessMessage, user });
  } catch (error) {
    return next(error);
  }
};

// Update Password - Send Code To Gmail
exports.updatePassword = async (req, res, next) => {
  try {
  } catch (error) {
    return next(error);
  }
};

exports.delete = async (req, res, next) => {
  const {
    params: { userId },
  } = req;

  try {
    if (!userId) throw new Error(failMessage);
    const user = await User.findById(userId);
    if (!user) throw new Error(failMessage);

    // Xóa tất cả liên quan tới User trong CSDL

    // - Giỏ hàng - Chi tiết giỏ hàng
    const cart = await Cart.findOne({ userId: user._id });
    if (!cart) throw new Error(failMessage);
    const cartDetails = await CartDetail.find({ cartId: cart._id });
    for (let cartDetail of cartDetails)
      await CartDetail.findByIdAndDelete(cartDetail._id);
    await Cart.findByIdAndDelete(cart._id);

    // - Hóa đơn - Chi tiết hóa đơn
    const bills = await Bill.find({ userId: user._id });
    if (!bills) throw new Error(failMessage);
    for (let bill of bills) {
      const billDetails = await BillDetail.find({ billId: bill._id });
      for (let billDetail of billDetails)
        await BillDetail.findByIdAndDelete(billDetail._id);
      await Bill.findByIdAndDelete(bill._id);
    }

    // - Bình Luận - Đánh giá

    // - Mã giảm giá

    await User.findByIdAndDelete(userId);

    return Response.success(res, { message: deleteSuccessMessage });
  } catch (error) {
    return next(error);
  }
};
