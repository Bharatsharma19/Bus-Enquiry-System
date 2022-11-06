var express = require("express");
var router = express.Router();
var pool = require("./pool");
var LocalStorage = require("node-localstorage").LocalStorage;
localStorage = new LocalStorage("./scratch");

router.get("/admin", function (req, res, next) {
  res.render("admin", { status: false, message: "" });
});

router.get("/adminlogout", function (req, res, next) {
  localStorage.removeItem("ADMIN");
  res.redirect("/login/admin");
});

router.post("/check_admin_login", function (req, res, next) {
  pool.query(
    "select * from adminlogin where (email=? or mobileno=?) and password=?",
    [req.body.email, req.body.email, req.body.password],
    function (error, result) {
      if (error) {
        res.render("admin", { message: "Server Error" });
      } else {
        if (result.length == 1) {
          localStorage.setItem("ADMIN", JSON.stringify(result[0]));
          res.redirect("/bus/dashboard");
        } else {
          res.render("admin", {
            status: true,
            message: "Invalid Email Id or Password",
          });
        }
      }
    }
  );
});

module.exports = router;
