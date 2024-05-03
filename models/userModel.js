const Datastore = require("nedb");
const bcrypt = require("bcrypt");
const saltRounds = 10;

class UserDAO {
  constructor(dbFilePath) {
    if (dbFilePath) {
      //embedded
      this.db = new Datastore({filename: dbFilePath.filename,autoload: true,
      });
    } else {
      //in memory
      this.db = new Datastore();
    }
  }
  // for the demo the password is the bcrypt of the user name
  init() {
    this.db.insert({
      user:"AdminHugh",
      password:"$2b$10$04nO8oYrcE2DkELBOTRdr.z6Et0fp/zVi3KZ03OE6qt5ndgDhG4Ve",
      role:"admin"
      });

      this.db.insert({
        user:"StaffHugh",
        password:"$2b$10$2wcBU.isc3iyd/awjUXBye/KaHP8e/bZMqSLtL6C/D3m2dXRxR2Fy",
        role:"Staff"
        });

      this.db.insert(
        {user:"TestAccount1",typeOfUser:"individual",name:"Hugh Campbell",EmailAddress:"HANTHO300@caledonian.ac.uk",password:"$2b$10$pRMbaC2eDtDH9X.EvPTfUec/PrX7y4qvh4zZ./3QRfiDm1QptsxA.",role:"normalUser"}
      );
    return this;
  }
  create(username, password, role) {
    const that = this;
    bcrypt.hash(password, saltRounds).then(function (hash) {
      var entry = {
        user: username,
        password: hash,
        role: role,
      };
      that.db.insert(entry, function (err) {
        if (err) {
          console.log("Can't insert user: ", username);
        }
      });
    });
  }

  createUser(username, typeOfUser,name, EmailAddress,password,) {
    const that = this;
    bcrypt.hash(password, saltRounds).then(function (hash) {
      var userEntry = {
        user: username,
        typeOfUser:typeOfUser,
        name:name,
        EmailAddress:EmailAddress,
        password: hash,
        role: "normalUser",
      };
      that.db.insert(userEntry, function (err) {
        if (err) {
          console.log("Can't insert user: ", username);
        }
      });
    });
  }

  lookup(user, cb) {
    this.db.find({ user: user }, function (err, entries) {
      if (err) {
        return cb(null, null);
      } else {
        if (entries.length == 0) {
          return cb(null, null);
        }
        return cb(null, entries[0]);
      }
    });
  }

  getAllUsers() {
    return new Promise((resolve, reject) => {
    this.db.find({}, function (err, users) {
      if (err) {
        reject (err) ;
      } else {
        resolve(users);
        console.log("function getAllUsers() returns: ", users);
        
      }
    });
    });
  }

  removeUserById(id) {
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
}

const dao = new UserDAO({ filename: "users.db", autoload: true });
dao.init();

module.exports = dao;
