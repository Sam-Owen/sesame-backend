var constant = {

    BASE_ATTR_DATE: "time",
    BASE_ATTR_OPEN: "open",
    BASE_ATTR_HIGH: "high",
    BASE_ATTR_LOW: "low",
    BASE_ATTR_CLOSE: "close",
    BASE_ATTR_VOL: "volume",

    FIX_NUM: 4,

    KDJ_K: "KDJ.K",
    KDJ_D: "KDJ.D",
    KDJ_J: "KDJ.J",

    MACD_EMA_FAST: "MACD.EMA.FAST",
    MACD_EMA_SLOW: "MACD.EMA.SLOW",
    MACD_DIF: "MACD.DIF",
    MACD_DEA: "MACD.DEA",
    MACD_BAR: "MACD.MACD",

    MA: "MA.MA"
};

if (typeof module !== "undefined"){
    module.exports = constant;
}