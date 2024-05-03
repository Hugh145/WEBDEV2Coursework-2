const nedb = require("nedb");
class pantryItemModel {
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
      expiryDate: new Date('2024-07-02').toISOString().split("T")[0],
      published: "2024-02-16",
      picture: "https://www.eatthis.com/wp-content/uploads/sites/4/2020/05/fresh-apples.jpg?quality=82&strip=1",
      createBy: "king01",
      pantryLocation: "cambuslang"
      });

  }
  //a function to return all items from the database
  getAllFoodItemsPantry() {
    return new Promise((resolve, reject) => {
      this.db.find({}, function (err, PantryItems) {
        if (err) {
          reject(err);
        } else {
          resolve(PantryItems);
          console.log("function gatAllEntries() returns: ", PantryItems);
        }
      });
    });
  }
  
  pantryAddFoodItems(category, nameFood, expiryDate, quantity,createBy,picture,pantryLocation) {
    var PantryItems = {
        category: category,
        nameFood: nameFood,
        expiryDate: new Date(expiryDate).toISOString().split("T")[0],
        quantity: quantity, 
        published: new Date().toISOString().split("T")[0],
        createBy : createBy,
        picture : picture,
        pantryLocation: pantryLocation
    };

    console.log("Pantry Item created", PantryItems);

    this.db.insert(PantryItems, function (err, doc) {
        if (err) {
            console.log("Error inserting item", err);
        } else {
            console.log("pantry item inserted into the database", doc);
        }
    });
  }

}
const pantryItemDAO = new pantryItemModel({ filename: "pantryItemModel.db", autoload: true });
pantryItemDAO.init();
module.exports = pantryItemDAO;