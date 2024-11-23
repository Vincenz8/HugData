"use strict";

import {DataTypes, Model } from 'sequelize';
import sequelize from"./connection.js";
import Article from './Article.js';
import User from './User.js';

export default class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },

    time: {
      type: DataTypes.DATE,
      allowNull: false
    },

    corpus: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1, 100]
      }
    },
    articleId: {
      type: DataTypes.UUID,
      references: {
        model: Article,
        key: 'id',

      },
    },

    userEmail: {
      type: DataTypes.TEXT,
      references: {
        model: User,
        key: 'email',
      },
      validate:{
        isEmail: true,
      }
  },
  },
  {
    sequelize, 
    modelName: 'COMMENT', 
  },
);

