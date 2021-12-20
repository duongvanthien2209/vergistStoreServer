const Bill = require("../models/Bill");
const Product = require("../models/Product");

const Response = require("../helpers/response.helper");
const User = require("../models/User");

exports.getAll = async (req, res, next) => {
  try {
    let {
      query: { sortBy },
    } = req;
    if (!sortBy) sortBy = "DoanhThu";
    let bills;
    let users;
    let products;

    if (sortBy === "DoanhThu") {
      bills = await Bill.aggregate([
        {
          $match: { dateModified: { $ne: null } },
        },
        {
          $group: {
            _id: {
              year: { $year: "$dateModified" },
              month: { $month: "$dateModified" },
              day: { $dayOfMonth: "$dateModified" },
            },
            totalAmount: { $sum: "$total" },
          },
        },
      ]);
    } else if (sortBy === "SanPham") {
      currentBills = await Bill.aggregate([
        {
          $match: { dateCreate: { $ne: null } },
        },
        {
          $group: {
            _id: {
              year: { $year: "$dateModified" },
              month: { $month: "$dateModified" },
              day: { $dayOfMonth: "$dateModified" },
            },
            total: { $sum: 1 },
          },
        },
      ]);

      for (let currentBill of currentBills) {
        const totalBills = await Bill.find({ $where: "" });
      }
    } else {
      users = await User.aggregate([
        {
          $match: { dateCreate: { $ne: null } },
        },
        {
          $group: {
            _id: {
              year: { $year: "$dateModified" },
              month: { $month: "$dateModified" },
              day: { $dayOfMonth: "$dateModified" },
            },
            count: { $sum: 1 },
          },
        },
      ]);
    }

    // const products = await Product.aggregate([
    //   { $project: { minutes: { $minute: "$dateCreate" }, total: { $sum: 1 } } },
    // ]);
    // const bills = await Bill.aggregate([
    //   {
    //     $match: { dateModified: { $ne: null } },
    //   },
    //   {
    //     $group: {
    //       _id: {
    //         year: { $year: "$dateModified" },
    //         month: { $month: "$dateModified" },
    //         day: { $dayOfMonth: "$dateModified" },
    //       },
    //       totalAmount: { $sum: "$total" },
    //     },
    //   },
    // ]);

    let obj = {};
    if (bills) obj = { bills };
    if (users) obj = { ...obj, users };
    if (products) obj = { ...obj, products };

    return Response.success(res, obj);
  } catch (error) {
    return next(error);
  }
};
