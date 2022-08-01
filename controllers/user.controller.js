const asyncHandler = require("../middlewares/async");
const { models } = require("../sequelize");
const AuthHelper = require("../utils/AuthHelper");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateUId } = require("../utils/helpers");

const ROLES = ["ADMIN", "MEMBER", "TRAINER"];

//  @desc       create single user
//  @route      POST /api/v1/users/register
//  @access     Public
exports.createUser = asyncHandler(async (req, res, next) => {
  if (ROLES.includes(req.body.role) === false) {
    return res.status(401).json({
      success: false,
      message: `Please provide a valid role`
    });
  }
  if (req.body.mobile.length !== 10) {
    return res.status(401).json({
      success: false,
      message: `Please provide a 10 digit no`
    });
  }
  const passReg = RegExp(/^(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/);
  if (passReg.test(req.body.password) === false) {
    return res.status(401).json({
      success: false,
      message: `Please provide  - Minimum 8 characters, One special character, One capital letter.`
    });
  }
  try {
    const hashedPassword = await AuthHelper.hashPassword(req.body.password);
    const { dataValues } = await models.user.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      mobile: req.body.mobile,
      password: hashedPassword,
      role: req.body.role,
      uid: generateUId(13)
    });

    delete dataValues.password;
    //   console.error(savedUser);
    // const savedUser = await user.save();
    res.status(200).json({
      success: true,
      data: {
        ...dataValues
      },
      message: "Account successfully created"
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: err?.original?.sqlMessage || err
    });
  }
});

//  @desc       login user
//  @route      POST /api/v1/users/login
//  @access     Public
exports.loginUser = asyncHandler(async (req, res, next) => {
  try {
    let currentUser;
    if (req.body.email) {
      currentUser = await models.user.findOne({
        where: { email: req.body.email }
      });
    }
    if (!currentUser)
      return (
        res.status(400),
        json({
          success: false,
          message: `Provide valid email`
        })
      );
    //check if password is correct
    const validPass = await bcrypt.compare(
      req.body.password,
      currentUser.password
    );

    if (!validPass)
      return (
        res.status(400),
        json({
          success: false,
          message: `Wrong password`
        })
      );

    console.log(process.env.TOKEN_SECRET);
    //jwt sign
    const token = jwt.sign({ id: currentUser.id }, process.env.TOKEN_SECRET, {
      expiresIn: "30d"
    });

    currentUser.password = undefined;
    delete currentUser.password;

    return res.status(200).json({
      success: true,
      message: `Logged in successfully`,
      data: currentUser,
      token: token
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err?.original?.sqlMessage || err
    });
  }
});

//  @desc       login user
//  @route      POST /api/v1/users/getUserDetails
//  @access     Public
exports.getUserDetails = asyncHandler(async (req, res) => {
  try {
    let currentUser;
    if (req.user.id) {
      currentUser = await models.user.findOne({
        attributes: [
          "id",
          "firstName",
          "lastName",
          "uid",
          "role",
          "email",
          "mobile",
          "status",
          "createdAt",
          "updatedAt"
        ]
      });
    }
    // console.log(req.body.email);

    res.status(200).json({
      success: true,
      message: `User logged in.`,
      data: { currentUser }
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err?.original?.sqlMessage
    });
  }
});

//  @desc       list users
//  @route      get /api/v1/users/list
//  @access     Public
exports.getUserList = asyncHandler(async (req, res, next) => {
  try {
    const users = await models.user.findAll({
      attributes: [
        "id",
        "firstName",
        "lastName",
        "uid",
        "role",
        "email",
        "mobile",
        "status",
        "createdAt",
        "updatedAt"
      ]
    });

    res.status(200).json({
      success: true,
      message: `User logged in.`,
      data: { users }
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err?.original?.sqlMessage
    });
  }
});
