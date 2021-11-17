const Category = require("../../models/Category");
const Product = require("../../models/Product");

const fs = require("fs");

const Response = require("../../helpers/response.helper");
const readFile = require("../../utils/readFile");

exports.addCategories = async (req, res, next) => {
  try {
    const data = await readFile("./db.json");
    if (data) {
      // console.log(JSON.parse(data));
      // Add Category
      const { Category: categories } = JSON.parse(data);

      for (let category of categories) {
        let currentCategory = await Category.findOne({ name: category.name });

        if (!currentCategory) {
          delete category.id;

          await Category.create({
            ...category,
          });
        }
      }
      Response.success(res, { message: "Thanh cong" });
    }
  } catch (error) {
    return next(error);
  }
};

exports.addProducts = async (req, res) => {
  try {
    const data = await readFile("./db.json");

    if (data) {
      const { products, Category: categories } = JSON.parse(data);

      for (let product of products) {
        const currentCategory = await Category.findOne({
          name: categories[product.categoryId - 1].name,
        });

        if (currentCategory) {
          delete product.id;
          delete product.tabId;

          await Product.create({
            ...product,
            categoryId: currentCategory.id,
          });
        }
      }

      Response.success(res, { message: "Thanh cong" });
    }
  } catch (error) {
    return next(error);
  }
};

exports.changePriceForProducts = async (req, res) => {
  try {
    const products = await Product.find();
    for (let product of products) {
      // await Product.findByIdAndUpdate(product.id, [
      //   { $unset: { newPrice: 1 } },
      //   // { $set: { price: product._doc.newPrice } },
      // ]);
      // await Product.findByIdAndUpdate(product.id, { $unset: { newPrice: 1 } });
      await Product.findByIdAndUpdate(product.id, { $unset: { news: 1 } });
    }

    Response.success(res, { message: "Cập nhật thành công" });
  } catch (error) {
    return console.log(error);
  }
};

exports.changeNewsForProducts = async (req, res, next) => {
  try {
    const data = await readFile("./db.json");

    if (data) {
      const { products } = JSON.parse(data);

      let currentProducts = await Product.find();

      // for (let product of currentProducts) {
      //   await Product.findByIdAndUpdate(product.id, {
      //     $unset: { news: 1 },
      //   });
      // }

      // currentProducts = await Product.find();

      for (let i = 0; i <= currentProducts.length; i++) {
        if (currentProducts[i]) {
          //   let obj = {};
          //   if (products[i].desc) obj["des"] = products[i].desc;
          //   if (products[i].shortDesc) obj["shortDes"] = products[i].shortDesc;
          await Product.findByIdAndUpdate(currentProducts[i]._id, {
            $set: {
              // ...obj,
              // rate: products[i].rate,
              sale: 0,
            },
            // $unset: {
            //   news: 1,
            // },
          });
        }
      }

      Response.success(res, {
        message: "Thanh cong",
        currentProducts,
        // currentProductsCount: currentProducts.length,
        // count: products.length,
      });
    }
  } catch (error) {
    return next(error);
  }
};
