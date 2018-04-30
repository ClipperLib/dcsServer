#!/usr/bin/env node
'use strict';

const net = require('net')

const PORT = 33333
const ADDRESS = '192.168.211.111'

let server = net.createServer();

//server.listen(PORT,ADDRESS, () => {
//server.listen(port, [host], [backlog], [callback])
//지정한 port와 host에서 연결을 받아들이기 시작한다.
//host를 생략하면 모든 IPv4 주소(INADDR_ANY)에서 직접 들어오는 연결을 받아들일 것이다.
server.listen(PORT, () => {
	console.log(`Server Listening: ${ADDRESS}:${PORT}`)
})

server.on('connection', (socket) => {

	let clientName = `${socket.remoteAddress}:${socket.remotePort}`
	console.log(`${clientName} connected`)

	socket.on('data', (socketData) => {
		// 클라이언트소켓에서 전송되는 데이터는 꼭 하나가 아닐 수도 있다.
		// 따라서 라인끝 딜리미터로 각각의 데이터로 분리하여야 한다.
		let dcsSocketData = socketData.toString().replace(/[\n\r]*$/, '')

		// 데이터의 끝을 알리는 '$' 문자를 기준으로 각각의 데이터로 분리한다.
		// 자연스럽게 맨 끝의 '$' 문자는 제거된다.
		let aDcsData = dcsSocketData.split('$')

		//console.log(aDcsData.length)
		aDcsData.forEach( (item,index) => {
			//변수가 존재하고 길이가 0 이상인 문자열만 처리
			if ((typeof item !== "undefined") && (item.length > 0)){
				// 각각의 DCS Data를 데이터베이스에 등록
				dcsDataInsert(item)
			}
		})

		//console.log(`data:${dcsData}`)
	})

	socket.on('end', () => {
		console.log(`${clientName} disconnectd`)
	})


	//console.log(`New Client: ${socket.remoteAddress}:${socket.remotePort}`)
	//socket.destroy();
})

console.log(`Server started at: ${ADDRESS}:${PORT}`)

function dcsDataInsert( sDcsData ) {
	//console.log(`index/data : [${index}][${item}]:${typeof item}`)
	console.log(`index/data : [${sDcsData}`)
}
