const guestbookDAO = require("../models/guestbookModel");
const userDao = require("../models/userModel.js");   
const FoodItemDAO = require("../models/foodItemModel.js");  
const contactMessagesDAO = require("../models/contactMessages.js");
const db = new guestbookDAO({ filename: "guestbook.db", autoload: true }); // to set database up in virtual memory use const db = new guestbookDAO();
db.init();

//user login
exports.show_login = function (req, res) {
  res.render("user/login");
};

exports.handle_login = function (req, res) {
  res.render("Homepage", {
    title: "Homepage-Login",
    user: "user" 
  });
};

//homepage of the website
exports.landing_page = function (req, res) 
{
  res.render("Homepage",{
    title:"homepage"
  });
};

//the about page 
exports.about_page = function (req, res) 
{
  res.render("about",{
    title:"about us page"
  });
};

//Add-Food-Item page 
exports.show_new_Add_Food_Item = function (req, res) {
  res.render("Add_Food_Item", {
    title: "Add Food Item",
    user: "user",
  });
};

exports.addFoodItem = async function (req, res) {
  try {
    if (!req.body.category || !req.body.nameFood || !req.body.quantity) {
      res.status(400).send("All fields are required.");
      return;
    }
    await FoodItemDAO.addFoodItems(
      req.body.category,
      req.body.nameFood,
      req.body.expiryDate,
      req.body.quantity
    );
    res.redirect("/Add_Food_Item");
  } catch (error) {
    console.error("Error adding food item:", error);
    res.status(500).send("Error adding food item");
  }
};


//creating the link for the contact form
exports.getContactform = function (req, res) {
  res.render("contact_form", {
    title: "contact form",
    user: "user",
  });
};
//creation of the message 
// Controller method for handling the POST request of the contact message
exports.postContactMessage = function (req, res) {
  // Validate form data
  if (!req.body.email || !req.body.name || !req.body.subjectMatter || !req.body.message) {
    // If any required field is missing, send a response indicating the error
    res.status(400).send("All fields are required.");
    return;
  }
  // Save the contact message to the database
  contactMessagesDAO.addContactMessage(req.body.email, req.body.name, req.body.subjectMatter, req.body.message );
  res.redirect("/contact_form");
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
  const typeOfUser = req.body.typeOfUser;
  const name = req.body.name
  const EmailAddress = req.body.EmailAddress;
  const password = req.body.pass;

  if (!user|| !typeOfUser || !name || !EmailAddress || !password) {
    res.send(401, "please enter in all of the fields");
    return;
  }
  userDao.lookup(user, function (err, u) {
    if (u) {
      res.send(401, "User exists:", user);
      return;
    }
    userDao.createUser(user,typeOfUser, name,EmailAddress, password);
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