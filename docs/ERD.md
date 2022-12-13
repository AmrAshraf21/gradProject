# ERD : Book Recommendation Store.
> ***This document explores the design of Book Recommendation, a social experience for sharing useful Book resources. We'll use a basic client/server architecture, where a single server is deployed on a cloud provider next to a non relational database, and serving HTTP traffic from a public endpoint.***
# _Storage_ 
 * ***We'll use a non relational database (schema follows) to fast retrieval of Info and Books. A minimal database implementation such as MongoDB, although we can potentially switch to something with a little more power such as Mysql if necessary. Data will be stored on the server on a separate like MongoDB Atlas, backed up volume for resilience. There will be no replication or sharding of data at this early stage. We ruled out storage-as-a-service services such as Firestore***



## Schema

> ### User Schema(JSON) 

| Column\Key| Type |
|-------|------|
|**id**|String(UUID)PK \ MongoID|
|**FirstName**|String|
|**LastName**|String|
|**Email** | String |
|**Password** | String(Hashing)|
|**PasswordResetToken(When Reset)** | String |
|**PasswordResetExpire(When Reset)** | Date |


> ### Book Schema(JSON Format)

| Column\Key| Type |
|-------|------|
|**BookId**|String(UUID)PK \ MongoID|
|**Title**|String|
|**Isbn**|String|
|**NoOfPages** | Number |
| **Price**| Number |
|**Rating** | Number |
|**PublishedDate** | Date|
|**ThumbnailUrl** | String|
|**BriefDescription** | String|
|**FullDescription**|String|
|**Status**|String|
|**Categories**|Array|

> ### Author Schema(JSON Format)

|Column\Key | Type|
|----------|-------|
|**AuthorId** |String(UUID)\MongoId|
|**BookId(ref)** | String(UUID)Foreign_Key(books)|
|**Name** | String|
|**Gender**|String|
|**BirthDate**|Date|
|**Address**|String|


> ### Reviews Schema(JSON Format)

|Column\Key | Type|
|----------|-------|
|**Book** |Book_Object(Book_schema)|
|**User** | User_Object(User_schema)|
|**Review** | String|
|**Rating**|String|
|**CreateAt**|Date\Timestamp|
|**Address**|String|


# Server being used:
 * A Simple HTTP server us responsible to authentication serving stored data , user can filter data via query string.

   * Node.js for implementing server .
   * Express.js is the web server framework.
   * Mongoose ODM.

# Authentication  
 - ***A simple JWT-based auth mechanism is to be used with passwords and Reset it when the user forgot his password.***

# Some EndPoint that we will use in Our API:

 1. Auth:
    ```
     auth/singup [Post Request]
     auth/login [Post Request]
     auth/password-reset [Post Request]
     auth/new-password [Put Request]
    ```
2. Books:
    ```
    /books [GET]
    /books [POST]
    /book/:id [GET]
    /book/:id [PUT]
    /book/:id [DELETE]
    ```


# Error Handling in our App:
 - Using an Error Object to Handle and trace the error
 - Using try and catch block to prevent the server from crashing when any error occurred

# Clients
 - For now we'll start with a Mobile Application with Kotlin, possibly adding Web page later.

# Hosting 
- The code will be hosted on Github, PRs and our docs wiht ERD And schema. The web Back will be hosted using any free web hosting platform such as Render or netlify or heroku.For now we are using Render for Hosting but have some issues so we can change it in the Future.











 