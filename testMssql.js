var sql = require('mssql');

var config = {
    user: 'sa',
    password: 'edps1986',
    server: '200.101.103.102',
    database: 'sama',
    stream: true
}

var pool = new sql.ConnectionPool(config)

//sql.connect(config, function(err) {
pool.connect().then(function(err) {
    var request = new sql.Request();
    request.stream = true;
    request.query('select top 10 * from sys.all_objects');
    request.on('row', function(row) {
        console.log('name      : '+ row.name);
        console.log('object_id : '+ row.object_id);
        console.log('');
    });
    request.on('error', function(err) {
        console.log(err);
    });
    request.on('done', function(returnValue) {
        console.log('Data End');
    });
});

