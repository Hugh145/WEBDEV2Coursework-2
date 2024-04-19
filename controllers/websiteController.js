const guestbookDAO = require("../models/guestbookModel");
const userDao = require("../models/userModel.js");   

const db = new guestbookDAO({ filename: "guestbook.db", autoload: true }); // to set database up in virtual memory use const db = new guestbookDAO();
db.init();

exports.show_login = function (req, res) {
  res.render("user/login");
};

exports.handle_login = function (req, res) {
  res.render("Homepage", {
    title: "Guest Book",
    user: "user"
  });
};

exports.landing_page = function (req, res) 
{
  res.render("Homepage",{
    title:"homepage"
  });
};

exports.show_new_entries = function (req, res) {
  res.render("newEntry", {
    title: "Guest Book",
    user: "user",
  });
};

exports.post_new_entry = function (req, res) {
  if (!req.body.author) {
    response.status(400).send("Entries must have an author.");
    return;
  }
  db.addEntry(req.body.author, req.body.subject, req.body.contents);
  res.redirect("/loggedIn");
};

exports.show_user_entries = function (req, res) {
  let user = req.params.author;
  db.getEntriesByUser(user)
    .then((entries) => {
      res.render("entries", {
        title: "Guest Book",
        user: "user",
        entries: entries,
      });
    })
    .catch((err) => {
      console.log("Error: ");
      console.log(JSON.stringify(err));
    });
};

exports.show_register_page = function (req, res) {
  res.render("user/register");
};

exports.post_new_user = function (req, res) {
  const user = req.body.username;
  const password = req.body.pass;
  const role = req.body.role;

  if (!user || !password) {
    res.send(401, "no user or no password");
    return;
  }
  userDao.lookup(user, function (err, u) {
    if (u) {
      res.send(401, "User exists:", user);
      return;
    }
    userDao.create(user, password,role);
    res.redirect("/login");
  });
};

exports.loggedIn_landing = function (req, res) {
      res.render("Hompage", {
        title: "Homepage",
        user:"user"
      });
    };

exports.logout = function (req, res) {
  res.clearCookie("jwt").status(200).redirect("/");
};

exports.show_admin = function (req, res) {
 userDao.getAllUsers()
 .then((list) => {
    res.render("admin", {
      title: 'Admin dashboard',
      user:"admin",
      users: list,
    });
  
  })
  .catch((err) => {
    console.log("promise rejected", err);
  });
};
exports.admin_add_new_user=function(req, res){
  res.render('addUser',{ user:"admin"})
}
exports.admin_post_new_user = function (req, res) {
  const user = req.body.username;
  const password = req.body.pass;
  const role = req.body.role;

  if (!user || !password) {
    res.send(401, "no user or no password");
    return;
  }
  userDao.lookup(user, function (err, u) {
    if (u) {
      res.send(401, "User exists:", user);
      return;
    }
    userDao.create(user, password,role);
  });
  res.render("userAdded")
 };