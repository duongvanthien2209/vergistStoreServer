const constant = require("../constants/index");
const remove_Id = require("../utils/remove_Id");

const Category = require("../models/Category");
const Product = require("../models/Product");

const Response = require("../helpers/response.helper");
const uploadImage = require("../utils/uploadImage");

const {
  response: {
    createSuccessMessage,
    updateSuccessMessage,
    deleteSuccessMessage,
    failMessage,
  },
} = require("../constants");

exports.getAll = async (req, res, next) => {
  let {
    _page,
    _limit,
    categoryId,
    price_gte,
    price_lte,
    tagId, // Todo Late
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

    if (price_gte >= 0 && price_lte >= 0) {
      queryObj = {
        ...queryObj,
        price: { $gt: price_gte, $lt: price_lte },
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

    // Add Id
    product._doc.id = product._id;

    return Response.success(res, { product });
  } catch (error) {
    return next(error);
  }
};

exports.addProduct = async (req, res, next) => {
  try {
    const {
      files,
      body: {
        categoryId,
        name,
        // status,
        price,
        sale,
        rate,
        // tagId,
        shortDes,
        des,
      },
    } = req;

    let product;

    if (
      !name ||
      !categoryId ||
      !status ||
      !price ||
      !rate ||
      !shortDes ||
      !des ||
      !sale
    )
      throw new Error("Có lỗi xảy ra");

    const category = await Category.findById(categoryId);

    if (!category) throw new Error("Có lỗi xảy ra");

    if (files) {
      let resultUrls = [];
      for (let file of files) {
        const result = await uploadImage(file);
        resultUrls.push(result.url);
      }
      product = await Product.create({
        categoryId: category._id,
        name,
        // status,
        price: parseInt(price),
        sale: parseInt(sale),
        rate: parseInt(rate),
        // tagId,
        shortDes,
        des,
        imgs: resultUrls,
      });
    } else
      product = await Product.create({
        categoryId: category._id,
        name,
        // status,
        price: parseInt(price),
        sale: parseInt(sale),
        rate: parseInt(rate),
        // tagId,
        shortDes,
        des,
      });

    product._doc.id = product._id;

    return Response.success(res, { message: createSuccessMessage, product });
  } catch (error) {
    return next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const {
      files,
      params: { productId },
      body: {
        categoryId,
        name,
        status,
        price,
        sale,
        rate,
        // tagId,
        shortDes,
        des,
      },
    } = req;

    if (
      !productId ||
      !categoryId ||
      !name ||
      !status ||
      !price ||
      !rate ||
      !shortDes ||
      !des
    )
      throw new Error(failMessage);

    let product = await Product.find({ productId });
    const category = await Category.findById(categoryId);

    if (!product || !category) throw new Error(failMessage);

    if (files) {
      let resultUrls = [];
      for (let file of files) {
        const result = await uploadImage(file);
        resultUrls.push(result.url);
      }
      product = await Product.findByIdAndUpdate(product._id, {
        categoryId: category._id,
        name,
        status,
        price: parseInt(price),
        sale,
        rate: parseInt(rate),
        // tagId,
        shortDes,
        des,
        imgs: resultUrls,
      });
    } else
      product = await Product.findByIdAndUpdate(product._id, {
        categoryId: category._id,
        name,
        status,
        price: parseInt(price),
        sale,
        rate: parseInt(rate),
        // tagId,
        shortDes,
        des,
      });

    product._doc.id = product._id;

    return Response.success(res, { message: updateSuccessMessage, product });
  } catch (error) {
    return next(error);
  }
};

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
