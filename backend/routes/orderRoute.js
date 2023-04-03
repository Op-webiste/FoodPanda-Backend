const express = require("express")
const {isAuthenticateUser,isAuthenticateAdmin} = require("../middleware/auth")
const { Get_All_Orders_By_Admin, Add_Orders_By_User, Get_All_Orders_By_Seller, Delete_All_Orders_By_Admin, Update_Order_Status_By_Seller, Delete_Single_Order_By_Admin, Delete_Single_Order_By_Seller, Get_All_Orders_By_User, Cancel_Order_By_User, Get_All_Order_By_Searching_By_Seller, Get_All_Orders_By_Searching_By_User, Delete_All_Orders_Of_All_Shops_By_Admin } = require("../controllers/orderController")
const router = express.Router()

// Only Admin Allowed--LOGIN REQUIRED
router.route("/Admin/orders/:id").get(isAuthenticateUser,isAuthenticateAdmin("admin"),Get_All_Orders_By_Admin)
router.route("/Admin/orders/deleteAll/:id").delete(isAuthenticateUser,isAuthenticateAdmin("admin"),Delete_All_Orders_By_Admin)
router.route("/Admin/orders/:id").delete(isAuthenticateUser,isAuthenticateAdmin("admin"),Delete_Single_Order_By_Admin)
router.route("/Admin/orders/deleteOrders/new").delete(isAuthenticateUser,isAuthenticateAdmin("admin"),Delete_All_Orders_Of_All_Shops_By_Admin)

// Only User Allowed--LOGIN REQUIRED
router.route("/Users/orders/new").post(isAuthenticateUser,isAuthenticateAdmin("user"),Add_Orders_By_User)
router.route("/Users/orders").get(isAuthenticateUser,isAuthenticateAdmin("user"),Get_All_Orders_By_User)
router.route("/Users/orders/search").get(isAuthenticateUser,isAuthenticateAdmin("user"),Get_All_Orders_By_Searching_By_User)
router.route("/Users/orders/:id").put(isAuthenticateUser,isAuthenticateAdmin("user"),Cancel_Order_By_User)


// Only Seller Allowed--LOGIN REQUIRED
router.route("/Seller/orders").get(isAuthenticateUser,isAuthenticateAdmin("seller"),Get_All_Orders_By_Seller)
router.route("/Seller/orders/:id").put(isAuthenticateUser,isAuthenticateAdmin("seller"),Update_Order_Status_By_Seller)
router.route("/Seller/orders/:id").delete(isAuthenticateUser,isAuthenticateAdmin("seller"),Delete_Single_Order_By_Seller)
router.route("/Seller/orders/search").get(isAuthenticateUser,isAuthenticateAdmin("seller"),Get_All_Order_By_Searching_By_Seller)


module.exports = router