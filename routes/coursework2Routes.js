const express = require('express');
const router = express.Router();
const controller = require('../controllers/websiteController.js');
const auth =require('../auth/auth.js')
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

//login page 
router.get('/login', controller.show_login);
router.post('/login', auth.login, controller.handle_login);
router.get("/", controller.landing_page);

//this is for the contact form 
router.get('/contact_form', controller.getContactform);
router.post('/contact_form',controller.postContactMessage);
router.get('/messageSent',controller.show_messageSent);


//about page 
router.get( '/about', controller.about_page);


//add new food item and viewing food items 
router.get('/Add_Food_Item',auth.verify,controller.show_new_Add_Food_Item);
router.post("/Add_Food_Item",upload.single("picture"), auth.verify, controller.addFoodItem);
router.get('/ViewFoodItemUsername', auth.verify, controller.show_ViewFoodItemUsername);
router.post("/ViewFoodItemUsername", auth.verify, controller.postAllFoodItemswithUsername);
router.get('/messageUserFoodAdded',auth.verify,controller.show_messageUserFoodAdded);
//displaying all the food items 
router.get('/foodItems', auth.verify, controller.showAllFoodItems);

//register page
router.get('/register', controller.show_register_page);
router.post('/register', controller.post_new_user);
router.get('/enterInNewUsername',controller.show_enterInNewUsername);

//login in and out 
router.get("/loggedIn",auth.verify, controller.loggedIn_landing);
router.get("/logout", controller.logout);

//admin pages 
router.get("/admin",auth.verifyAdmin, controller.show_admin);
router.get("/adminPostNewUser",auth.verifyAdmin, controller.admin_add_new_user);
router.post("/adminPostNewUser",auth.verifyAdmin, controller.admin_post_new_user);

//new food adding 
router.get('/Add_Food_Item_Admin',auth.verifyAdmin,controller.show_new_Add_Food_Item_Admin);
router.post("/Add_Food_Item_Admin",upload.single("picture"), auth.verifyAdmin, controller.addFoodItemAdmin);

//Delete food items 
router.get('/deleteFoodItem',auth.verifyAdmin, controller.showDeleteFoodItemForm);
router.post('/deleteFoodItem',auth.verifyAdmin, controller.deleteFoodItem);

//Update Food Items
router.get('/updateFoodItem',auth.verifyAdmin,  controller.showUpdateFoodItemForm);
router.post('/updateFoodItem',upload.single("picture"),auth.verifyAdmin,  controller.updateFoodItem);

//create a new user account 
router.get('/createUserAccountAdmin',auth.verifyAdmin,controller.showCreateUserAccountAdmin);
router.post('/createUserAccountAdmin',auth.verifyAdmin,controller.postCreateUserAccountAdmin);

//view all the user 
router.get('/viewAllUserAccounts',auth.verifyAdmin, controller.viewAllUserAccounts);

//create a new user account 
router.get('/deleteUserAccountAdmin',auth.verifyAdmin,controller.showDeleteUserAccountAdmin);
router.post('/deleteUserAccountAdmin',auth.verifyAdmin,controller.postDeleteUserAccountAdmin);

//view all the contact messages as admin 
router.get('/viewAllContactMessages', auth.verifyAdmin, controller.show_viewAllContactMessages);

//send emails to message sendEmail
router.get('/sendEmail',auth.verifyAdmin,controller.show_sendEmail);
router.post('/sendEmail',auth.verifyAdmin,controller.post_sendEmail);

//staff pages 
router.get("/staff",auth.verifyStaff, controller.show_staff);
//viewing the food items 
router.get('/viewFoodItemStaff', auth.verifyStaff, controller.show_viewFoodItemStaff);
router.post('/viewFoodItemStaff', auth.verifyStaff, controller.post_viewFoodItemStaff);

//viewing all the parties 
router.get('/viewPantryFoodItemStaff',auth.verifyStaff, controller.show_viewPantryFoodItemStaff);

//error displaying
router.use(function(req, res) {
        res.status(404);
        res.type('text/plain');
        res.send('404 Not found.');
    });

router.use(function(req, res) {
        res.status(401);
        res.type('text/plain');
        res.send('please enter in new username.');
    });

router.use(function(err, req, res, next) {
        res.status(500);
        res.type('text/plain');
        res.send('Internal Server Error in routes file.');
    });
module.exports = router;