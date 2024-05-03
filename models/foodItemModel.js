const nedb = require("nedb");
class foodItemModel {
  constructor(dbFilePath) {
    if (dbFilePath) {
      this.db = new nedb({ filename: dbFilePath.filename, autoload: true });
    } else {
      this.db = new nedb();
    }
  }
  //a function to seed the database
  init() {
    this.db.insert({
      category: 'Fruit',
      nameFood:"Apple",
      quantity: 5,
      expiryDate: new Date('2024-02-27').toISOString().split("T")[0],
      published: "2024-02-16",
      picture: "https://www.eatthis.com/wp-content/uploads/sites/4/2020/05/fresh-apples.jpg?quality=82&strip=1",
      createBy: "king01"
      });

  }
  //a function to return all items from the database
  getAllFoodItems() {
    return new Promise((resolve, reject) => {
      this.db.find({}, function (err, FoodItems) {
        if (err) {
          reject(err);
        } else {
          resolve(FoodItems);
          console.log("function gatAllEntries() returns: ", FoodItems);
        }
      });
    });
  }
  
  addFoodItems(category, nameFood, expiryDate, quantity,createBy,picture) {
    var foodItem = {
        category: category,
        nameFood: nameFood,
        expiryDate: new Date(expiryDate).toISOString().split("T")[0],
        quantity: quantity, 
        published: new Date().toISOString().split("T")[0],
        createBy : createBy,
        picture : picture
    };

    console.log("Food item created", foodItem);

    this.db.insert(foodItem, function (err, doc) {
        if (err) {
            console.log("Error inserting food item", err);
        } else {
            console.log("Food item inserted into the database", doc);
        }
    });
  }

  getFoodItemById(foodItemId) {
    return new Promise((resolve, reject) => {
        this.db.findOne({ _id: foodItemId }, (err, foodItem) => {
            if (err) {
                reject(err);
            } else {
                resolve(foodItem);
            }
        });
    });
}

  getFoodItemsByUser(name) {
    return new Promise((resolve, reject) => {
        this.db.find({ createBy: name }, function (err, foodItems) {
            if (err) {
                reject(err);
            } else {
                resolve(foodItems);
            }
        });
    });
  }

  // Function to update a food item by its ID
  updateFoodItemById(id, updatedFields) {
    return new Promise((resolve, reject) => {
        this.db.update({ _id: id }, { $set: updatedFields }, {}, (err, numReplaced) => {
            if (err) {
                reject(err);
            } else {
                resolve(numReplaced);
            }
        });
    });
}

// Function to remove a food item by its ID
removeFoodItemById(id) {
    return new Promise((resolve, reject) => {
        this.db.remove({ _id: id }, {}, (err, numRemoved) => {
            if (err) {
                reject(err);
            } else {
                resolve(numRemoved);
            }
        });
    });
}

// Method to update a food item by its ID
updateFoodItemById(id, category, nameFood, expiryDate, quantity, createBy, picture) {
  return new Promise((resolve, reject) => {
    this.db.findOne({ _id: id }, (err, foodItem) => {
      if (err) {
        reject(err);
        return;
      }
      if (!foodItem) {
        reject(new Error('Food item not found'));
        return;
      }

      // Update the fields
      if (category) foodItem.category = category;
      if (nameFood) foodItem.nameFood = nameFood;
      if (expiryDate) foodItem.expiryDate = expiryDate;
      if (quantity) foodItem.quantity = quantity;
      if (createBy) foodItem.createBy = createBy;
      if (picture) foodItem.picture = picture;

      // Save the updated document
      this.db.update({ _id: id }, foodItem, {}, (err, numReplaced) => {
        if (err) {
          reject(err);
        } else {
          resolve(numReplaced);
        }
      });
    });
  });
}

getAvailableItemsOfExpiryDate() {
  return new Promise((resolve, reject) => {
    const published = new Date().toISOString().split("T")[0];
    this.db.find({ expiryDate: { $gte: published } }, (err, items) => {
      if (err) {
        reject(err);
      } else {
        resolve(items);
      }
    });
  });
}
}
const FoodItemDAO = new foodItemModel({ filename: "foodItemModel.db", autoload: true });
FoodItemDAO.init();
module.exports = FoodItemDAO;
