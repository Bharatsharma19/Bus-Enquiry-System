var express = require("express");
var router = express.Router();
var pool = require("./pool");
var upload = require("./multer");
var LocalStorage = require("node-localstorage").LocalStorage;
localStorage = new LocalStorage("./scratch");

router.get("/fetch_all_bustype", function (req, res) {
  pool.query("select * from bustype", function (error, result) {
    if (error) {
      //console.log(error);
      res.status(500).json([]);
    } else {
      res.status(200).json({ busmodal: result });
    }
  });
});

router.get("/fetch_rent", function (req, res) {
  pool.query(
    "select rent from bustype where typeid=?",
    [req.query.typeid],
    function (error, result) {
      if (error) {
        res.status(500).json([]);
      } else {
        res.status(200).json({ rent: result });
      }
    }
  );
});

router.get("/fetch_all_states", function (req, res) {
  pool.query("select * from states", function (error, result) {
    if (error) {
      res.status(500).json([]);
    } else {
      res.status(200).json({ state: result });
    }
  });
});

router.get("/fetch_all_cities", function (req, res) {
  pool.query(
    "select * from cities where stateid=?",
    [req.query.stateid],
    function (error, result) {
      if (error) {
        res.status(500).json([]);
      } else {
        res.status(200).json({ city: result });
      }
    }
  );
});

router.get("/bus", function (req, res) {
  try {
    var admin = localStorage.getItem("ADMIN");
    if (admin == null) {
      res.redirect("/login/admin");
    }
    res.render("busInterface", { message: "" });
  } catch (e) {
    res.redirect("/login/admin");
  }
});

router.get("/dashboard", function (req, res) {
  var query =
    "select count(*) as counttypeid from bustype;select count(*) as countstate from states;select count(*) as countcity from cities";
  pool.query(query, function (error, result) {
    if (error) {
      res.render("dashboard", { message: "Server Error", result: [] });
    } else {
      var admin = JSON.parse(localStorage.getItem("ADMIN"));

      res.render("dashboard", {
        message: "Result",
        result: result,
        admin: admin,
      });
    }
  });
});

router.post("/submmited", upload.any("picture"), function (req, res) {
  pool.query(
    "insert into bus (bustype,sstate,scity,dstate,dcity,kilometer,rent,busnumber,day,picture) values(?,?,?,?,?,?,?,?,?,?)",
    [
      req.body.bustype,
      req.body.sstate,
      req.body.scity,
      req.body.dstate,
      req.body.dcity,
      req.body.kilometer,
      req.body.rent,
      req.body.busnumber,
      JSON.stringify(req.body.day),
      req.files[0].filename,
    ],
    function (error, result) {
      if (error) {
        res.render("busInterface", { message: "Server Error" });
      } else {
        res.render("busInterface", { message: "Record Submitted" });
      }
    }
  );
});

router.get("/display_all_data", function (req, res) {
  pool.query(
    "select B.*,(select T.busmodal from bustype T where T.typeid=B.bustype) as modalname,(select S.statename from states S where S.stateid=B.sstate)as sourcestate,(select S.statename from states S where S.stateid=B.dstate)as destinationstate,(select C.cityname from cities C where C.cityid=B.scity)as sourcecity,(select C.cityname from cities C where C.cityid=B.dcity)as destinationcity from bus B",
    function (error, result) {
      if (error) {
        res.render("displayalldata", {
          status: false,
          message: "Server Error",
          data: null,
          admin: null,
        });
      } else {
        if (admin === null) {
          res.redirect("/login/admin");
        } else {
          var admin = JSON.parse(localStorage.getItem("ADMIN"));

          res.render("displayalldata", {
            status: true,
            data: result,
            admin: admin,
            message: "",
          });
        }
      }
    }
  );
});

router.get("/savebusdata", function (req, res) {
  var days = JSON.stringify(req.query.day);

  pool.query(
    "update bus set bustype=?,sstate=?,scity=?,dstate=?,dcity=?,kilometer=?,rent=?,busnumber=?,day=? where busid=?",
    [
      req.query.bustype,
      req.query.sstate,
      req.query.scity,
      req.query.dstate,
      req.query.dcity,
      req.query.kilometer,
      req.query.rent,
      req.query.busnumber,
      days,
      req.query.busid,
    ],
    function (error, result) {
      if (error) {
        res.status(500).json({ status: false, message: "Server Error" });
      } else {
        res
          .status(200)
          .json({ status: true, message: "Record Successfully Modified" });
      }
    }
  );
});

router.get("/deletebusdata", function (req, res) {
  pool.query(
    "delete from bus where busid=?",
    [req.query.busid],
    function (error, result) {
      if (error) {
        res.status(500).json({ status: false, message: "Server Error" });
      } else {
        res
          .status(200)
          .json({ status: true, message: "Record Successfully Deleted" });
      }
    }
  );
});

router.post("/upload_picture", upload.any("picture"), function (req, res) {
  pool.query(
    "update bus set picture=? where busid=?",
    [req.files[0].filename, req.body.busid],
    function (error, result) {
      if (error) {
        res.status(500).json({ status: false, message: "Server Error" });
      } else {
        res.status(200).json({ status: true, message: "Record Submitted" });
      }
    }
  );
});

module.exports = router;
