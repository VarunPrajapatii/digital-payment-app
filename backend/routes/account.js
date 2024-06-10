const express = require('express');
const { User, Account } = require('../db');
const mongoose = require("mongoose");
const { authMiddleware } = require('../middleware');

const router = express.Router();


router.get("/balance", authMiddleware , async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId,
    });

    res.json({
        balance: account.balance,
    });
});


router.post("/transfer", authMiddleware, async (req, res) => {
    try {
        const session = await mongoose.startSession();

        //start the transaction
        session.startTransaction();

        const {to, amount} = req.body;

        //fetch the account within the transaction
        const user = await Account.findOne({
            userId: req.userId,
        }).session(session);

        if(!user || user.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient Balance",
            });
        }

        const toAccount = await Account.findOne({
            userId: to,
        }).session(session);

        if(!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid Account"
            });
        }


        //perform the transfer
        await Account.updateOne({
            userId: req.userId,
        }, {
            $inc: {
                balance: -amount,
            }
        }).session(session);
        
        await Account.updateOne({
            userId: to,
        }, {
            $inc: {
                balance: amount,
            }
        }).session(session);


        //commit the transaction
        await session.commitTransaction();
        res.json({
            message: "transfer successful"
        });
    } catch (error) {
        res.status(400).json({
            message: error
        })
    }
});


module.exports = router;