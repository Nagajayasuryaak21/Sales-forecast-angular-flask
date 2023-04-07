let express = require("express"),
  multer = require("multer"),
  mongoose = require("mongoose"),
  fs = require("fs"),
  path = require("path"),
  router = express.Router();

// Multer File upload settings
const DIR = "./public/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(req.params);
    console.log(file);

    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, fileName);
  },
});

var upload = multer({
  storage: storage,
  // limits: {
  //   fileSize: 1024 * 1024 * 5
  // },
  fileFilter: (req, file, cb) => {
    if (req.file && file.mimetype == "text/csv") {
      cb(null, true);
    } else {
      cb(null, true);
      //return cb(new Error('Only .csv format allowed!'))
    }
  },
});

// User model
let Folder = require("../models/Folder");

router.post("/create-user", upload.array("avatar", 6), (req, res, next) => {
  const reqFiles = [];
  const uid = "";
  //console.log(req.files[0]);
  const url = req.protocol + "://" + req.get("host");
  const user_Id = req.body.id;
  //console.log(user_Id);
  if (req.file || req.files[0].mimetype != "text/csv") {
    res.status(500).json({
      message: "Only .csv format allowed!",
    });
  } else {
    // for (var i = 0; i < req.files.length; i++) {
    //   reqFiles.push(url + '/public/' + req.files[i].filename)
    // }
    //console.log(req.files[0].mimetype);

    // const user = new Folder({
    //   _id: new mongoose.Types.ObjectId(user_Id),
    //   avatar: url + '/public/' + req.files[0].filename,
    // })
    // user
    //   .save()
    //   .then((result) => {
    //     console.log(result)
    //     res.status(201).json({
    //       message: 'Done upload!',
    //       userCreated: {
    //         _id: result._id,
    //         avatar: result.avatar,
    //       },
    //     })
    //   })
    //   .catch((err) => {
    //     console.log(err+"123425")
    //       res.status(500).json({
    //         message: "Only .csv format allowed! 123456"
    //       })
    //   })

    const dirName = "./public/" + req.body.id + "/";
    const filePath = path.join(dirName);

    fs.mkdir(filePath, { recursive: true }, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Failed to create directory");
      } else {
        console.log(`${dirName} directory created`);

        //Move file to directory
        const fileName = req.files[0].originalname;
        const oldPath = path.join("./public/", fileName);
        const newPath = path.join(filePath, fileName);

        fs.rename(oldPath, newPath, (err) => {
          if (err) {
            console.error(err);
            //res.status(500).send("Failed to move file to directory");
          } else {
            console.log(`${fileName} moved to ${dirName} directory`);
            //res.send("File uploaded successfully");
          }
        });
      }
    });

    const old_dt = path.join(dirName, "input.csv");
    const out_dt = path.join(dirName, "output_data.csv");
    fs.writeFile(old_dt, "", (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`${old_dt} created successfully.`);
    });
    fs.writeFile(out_dt, "", (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`${out_dt} created successfully.`);
    });

    const user = new Folder({
      _id: new mongoose.Types.ObjectId(user_Id),
      avatar: url + "/public/" + req.body.id + "/" + req.files[0].originalname,
    });

    Folder.updateOne({ _id: user._id }, user, { upsert: true })
      .then((result) => {
        //console.log(result)
        console.log(
          url + "/public/" + req.body.id + "/" + req.files[0].originalname
        );

        if (result.upserted) {
          res.status(201).json({
            message: "Done upload!",
            file:
              url + "/public/" + req.body.id + "/" + req.files[0].originalname,
            path: url + "/public/" + req.body.id + "/",
            userCreated: {
              _id: result.upserted[0]._id,
              avatar: result.upserted[0].avatar,
            },
          });
          //console.log("UpLoaded");
        } else {
          res.status(200).json({
            message: "Done update!",
            path:
              url + "/public/" + req.body.id + "/" + req.files[0].originalname,
            userUpdated: {
              _id: user._id,
              avatar: user.avatar,
            },
          });
          console.log("UpDated");
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "Error!",
        });
      });
  }
});

router.get("/", (req, res, next) => {
  User.find().then((data) => {
    res.status(200).json({
      message: "User list retrieved successfully!",
      users: data,
    });
  });
});

module.exports = router;
