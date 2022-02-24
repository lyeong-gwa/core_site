const fs=require('fs');
const search_job_skill = function(path) {
  let job_skill = {};
  if (fs.existsSync(path)) {               
    fs.readdirSync(path).forEach(function(file, index){   
      var curPath = path + "/" + file;                                 
        job_skill[`${file}`]=fs.readdirSync(curPath);                 
    });
  }
  return job_skill;
};



module.exports.search_job_skill = search_job_skill;