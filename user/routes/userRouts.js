const axios = require("axios");
const { hash, compare } = require("bcrypt");
const { Router } = require("express");
const { check, validationResult,body,param } = require("express-validator");
const { route } = require("express/lib/application");
const { error } = require("response-format");
const FormatResponse = require("response-format");
const hostName = require("../utils/constant")
const Auth = require("../middleware/auth");
const User = require("../models/User.js");
const customInputValidations = require("../utils/customValidation");
const router = Router();

router.post("/hello", (req, res) => {
  try {
    res.send("hello world");
  } catch (err) {}
});
router.post(
  "/register",
  [
    body('email').custom(val => {
      const err = customInputValidations.isInputEmailValid(val);
      if (err !== '') {
        throw new Error(err);
      }
      return true;
    }),
    body('password').custom(val => {
      const err = customInputValidations.isInputPasswordValid(val);
      if (err !== '') {
        throw new Error(err);
      }
      return true;
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      let err = errors.array();
      return res.status(422).json({ message: err[0].msg });
    }
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password)
        return res
          .status(400)
          .json({ status: 400, message: "Enter All Fields" });
      const doesExist = await User.findByEmail(email);
      if (doesExist)
        return res
          .status(400)
          .json(
            FormatResponse.badRequest(
              `User already exists as ${doesExist.email}`,
              {}
            )
          );

      const user1 = new User({ ...req.body });
      const token = await user1.genrateToken();
      const { data } = await axios.post(
        `${hostName}/Api/dailyPass/addSeriesInUserPass/${user1._id}`
      );
      if(data.message != 'success') throw new Error('error in adding user with series')
      console.log({ register: data });
      return res
        .status(200)
        .json(
          FormatResponse.success(`User created successfuly `, { user: user1 })
        );
    } catch (error) {
      console.log(error);
      res.status(500).send("server error");
    }
  }
);

router.post(
  "/login",
  [
    body('email').custom(val => {
      const err = customInputValidations.isInputEmailValid(val);
      if (err !== '') {
        throw new Error(err);
      }
      return true;
    }),
    body('password').custom(val => {
      const err = customInputValidations.isInputPasswordValid(val);
      if (err !== '') {
        throw new Error(err);
      }
      return true;
    })
  ],
  async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res
          .status(404)
          .json(FormatResponse.badRequest(`Enter all fileds `, {}));
      const user1 = await User.findByEmailAndPassword(email, password);
      if (!user1)
        return res
          .status(404)
          .json(FormatResponse.notFound(`Invalid Email or Password `, user1));
      const token = await user1.genrateToken();
      return res
        .status(200)
        .json(FormatResponse.success("Success", { user: user1 }));
    } catch (err) {
      console.log(err);
      if(err.message === "user not found") return res.status(404).send({message:err.message}) 
      if(err.message === "type Valid Password") return res.status(404).send({message:err.message}) 
      res.status(500).send(err.message)
      res.status(500).send("server error");
    }
  }
);

router.get("/fetchAllUser" , async (req,res)=>{
  try{
    const allUser = await User.find({ })
    res.status(200).json(allUser)
  }catch(err){
    console.log(err)
    res.status(500).send("server error")
  }
})

module.exports = router;
