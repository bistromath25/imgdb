const express = require("express");
const cors = require("cors");
const fs = require("fs");
var path = require("path")
require("dotenv").config();

const app = express();
const BASE_URL = 'app url goes here';

app.engine('html', require('ejs').renderFile)

app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function(req, res) {
    res.sendFile(process.cwd() + "/public/index.html");
});

function randomstring(len) {
    var res = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < len; i++) {
        res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
}

let date = Date.now();
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "public/uploads/"),
    filename: (req, file, cb) => cb(null, randomstring(5) + path.extname(file.originalname.replace('.PNG', '.png')))
});

const uploads = multer({ storage: storage });

app.post("/api/uploaded", uploads.single("upfile"), function(req, res, next) {
    var oldname = req.file.originalname;
    var newname = req.file.filename;
	var date = new Date();
	var msg = oldname + " saved as " + newname + " at " + date + "\n";
	console.log(msg);
	fs.appendFile(process.cwd() + "/public/uploads/uploads.txt", msg, e => {
		if (e) {
			console.error(e);
			return;
		}
	})
    res.render(process.cwd() + "/public/sucess.html", { name: newname, base_url: BASE_URL });
    next();
});

app.get("/images/:image", (req, res) => {
    const path = process.cwd() + "/public/uploads/" + req.params.image;
    if (fs.existsSync(path)) {
        res.sendFile(path);
    }
    else {
        res.sendFile(process.cwd() + "/public/failure.html", {  base_url: BASE_URL });
    }
});

app.listen(3000, function() {
    console.log("Your app is listening on port 3000");
});