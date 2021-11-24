const Bill = require("../models/Bill");
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
    let {
      query: { _limit, _page },
    } = req;

    _page = parseInt(_page) || 1;
    _limit = parseInt(_limit) || constant._limit;

    const total = await Bill.find().count();
    const bills = await Bill.find()
      .populate("userId")
      .skip((_page - 1) * _limit)
      .limit(_limit);

    Response.success(res, { bills: remove_Id(bills), total });
  } catch (error) {
    return next(error);
  }
};

exports.getAllByUser = async (req, res, next) => {
  try {
    let {
      params: { userId },
      query: { _limit, _page },
      user,
    } = req;

    _page = parseInt(_page) || 1;
    _limit = parseInt(_limit) || constant._limit;

    if (!userId && user) userId = user._id;
    if (!userId) throw new Error(failMessage);
    if (!user) user = await User.findById(userId);
    if (!user) throw new Error(failMessage);

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
    let {
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
      .populate("productId")
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

// Cập nhật lại code nếu thanh toán bằng thẻ ngân hàng...
exports.create = async (req, res, next) => {
  try {
    const {
      body: { payment, name, address, phoneNumber },
      user,
    } = req;

    if (!user || !payment || !name || !address || !phoneNumber)
      throw new Error(failMessage);
    const cart = await Cart.findOne({ userId: user._id });
    if (!cart) throw new Error(failMessage);

    const cartDetails = await CartDetail.find({ cartId: cart._id });
    if (!cartDetails) throw new Error(failMessage);

    let bill = await Bill.create({
      userId: user._id,
      payment,
      name,
      address,
      phoneNumber,
    });
    let total = 0;
    for (let cartDetail of cartDetails) {
      const product = await Product.findById(cartDetail.productId);
      if (!product) throw new Error(failMessage);
      total += product.price * cartDetail.quantity;

      await BillDetail.create({
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

    if (bill.status !== "Đợi xác nhận")
      throw new Error("Chỉ có đơn hàng đang xác nhận mới có thể cập nhật lại");

    const oldBillDetails = await BillDetail.find({ billId: bill._id });
    for (let billDetail of oldBillDetails)
      await BillDetail.findByIdAndDelete(billDetail._id);

    let total = 0;
    for (let billDetail of billDetails) {
      const product = await Product.findById(billDetail.productId);
      if (!product) throw new Error(failMessage);
      total += product.price * billDetail.quantity;

      await BillDetail.create({
        quantity: billDetail.quantity,
        billId: bill._id,
        productId: product._id,
      });
    }
    bill = await Bill.findByIdAndUpdate(bill._id, {
      total,
      dateModified: Date.now(),
    });
    bill._doc.id = bill._id;

    return Response.success(res, { message: updateSuccessMessage, bill });
  } catch (error) {
    return next(error);
  }
};

// User chỉ có quyền hủy đơn hàng, Amin có quyền cập nhật các trạng thái khác
exports.updateStatus = async (req, res, next) => {
  try {
    const {
      params: { billId },
      body: { status, isCompleted },
      user,
    } = req;

    if (!billId || !status) throw new Error(failMessage);

    let bill = await Bill.findById(billId);
    if (!bill) throw new Error(failMessage);

    if (user && user.role === "user" && status !== "Đã hủy")
      throw new Error("Người dùng chỉ có quyền hủy đơn hàng");

    if (
      bill.status === "Đợi xác nhận" &&
      !(status === "Đã xác nhận" || status === "Đã hủy")
    )
      throw new Error(
        'Bạn chỉ có thể cập nhật trạng thái "Đã xác nhận" hoặc "Đã hủy"'
      );

    if (bill.status === "Đã xác nhận" && !(status === "Đang vận chuyển"))
      throw new Error('Bạn chỉ có thể cập nhật trạng thái "Đang vận chuyển"');

    if (bill.status === "Đang vận chuyển" && status !== "Đã giao hàng")
      throw new Error('Bạn chỉ có thể cập nhật trạng thái "Đã giao hàng"');

    if (bill.status === "Đã hủy")
      throw new Error(
        "Đơn hàng đã hủy, bạn không thể cập nhật trạng thái cho nó"
      );

    if (isCompleted === "true" || isCompleted === "false") {
      if (bill.payment === "Trực tiếp") {
        if (status !== "Đã giao hàng")
          throw new Error(
            "Bạn chỉ có thể thay đổi trạng thái khi đơn hàng đã được giao với hình thanh toán trực tiếp"
          );
        else
          await Bill.findByIdAndUpdate(bill._id, {
            status,
            isCompleted: isCompleted === "true",
            dateModified: Date.now(),
          });
      }

      // Cho các hình thức thanh toán khác
      // if() {

      // }
    } else
      await Bill.findByIdAndUpdate(bill._id, {
        status,
        dateModified: Date.now(),
      });
    bill = await Bill.findById(billId);
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
