const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Register user
const userRegister = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        responseCode: 400,
        message: "All fields are mandatory!",
      });
    }

    // Check if the email is already registered
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(409).json({
        success: false,
        responseCode: 409,
        message: "Email is already registered!",
      });
    }

    // Check if the username is already taken
    // const userNameExists = await User.findOne({ userName });
    // if (userNameExists) {
    //   return res.status(409).json({
    //     success: false,
    //     responseCode: 409,
    //     message: "Username is already taken!",
    //   });
    // }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      responseCode: 201,
      message: "User registered successfully",
      data: { _id: user.id, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

// Login user
const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        responseCode: 400,
        message: "All fields are mandatory!",
      });
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = jwt.sign(
        {
          user: {
            userName: user.userName,
            email: user.email,
            id: user.id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      res.status(200).json({
        success: true,
        responseCode: 200,
        message: "Login successful",
        data: { accessToken },
      });
    } else {
      return res.status(401).json({
        success: false,
        responseCode: 401,
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    next(error);
  }
};

// Get user info
const userInfo = (req, res) => {
  res.status(200).json({
    success: true,
    responseCode: 200,
    message: "User information retrieved",
    data: req.user,
  });
};

module.exports = { userRegister, userLogin, userInfo };
