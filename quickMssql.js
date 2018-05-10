const sql = require('mssql')

//console.log("start")

let quickTest = async () => {
	console.log("hi")
	try {
		//const pool = await sql.connect('mssql://username:password@localhost/database')
		let pool = await sql.connect('mssql://sa:edps1986@200.101.103.102/sama')
		//const result = await sql.query`select * from mytable where id = ${value}`
		let result = await pool.request()
			.query(`SELECT TOP 5 CONVERT(varchar(19), LOG_DATE, 121) as DT, * FROM COM_ALARM WHERE TASK_ID LIKE 'C%' ORDER BY LOG_DATE DESC`)

		//console.dir(result)
		console.log(result)

		pool.close()

	} catch (err) {
		console.log("error")
		console.log(err)
		// ... error checks
	}
}

quickTest()
