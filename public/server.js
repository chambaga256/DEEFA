const express = require("express");
const app = express()


// env vaveriables
require("dotenv").config();
//path for rendering hmtl files
const path = require("path")
// static files to enable css to show

app.use(express.static("public"));

// cors access to enable applications on different host send resquest

const cors = require("cors");
app.use(cors());


const bodyParser = require("express")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser());
// nodemailer config
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD
    }
})

transporter.verify((error, success) => {
    if (error) {
        console.log(error);

    } else {
        console.log("Ready for message");
        console.log(success)
    }

});
app.post("/sendmail", (req, res) => {
    const { name, email, subject, message } = req.body;

    const mailOptions = {

        to: process.env.AUTH_EMAIL,
        name: name,
        email: email,
        subject: subject,
        text: message
    }
    transporter
        .sendMail(mailOptions)
        .then(() => {
            res.sendFile(path.join(__dirname, "./public/success.html"))
        })
        .catch((error) => {
            console.log(error);
            res.json({
                status: "FAILED ", message: "AN ERROR OCCURRED"
            })
        })


})
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../contact.html"))
})
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`listening to port ${PORT}`));
