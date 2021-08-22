const fs=require('fs');
const deleteFolderRecursive = function(path) {
  // existsSync: 파일이나 폴더가 존재하는 파악
  if (fs.existsSync(path)) {               
     // readdirSync(path): 디렉토리 안의 파일의 이름을 배열로 반환
    fs.readdirSync(path).forEach(function(file, index){   
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // lstatSync: stat값을 반환함, isDirectory(): 디렉토리인지 파악
        deleteFolderRecursive(curPath);          // 재귀(reCurse)
      } else {                                              // delete file
        fs.unlinkSync(curPath);                     // unlinkSync: 파일 삭제
      }
    });
    fs.rmdirSync(path);                              // rmdirSync: 폴더 삭제
  }
};

const check_del_folder = function(path,session) {
  // existsSync: 파일이나 폴더가 존재하는 파악
  if (fs.existsSync(path)) {               
    fs.readdirSync(path).forEach(function(file, index){   
      let curPath = path + "/" + file;
      if((new Date().getTime()-fs.lstatSync(curPath).ctime)/1000>86400){
        deleteFolderRecursive(curPath);
      }
    });
  }
};

module.exports.check_del_folder = check_del_folder;
module.exports.deleteFolderRecursive = deleteFolderRecursive;
