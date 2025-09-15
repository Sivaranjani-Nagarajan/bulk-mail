import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // load environment variables

const app = express(); // CREATE THE EXPRESS APP

app.use(express.json()); // for parsing JSON
app.use(cors());

app.get("/", (req, res) => res.send("Backend is running!"));

app.post("/sendemail", async (req, res) => {
    try {
        console.log("Request body:", req.body);
        const { msg, emailList } = req.body;

        if (!msg || !emailList) {
            return res.status(400).send({ success: false, error: "Missing msg or emailList" });
        }

        const data = await credential.find();
        if (!data[0]) return res.status(500).send({ success: false, error: "No email credentials found in DB" });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: data[0].toJSON().user,
                pass: data[0].toJSON().pass,
            },
        });

        for (let i = 0; i < emailList.length; i++) {
            await transporter.sendMail({
                from: data[0].toJSON().user,
                to: emailList[i],
                subject: "A message from Bulk Mail App",
                text: msg
            });
            console.log("Email sent to:", emailList[i]);
        }

        res.send(true);
    } catch (error) {
        console.error(error);
        res.status(500).send(false);
    }
});
