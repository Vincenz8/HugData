"use strict"
import bcrypt  from "bcrypt";
import {Strategy} from "passport-local";
import { Op } from "sequelize";
import sequelize from "./connection.js";
import Article from "./Article.js";
import Augment from "./Augment.js";
import Category from "./Category.js";
import Comment from "./Comment.js";
import Dataset from "./Dataset.js";
import User from "./User.js";
import Art_Cat from "./Art_Cat.js"
import Love from "./Love.js"

export class HugDB{

    async setupDB(){
        // User-Article
        User.hasMany(Article, {
            foreignKey: {
                allowNull: false
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });

        Article.belongsTo(User,{
            foreignKey: {
                allowNull: false
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });

        // User-Article-Love
        User.belongsToMany(Article, { as: "voted", through: 'LOVE' });
        Article.belongsToMany(User, { as: "votedBy", through: 'LOVE' });

        // User-Dataset
        User.hasMany(Dataset, {
            foreignKey: {
                allowNull: false
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        Dataset.belongsTo(User,
            {
                foreignKey: {
                    allowNull: false
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            }
        );

        // User-Augment
        User.hasMany(Augment, {
            foreignKey: {
                allowNull: false
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        Augment.belongsTo(User,{
            foreignKey: {
                allowNull: false
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });

        // Article-Category
        Article.belongsToMany(Category, { as: "groups", through: 'ART_CAT' });
        Category.belongsToMany(Article, { as: "represented", through: 'ART_CAT' });

        try {
            await sequelize.sync();
        } catch (error) {
            console.log(error);
        }

    }
    async newUser(email, password, username, creator){

        const cryptPassword = async password => await bcrypt.hash(password, 10)

        try {

            const criptedPass = await cryptPassword(password);
            const user = await User.create({
                'email': email,
                'password': criptedPass,
                'name': username,
                'creator': creator,
                'pathImg': 'public/images/profile_pic/no_pic.jpeg'
            })

            if (!user) {
                return false
            } else {
                return true
            }

        } catch (error) {
            console.log(error)
            return false
        }
    }
    async newArticle(title, pathImg, corpus, email, categories){
        try {

            const article = await Article.create({'title': title, 'pathImg': pathImg, 'corpus': corpus, 'USEREmail': email})
            if (!article) {
                return false
            } else {

                categories.forEach(async category => {

                    console.log(category['value']);
                    const present = await this.categoryPresent(category['value'])
                    console.log(present);

                    if (!present) {
                        await this.newCategory(category['value'])
                    }    
                    await Art_Cat.create({'ARTICLEId': article.id, 'CATEGORYName': category['value']})
                });

                return true
            }
            
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async newDataset(title, pathImg, description, pathData, email) {
        try {
            const dataset = await Dataset.create({'title': title, 'pathImg': pathImg, 'description': description, 'pathData': pathData, 'USEREmail': email})
            console.log(dataset);
            if (!dataset) {
                return false
            } else {
                return true
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async newCategory(name) {
        try {
            const category = Category.create({'name': name})      

            if (!category) {
                return false

            } else {
                return true
            }

        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async newComment(date, corpus, email, articleId){
        try {
            const comment = Comment.create({'time': date, 'corpus': corpus, 'userEmail': email, 'articleId': articleId})      

            if (!comment) {

                return false

            } else {
                return true
            }

        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async newAugment(time, nOp, dataname, pathAug, email){
        try {
            const augment = Augment.create({'time': time, 'nOp': nOp, 'dataName': dataname, 'pathAug': pathAug, 'USEREmail': email})      

            if (!augment) {

                return false

            } else {
                return true
            }

        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async addLove(email, articleId){
        try {
            const love = Love.create({'USEREmail': email, 'ARTICLEId': articleId})      

            if (!love) {
                return false
            } else {
                return true
            }

        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async rmLove(email, articleId){
        try {
            const love = Love.destroy({where: {'USEREmail': email, 'ARTICLEId': articleId}})      

            if (love === 0) {
                return false
            } else {
                return true
            }

        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async lovePresent(email, articleId){
        try {
            const found = await Love.findOne({where:{'USEREmail': email, 'ARTICLEId': articleId}})

            if (!found) {
                return false

            } else {
                return true
            }
        } catch (error) {
            console.log(error);
        }

    }
    async categoryPresent(name){
        try {
            const found = await Category.findOne({where:{'name': name}});

            if (!found) {
                return false

            } else {
                return true
            }

        } catch (error) {
            console.log(error);
        }
    }
    async getUser(email){
        return await User.findOne({where:{'email': email}})
    }
    async getUserByName(name){
        return await User.findOne({where:{'name': name}})
    }
    async getUserAugment(email){
        return await Augment.findAll({where:{'USEREmail': email}})
    }
    async getUserArticles(email){
        return await Article.findAll({where:{'USEREmail': email}})
    }
    async getUserDatasets(email){
        return await Dataset.findAll({where:{'USEREmail': email}})
    }
    async getArticle(id){
        return await Article.findOne({where:{'id': id}})
    }
    async getArticleCategories(id){
        return await Art_Cat.findAll({where: {'ARTICLEId': id}, attributes:['CATEGORYName']})
    }
    async getArticleLove(id){
        return await Love.count({where:{'ARTICLEId': id}})
    }
    async getArticleComments(id) {
        return await Comment.findAll({where:{'articleId': id}})
    }
    async getRecentAugFile(email){
        return await Augment.findOne({attributes:['pathAug', 'nOp'],where:{'USEREmail': email}, order:[['time', 'DESC']]})
    }
    async userPresent(email, username){
        try {
            let user = await User.findOne({where:{'email': email}})
            let message = ""

            if(user === null){

                user = await User.findOne({where:{'name': username}})

                if(user === null){
                    return [false, "Correctly registered!"]
                }
                else{
                    message = "Error: username already present :("
                    console.log(message)
                    return [true, message]
                }
            }
            else{
                message = "Error: email already present :("
                console.log(message)
                return [true, message]
            }            
        } catch (error) {
            console.log(error)
            return [true]
        }
    }
    login(){
        const strategy = new Strategy({usernameField: 'name', passwordField: 'password'},
            async (username, password, done)=>{
                try {
                    const user =  await User.findOne({where: {'name': username}})

                    if (!user) {
                        console.log("No User found!");
                        return done(null, false,  {message: 'Incorrect username or password.' })
                        
                    } else {

                        const comparePassword = async (password, hPassword) => await bcrypt.compare(password, hPassword)
                        const result = await comparePassword(password, user.password)

                        if (!result){ 
                            console.log("Password not matched");
                            return done(null, false, {message: 'Incorrect username or password.' }); 
                        }
            
                        return done(null, user);  
                    }
    
                } catch (err) {
                    console.log(err);
                    return done(err);
                }  
        })

        return strategy;
    }
    async deserialize(username, done){

        try {
            const user = await User.findOne({where: {'name': username}});

            return done(null, user);

        } catch (err) {
            console.log(err);
            return done(err);
        }
    }
    async searchArticles(title){

        try {
            if (!title) {
                return await Article.findAll()
            } else {
                return await Article.findAll({where:{'title': {[Op.like]: title + '%'}}})
            }
   
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async searchDatasets(title){
        try {
            if (!title) {
                return await Dataset.findAll()
            } else {
                return await Dataset.findAll({where:{'title': {[Op.like]: title + '%'}}})
            }
   
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async searchCreators(name) {
        try {
            if (!name) {
                return await User.findAll({where:{'creator': true}})
            } else {
                return await User.findAll({where:{'name': {[Op.like]: name + '%'}, 'creator': true}})
            }
   
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateUserDescription(description, name){
        try {
            await User.update({'description': description}, {where:{'name': name}})
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    
    async updateUserPathImg(pathImg, name){
        try {
            await User.update({'pathImg': pathImg}, {where:{'name': name}})
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async userBecomeCreator(name){
        try {
            await User.update({'creator': true}, {where:{'name': name}})
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async deleteDataset(id){
        try {
            await Dataset.destroy({where:{'id': id}, force: true})
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async deleteArticle(id){
        try {
            await Article.destroy({where:{'id': id}, force: true})
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}