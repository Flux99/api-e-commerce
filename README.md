# E-Commerce Backend apis

## Description

#### This a e-commerce backend.Where there is a Seller and Buyer.Seller can register and create a catalog of products.where as Buyer can see the list of seller,can request for a seller catalog and create an order for those products.
api doc link: https://marvelous-zuccutto-de0b6d.netlify.app/

## This repo Consist
- Insomnia api collection

- Test Cases Screenshot

### Modules

- Auth

- Seller

- Buyer


### Tech Stack

- Typescript Express(Nodejs)

- mysql

- typeorm


## How to run

1. Now either fork or download the app and open the folder in the cli

2. Go to Project Folder.

3. Go to `src/secret/config.json` and change the database connection string.

4. Go to `src/database.ts` for database connection setup.

4. Run the command `npm install`.

5. Run the command `npm run start` to run the server

6. Run the command `npm run test` to test all the backend apis

## User Stories

- Seller can register/login ,create a catalog of products and can request for the order placed on them.

- Buyer can register/login, can request list of sellers,can request a seller catalog and also create an order on those products.

## Dependencies

- express

- typescript

- typeorm

- mysql

- bcrypt

- jest


## Testing screenshot


![Screenshot_1](https://github.com/Flux99/api-e-commerce/blob/main/Screenshots/Screenshot%20from%202023-02-25%2014-55-27.png?raw=true)

![Screenshot_1](https://github.com/Flux99/api-e-commerce/blob/main/Screenshots/Screenshot%20from%202023-02-25%2001-25-29.png?raw=true)
