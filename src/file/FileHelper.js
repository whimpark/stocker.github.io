let fs = require('fs')


function getAllFiles(root){
    if(!fs.existsSync(root)) { return []} 
    var res = [] , files = fs.readdirSync(root);
    files.forEach(function(file){
        var pathname = root+'/'+file , stat = fs.lstatSync(pathname);
        if (!stat.isDirectory()){
            res.push(pathname);
        } else {
            res = res.concat(getAllFiles(pathname));
        }
    });
    return res
}

module.exports = {
    read(path) {
        try {
          return fs.readFileSync(path, { encoding: 'utf8' });
        } catch(err) {
          // 发生错误
          console.error(err);
        }
    },
    write(path, content, encoding) {
        if(!encoding)encoding="utf8"
        try {
            fs.writeFileSync(path,content,{ encoding: encoding })
        } catch(err) { 
            console.error(err);
        }
    },
    append(path, content, encoding) {
        if(!encoding)encoding="utf8"
        try {
            fs.appendFileSync(path,content,{ encoding: encoding })
        } catch(err) { 
            console.error(err);
        }
    },
    getFiles(root){
        return getAllFiles(root)
    }
}





