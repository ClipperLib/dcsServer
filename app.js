var sql = require('mssql');

var config = {
    server: 'localhost',
    database: 'Company',
    user: 'sa',
    password: 'sa',
    port: 1433
};

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

loadEmployees();
