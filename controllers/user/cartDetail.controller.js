const CartDetail = require("../../models/CartDetail");
const Product = require("../../models/Product");

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
const Cart = require("../../models/Cart");

// Thêm được tối đa 30 SP
exports.create = async (req, res, next) => {
  let {
    body: { quantity, productId },
    user,
  } = req;
  try {
    if (!user || !quantity || !productId) throw new Error(failMessage);
    quantity = parseInt(quantity);

    const product = await Product.findById(productId);
    if (!product) throw new Error(failMessage);

    let cart = await Cart.findOne({ userId: user._id });
    let cartDetail;

    if (!cart) {
      cart = await Cart.create({ userId: user._id });

      if (quantity > 30) throw new Error("Bạn chỉ mua tối đa 30 SP");

      cartDetail = await CartDetail.create({
        quantity,
        productId,
        cartId: cart._id,
      });
    } else {
      cartDetail = await CartDetail.findOne({
        cartId: cart._id,
        productId: product._id,
      });

      if (!cartDetail) {
        if (quantity > 30) throw new Error("Bạn chỉ mua tối đa 30 SP");

        cartDetail = await CartDetail.create({
          quantity,
          productId,
          cartId: cart._id,
        });
      } else {
        if (cartDetail.quantity + quantity > 30)
          throw new Error(
            "Số sản phẩm hiện tại bạn đang có và số sản phẩm thêm vào của bạn hiện vượt quá 30 SP cho phép"
          );

        cartDetail = await CartDetail.findByIdAndUpdate(cartDetail._id, {
          quantity: cartDetail.quantity + parseInt(quantity),
        });
      }
    }
    // cartDetail = await CartDetail.findById(cartDetail._id).populate(
    //   "productId"
    // );
    // cartDetail._doc.id = cartDetail._id;
    const cartDetails = await CartDetail.find({ cartId: cart._id }).populate(
      "productId"
    );
    if (!cartDetails) throw new Error(failMessage);

    return Response.success(res, {
      message: createSuccessMessage,
      cartDetails: remove_Id(cartDetails),
    });
  } catch (error) {
    return next(error);
  }
};

// Hiện đang có thể cập nhật lại cả Sản phẩm cho 1 CartDetail -> có thể có hoặc ko ProductId
exports.update = async (req, res, next) => {
  try {
    let {
      params: { cartDetailId },
      body: { quantity, productId },
    } = req;

    if (!cartDetailId || !quantity) throw new Error(failMessage);

    quantity = parseInt(quantity);
    if (quantity > 30) throw new Error("Bạn chỉ được mua tối đa 30 SP");

    let cartDetail = await CartDetail.findById(cartDetailId);
    if (!cartDetail) throw new Error(failMessage);

    if (productId) {
      const product = await Product.findById(productId);
      if (!product) throw new Error(failMessage);
      await CartDetail.findByIdAndUpdate(cartDetailId, {
        quantity,
        productId,
      });
    } else
      await CartDetail.findByIdAndUpdate(cartDetailId, {
        quantity,
      });

    cartDetail = await CartDetail.findById(cartDetailId).populate("productId");
    cartDetail._doc.id = cartDetail._id;

    return Response.success(res, { message: updateSuccessMessage, cartDetail });
  } catch (error) {
    return next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const {
      params: { cartDetailId },
    } = req;

    if (!cartDetailId) throw new Error(failMessage);
    let cartDetail = await CartDetail.findById(cartDetailId);
    if (!cartDetail) throw new Error(failMessage);

    await CartDetail.findByIdAndDelete(cartDetailId);

    return Response.success(res, { message: deleteSuccessMessage });
  } catch (error) {
    return next(error);
  }
};
