const express = require('express');
const asyncify = require('express-asyncify');
const path = require('path');
const router = asyncify(express.Router());
const multer = require("multer");
const delete_forder=require("./delete_folder");
let async = require('async');
let {PythonShell} = require("python-shell");
const { appendFile } = require('fs');
const { resolve } = require('path');
const { rejects } = require('assert');
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
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, new Date().valueOf()+file.originalname);
    }
  }),
  fileFilter: fileFilter
});
// const upload = multer({
//   storage: multer.memoryStorage(),
// });


// GET / 라우터
router.get('/', (req, res) => {
  res.render("core.ejs");
});

router.post('/',upload.array('profile_pt'), async(req, res) => {
   job=req.body.job;
   core_num=req.body.core_num;
   skill_box=req.body.skill_box;
   img_path=``;
   img_mime=``;
   send_data=``;

   for(let i=0;i<req.files.length;i++){
     let {mimetype,path} = req.files[i];
     
     img_path=`${img_path}"${path}",`;
     img_mime=`${img_mime}"${mimetype}",`;
   }
   img_path=img_path.substring(0,img_path.length-1);
   img_mime=img_mime.substring(0,img_mime.length-1);

  json_info=`{"job":"${job}","ID":"${req.sessionID}","core_num":${core_num},"img_path":[${img_path}],"skill_box":[${skill_box}],"img_mime":[${img_mime}]}`; 
  json_info=json_info.replace(/\\/g,`/`);
  json_info=json_info.replace(`\\`,`/`);
  let options = {mode: 'json',pythonPath: '',pythonOptions: ['-u'],scriptPath: '',args: JSON.stringify(json_info)};
  
  PythonShell.run(__dirname+'/../maple_python/test.py',options,function(err,results){
    if(err) throw err;
    res.render("core_result.ejs",{results});
  });

  //delete_forder.deleteFolderRecursive(__dirname+'/../public/tmp/'+req.sessionID);
  delete_forder.check_del_folder(__dirname+'/../public/tmp',req.sessionID);
});

module.exports = router;

