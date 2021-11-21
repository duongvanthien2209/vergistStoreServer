const constant = require("../constants/index");
const remove_Id = require("../utils/remove_Id");

const Category = require("../models/Category");
const Product = require("../models/Product");
const Tag = require("../models/Tag");

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
    tagId,
    _sort,
    _order,
    new: currentNew,
    hot,
    q,
  } = req.query;

  try {
    _page = parseInt(_page) || 1;
    _limit = parseInt(_limit) || constant._limit;

    let products;
    let queryObj = {};

    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) throw new Error(failMessage);
      queryObj = {
        categoryId,
      };
    }

    if (tagId) {
      const tag = await Tag.findById(tagId);
      if (!tag) throw new Error(failMessage);
      queryObj = {
        ...queryObj,
        tagId,
      };
    }

    if (price_gte >= 0 && price_lte >= 0) {
      queryObj = {
        ...queryObj,
        price: { $gt: price_gte, $lt: price_lte },
      };
    }

    if (currentNew && (currentNew === "true" || currentNew === "false")) {
      queryObj = {
        ...queryObj,
        "status.new": currentNew === "true",
      };
    }

    if (hot && (hot === "true" || hot === "false")) {
      queryObj = {
        ...queryObj,
        "status.hot": hot === "true",
      };
    }

    if (q) {
      queryObj = {
        ...queryObj,
        $text: { $search: q },
      };
    }

    const count = await Product.find({ ...queryObj }).count();

    if (_sort && _order)
      products = await Product.find({ ...queryObj })
        .populate(["categoryId", "tagId"])
        .sort({
          [sort]: _order === "asc" ? 1 : -1,
        })
        .skip((_page - 1) * _limit)
        .limit(_limit);
    else
      products = await Product.find({ ...queryObj })
        .populate(["categoryId", "tagId"])
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
    if (!product) throw new Error(failMessage);

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
        // sale,
        // rate,
        tagId,
        shortDes,
        des,
      },
    } = req;

    let product;

    if (
      !name ||
      !categoryId ||
      // !status ||
      !price ||
      // !rate ||
      !shortDes ||
      !des ||
      // !sale ||
      !tagId
    )
      throw new Error(failMessage);

    const category = await Category.findById(categoryId);

    if (!category) throw new Error(failMessage);

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
        // sale: parseInt(sale),
        // rate: parseInt(rate),
        tagId,
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
        // sale: parseInt(sale),
        // rate: parseInt(rate),
        tagId,
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
        tagId,
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
      !des ||
      !tagId
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
        tagId,
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
        tagId,
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
    if (!product) throw new Error(failMessage);
    await Product.findByIdAndDelete(productId);
    return Response.success(res, { message: "Xóa thành công" });
  } catch (error) {
    return next(error);
  }
};
