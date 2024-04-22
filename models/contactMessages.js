const nedb = require("nedb");
class ContactMessages {
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
      email: "hugh@hugh.com",
      name: "Hugh",
      subjectMatter: "Question",
      message: "Hi how can i a donation to this website",
      published: "2024-02-16"
      });

  }
  //a function to return all entries from the database
  getAllContactMessage() {
    //return a Promise object, which can be resolved or rejected
    return new Promise((resolve, reject) => {
      //use the find() function of the database to get the data,
      //error first callback function, err for error, entries for data
      this.db.find({}, function (err, contactMessage) {
        //if error occurs reject Promise
        if (err) {
          reject(err);
          //if no error resolve the promise & return the data
        } else {
          resolve(contactMessage);
          //to see what the returned data looks like
          console.log("function gatAllEntries() returns: ", contactMessage);
        }
      });
    });
  }

  addContactMessage(email, name,subjectMatter, message) {
    var contactMessage = {
      email: email,
      name: name,
      subjectMatter: subjectMatter,
      message: message,
      published: new Date().toISOString().split("T")[0],
    };
    console.log("contact message created", contactMessage);
    this.db.insert(contactMessage, function (err, doc) {
      if (err) {
        console.log("Error inserting document", subjectMatter);
      } else {
        console.log("document inserted into the database", doc);
      }
    });
  }

  getContactMessageByEmail(Email) {
    return new Promise((resolve, reject) => {
      this.db.find({ Email: Email }, function (err, contactMessage) {
        if (err) {
          reject(err);
        } else {
          resolve(contactMessage);
          console.log("getEntriesByUser returns: ", contactMessage);
        }
      });
    });
  }

  getContactMessageBySubjectMatter(subjectMatter) {
    return new Promise((resolve, reject) => {
      this.db.find({ subjectMatter: subjectMatter }, function (err, contactMessage) {
        if (err) {
          reject(err);
        } else {
          resolve(contactMessage);
          console.log("getEntriesByUser returns: ", contactMessage);
        }
      });
    });
  }
  
  // DeleteContactMessageBySubjectMatter(subjectMatter) {
  //   return new Promise((resolve, reject) => {
  //     this.db.remove({ subjectMatter: subjectMatter }, function (err, contactMessage) {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve(contactMessage);
  //         console.log("remove by subject matter: ", contactMessage);
  //       }
  //     });
  //   });
  // }

 
}
const cM = new ContactMessages({ filename: "contactMessage.db", autoload: true });
cM.init();
module.exports = cM;