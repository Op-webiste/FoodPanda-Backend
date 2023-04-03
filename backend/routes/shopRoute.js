const express =require("express")
const {isAuthenticateUser,isAuthenticateAdmin} = require("../middleware/auth")
const { Get_All_Shops, Create_Shop_by_Seller, Delete_Shop_by_Admin, Update_Shop_by_Admin, Update_Shop_By_Seller, Delete_Shop_By_Seller, Get_Shop_Details_by_Seller, Get_Single_Shop_by_Admin, Add_Review_by_User } = require("../controllers/shopController")
const router = express.Router()

// Only Admin Allowed--LOGIN REQUIRED
router.route("/Admin/shops/:id").get(isAuthenticateUser,isAuthenticateAdmin("admin"),Get_Single_Shop_by_Admin)
router.route("/Admin/shops/:id").delete(isAuthenticateUser,isAuthenticateAdmin("admin"),Delete_Shop_by_Admin)
router.route("/Admin/shops/:id").put(isAuthenticateUser,isAuthenticateAdmin("admin"),Update_Shop_by_Admin)


// All people Access this--No LOGIN REQUIRED
router.route("/shops").get(Get_All_Shops)


// Only Seller Allowed--LOGIN REQUIRED
router.route("/Seller/shops/new").post(isAuthenticateUser,isAuthenticateAdmin("seller"),Create_Shop_by_Seller)
router.route("/Seller/shops").get(isAuthenticateUser,isAuthenticateAdmin("seller"),Get_Shop_Details_by_Seller)
router.route("/Seller/shops/update").put(isAuthenticateUser,isAuthenticateAdmin("seller"),Update_Shop_By_Seller)
router.route("/Seller/shops/delete").delete(isAuthenticateUser,isAuthenticateAdmin("seller"),Delete_Shop_By_Seller)



// Only User Allowed--LOGIN REQUIRED
router.route("/Users/shops/review").post(isAuthenticateUser,isAuthenticateAdmin("user"),Add_Review_by_User)


module.exports = router