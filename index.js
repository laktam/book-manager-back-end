import express from "express";
import { readFileSync } from "fs";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import fs from "fs";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "books/images"); // Destination directory for storing uploaded files
  },
  filename: function (req, file, cb) {
    // Use Date.now() to make sure each file has a unique name
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
// Initialize multer middleware
const upload = multer({ storage: storage });

// Endpoint for handling image uploads
app.post("/upload/:username", upload.single("image"), (req, res) => {
  // Access the uploaded file via req.file
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const newBook = req.body;
  delete newBook.image;
  //add imgSrc to newBook4
  const imagePath = "/images/" + req.file.filename;
  newBook.imgSrc = imagePath;
  console.log("new Book::::::::", newBook);

  const username = req.params.username;
  // const xmlFile = readFileSync(`./users/users.xml`, "utf8");
  // const parser = new XMLParser();
  // const json = parser.parse(xmlFile); //options
  const json = getXMLAsJson();
  // const users = json.users.user;
  for (const user of json.users.user) {
    if (user.username === username) {
      if (Array.isArray(user.books.book)) {
        user.books.book.push(newBook);
      } else {
        //in case book is an object i can't call push
        user.books.book = [user.books.book, newBook];
      }
      res.json(user);
    }
  }
  writeJsonToXML(json);
  //write to xml file
  // Convert the XML data object to XML string
  // const builder = new XMLBuilder(); //options
  // let xmlDataStr = builder.build(json);
  // // Write the XML string to a file
  // fs.writeFile("users/users.xml", xmlDataStr, function (err) {
  //   if (err) {
  //     console.error("Error writing XML file:", err);
  //   } else {
  //     console.log("XML file written successfully!");
  //   }
  // });
  // File has been uploaded successfully
  console.log("File uploaded successfully.");
});

app.use("/images", express.static("books/images"));

app.get("/user/:username", (req, res) => {
  const username = req.params.username;

  const json = getXMLAsJson();
  const users = json.users.user;
  for (const user of users) {
    if (user.username === username) {
      console.log("user found :::::: ", user);
      res.json(user);
      break;
    }
  }
});

app.get("/books", async (req, res) => {
  const json = getXMLAsJson();
  const users = json.users.user;
  const books = [];
  for (const user of users) {
    const userBooks = user.books.book;
    for (const book of userBooks) {
      book.by = user.username;
      books.push(book);
    }
    // } else { //do this in getXMLAsJson()
    //   //if there is only one it's not returned as a list
    //   user.books.book.by = user.username;
    //   books.push(user.books.book);
    // }
  }
  console.log(books);
  //transfrom books to be ready for props
  //     const data = { message: "Hello from Express!" };
  res.json(books);
});

//loggin
app.post("/login", (req, res) => {
  const requestData = req.body;
  // console.log(requestData);
  //getting users from xml file
  const xmlFile = readFileSync(`./users/users.xml`, "utf8");
  const parser = new XMLParser();
  const json = parser.parse(xmlFile);
  const users = json.users.user;
  // console.log(users);
  let userFound = false;
  for (const user of users) {
    if (
      user.username === requestData.username &&
      user.password == requestData.password
    ) {
      res.json({ status: true });
      userFound = true;
      break;
    }
  }
  if (!userFound) {
    res.json({ status: false });
  }
});

app.post("/signup", (req, res) => {
  // const requestData = req.body;
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  //check if user exist
  const json = getXMLAsJson();
  const users = json.users.user;
  const responseData = {};
  responseData.status = true; //true means signup successful
  for (const user of users) {
    if (user.username === username) {
      responseData.status = false;
      responseData.message = "username already exist";
      res.send(responseData);
      break;
    }
  }
  //if we don't find a user with the same username
  if (responseData.status) {
    responseData.status = true;
    json.users.user.push({ username, email, password, books: { book: [] } });
    //write to xml
    writeJsonToXML(json);
    res.send(responseData);
    console.log("new user added");
  }
});

app.delete("/:bookName/:username", (req, res) => {
  const username = req.params.username;
  const bookName = req.params.bookName;
  const json = getXMLAsJson();
  const users = json.users.user;
  for (const user of users) {
    if (user.username === username) {
      user.books.book = user.books.book.filter((book) => book.name != bookName);
      console.log(
        "book : " + bookName + " for " + username + " has been deleted."
      );
      res.json(user);
      writeJsonToXML(json);
      //
      console.log("sending json");
      // res.json(user);
    }
  }
});

app.get("/categories", (req, res) => {
  const categories = getCategories();
  res.send({ categories });
});

app.use("/transform", express.static("users/users.xml"));
app.use("/xslt", express.static("xslt/books.xslt"));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//helpers
//get users and transform book to book list if there is only one to facilitate for loops
function getXMLAsJson() {
  const xmlFile = readFileSync(`./users/users.xml`, "utf8");
  const options = {
    format: true,
    ignoreAttributes: false,
    format: true,
  };
  const parser = new XMLParser(options);
  const json = parser.parse(xmlFile);
  const users = json.users.user;
  //if there is no users
  if (!Array.isArray(json.users.user)) {
    json.users = { user: [] };
  }
  //
  for (const user of users) {
    //if there is no books the element books : "" so we need to convert it to an object that has an array.

    if (typeof user.books == "string") {
      user.books = { book: [] };
    }
    //in case there is only one book user.books.book is an object : convert it to a list with one object
    else if (!Array.isArray(user.books.book)) {
      user.books = { book: [user.books.book] };
    }
    //this part if book is not an array (no book)
    // else if(user.books.book ?){

    // }
  }
  return json;
}

function writeJsonToXML(json) {
  //write to xml file
  // Convert the XML data object to XML string
  const options = {
    format: true,
    ignoreAttributes: false,
    format: true,
  };

  const builder = new XMLBuilder(options);
  let xmlDataStr = builder.build(json);

  // Write the XML string to a file
  fs.writeFile("users/users.xml", xmlDataStr, function (err) {
    if (err) {
      console.error("Error writing XML file:", err);
    } else {
      console.log("XML file written successfully!");
    }
  });
}

function getCategories() {
  const categoriesSet = new Set();
  const json = getXMLAsJson();
  const users = json.users.user;
  for (const user of users) {
    const books = user.books.book;
    for (const book of books) {
      categoriesSet.add(book.category);
    }
  }
  return Array.from(categoriesSet);
}
