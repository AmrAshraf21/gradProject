# Welcome to our Graduation Project

## **Recommendation Books** Graduation Project
j
#### This repo made for our _FCD_ Graduations Project.

# Technology that we used : 
> - [x] Nodejs
> - [x] ExpressJs
> - [x] MongoDB As a database
> - [x] MongoAtlas as a store our data
> - [x] JWT For Authorization And Authentication

---

> **Note that the project still we working on and not finished yet**.

---
---
> **Our Documentation(Still updating)[docs](docs/)**
---

---
Run `npm install` To Install all Dependencies.
***Note that you must provide your .env file to run the api correctly without anu issue***

---



  


# gradProject
# Recommindation Books Gradution Project



LISTS ENDPOINTS:

  -wishlist:
    1. GET - http://localhost:5000/list/wishlist
    2. PUT - http://localhost:5000/list/addToWishlist
    3. PUT - http://localhost:5000/list/RemoveFromWishlist

  -favorits:
    1. GET - http://localhost:5000/list/favorits
    2. PUT - http://localhost:5000/list/addToFavorits
    3. PUT - http://localhost:5000/list/removeFromFavorits

  -already read:
    1. GET - http://localhost:5000/list/alreadyread
    2. PUT - http://localhost:5000/list/addToAlreadyRead
    3. PUT - http://localhost:5000/list/removeFromAlreadyRead


*TOKEN IN THE HEADERS FOR ALL ENDPOINTS*
*bookId IN THE BODY FOR ALL PUT REQUESTS*


SOME BOOK IDS TO TEST WITH:
  - 64146e1af4e3777d8fae2d20
  - 64146e1af4e3777d8fae2d1d
  - 64146e1af4e3777d8fae2d23
