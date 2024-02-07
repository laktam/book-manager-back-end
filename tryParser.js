import { readFileSync } from "fs";
import { XMLParser } from "fast-xml-parser";

const xmlFile = readFileSync(`./users/users.xml`, "utf8");
const parser = new XMLParser();
const json = parser.parse(xmlFile);

// const users = json.users.users;
// console.log(json.users.user[0].books.book);
//users tag : object , containt user array
const users = json.users.user;
const books = [];
for (const user of users) {
  console.log(user.books.book);
  if (Array.isArray(user.books.book)) {
    const userBooks = user.books.book;
    for (const book of userBooks) {
      book.by = user.username;

      books.push(book);
    }
  } else {
    //if there is only one it's not returned as a list
    user.books.book.by = user.username;
    books.push(user.books.book);
  }
}
console.log(books);
