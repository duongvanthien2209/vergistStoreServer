const constant = require("../constants/index");
const remove_Id = require("../utils/remove_Id");

const Category = require("../models/Category");
const Product = require("../models/Product");

const Response = require("../helpers/response.helper");

exports.getAll = async (req, res, next) => {
  let {
    _page,
    _limit,
    categoryId,
    newPrice_gte,
    newPrice_lte,
    tagId, // Todo Late
    oldPrice_gte, // Don't understand
    _sort,
    _order,
    news,
    q,
  } = req.query;

  try {
    _page = parseInt(_page) || 1;
    _limit = parseInt(_limit) || constant._limit;

    let products;
    let queryObj = {};

    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) throw new Error("Có lỗi xảy ra");
      queryObj = {
        categoryId,
      };
    }

    if (newPrice_gte >= 0 && newPrice_lte >= 0) {
      queryObj = {
        ...queryObj,
        newPrice: { $gt: newPrice_gte, $lt: newPrice_lte },
      };
    }

    if (news && (news === true || news === false)) {
      queryObj = {
        ...queryObj,
        news,
      };
    }

    const count = await Product.find({ ...queryObj }).count();

    if (_sort && _order)
      products = await Product.find({ ...queryObj })
        .sort({
          [sort]: _order === "asc" ? 1 : -1,
        })
        .skip((_page - 1) * _limit)
        .limit(_limit);
    else
      products = await Product.find({ ...queryObj })
        .skip((_page - 1) * _limit)
        .limit(_limit);

    return Response.success(res, {
      // Add propertype id for db
      products: remove_Id(products),
      totalProduct: count,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const {
      params: { productId },
    } = req;

    const product = await Product.findById(productId).populate("categoryId");
    if (!product) throw new Error("Có lỗi xảy ra");

    return Response.success(res, { product });
  } catch (error) {
    return next(error);
  }
};

exports.addProduct = async (req, res, next) => {};

exports.changeProduct = async (req, res, next) => {};

exports.deleteProduct = async (req, res, next) => {
  try {
    const {
      params: { productId },
    } = req;

    const product = await Product.findById(productId);
    if (!product) throw new Error("Có lỗi xảy ra");
    await Product.findByIdAndDelete(productId);
    return Response.success(res, { message: "Xóa thành công" });
  } catch (error) {
    return next(error);
  }
};
