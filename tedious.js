var Connection = require('tedious').Connection;

var config = {
	userName: 'sa',
	password: 'edps1986',
	server: '200.101.103.102',
	// If you are on Microsoft Azure, you need this:
	options: {
		//encrypt: true,
		database: 'sama'
	}

};

var connection = new Connection(config);

connection.on('connect', function(err) {
// If no error, then good to proceed.
	console.log("Connected");
	executeStatement();
});

var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

function executeStatement() {
	request = new Request(
		"SELECT TOP 5 CONVERT(varchar(19), LOG_DATE, 121) as DT, * \
		FROM COM_ALARM \
		WHERE TASK_ID LIKE 'C%' ORDER BY LOG_DATE DESC;",
		function(err) {
			if (err) {console.log(err);}
		}
	);

	var result = "";

	request.on('row', function(columns) {
		columns.forEach(function(column) {
		  if (column.value === null) {
			console.log('NULL');
		  } else {
			result+= column.value + " ";
		  }
		});
		console.log(result);
		result = "";
		//connection.close()
	});

	request.on('done', function(rowCount, more) {
		console.log(rowCount + ' rows returned');
	});

	connection.execSql(request);
}
