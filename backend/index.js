import express from "express"
import cors from "cors"
import nodemailer from "nodemailer"
import mongoose from "mongoose"
import dotenv from "dotenv";
dotenv.config();

const app = express()

app.use(express.json())

app.use(cors())


mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Connected to DB"))
.catch(err => console.error("Failed to connect:", err));



const credentialSchema = new mongoose.Schema({}, { strict: false })


const credential = mongoose.model("credential",credentialSchema,"bulkmail")

app.get("/", (req, res) => {
    res.send("Backend is running!");
});


app.post("/sendemail", function (req, res) {

    let msg = req.body.msg
    let emailList = req.body.emailList

   
credential.find().then(function(data){

    const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {
        user: data[0].toJSON().user,
        pass: data[0].toJSON().pass,
    },
});

new Promise(async function (resolve, reject) {

        try {

            for (var i = 0; i < emailList.length; i++) {

               await transporter.sendMail({
                    from: "sivaranjanint@gmail.com",
                    to: emailList[i],
                    subject: "A message from Bulk Mail App",
                    text: msg
                }

                )

                console.log("Email sent to:"+emailList)
            }

            resolve("Success")

        }
        catch (error) {
            res.send(fail)
        }
    }).then(function(){
        res.send(true)
    }).catch(function(){
        res.send(false)
    })


}).catch(function(error){
    console.log(error)
})


})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
