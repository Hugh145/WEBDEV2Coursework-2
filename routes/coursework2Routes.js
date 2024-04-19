const express = require('express');
const router = express.Router();
const controller = require('../controllers/websiteController.js');
const auth =require('../auth/auth.js')


router.get('/login', controller.show_login);
router.post('/login', auth.login, controller.handle_login);
router.get("/", controller.landing_page);
router.get('/new',auth.verify,controller.show_new_entries);
router.post('/new', auth.verify, controller.post_new_entry);
router.get('/posts/:author', controller.show_user_entries);
router.get('/register', controller.show_register_page);
router.post('/register', controller.post_new_user);
router.get("/loggedIn",auth.verify, controller.loggedIn_landing);
router.get("/logout", controller.logout);
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