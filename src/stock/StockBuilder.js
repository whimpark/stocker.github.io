

const fs = require('fs')
const FileHelper =require("../file/FileHelper.js") 
const Helper = require('../util/Helper.js')

 
const ROOT=__dirname+"/../.."


function getKLinesValue(values, index){
    if(values.length>index) return values[index];
    else return null;
}

function buildJsonFiles(dir,filter){
    let companyFolder=dir+"/company"
    let klinesFolder=dir+"/klines"
    let files=fs.readdirSync(companyFolder)
 
    let data=[]
    files.forEach(function(filename){
        if(filename.endsWith(filter)){
            // company
            let stock=JSON.parse(FileHelper.read(companyFolder+"/"+filename));
            let code=filename.split(".")[0]
            let klinesFiles=FileHelper.getFiles(klinesFolder+"/"+code)
            // klines, 仅处理klines最新2个文件(最近2年的数据)
            if(klinesFiles && klinesFiles.length>2){
                klinesFiles.splice(0, klinesFiles.length-2)
            }
            klinesFiles.forEach(function(klinesFilename){
                const klineContent=FileHelper.read(klinesFilename)
                const klineArray=klineContent.split("\n")
                klineArray.forEach(kline=>{
                    stock.klines.push(kline)
                })
            })
            data.push(stock)
        }
    })
    console.log("读到"+data.length+"个文件数据!");

    data.forEach(stock=>{
        let klines=[];
        stock.klines.forEach(e=>{
            let values=e.split(",")
            klines.push({
                "date": getKLinesValue(values,0),
                "open": getKLinesValue(values,1),
                "close":getKLinesValue(values,2),
                "max":getKLinesValue(values,3),
                "min": getKLinesValue(values,4),
                "deal_num": getKLinesValue(values,5),
                "deal_amount": getKLinesValue(values,6),
                "amp_total": getKLinesValue(values,7),
                "amp_final_percent": getKLinesValue(values,8),
                "amp_final_amount": getKLinesValue(values,9),
                "exchange": getKLinesValue(values,10),
            })
        })
        stock.klines=klines;
    })
    console.log("完成转换!");
 
    //write data file
    let builderOutputFileName="builder-"+parseInt(new Date().getTime()/1000/3600)+".json" 
    FileHelper.write(ROOT+"/data/temp/"+builderOutputFileName,JSON.stringify(data))

    //write config
    Helper.config(builderOutputFileName,"builder","filename")
}

 

async function main(){
    let dir="./data/stock/spider"
    let filter=".json"
    buildJsonFiles(dir,filter)


}


main()
     






