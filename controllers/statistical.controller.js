const Bill = require("../models/Bill");
const Product = require("../models/Product");

const Response = require("../helpers/response.helper");

exports.getAll = async (req, res, next) => {
  try {
    // let { sortBy } = req;

    // if (!sortBy) sortBy = "Doanh Thu";

    // if (sortBy === "") {
    // } else if (sortBy === "") {
    // } else {
    //   // Mặc định sẽ là Doanh Thu
    //   // Xét với hóa đơn đã thanh toán -> sort bằng dateModified
    //   // const bills = await Bill.find({ isCompleted: true }).sort({
    //   //   dateModified: 1,
    //   // });
    //   // const products = await Product.aggregate([
    //   //   { $project: { minutes: { $minute: "$dateCreate" } } },
    //   // ]);
    //   // return Response.success()
    // }

    // const products = await Product.aggregate([
    //   { $project: { minutes: { $minute: "$dateCreate" }, total: { $sum: 1 } } },
    // ]);
    const bills = await Bill.aggregate([
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

    return Response.success(res, { bills });
  } catch (error) {
    return next(error);
  }
};
