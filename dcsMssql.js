const mssql = require('mssql')

const config_prd = {
	user: 'mes',
	password: 'sames',
	server: '200.101.103.13', // 압연
	//server: '200.101.103.12', // 가공
	database: 'sa_mes',
	pool:{
		max: 10,
		min: 1,
		idleTimeoutMillis:30000
	},
	options:{
		instantName: 'nodejs DCS',
		appName:'DCS_IF',
		tdsVersion: '7_1'
	}
}

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
		instantName: 'nodejs DCS Server',
		appName:'DCS_IF'
	}
}

let current_config = config_dev

let debug = true
let oml = (logData) => {
	if (debug) {
		console.log(logData)
	}
}

execSql = async function (sqlQuery) {

	const connectionPool = new mssql.ConnectionPool(current_config)
	connectionPool.on('error', err => {
		oml('connection pool errors', err)
	})

	try {
		await connectionPool.connect()
		let request = await connectionPool.request()
		let result = await request.query(sqlQuery)
		return {success: result}
	} catch (err) {
		let e = JSON.stringify(err, ["message", "arguments", "type", "name"]);
		return {error: JSON.parse(e).message};
		//return {err: err}
	} finally {
		connectionPool.close();
	}
}


exports.dcsInsert = async function (dcsData) {

	const connectionPool = new mssql.ConnectionPool(current_config)
	connectionPool.on('error', err => {
		oml('connection pool errors', err)
	})

	let strSql = "select count(*) as row_count from mesga.mes.SMES_DCS_IF_DATA2"

	strSql = ""
	strSql += "INSERT INTO mes.SMES_DCS_IF_DATA2("
	strSql += "DCS_IF_SVR_IP,"
	strSql += "FACT_CD, "
	strSql += "MCH_CD, "
	strSql += "MCH_TIM,"
	strSql += "DCS_IF_DATA "
	strSql += ") VALUES ( "
	strSql += "'200.101.103.13',"
	strSql += "	'PL60',"
	strSql += "	'CC07',"
	strSql += "	getdate(),"
	strSql += "'김성국'"
	//strSql += "	@str_if_data"
	strSql += ")"
	strSql = `
	INSERT INTO mes.SMES_DCS_IF_DATA2(
	DCS_IF_SVR_IP,
	FACT_CD,
	MCH_CD,
	MCH_TIM,
	DCS_IF_DATA
	) VALUES (
	'200.101.103.13',
		'PL60',
		'CC07',
		getdate(),
		'${dcsData.dcs_data}'
	)
	`
	oml(strSql)

	strSql = `
	INSERT INTO mes.SMES_DCS_IF_DATA2(
	DCS_IF_SVR_IP,
	FACT_CD,
	MCH_CD,
	MCH_TIM,
	DCS_IF_DATA
	) VALUES (
	'200.101.103.13',
		'PL60',
		'CC07',
		getdate(),
		'${dcsData.dcs_data}'
	)
	`

	strSql = ""
	strSql += "INSERT INTO mes.SMES_DCS_IF_DATA2("
	strSql += "DCS_IF_SVR_IP,"
	strSql += "FACT_CD, "
	strSql += "MCH_CD, "
	strSql += "MCH_TIM,"
	strSql += "DCS_IF_DATA "
	strSql += ") VALUES ( "
	strSql += "'200.101.103.13',"
	strSql += "	'PL60',"
	strSql += "	'CC07',"
	strSql += "	getdate(),"
	strSql += "	@str_if_data"
	strSql += ")"

	try {
		await connectionPool.connect()
		let request = await connectionPool.request()

		//request.addParameter('str_if_data', mssql.TYPES.VarChar, dcsData.dcs_data)
		//dcsData.dcs_data = '김성국'
		request.input('str_if_data', mssql.TYPES.VarChar, dcsData.dcs_data)

		let result = await request.query(strSql)
		return {success: result}
	} catch (err) {
		let e = JSON.stringify(err, ["message", "arguments", "type", "name"]);
		return {error: JSON.parse(e).message};
		//return {err: err}
	} finally {
		connectionPool.close();
	}
}


exports.dcsInsertTedious = (dcsData) => {

	let tedious = require('tedious')
	let tediousConnection = require('tedious').Connection
	let tediousRequest = require('tedious').Request
	let TYPE = require('tedious').TYPES
	/*
	let tediousConnection = tedious.Connection
	let tediousRequest = tedious.request
	let TYPE = tedious.TYPES
	*/
	//let connection = new tediousConnection(current_config)
	let connection = new tediousConnection({
		server: '200.101.103.133',
		userName: 'mes13',
		password: 'mes13',
		options:{
			port: '1433',
			database: 'mesga',
			instantName: 'nodejs DCS Server',
			appName:'DCS_IF'
		}
	})

	connection.on('connect', err => {
		let strSql = ''

		strSql += "INSERT INTO mes.SMES_DCS_IF_DATA2("
		strSql += "DCS_IF_SVR_IP,"
		strSql += "FACT_CD, "
		strSql += "MCH_CD, "
		strSql += "MCH_TIM,"
		strSql += "DCS_IF_DATA "
		strSql += ") VALUES ( "
		strSql += "@dcs_if_svr_ip,"
		strSql += "@fact_cd,"
		strSql += "@mch_cd,"
		strSql += "@mch_tim,"
		strSql += "@str_if_data"
		strSql += ")"

		let request = new tediousRequest(strSql, err => {
			if (err) {
				oml(err);
			}
		})

		oml(dcsData)
		request.addParameter('dcs_if_svr_ip',TYPE.VarChar,dcsData.dcs_server_ip)
		request.addParameter('fact_cd',TYPE.VarChar,dcsData.dcs_fact_cd)
		request.addParameter('mch_cd',TYPE.VarChar,dcsData.dcs_data_mch_cd)
		request.addParameter('mch_tim',TYPE.VarChar,dcsData.dcs_data_mch_dt)
		request.addParameter('str_if_data',TYPE.VarChar,dcsData.dcs_data)
		connection.execSql(request)
	})
}


if (require.main === module ) {
	let strSql = "select count(*) as row_count from mesga.mes.SMES_DCS_IF_DATA2"

	oml(strSql)
	execSql(strSql).then( result => {
		if (result.success) {
			oml(result.success)
		} else if (result.error) {
			oml(result.error)
		} else {
			oml(result)
		}
	})
}

