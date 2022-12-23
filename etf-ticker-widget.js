/* --------------------------------------------------------------
Script: etf-ticker-widget
Author: Nico Wickersheim
Version: 1.0.0
Description:
Displays the yesterday's course of an etf  based on 
the data of leeway API.
Changelog:
1.0.0: Initialization
-------------------------------------------------------------- */

// Insert your api key here!
// https://leeway.tech/account
const apiKey = '<INSERT API KEY>'

let params = null;
// Parameter takeover from input
if (args.widgetParameter == null) {
    params = ["DE000A2QP331"]; // Default input without parameters
} else {
    params = args.widgetParameter.split(",")
    console.log(params)
}

// Fetch Coinbase API json object
const url = 'https://api.leeway.tech/api/v1/public/general/isin/' + params[0] + '?apitoken=' + apiKey
const req = new Request(url)
const res = await req.loadJSON()
let countryName = "";
countryName = res[0].countryName;
let code = "";
code = res[0].Code;
let currencyCode = "";
currencyCode = res[0].currencyCode;
let type = "";
type = res[0].Type;
let ISIN = "";
ISIN = res[0].ISIN;
let name = "";
name = res[0].Name;
let previousClose = 0;
previousClose = res[0].previousClose;
let exchange = "";
exchange = res[0].Exchange;
let previousCloseDate = "";
previousCloseDate = res[0].previousCloseDate

const exchangeInfoUrl = 'https://api.leeway.tech/api/v1/public/general/exchanges?apitoken=p822b4zix92kereexub6iz'
const exchangeInfoReq = new Request(exchangeInfoUrl)
const exchangeInfoRes = await exchangeInfoReq.loadJSON()

let exchangeInfo = ""

for(var index = 0; index < exchangeInfoRes.length; index++) {
  if(exchangeInfoRes[index].Code == exchange) {
    exchangeInfo = exchangeInfoRes[index]
  }
}

const countryFlagUrl = new Request("https://countryflagsapi.com/png/" + exchangeInfo.CountryISO2);
const flagImg = await countryFlagUrl.loadImage()


// Image fetching
let img = {};
let i = {};
    // Fetch default independent image
    i = new Request('https://img.icons8.com/external-smashingstocks-circular-smashing-stocks/512/external-stock-market-webmobile-applications-smashingstocks-circular-smashing-stocks.png')
    img = await i.loadImage()

let widget = createWidget()
if (config.runsInWidget) {
    // create and show widget
    Script.setWidget(widget)
    Script.complete()
}
else {
    widget.presentSmall()
}

function createWidget() {
        
  let w = new ListWidget()
  w.backgroundColor = new Color("#1A1A1A")
        
    // Place image on the left top
    let imageStack = w.addStack();
    imageStack.setPadding(8, 25, 0, 10);
    //imageStack.backgroundColor = Color.red()
    imageStack.layoutHorizontally();
    imageStack.centerAlignContent();
    let image = imageStack.addImage(img)
    image.imageSize = new Size(43, 43)
    image.centerAlignImage()
    imageStack.addSpacer(12);

    let imageTextStack = imageStack.addStack();
    imageTextStack.layoutVertically();
    imageTextStack.addSpacer(0);
    
    // Stack at the right to the image
    
    // highest stack with code
    let codeText = "";
    codeText = imageTextStack.addText(code)
    codeText.textColor = Color.gray()
    codeText.font = Font.systemFont(12)

    let baseStack = imageTextStack.addStack()
    baseStack.layoutHorizontally();
    baseStack.backogrundColor = Color.red()
    
    // ISIN text in the middle 
    let isinText = baseStack.addText(ISIN)
    isinText.textColor = Color.white()
    isinText.font = Font.systemFont(8)
    
    let exchangeStack = imageTextStack.addStack()
    exchangeStack.layoutHorizontally();
    
    // Exchange text bottom
    let exchangeText = exchangeStack.addText(exchange)
    exchangeText.textColor = Color.gray()
    exchangeText.font = Font.mediumSystemFont(12)
    
    let flagImgInStack = exchangeStack.addImage(flagImg)
    flagImgInStack.imageSize = new Size(14, 14)
    flagImgInStack.centerAlignImage()
    
    w.addSpacer(8)    
    
    // Full name of the ETF
    let nameText = w.addText(name)
    nameText.textColor = Color.white()
    nameText.font = Font.systemFont(10)
    nameText.centerAlignText()

    w.addSpacer(8)
    
    // Value in the center 
    let valueText = "";
    valueText = w.addText(previousClose + ' ' + currencyCode)
    valueText.centerAlignText()
    valueText.textColor = Color.yellow()
    valueText.font = Font.systemFont(16)

    w.addSpacer(8)        
        
    // Bottom date text 
    let currentDate = new Date(previousCloseDate);
    let lastDate = w.addDate(currentDate);
    lastDate.textColor = Color.gray()
    lastDate.font = Font.mediumSystemFont(10)
    lastDate.centerAlignText();

    w.setPadding(0, 0, 0, 0)    
            
    return w
    
}