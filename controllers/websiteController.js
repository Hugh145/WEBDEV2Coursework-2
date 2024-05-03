const userDao = require("../models/userModel.js");   
const FoodItemDAO = require("../models/foodItemModel.js");  
const PantryDAO = require("../models/PantriesModel.js");  
const contactMessagesDAO = require("../models/contactMessages.js"); // to set database up in virtual memory use const db = new guestbookDAO();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'scottishpantrynetwork49@gmail.com',
        pass: 'sopv cpdx yvuh cgij'
    }
});

exports.show_enterInNewUsername = function (req, res) {
  res.render("enterInNewUsername");
};


//user login
exports.show_login = function (req, res) {
  res.render("user/login");
};

//after login
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
    title:"homepage",
  });
};

//the about page 
exports.about_page = function (req, res) 
{
  res.render("about",{
    title:"about us page",
  });
};

//display_message messageUserFoodAdded
exports.show_messageUserFoodAdded = function (req, res) {
  res.render("messageUserFoodAdded", {
    title: "messageUserFoodAdded",
    user: "user"
  });
};

//Add-Food-Item page 
exports.show_new_Add_Food_Item = function (req, res) {
  res.render("Add_Food_Item", {
    title: "Add Food Item",
    user: "user",
  });
};

// getting the user food item 
exports.addFoodItem = async function (req, res) {
  try {
    if (!req.body.category || !req.body.nameFood || !req.body.quantity ||!req.body.expiryDate|| !req.body.createBy) {
      res.status(400).send("All fields are required.");
      return;
    }
    const picture = req.file ? req.file.path : null;

    await FoodItemDAO.addFoodItems(
      req.body.category,
      req.body.nameFood,
      req.body.expiryDate,
      req.body.quantity,
      req.body.createBy,
      picture
    );
    res.redirect("/messageUserFoodAdded");
  } catch (error) {
    console.error("Error adding food item:", error);
    res.status(500).send("Error adding food item");
  }
};

//displaying all the food items 
exports.showAllFoodItems = function(req, res) {
  FoodItemDAO.getAllFoodItems()
    .then(foodItems => {
      res.render('foodItems', { 
        title: "View Food Items",
        user: "user",
        foodItems: foodItems 
      });
    })
    .catch(err => {
      console.error('Error fetching food items:', err);
      res.status(500).send('Error fetching food items');
    });
};

//displaying the user own orders 
exports.postAllFoodItemswithUsername = function(req, res) {
  if (!req.body.name) {
    // If any required field is missing, send a response indicating the error
    res.status(400).send(" please enter in the username as it required.");
    return;
  }
  FoodItemDAO.getFoodItemsByUser(req.body.name)
    .then(userFoodorders => {
      res.render('viewFoodItemAsUser', {
        title: "View Food Items",
        user: "user",
        userFoodorders: userFoodorders 
      });
    })
    .catch(err => {
      console.error('Error fetching food items:', err);
      res.status(500).send('Error fetching food items');
    });
};

//Add-Food-Item page ViewFoodItemUsername
exports.show_ViewFoodItemUsername = function (req, res) {
  res.render("ViewFoodItemUsername", {
    title: "View food Items",
    user: "user",
    error: "Incorrect name entered. Please try again."
  });
};


//creating the link for the contact form messageSent
exports.getContactform = function (req, res) {
  res.render("contact_form", {
    title: "contact form",
  });
};
//creation of the message 
exports.postContactMessage = function (req, res) {
  if (!req.body.email || !req.body.name || !req.body.subjectMatter || !req.body.message) {
    res.status(400).send("All fields are required.");
    return;
  }
// Save the contact message to the database
  contactMessagesDAO.addContactMessage(req.body.email, req.body.name, req.body.subjectMatter, req.body.message );
  res.redirect("/messageSent");
};

//creating the link for messageSent
exports.show_messageSent = function (req, res) {
  res.render("messageSent", {
    title: "messageSent",
  });
};

//register
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
      res.redirect("/enterInNewUsername");
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

//user can logout 
exports.logout = function (req, res) {
  res.clearCookie("jwt").status(200).redirect("/");
};


exports.show_admin = function (req, res) {
  res.render("admin", {
    title: "admin homepage",
    user:"admin"
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

  
//Add-Food-Item page 
exports.show_new_Add_Food_Item_Admin = function (req, res) {
  res.render("Add_Food_Item_Admin", {
    title: "Add Food Item",
    user: "admin",
  });
};

// add the user food item as admin 
exports.addFoodItemAdmin = async function (req, res) {
  try {
    if (!req.body.category || !req.body.nameFood || !req.body.quantity ||!req.body.expiryDate|| !req.body.createBy) {
      res.status(400).send("All fields are required.");
      return;
    }
    const picture = req.file ? req.file.path : null;
    await FoodItemDAO.addFoodItems(
      req.body.category,
      req.body.nameFood,
      req.body.expiryDate,
      req.body.quantity,
      req.body.createBy,
      picture
    );
    res.redirect("/admin");
  } catch (error) {
    console.error("Error adding food item:", error);
    res.status(500).send("Error adding food item");
  }
};
//displaying the page
exports.showDeleteFoodItemForm = function (req, res) {
  res.render("deleteFoodItemForm", {
      title: "Delete Food Item",
      user: "admin"
  });
};
//  deleting a food item
exports.deleteFoodItem = function (req, res) {
  const id = req.body.id; 
  FoodItemDAO.removeFoodItemById(id)
      .then(() => {
          res.redirect("/foodItems"); 
      })
      .catch((err) => {
          console.error("Error deleting food item:", err);
          res.status(500).send("Error deleting food item");
      });
};

exports.showUpdateFoodItemForm = function (req, res) {
  res.render("update_Food_Item_Admin", {
      title: "Update Food Item",
      user: "admin"
  });
};

// Controller method for updating a food item
exports.updateFoodItem = function (req, res) {
  const id = req.body.id; // ID of the food item to be updated
  const category = req.body.category;
  const nameFood = req.body.nameFood;
  const expiryDate = req.body.expiryDate;
  const quantity = req.body.quantity;
  const createBy = req.body.createBy;
  const picture = req.file ? req.file.path : null;

  // Call the method to update the food item in the database
  FoodItemDAO.updateFoodItemById(id, category, nameFood, expiryDate, quantity, createBy, picture)
      .then(() => {
          res.redirect("/admin"); // Redirect to the admin page after update
      })
      .catch((err) => {
          console.error("Error updating food item:", err);
          res.status(500).send("Error updating food item");
      });
};

exports.showCreateUserAccountAdmin = function (req, res) {
  res.render("CreateUserAccountAdmin", {
      title: "Create User Account as Admin",
      user: "admin"
  });
};

exports.postCreateUserAccountAdmin = function (req, res) {
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
    res.redirect("/admin");
  });
};

//displaying all the food items 
exports.viewAllUserAccounts = function(req, res) {
  userDao.getAllUsers()
    .then(viewUserAccounts => {
      res.render('viewAllUserAccounts', { 
        title: "View All User Accounts",
        user: "admin",
        viewUserAccounts: viewUserAccounts 
      });
    })
    .catch(err => {
      console.error('Error fetching food items:', err);
      res.status(500).send('Error fetching food items');
    });
};

exports.showDeleteUserAccountAdmin = function (req, res) {
  res.render("deleteUserAccountAdmin", {
      title: "Delete user",
      user: "admin"
  });
};
// Controller method for deleting a user account
exports.postDeleteUserAccountAdmin = function (req, res) {
  const id = req.body.id; 
  userDao.removeUserById(id)
      .then(() => {
          res.redirect("/viewAllUserAccounts"); // Redirect to the user page after deletion
      })
      .catch((err) => {
          console.error("Error deleting food item:", err);
          res.status(500).send("Error deleting food item");
      });
};

exports.show_sendEmail = function (req, res) {
  res.render("sendEmail", {
      title: "sending a Email",
      user: "admin"
  });
};

exports.post_sendEmail = function (req, res) {
  try {
    const { email, name, message } = req.body;

    // Send mail with defined transport object
    const info = transporter.sendMail({
        from: 'scottishpantrynetwork49@gmail.com',
        to: email,
        subject: 'Contact Form Submission Email Respone',
        text: `Admin name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    });

    console.log('Email sent:', info.messageId);
    res.render("sendEmail", { Message: "Email sent successfully" });
    //res.status(200).json({ message: 'Email sent successfully' });
} catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
}
};

//veiw all the contact messages 
exports.show_viewAllContactMessages = function (req, res) {
  contactMessagesDAO.getAllContactMessage()
  .then(messages => {
    res.render('viewAllContactMessages', { 
      title: "view All Contact Messages",
      user: "admin",
      messages: messages 
    });
  })
  .catch(err => {
    console.error('Error fetching message:', err);
    res.status(500).send('Error fetching messages');
  });
};

exports.show_staff = function (req, res) {
  res.render("staff", {
    title: "Staff homepage",
    user:"Staff"
  });
};

exports.show_viewFoodItemStaff = function (req, res) {
  FoodItemDAO.getAvailableItemsOfExpiryDate()
  .then(foodItems => {
    res.render('viewFoodItemStaff', { 
      title: "View Food Items within usable date",
      user: "Staff",
      foodItems: foodItems 
    });
  })
  .catch(err => {
    console.error('Error fetching food items:', err);
    res.status(500).send('Error fetching food items');
  });
};

// Add food item to pantry
exports.post_viewFoodItemStaff = async function (req, res) {
  try {
    const foodItemId = req.body.foodItemId;
    const location = req.body.location; // Assuming location is provided in the request body

    // Get the selected food item from FoodItemDAO
    const foodItem = await FoodItemDAO.getFoodItemById(foodItemId);

    if (!foodItem) {
      res.status(404).send('Food item not found');
      return;
    }

    // Add the selected food item to PantryItemDAO
    await PantryDAO.pantryAddFoodItems(
      foodItem.category,
      foodItem.nameFood,
      foodItem.expiryDate,
      foodItem.quantity,
      foodItem.createBy,
      foodItem.picture,
      location
    );

    // Remove the selected food item from FoodItemDAO
    await FoodItemDAO.removeFoodItemById(foodItemId);

    res.redirect('/messageUserFoodAdded'); // Redirect to success page
  } catch (error) {
    console.error("Error adding food item to pantry:", error);
    res.status(500).send("Error adding food item to pantry");
  }
};

exports.show_viewPantryFoodItemStaff = function (req, res) {
  PantryDAO.getAllFoodItemsPantry()
  .then(PantryItems => {
    res.render('viewPantryFoodItemStaff', { 
      title: "View Food Items within Pantry",
      user: "Staff",
      PantryItems: PantryItems 
    });
  })
  .catch(err => {
    console.error('Error fetching food items:', err);
    res.status(500).send('Error fetching food items');
  });
};