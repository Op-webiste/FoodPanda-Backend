const express= require("express")
const {isAuthenticateUser,isAuthenticateAdmin} = require("../middleware/auth")
const { Get_All_Products, Add_Products, Delete_Products_By_Admin, Update_Products_By_Admin,Update_Products, Delete_Products, Get_Single_Product_By_Admin, Get_Single_Product, Delete_All_Products_By_Admin } = require("../controllers/productController")
const router = express.Router()

// Only Admin Allowed--LOGIN REQUIRED
router.route("/Admin/products/:id").delete(isAuthenticateUser,isAuthenticateAdmin("admin"),Delete_Products_By_Admin)
router.route("/Admin/products/update/:id").put(isAuthenticateUser,isAuthenticateAdmin("admin"),Update_Products_By_Admin)
router.route("/Admin/products/update/:id").get(isAuthenticateUser,isAuthenticateAdmin("admin"),Get_Single_Product_By_Admin)
router.route("/Admin/products/delete/new").delete(isAuthenticateUser,isAuthenticateAdmin("admin"),Delete_All_Products_By_Admin)


// EveryOne Can Access--NO LOGIN REQUIRED
router.route("/shop/products").get(Get_All_Products)


// Only Seller Allowed--LOGIN REQUIRED
router.route("/Seller/products/new").post(isAuthenticateUser,isAuthenticateAdmin("seller"),Add_Products)
router.route("/Seller/products/update/:id").put(isAuthenticateUser,isAuthenticateAdmin("seller"),Update_Products)
router.route("/Seller/products/delete/:id").delete(isAuthenticateUser,isAuthenticateAdmin("seller"),Delete_Products)
router.route("/Seller/products/:id").get(isAuthenticateUser,isAuthenticateAdmin("seller"),Get_Single_Product)

module.exports = router