const Datastore = require("nedb");
const bcrypt = require("bcrypt");
const saltRounds = 10;

class FoodItemDAO {
  constructor(dbFilePath) {
    if (dbFilePath) {
      // Embedded database
      this.db = new Datastore({ filename: dbFilePath, autoload: true });
    } else {
      // In-memory database
      this.db = new Datastore();
    }
  }

  // Initialize the food item database
  init() {
    // Create indexes for faster querying (optional but recommended)
    this.db.ensureIndex({ fieldName: 'type' });
    this.db.ensureIndex({ fieldName: 'expiryDate' });

    // Insert some sample data (optional)
    this.db.insert({
      type: 'Fruit',
      expiryDate: new Date('2024-04-30'),
      quantity: 10,
      picture: 'fruit.jpg',
      createdBy: 'AdminHugh' // Example user
    });
  }

  // Create a new food item
  createFoodItem(type, expiryDate, quantity, picture, createdBy) {
    const foodItem = {
      type: type,
      expiryDate: new Date(expiryDate),
      quantity: quantity,
      picture: picture,
      createdBy: createdBy
    };
    
    return new Promise((resolve, reject) => {
      this.db.insert(foodItem, (err, newFoodItem) => {
        if (err) {
          reject(err);
        } else {
          resolve(newFoodItem);
        }
      });
    });
  }

  // Get all food items
  getAllFoodItems() {
    return new Promise((resolve, reject) => {
      this.db.find({}, (err, foodItems) => {
        if (err) {
          reject(err);
        } else {
          resolve(foodItems);
        }
      });
    });
  }
}

module.exports = FoodItemDAO;
