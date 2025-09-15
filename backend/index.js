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
