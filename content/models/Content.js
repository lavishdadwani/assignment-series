const mongoose = require("mongoose");
const { compare, hash } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const Schema = mongoose.Schema;

const SeriesSchema = new Schema(
  {
    autherName: { type: String, required: true, trim: true },
    title: { type: String, trim: true },
    content: { type: String, trim: true },
    totalChapter: { type: Number, trim: true ,default:0 },
    seriesList: [
      {
        chapterNo: Number,
        Title: String,
        Description: String,
      },
    ],
  },
  { timestamps: true }
);



var Content = mongoose.model("content", SeriesSchema);

module.exports = Content;
