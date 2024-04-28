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
      expiryDate: new Date('2024-05-15'),
      published: "2024-02-16"
      });

  }
  //a function to return all entries from the database
  getAllFoodItems() {
    //return a Promise object, which can be resolved or rejected
    return new Promise((resolve, reject) => {
      //use the find() function of the database to get the data,
      //error first callback function, err for error, entries for data
      this.db.find({}, function (err, FoodItems) {
        //if error occurs reject Promise
        if (err) {
          reject(err);
          //if no error resolve the promise & return the data
        } else {
          resolve(FoodItems);
          //to see what the returned data looks like
          console.log("function gatAllEntries() returns: ", FoodItems);
        }
      });
    });
  }
  
  addFoodItems(category, nameFood, expiryDate, quantity,) {
    var foodItem = {
        category: category,
        nameFood: nameFood,
        expiryDate: new Date(expiryDate),
        quantity: quantity, 
        published: new Date().toISOString().split("T")[0]
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
}
const FoodItemDAO = new foodItemModel({ filename: "foodItemModel.db", autoload: true });
FoodItemDAO.init();
module.exports = FoodItemDAO;
