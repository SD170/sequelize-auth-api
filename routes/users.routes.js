const router = require("express").Router();
const { createUser, loginUser, getUserDetails, getUserList } = require("../controllers/user.controller");
const {authenticate} = require('../middlewares/vetifyToken');

// router.route("/register").post(authenticate,createUser);
router.route("/register").post(createUser);
router.route("/login").post(loginUser);
router.route("/getUserList").post(getUserList);
router.route("/getUserDetails").post(authenticate,getUserDetails);


module.exports = router;
