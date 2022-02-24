const express = require('express');
const asyncify = require('express-asyncify');
const path = require('path');
const router = asyncify(express.Router());
const multer = require("multer");
const delete_forder=require("./delete_folder");
const job_skill=require("./job_skill_name");
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
      cb(null, new Date().valueOf()+file.originalname.charCodeAt(0).toString(16)+".png");
    }
  }),
  fileFilter: fileFilter
});
// const upload = multer({
//   storage: multer.memoryStorage(),
// });


// GET / 라우터
router.get('/', (req, res) => {
  const job_skill_class = job_skill.search_job_skill(__dirname+'/../public/maple_img');
  res.render("core.ejs",{job_skill_class});
});

router.post('/',upload.array('profile_pt'), async(req, res) => {
   job=req.body.job;
   img_path=``;
   const job_skill_class = job_skill.search_job_skill(__dirname+'/../public/maple_img');
   for(let i=0;i<req.files.length;i++){
     let {mimetype,path} = req.files[i];
     img_path=`${img_path}"${path}",`;
   }
   img_path=img_path.substring(0,img_path.length-1);

  json_info=`{"job":"${job}","ID":"${req.sessionID}","img_path":[${img_path}]}`; 
  json_info=json_info.replace(/\\/g,`/`);
  json_info=json_info.replace(`\\`,`/`);
  let options = {mode: 'json',pythonPath: '',pythonOptions: ['-u'],scriptPath: '',args: JSON.stringify(json_info)};
  
  PythonShell.run(__dirname+'/../maple_python/test.py',options,function(err,results){
    if(err){
      res.type("text/plain");
    res.send(
      "오류가 발생하였습니다 다음을 확인해주세요\n1.이미지는 PNG형식이여야 합니다.\n2.스킬잠금을 해제하셨는지 확인해주세요."
    );
    }
    res.render("core_result.ejs",{results,job_skill_class});
  });

  //delete_forder.deleteFolderRecursive(__dirname+'/../public/tmp/'+req.sessionID);
  delete_forder.check_del_folder(__dirname+'/../public/tmp',req.sessionID);
});

module.exports = router;

