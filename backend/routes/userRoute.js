const express = require("express")
const { isAuthenticateUser,isAuthenticateAdmin } = require("../middleware/auth")
const { Get_All_Users_By_Admin, SignUp, Delete_Users_By_Admin, Update_Users_By_Admin, Login, Logout, Get_User_Details_By_User, Get_Single_User_By_Admin, Delete_Own_Account_By_User, Update_Own_Account_By_User, Update_Own_Account_Password_By_User, Forget_Password, Reset_Password, Delete_Seller_Account_with_Shop_And_Products } = require("../controllers/userController")
const router = express.Router()

// Only Admin Allowed--LOGIN REQUIRED
router.route("/Admin/users").get(isAuthenticateUser,isAuthenticateAdmin("admin"),Get_All_Users_By_Admin)
router.route("/Admin/users/:id").get(isAuthenticateUser,isAuthenticateAdmin("admin"),Get_Single_User_By_Admin)
router.route("/Admin/users/delete/:id").delete(isAuthenticateUser,isAuthenticateAdmin("admin"),Delete_Users_By_Admin)
router.route("/Admin/users/update/:id").put(isAuthenticateUser,isAuthenticateAdmin("admin"),Update_Users_By_Admin)


// Authentication--NO LOGIN REQUIRED
router.route("/signup").post(SignUp)
router.route("/login").post(Login)
router.route("/password/forget").post(Forget_Password)
router.route("/password/reset/:token").put(Reset_Password)


// Only User Allowed--LOGIN REQUIRED
router.route("/me/logout").get(Logout)
router.route("/me/details").get(isAuthenticateUser,Get_User_Details_By_User)
router.route("/me/delete").delete(isAuthenticateUser,Delete_Own_Account_By_User)
router.route("/me/delete/seller").delete(isAuthenticateUser,Delete_Seller_Account_with_Shop_And_Products)
router.route("/me/update").put(isAuthenticateUser,Update_Own_Account_By_User)
router.route("/me/update/password").put(isAuthenticateUser,Update_Own_Account_Password_By_User)


module.exports = router