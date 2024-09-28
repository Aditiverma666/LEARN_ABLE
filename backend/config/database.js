const mongoose = require('mongoose');
require("dotenv").config();


exports.connect =() =>{
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
   .then (() => console.log("db connected"))
   .catch( (error) =>{
    console.log("failed db connection")
    console.error(error);
    process.exit(1);
   });
};
/*REST APIs (Representational State Transfer Application Programming Interfaces) are a set of rules and conventions for building and interacting with web services. REST APIs enable communication between different systems or components of software using standard HTTP methods like GET, POST, PUT, DELETE, etc.

Key Concepts of REST APIs:
Resources and Endpoints:

Resources: A resource in REST is any data or service the client can access, identified by a unique URL. For example, a resource could be a user, a book, or a collection of products.
Endpoints: An endpoint is a specific URL where a resource is accessed or modified. For example, https://api.example.com/users might be an endpoint to access user data.
HTTP Methods:

GET: Retrieve data from a resource.
POST: Create a new resource.
PUT: Update an existing resource or create a new one if it doesn’t exist.
DELETE: Remove a resource.
PATCH: Partially update a resource.
Statelessness:

Each request from the client to the server must contain all the information needed to understand and process the request. The server does not store any client context between requests. This makes REST APIs scalable and easier to manage.
JSON Format:

JSON (JavaScript Object Notation) is the most common format for data exchange in REST APIs due to its simplicity and ease of use. XML can also be used but is less common.
Example of a JSON response:

json
Copy code
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
Stateless Operations:

Each operation should be stateless. For example, when you retrieve a user’s information via a GET request, the server should not retain any information about that request after it has been completed.
URI (Uniform Resource Identifier):

Each resource in a REST API is identified by a unique URI. For example, https://api.example.com/products/123 might refer to a specific product with ID 123.
HTTP Status Codes:

REST APIs use standard HTTP status codes to indicate the result of an operation:
200 OK: The request was successful.
201 Created: The resource was successfully created.
204 No Content: The request was successful but there’s no content to return.
400 Bad Request: The server could not understand the request due to invalid syntax.
401 Unauthorized: Authentication is needed to access the resource.
404 Not Found: The requested resource could not be found.
500 Internal Server Error: The server encountered an unexpected condition.
Example: A Simple REST API
Consider a REST API for managing a collection of books.

GET /books: Retrieve a list of all books.
GET /books/{id}: Retrieve a specific book by its ID.
POST /books: Create a new book.
PUT /books/{id}: Update the book with the specified ID.
DELETE /books/{id}: Delete the book with the specified ID.
Advantages of REST APIs:
Scalability: Statelessness and simplicity make it easy to scale REST APIs.
Flexibility: REST APIs can handle various types of calls and return different data formats.
Independence: The client and server can evolve independently. The interface is standard, but the underlying implementation can change without affecting the other side.
Tools and Libraries:
Postman: A popular tool for testing REST APIs.
Swagger: Helps in documenting and testing REST APIs.
Axios or Fetch API: JavaScript libraries commonly used for making HTTP requests to REST APIs.
REST APIs are fundamental to modern web development, enabling seamless interaction between clients and servers. They form the backbone of many web services and applications, from social media platforms to online stores.
*/