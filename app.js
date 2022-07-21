const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const database = require("./util/database");

const app = express();

database.execute("SELECT * FROM products");

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const { get404 } = require("./controllers/error");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(get404);

app.listen(3000);

// const server = http.createServer(app);

// server.listen(3000);
