// var sh = {
//     _id: '',
//     symbol: '',
//     data: [{}, {}, {}],
//     anaylis: '',
//     board: '',
//     answer_authority: '',
//     type: ''
// }
let trade_type = {},
    dao = require('../api/dao');

dao.register('trade_type').then((base) => {
    trade_type.base = base
})


module.exports = trade_type;