const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");

const Response = require("../../helpers/response.helper");
const {
  response: {
    createSuccessMessage,
    updateSuccessMessage,
    deleteSuccessMessage,
    failMessage,
  },
} = require("../../constants");

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // console.log(req.body);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Email không tồn tại");
    }

    // Add id
    user._doc.id = user._id;

    // if (!user.isVerified) throw new Error("Tài khoản chưa được xác nhận");

    // Result: boolean
    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      throw new Error("Bạn nhập sai mật khẩu");
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        return Response.success(res, {
          token,
          user: { ...user._doc, password: "" },
        });
      }
    );

    return true;
  } catch (error) {
    console.log(error.message);
    return next(error);
  }
};

exports.register = async (req, res, next) => {
  const {
    firstName,
    lastName,
    // phoneNumber,
    // address,
    // birthday,
    // avatar,
    // gender,
    email,
    password,
  } = req.body;

  try {
    if (!firstName || !lastName || !email || !password)
      throw new Error(failMessage);

    let user = await User.findOne({ email });

    if (user) {
      throw new Error("Email đã tồn tại");
    } else user = null;

    // const dateParts = birthday.split("/");

    // Tạo ra salt mã hóa
    const salt = await bcrypt.genSalt(10);
    const generatedPass = await bcrypt.hash(password, salt);

    user = await User.create({
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      phoneNumber,
      // address,
      password: generatedPass,
      // gender: gender === "Nam",
      email,
      role: "user",
      // birthday: new Date(
      //   parseInt(dateParts[2], 10),
      //   parseInt(dateParts[1], 10) - 1,
      //   parseInt(dateParts[0], 10)
      // ),
    });

    return Response.success(res, { message: "Tạo tài khoản thành công" });
  } catch (error) {
    console.log(error.message);
    return next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const { user } = req;

    if (!user) throw new Error(failMessage);
    user._doc.id = user._id;

    return Response.success(res, { user });
  } catch (error) {
    return next(error);
  }
};
