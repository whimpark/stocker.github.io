
/**
   kline: 
   "2022-12-30,15.50,17.42,17.42,15.42,1735005,2883635635.00,12.63,9.97,1.58,63.48"
    日期, 开盘, 收盘, 最高, 最低, 成交量, 成交额，振幅, 涨跌幅, 涨跌额, 换手率
    stock_date, open,close, max, min, deal_num, deal_amount, amplitude, final_amp, final_amp_amount, turnover
 */

const ROOT=__dirname+"/../.."
const FileHelper =require("../file/FileHelper.js") 

const Helper =require("../util/Helper.js") 
const util=require("util")
 
const StockAnalyzer=require("./analyzer/StockAnalyzer.js")
const ExchangeFilter=require("./filter/ExchangeFilter.js")
const AvgFilter=require("./filter/AvgFilter.js")
const NotNewFilter=require("./filter/NotNewFilter.js")
const NotSTFilter=require("./filter/NotSTFilter.js")
const ExchangeHandler=require("./handler/ExchangeHandler.js")
const AvgHandler=require("./handler/AvgHandler.js")
const LinkHandler=require("./handler/LinkHandler.js")
 

async function show(data, name){
    if(!data || data.length==0){
        console.log("分析结果为空!");
        return 
    }
    //md
    let content=""
    let title=util.format("|%s|%s|%s|%s|%s|%s|%s|%s|%s|%s|%s|%s|", "编号","名称","EXA1","EXA13","EXA-DP13","EXA2","EXA25","EXA-DP25","EXA3","EXA37","EXA-DP37")
    console.log(title);
    content+=title+"\n"
    content+="|-|-|-|-|-|-|-|-|-|-|-|-|\n"
    data.forEach(stock=>{ 
        let a=stock.analyst
        let link=util.format("[%s](http://quote.eastmoney.com/sh%s.html#fullScreenChart)",stock.code,stock.code)
        let msg=util.format("|%s|%s|%s|%s|%s|%s|%s|%s|%s|%s|%s|%s|", link,stock.name,a.exa1,a.exa13,a.exa_dp13 ,a.exa2,a.exa25,a.exa_dp25 ,a.exa3,a.exa37,a.exa_dp37)
        console.log(msg);
        content+=msg+"\n"
    })
    let date=Helper.formatDate()
    let timestamp=parseInt(new Date().getTime()/1000/3600)
    let filename="analyst-"+name+"-"+date+"-"+timestamp 
    FileHelper.write(ROOT+"/data/temp/"+filename+".md", content)

    //json
    let stocks=[]
    data.forEach(stock=>{
        stocks.push({
            code: stock.code,
            name: stock.name,
            info: stock.klines[stock.klines.length-1]
        })
    })
    FileHelper.write(ROOT+"/data/temp/"+filename+".json", JSON.stringify(stocks, null, 2))

    //write config
    Helper.config(filename,"analyst","filename")

    await Helper.sleep(500)
}

function main(){

    let config=Helper.config()
    let path=ROOT+"/data/temp/"+config.builder.filename 
    let data=JSON.parse(FileHelper.read(path));

    let analyzer=StockAnalyzer;
    analyzer.appendFilter(NotNewFilter)
    analyzer.appendFilter(NotSTFilter)
    analyzer.appendHandler(ExchangeHandler)
    analyzer.appendHandler(AvgHandler)  

 
    //avg
    console.log("=========================avg");
    analyzer.cleanAnalyzeFilter()
    analyzer.appendAnalyzeFilter(AvgFilter) 
    let avgStocks=analyzer.analyze(data) 
    show(avgStocks,"avg")

    //exchange
    console.log("=========================exchange");
    analyzer.cleanAnalyzeFilter()
    analyzer.appendAnalyzeFilter(ExchangeFilter)
    let exchangeStocks=analyzer.analyze(data) 
    show(exchangeStocks, "exa")


}


main()
     






