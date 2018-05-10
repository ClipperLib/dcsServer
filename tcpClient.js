/**
 * TCP 클라이언트
 */

const net = require('net')

const PORT = 33333
const ADDRESS = '192.168.211.111'

// net.Socket 인스턴스 생성
let client = net.createConnection(PORT, ADDRESS)

let dcsData = '2018-03-27 17:55:07CC07+000034.13+000030.00+000030.00+000030.00+000030.00+000399.00+000399.00+000000.00+000000.00+000000.00+000000.00+000000.00+000000.00+000000.00+000000.00+000152.00+000000.00+000000.00+000000.0005$'

/*
let client = net.connect( PORT, ADDRESS, () => {
	//this.setNoDelay(true)
	//this.setEncoding('utf8')
	client.on('connect', () => {
		console.log('onConnect')
		for (let i = 1 ; i <= 10 ; i++) {
			//this.write('클라이언트가 보낸 메시지.')
			this.write(dcsData)
		}
	})
})
*/

client.on('drain', function onDrain() {
    console.log('onDrain--------------------------------------------------')
    console.log('onDrain--------------------------------------------------')
    console.log('onDrain--------------------------------------------------')
    console.log('onDrain--------------------------------------------------')
    console.log('onDrain--------------------------------------------------')
    console.log('onDrain--------------------------------------------------')
    console.log('onDrain--------------------------------------------------')
    console.log('onDrain--------------------------------------------------')
    console.log('onDrain--------------------------------------------------')
    console.log('onDrain--------------------------------------------------')
    console.log('onDrain--------------------------------------------------')
	client.end()
})


client.on('connect', function onConnect() {
    console.log('onConnect')
	this.setNoDelay(true)
	this.setEncoding('utf8')
	for (let i = 1 ; i <= 1 ; i++) {
		//this.write('클라이언트가 보낸 메시지.')
		//this.write(`WC:[${i}]:${dcsData}`)
		this.write(dcsData)
	}
	client.end()
})

/*
client.on('close', function onClose(had_error) {
    console.log('onClose')
    console.log('had_error :', had_error)
})

client.on('data', function onData(buff) {
    console.log('onData')
    console.log('서버로부터 받은 메시지 :', buff.toString())
})

client.on('drain', function onDrain() {
    console.log('onDrain')
})

client.on('end', function onEnd() {
    console.log('onEnd')
})

client.on('error', function onError(err) {
    console.log('onError')
    console.log(err)
})

client.on('lookup', function onLookup(err, address, family, host) {
    console.log('onLookup')
    console.log('err', err)
    console.log('address', address)
    console.log('family', family)
    console.log('host', host)
})

client.on('timeout', function onTimeout() {
    console.log('onTimeout')
})
*/
