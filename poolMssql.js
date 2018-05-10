let mssqlInstance = require("mssql")

let config_dev = {
	server: '200.101.103.133',
	port: '1433',
	database: 'mesga',
	user: 'mes13',
	password: 'mes13',
	pool:{
		max: 10,
		min: 1,
		idleTimeoutMillis:30000
	},
	options:{
		abortTransactionOnError: true,
		instantName: 'nodejs DCS Server',
		appName:'DCS_IF'
	}
}

let config_prd = {
	server: '200.101.103.13', // 가공
	//server: '200.101.103.12', // 압연
	port: '1433',
	database: 'sa_mes',
	user: 'mes',
	password: 'sames',
	pool:{
		max: 10,
		min: 1,
		idleTimeoutMillis:30000
	},
	options:{
		instantName: 'nodejs DCS Server',
		appName:'DCS_IF',
		tdsVersion: '7_1'
	}
}

let myLogger = console.log
let current_config = config_dev

let connectionPool = new mssqlInstance.ConnectionPool(current_config)

connectionPool.connect()

mssqlInstance.on('error', err => {
	if (err) {
		myLogger('-------------------------')
		myLogger(err)
	} else {
		connectionPool.connect()
	}
})

console.log("Dcs Mssql Write")

function dcsSelect() {
	let strSql = "select count(*) as row_count from mesga.mes.SMES_DCS_IF_DATA2"
	//let strSql = "select count(*) from mesga.mes.SMES_DCS_IF_DATA2"


	connectionPool.request().query(strSql).then(function (recordset) {
		console.log(recordset)
		connectionPool.close()
	}).catch(function (err) {
		myLogger('-------------------------')
		myLogger(err)
		connectionPool.close()
	})
}

function dcsSelect2() {
	connectionPool.connect().then(function () {
		let req = new mssqlInstance.Request(connectionPool)
		let strSql = "select count(*) as row_count from mesga.mes.SMES_DCS_IF_DATA2"
		//let strSql = "select count(*) from mesga.mes.SMES_DCS_IF_DATA2"

		req.query(strSql).then(function (recordset) {
			console.log(recordset);
			connectionPool.close();
		}).catch(function (err) {
				console.log(err);
				connectionPool.close();
		})
	}).catch(function (err) {
		console.log(err);
	});
}

function dcsInsert2() {
	connectionPool.connect().then(function () {
		let req = new mssqlInstance.Request(connectionPool)
		let strSql = ""

		strSql += "INSERT INTO mes.SMES_DCS_IF_DATA2("
		strSql += "DCS_IF_SVR_IP,"
		strSql += "FACT_CD, "
		strSql += "MCH_CD, "
		strSql += "MCH_TIM "
		strSql += ") VALUES ( "
		strSql += "'200.101.103.13',"
		strSql += "	'PL60',"
		strSql += "	'CC07',"
		strSql += "	'2018-04-03 16:24:54'"
		strSql += ")"

		req.query(strSql).then(function (recordset) {
			console.log(recordset);
			connectionPool.close();
		}).catch(function (err) {
				console.log(err);
				connectionPool.close();
		})
	}).catch(function (err) {
		console.log(err);
	});
}

function dcsInsert() {
	let request = new sql.Request(connectionPool)
	let strSql = ""

	strSql += "INSERT INTO mes.SMES_DCS_IF_DATA2("
	strSql += "DCS_IF_SVR_IP,"
	strSql += "FACT_CD, "
	strSql += "MCH_CD, "
	strSql += "MCH_TIM "
	strSql += ") VALUES ( "
	strSql += "'200.101.103.13',"
	strSql += "	'PL60',"
	strSql += "	'CC07',"
	strSql += "	'2018-04-03 16:24:54'"
	strSql += ")"

	console.log(strSql)

	connectionPool.connect().then(
		).then(
		).catch(
	)

	request.query(strSql).then( (recordset) => {
		console.log('Recordset : ' + recordset)
		console.log('Affected: ' + request.rowsAffected)
	}).catch( (err) => {
		if (err) {
			console.log('SQL Connection Error: ' + err)
		}
	})
}

function loadEmployees() {
    var dbConn = new sql.ConnectionPool(config_dev);
    dbConn.connect().then(function () {
        var request = new sql.Request(dbConn);
		let strSql = "select count(*) as row_count from mesga.mes.SMES_DCS_IF_DATA2"
        request.query(strSql).then(function (recordSet) {
            console.log(recordSet);
            dbConn.close();
        }).catch(function (err) {
            console.log(err);
            dbConn.close();
        });
    }).catch(function (err) {
        console.log(err);
    });
}

dcsSelect()
//dcsSelect2()
//dcsInsert2()
//dcsInsert()


