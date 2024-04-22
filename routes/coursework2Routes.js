const express = require('express');
const router = express.Router();
const controller = require('../controllers/websiteController.js');
const auth =require('../auth/auth.js')

//login page 
router.get('/login', controller.show_login);
router.post('/login', auth.login, controller.handle_login);
router.get("/", controller.landing_page);

//this is for the contact form 
router.get('/contact_form', controller.getContactform);
router.post('/contact_form',controller.postContactMessage);

//about page 
router.get( '/about', controller.about_page);

//new item
router.get('/new',auth.verify,controller.show_new_entries);
router.post('/new', auth.verify, controller.post_new_entry);
router.get('/posts/:author', controller.show_user_entries);

//register page
router.get('/register', controller.show_register_page);
router.post('/register', controller.post_new_user);

//login in and out 
router.get("/loggedIn",auth.verify, controller.loggedIn_landing);
router.get("/logout", controller.logout);

//admin pages 
router.get("/admin",auth.verifyAdmin, controller.show_admin);
router.get("/adminPostNewUser",auth.verifyAdmin, controller.admin_add_new_user);
router.post("/adminPostNewUser",auth.verifyAdmin, controller.admin_post_new_user);


router.use(function(req, res) {
        res.status(404);
        res.type('text/plain');
        res.send('404 Not found.');
    });


router.use(function(err, req, res, next) {
        res.status(500);
        res.type('text/plain');
        res.send('Internal Server Error.');
    });
module.exports = router;