# ***HUG DATA***

Hug data is a Desktop-only Web App dedicated to the world of ***[Computer Vision](https://en.wikipedia.org/wiki/Computer_vision)***, inspired by both [Kaggle](https://www.kaggle.com/) and [Medium](https://medium.com/).

## Content

- [Setup](#setup)
- [Functionalities](#functionalities)
- [Libraries](#extra-libraries)
- [Project Structure](#database)
- [Credentials](#credentials)

## Setup

In order to run the project locally you need to execute these step:

1. Install ***Node.js*** -> [installation guide](https://nodejs.org/en/download/package-manager)
2. Install all dependencies via command in your terminal:

   `npm install`
3. Run the server via command in your terminal:

   `node app.js`

## Functionalities

HugData support 3 types of user:

|Functionality                     | Anonymous          | User                | Creator           |
|:---------------------------------|:------------------:|:------------------:|:------------------:|
| Search knowledgebase             | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| Read Article                     | :x:                | :heavy_check_mark: | :heavy_check_mark: |
| Download Dataset                 | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| Write Article                    | :x:                | :x:                | :heavy_check_mark: |
| Publish Dataset                  | :x:                | :x:                | :heavy_check_mark: |
| 6 operations of Data Augmentation| :x:                | :heavy_check_mark: | :heavy_check_mark: |
| Leave comment on article         | :x:                | :heavy_check_mark: | :heavy_check_mark: |
| See creator page                 | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |

## Extra Libraries

Several extra libraries had been used for the development of all the functionalities, which are:

- [Jimp](https://jimp-dev.github.io/jimp/), image processing.
- [Multer](https://github.com/expressjs/multer#readme), handling files inside HTML form.
- [Decompress](https://github.com/kevva/decompress#readme), decompression of datasets
- [Archiver](https://www.archiverjs.com/), compression of datasets
- [express-session-sqlite](https://github.com/theogravity/express-session-sqlite#readme), saving sessions on the database.
  
## Database

I choose to use an [ORM](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping) interface to avoid hardcoded query and have an easier coding experience, inside ***./database*** you can find every operation related to the interaction with the database. 

Below you can see an example of how [DDL](https://en.wikipedia.org/wiki/Data_definition_language) and [DML](https://en.wikipedia.org/wiki/Data_manipulation_language) are implemented:

***Creation of Dataset table***

![Data Definition Language](/img_doc/ddl.png)


***Searching a dataset by title***

![Data Definition Language](/img_doc/dml.png)

## Credentials

Here some credentials to try the website!

|Type         | Username    | Password     |
|:----------- |:----------- |:-----------  |
| User        | Ford_42     | Artur_Dent01 |
| Creator     | Hari_seldon | Foundation11_|
