const axios = require("axios");
const { Router } = require("express");
const async = require("hbs/lib/async");
const FormatResponse = require("response-format");
const Content = require("../models/Content.js");
const hostName = require("../utils/constant")
const { ObjectId } = require("mongoose").Types;
const router = Router();

router.get("/hello", async (req,res)=>{
  try{
    const {id , title} = req.body
    const data = await Content.find({_id:id,title:title})
    return res.status(200).json(data)
  }catch(err){
    console.log(err)
  }
})


router.post(
  "/newSeries",
  async (req, res) => {
    try {
      const { autherName, title, content } = req.body;
      if (!autherName || !title || !content)
        return res
          .status(400)
          .json(FormatResponse.badRequest('Enter All Fileds',{}));
      const doesExist = await Content.findOne({ title });
      if (doesExist)
        return res
          .status(400)
          .json(
            FormatResponse.badRequest(
              `title  already taken as ${doesExist.title}`,
              {}
            )
          );

      const response = new Content({ ...req.body });
     

      const { data } = await axios.post(
        `${hostName}/Api/dailyPass/addSeriesForAllUser`,{seriesId:response._id,title:response.title}
      );
      if(data.message != 'success') throw new Error('error in adding series  with user')
      await response.save()
      return res
        .status(200)
        .json(FormatResponse.success(`Book Created Cuccessfuly `, { content:response }));
    } catch (error) {
      console.log(error)
      res.status(500).send('server error')
    }
  }
);

router.post("/addChapterById/:seriesID",async (req,res)=>{
  try{
    const {chapterNo , title, description} = req.body
    const {seriesID} = req.params
    if( !title || !description) return res.status(404).json(FormatResponse.badRequest("Enter all fileds", { }))
    const content1 = await Content.findOne({_id:seriesID})
    if(!content1) return res.status(404).json(FormatResponse.notFound("Invalid ID", {}))
    if(content1.totalChapter >= chapterNo) return res.status(404).json(FormatResponse.badRequest("Chapter Already Added", { }))
    console.log()
    if(content1.seriesList.length + 1 != chapterNo) return res.status(404).json(FormatResponse.badRequest("Plese Enter All The Chapter Line Wise", { }))
    let data = {
      chapterNo: chapterNo,
      Title: title,
      Description: description,
    }
    content1.seriesList.push(data)
    content1.totalChapter = content1.seriesList.length 
    content1.save()
    return res.status(200).json(FormatResponse.success('Success',{ content:content1  }));
  }catch(err){
    console.log(err)
    res.status(500).send('server error')
  }
});

router.get("/getAllComtent",async (req,res)=>{
  try{
    const data = await Content.find({ })
    res.status(200).json(FormatResponse.success('Success',data ))
  }catch(err){
    console.log(err)
    res.status(500).send("server error")
  }
})

router.post("/seriesById" , async (req,res)=>{
  try{
    const {seriesId} = req.body
    console.log({series:seriesId})
    if(!seriesId || seriesId.length === 0) return res.status(404).json({message:"data not found one invalid Id"})
    seriesList = []
    seriesId.forEach((item) => {
      seriesList.push({
        _id: ObjectId(item.seriesId),
        // totalChapter: { $lt: 2 }
      });
    });
    const response = await Content.find({_id: {$in: seriesList}} );
    console.log(response)
    return res.status(200).json(response)
  }catch(err){
    console.log(err)
    res.status(500).send("server error")
  }
})


module.exports = router;


// db.inventory.find( { $or: [ { quantity: { $lt: 20 } }, { price: 10 } ] } )