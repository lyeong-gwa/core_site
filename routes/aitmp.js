const express = require('express');
const router = express.Router();
const multer = require("multer");

const fileFilter = function(req,file,cb){
    let typeArray = file.mimetype.split('/');
    let fileType = typeArray[1];
    if(fileType=='png'){
      cb(null,true);
    }
    else{
      req.fileValidationError = "png파일만 업로드해주세요,";
      cb(null,false);
    }
  }
  const upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'public/tmpp/');
      },
      filename: function (req, file, cb) {
        cb(null, new Date().valueOf()+file.originalname.charCodeAt(0).toString(16)+".png");
      }
    }),
    fileFilter: fileFilter
  });


  router.post('/',upload.array('file1'), async(req, res) => {
     let paths = [];
     for(let i=0;i<req.files.length;i++){
         paths.push("http://www.coregemstone.com/"+req.files[i].path.substr(7));
       }
    res.header("Access-Control-Allow-Origin", "*");
    return res.send({'path':paths});
});
  

  module.exports = router;
