const express = require('express');
const router = express.Router();
let {PythonShell} = require("python-shell");

router.post('/', (req, res) => {
    let main_list = `${req.body.main_list}`.replace(/\"/g,'');
    let core_num = req.body.core_num;
    let prior_list = `${req.body.prior_list}`.replace(/\"/g,'');
    let job = req.body.job;
    let session = req.body.session;


    json_info=`{"job":"${job}","session":"${session}","prior_list":${prior_list},"core_num":${core_num},"main_list":${main_list}}`; 
    json_info=json_info.replace(/\\/g,`/`);
    json_info=json_info.replace(`\\`,`/`);
    let options = {mode: 'json',pythonPath: '',pythonOptions: ['-u'],scriptPath: '',args: JSON.stringify(json_info)};

    PythonShell.run(__dirname+'/../maple_python/ajax.py',options,function(err,results){
        if(err){
          res.type("text/plain");
        res.send(
          "오류가 발생하였습니다 다음을 확인해주세요\n1.이미지는 PNG형식이여야 합니다.\n2.스킬잠금을 해제하셨는지 확인해주세요."
        );
        }
        else{
            res.send({'combi_set':results});
        }
      });

});
  

  module.exports = router;
