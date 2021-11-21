const CartDetail = require("../../models/CartDetail");
const Product = require("../../models/Product");

const Response = require("../../helpers/response.helper");
const constant = require("../../constants/index");

const {
  response: {
    createSuccessMessage,
    updateSuccessMessage,
    deleteSuccessMessage,
    failMessage,
  },
} = require("../../constants");
const Cart = require("../../models/Cart");

exports.create = async (req, res, next) => {
  try {
    const {
      body: { quantity, productId },
      user,
    } = req;

    if (!user || !quantity || !productId) throw new Error(failMessage);

    const cart = await Cart.findOne({ userId: user._id });
    if (!cart) throw new Error(failMessage);

    const product = await Product.findById(productId);
    if (!product) throw new Error(failMessage);

    let cartDetail = await CartDetail.findOne({
      cartId: cart._id,
      productId: product._id,
    });

    if (cartDetail) {
      cartDetail = await CartDetail.findByIdAndUpdate(cartDetail._id, {
        quantity: cartDetail.quantity + parseInt(quantity),
      });
    } else {
      cartDetail = await CartDetail.create({
        quantity: parseInt(quantity),
        productId,
        cartId: cart._id,
      });
    }
    cartDetail = await CartDetail.findById(cartDetail._id).populate(
      "productId"
    );
    cartDetail._doc.id = cartDetail._id;

    return Response.success(res, { message: createSuccessMessage, cartDetail });
  } catch (error) {
    return next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const {
      params: { cartDetailId },
      body: { quantity, productId },
    } = req;

    if (!cartDetailId || !quantity || !productId) throw new Error(failMessage);
    let cartDetail = await CartDetail.findById(cartDetailId);
    if (!cartDetail) throw new Error(failMessage);

    const product = await Product.findById(productId);
    if (!product) throw new Error(failMessage);

    cartDetail = await CartDetail.findByIdAndUpdate(cartDetailId, {
      quantity: parseInt(quantity),
      productId,
    });
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
