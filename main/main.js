let database = require("./datbase");

function printInventory(inputs) {
    var obj = {};

    inputs.map(function (item) {
        countElementNumber(item,obj);
    });

    //console.log(obj);

    calculatePromotedGoodsInformation(obj);

};

function countElementNumber(item,obj){

    if(item.indexOf("-")!=-1){
        let element = item.split("-")[0];
        let count = item.split("-")[1];

        if(!obj[element]){
            obj[element] = count;
        }else{
            obj[element] += count;
        }
    }else{

        if(!obj[item]){
            obj[item] = 1;
        }else{
            obj[item] ++;
        }

    }
}

function calculatePromotedGoodsInformation(obj){


    //console.log("购买后 ",obj);

    //console.log("促销信息： " , promoteInformation);


    let freeGoodsObj = {};
    let promotedGoodsObj = {};

    for(let item in obj){
        calPromotedGoods(item,obj,promotedGoodsObj,freeGoodsObj);
    }

    console.log("免费的 ",freeGoodsObj);


    //console.log("促销后 ",promotedGoodsObj);

    printGoodsInfomation(obj,promotedGoodsObj,freeGoodsObj);

}

function calPromotedGoods(item,obj,promotedGoodsObj,freeGoodsObj) {

    let promoteInformation = database.loadPromotions();

    let beforeCount = obj[item];


    if(promoteInformation[0]["barcodes"].indexOf(item)!=-1){

        let divide2 = Math.floor(beforeCount/2);

        if(divide2!=0){

            freeGoodsObj[item] = 1;

            promotedGoodsObj[item] = beforeCount - 1;
        }

    }else{
        promotedGoodsObj[item] = beforeCount;
    }
}

function printGoodsInfomation(obj,promotedGoodsObj,freeGoodsObj){

    let allItems = database.loadAllItems();
    let sum = 0;

    //console.log("商品详细信息：" + allItems);

    let resultStr = `***<没钱赚商店>购物清单***\n`;

    for(let item in obj){

        resultStr += printPromotedGood(item,promotedGoodsObj,obj);

        sum += calSubSum(item,obj);
    }

    resultStr+= `----------------------\n挥泪赠送商品\n`;


    //免费商品
    let saveFee = 0;

    for(let promotedGoodItem in freeGoodsObj){

        //通过条形码找到对应名称
        let itemDetailInfo =allItems.filter(function (subitem) {
            return subitem["barcode"] == promotedGoodItem;
        })

        console.log(itemDetailInfo);

        resultStr+=`名称：${itemDetailInfo[0]["name"]}，数量：${freeGoodsObj[promotedGoodItem]}${itemDetailInfo[0]["unit"]}
`;
        saveFee += freeGoodsObj[promotedGoodItem]*itemDetailInfo[0]["price"];
    }

    sum -= saveFee;
    resultStr += `----------------------\n总计：${sum.toFixed(2)}(元)\n节省：${saveFee.toFixed(2)}(元)\n**********************`;

    console.log(resultStr);
}


function printPromotedGood(item,promotedGoodsObj,obj){

    let allItems = database.loadAllItems();

    let itemDetailInfo =allItems.filter(function (subitem) {
        return subitem["barcode"] == item;
    })

    //console.log(itemDetailInfo);

    let goodsPrice = itemDetailInfo[0]["price"].toFixed(2);
    let everyGoodsSum =(goodsPrice * promotedGoodsObj[item]).toFixed(2);

    //console.log(goodsPrice,everyGoodsSum);

    let resultSubStr =`名称：${itemDetailInfo[0]["name"]}，数量：${obj[item]}${itemDetailInfo[0]["unit"]}，单价：${goodsPrice}(元)，小计：${everyGoodsSum}(元)\n`;

    return resultSubStr;

}

function calSubSum(item,obj){
    let allItems = database.loadAllItems();

    let itemDetailInfo =allItems.filter(function (subitem) {
        return subitem["barcode"] == item;
    })

    let goodsPrice = itemDetailInfo[0]["price"].toFixed(2);

    let subSum = goodsPrice*obj[item];

    return subSum;
}


inputs = [
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000003-2',
    'ITEM000005',
    'ITEM000005',
    'ITEM000005'
];

printInventory(inputs);

module.exports = printInventory;

