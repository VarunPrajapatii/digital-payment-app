const express = require('express');
const zod = require("zod");
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config")
const {User, Account} = require("../db");
const { authMiddleware } = require('../middleware');

const router = express.Router();


const signupBody = zod.object({
    email: zod.string(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string(),
})

router.post("/signup", async (req, res) => {
    const body = req.body;
    const {success} = signupBody.safeParse(body);
    if(!success) {
        res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = User.findOne({
        email: body.email,
    })

    if(!user._id) {
        res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const dbUser = await User.create({
        email: body.email,
        passaaword: body.passaaword,
        firstName: body.firstName,
        lastName: body.lastName,
    });

    const userId = user._id;

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000,
    })


    const token = jwt.sign({
        userId: dbUser._id
    }, JWT_SECRET)
    res.json({
        message: "User created successfully",
        token: token
    })
})


const signinBody = zod.object({
    email: zod.string().email(),
    password: zod.string(),
})

router.post("/signin", async (req, res) => {
    const {success} = signinBody.safeParse();
    if(!success) {
        res.status(411).json({
            message: "Incorrect Inputs",
        })
    }

    const user = await User.findOne({
        email: req.body.email,
        password: req.body.password,
    });

    if(!user) {
        res.status(411).json({
            message: "Error while logging in",
        })
    }

    const token = jwt.sign({
        userId: user._id,
    }, JWT_SECRET);

    res.json({
        token: token,
    })

    return;
})


const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
});


router.put("/", authMiddleware, async (req, res) => {
    const {success} = updateBody.safeParse();
    if(!success) {
        res.status(411).json({
            message: "Error while updating information",
        })
    }

    await User.updateOne({
        _id: req.userId
    })

    res.json({
        message: "Updated successfully"
    })

})


router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter,
            },
            lastName: {
                "$regex": filter,
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id,
        }))
    })
})


module.exports = router;