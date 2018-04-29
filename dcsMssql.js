const config_prd = {
	user: 'mes',
	password: 'sames',
	server: '200.101.103.13', // 압연
	//server: '200.101.103.12', // 가공
	database: 'sa_mes',
	options:{
		instantName: 'nodejs DCS',
		appName:'DCS_IF',
		tdsVersion: '7_1'
	}
}

const config_dev = {
	user: 'mes13',
	password: 'mes13',
	server: '200.101.103.133',
	database: 'mesga',
	options:{
		instantName: 'nodejs DCS',
		appName:'DCS_IF'
	}
}

sql = require('mssql')

var strSql

sql.connect(config_dev, err => {
	strSql = 'select 1 as number'
	//strSql = 'select * from cs_common_m'
	new sql.Request().query(strSql, (err, result) => {
		console.log(err)
		console.log(result.recordset[0].number)
	})
})
