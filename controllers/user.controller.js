const bcrypt = require("bcrypt");

const Response = require("../helpers/response.helper");
const remove_Id = require("../utils/remove_Id");
const constant = require("../constants/index");

const User = require("../models/User");
const Cart = require("../models/Cart");
const CartDetail = require("../models/CartDetail");
const Bill = require("../models/Bill");
const BillDetail = require("../models/BillDetail");
const Token = require("../models/Token");

const uploadImage = require("../utils/uploadImage");

const {
  response: {
    createSuccessMessage,
    updateSuccessMessage,
    deleteSuccessMessage,
    failMessage,
  },
} = require("../constants");

// Find Users
exports.getAll = async (req, res, next) => {
  let { _limit, _page, q } = req.query;

  try {
    _page = parseInt(_page) || 1;
    _limit = parseInt(_limit) || constant._limit;

    let total = await User.find().count();
    let users = await User.find(
      {},
      {
        firstName: 1,
        lastName: 1,
        fullName: 1,
        phoneNumber: 1,
        address: 1,
        birthday: 1,
        avatar: 1,
        gender: 1,
        email: 1,
        role: 1,
      }
    );

    if (q) {
      users = users.filter((item) => {
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

exports.getDetail = async (req, res, next) => {
  const {
    params: { userId },
  } = req;

  try {
    if (!userId) throw new Error(failMessage);
    const user = await User.findById(userId, {
      firstName: 1,
      lastName: 1,
      fullName: 1,
      phoneNumber: 1,
      address: 1,
      birthday: 1,
      avatar: 1,
      gender: 1,
      email: 1,
      role: 1,
    });
    if (!user) throw new Error(failMessage);
    user._doc.id = user._id;

    return Response.success(res, { user });
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
  const {
    body: { password, newPassword },
    user,
  } = req;
  try {
    if (!user || !password || !newPassword) throw new Error(failMessage);

    const result = await bcrypt.compare(password, user.password);
    if (!result) throw new Error("Bạn nhập sai mật khẩu");

    const salt = await bcrypt.genSalt(10);
    const generatedPass = await bcrypt.hash(newPassword, salt);

    // Tạo 1 token -> lưu lại -> gởi email + token -> email gởi lại token hợp lệ -> verified user
    const token = crypto.randomBytes(16).toString("hex");
    await Token.create({
      userId: user._id,
      newPassword: generatedPass,
      token: crypto.createHash("sha256").update(token).digest("hex"),
      tokenExpire: Date.now() + 24 * 60 * 60 * 1000,
    });

    // Send email
    const tokenUrl = `<a href="${req.protocol}://${req.get(
      "host"
    )}/api/user/auth/confirmation/${token}">${req.protocol}://${req.get(
      "host"
    )}/api/user/auth/confirmation/${token}</a>`;

    const message = `<p>Hello ${user.fullName},</p><p>Bạn cần truy cập vào link sau để xác nhận thay đổi mật khẩu:</p><p>${tokenUrl}</p>`;
    await sendEmail({
      email: user.email,
      subject: "Change Password Token",
      message,
    });

    return Response.success(res, {
      message: "Vui lòng check mail để xác nhận thay đổi mật khẩu",
    });
  } catch (error) {
    return next(error);
  }
};

exports.updatePasswordConfirm = async (req, res, next) => {
  const {
    params: { token },
  } = req;

  try {
    if (!token) throw new Error(failMessage);

    const currentToken = await Token.findOne({ token });
    if (!currentToken && Date.now() > currentToken.tokenExpire)
      throw new Error(failMessage);

    const user = await User.findByIdAndUpdate(currentToken.userId, {
      password: currentToken.newPassword,
    });
    if (!user) throw new Error(failMessage);
    user._doc.id = user._id;

    await Token.findByIdAndDelete(currentToken._id);
    return Response.success({ user, message: updateSuccessMessage });
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
    if (cart) {
      const cartDetails = await CartDetail.find({ cartId: cart._id });
      for (let cartDetail of cartDetails)
        await CartDetail.findByIdAndDelete(cartDetail._id);
      await Cart.findByIdAndDelete(cart._id);
    }

    // - Hóa đơn - Chi tiết hóa đơn
    const bills = await Bill.find({ userId: user._id });
    if (bills) {
      for (let bill of bills) {
        const billDetails = await BillDetail.find({ billId: bill._id });
        for (let billDetail of billDetails)
          await BillDetail.findByIdAndDelete(billDetail._id);
        await Bill.findByIdAndDelete(bill._id);
      }
    }

    // - Bình Luận - Đánh giá

    // - Mã giảm giá

    await User.findByIdAndDelete(userId);

    return Response.success(res, { message: deleteSuccessMessage });
  } catch (error) {
    return next(error);
  }
};