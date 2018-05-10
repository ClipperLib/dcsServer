let myMssql = require('./bestPracticeMssql.js')
let dcsData = require('./dcsDataInfo.js')


dcsData.dcs_data = '김성국'
//myMssql.execSql(strSql).then( result => {
//let dcsData = 'test Data'
myMssql.dcsInsert(dcsData).then( result => {
	if (result.success) { // success가 아닌 경우는 에러
		console.log(result.success)
	} else {
		console.log(result)
	}
})

