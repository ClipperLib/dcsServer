#!/usr/bin/env node
'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////
// Module
////////////////////////////////////////////////////////////////////////////////////////////////////
let moment = require('moment')
let color = require('chalk')
let lodash = require('lodash')
let zf = require('zero-fill')
let net = require('net')

////////////////////////////////////////////////////////////////////////////////////////////////////
// 사용자 모듈
////////////////////////////////////////////////////////////////////////////////////////////////////
// Oh! My Logger
//let oml = require('./myLogger')
// Service Module
let myMssql = require('./bestPracticeMssql.js')
let dcsData = require('./dcsDataInfo.js')

const PORT = 33333
const ADDRESS = '192.168.211.111'

let clog = console.log;
let debug = true
let oml = (logData) => {
	if (debug) {
		console.log(logData)
	}
}

let server = net.createServer();

//server.listen(port, [host], [backlog], [callback])
//지정한 port와 host에서 연결을 받아들이기 시작한다.
//host를 생략하면 모든 IPv4 주소(INADDR_ANY)에서 직접 들어오는 연결을 받아들일 것이다.
//server.listen(PORT,ADDRESS, () => {
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
		aDcsData.forEach( (item, index) => {
			//변수가 존재하고 길이가 0 이상인 문자열만 처리
			if ((typeof item !== "undefined") && (item.length > 0)){
				// 각각의 DCS Data를 데이터베이스에 등록
				dcsData.dcs_data = item
				dcsData.dcs_server_ip = socket.remoteAddress
				dcsData.dcs_server_port = socket.remotePort
				if (dcsData.dcs_server_ip === '200.101.103.12') { // 압연 DCS 서버
					dcsData.dcs_fact_cd = 'PL50'
				} else if (dcsData.dcs_server_ip === '200.101.103.13') { // 가공 DCS 서버
					dcsData.dcs_fact_cd = 'PL60'
				}
				dcsData.dcs_fact_cd = 'PL60'
				dcsDataInsert(dcsData)
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

// 전송된 데이터를 파싱 및 검증하고 데이터베이스에 insert
function dcsDataInsert( poDcsData ) {

	// 설비일시와 설비코드를 추출하기 위해 토큰('+") 기준으로 배열화
	// 첫번째 배열에는 일시+설비코드가 들어있다.
	// 샘플: '2018-03-27 17:55:07CC07+000034.13+000030.00.....'
	let aDcsData = poDcsData.dcs_data.split('+')
	//oml(poDcsData.dcs_data)
	poDcsData.dcs_data_mch_dt = aDcsData[0].substr(0,19) // 일시추출
	poDcsData.dcs_data_mch_cd = aDcsData[0].substr(19,4) // 설비코드추출

	// 공장 설비별로 정의된 레이아웃 정보를 추출한다.
	let fact_mch_cd = poDcsData.dcs_fact_cd + '_' + poDcsData.dcs_data_mch_cd
	let val_cnt = poDcsData.dcs_data_info[fact_mch_cd].val_cnt // 전송되는 값의 갯수
	let stt_pos = poDcsData.dcs_data_info[fact_mch_cd].stt_pos // 전송되는 값과 위치정보 배열, 모든값은 한자리

	// 레이아웃 정보를 이용하여 각각의 데이터를 분리한다.
	// 샘플: '2018-03-27 17:55:07CC07+000034.13+000030.00.....'
	let val_start_pos = 23
	poDcsData.dcs_data_val = poDcsData.dcs_data.substr(val_start_pos,(val_cnt * 10)) // 전송된 설비 값
	poDcsData.dcs_data_stt = poDcsData.dcs_data.substr(val_start_pos+(val_cnt * 10)) // 전송된 설비 상태 값
	//oml('val:'+poDcsData.dcs_data_val)
	//oml('str:'+poDcsData.dcs_data_stt)

	// 설비 값 : poDcsData.dcs_data_val -> vals
	poDcsData.dcs_data_val.split('+').forEach( (element,element_index) => {
		if (element_index > 0) {
			poDcsData.dcs_data_vals["VAL_"+zf(2,element_index)] = element
		}else{
			// val 데이터가 + 부터 시작 하므로 0 인덱스는 버린다.
		}
	})
	//oml(poDcsData.dcs_data_vals)


	// 설비 상태 값 : poDcsData.dcs_data_stt -> stts
	let stt_offset = 0
	//oml(poDcsData.dcs_data_stt)
	stt_pos.forEach( (element,element_index) => {
		//oml(`elemet:${element}, offset:${stt_offset}`)
		poDcsData.dcs_data_stts["STT_"+zf(2,element_index+1)] = poDcsData.dcs_data_stt.substr(stt_offset,element)
		stt_offset += element
	})
	oml(poDcsData.dcs_data_stts)

	// 데이터 파싱이 완료 되었으므로 데이터베이스에 기록한다.
	let dcsMssql = require('./dcsMssql.js')
	//let dcsOracle = require('./dcsOracle.js')

	dcsMssql.dcsInsertTedious(poDcsData)
	/*////////////////////////////////////////////////////
	dcsMssql.dcsInsert(poDcsData).then( result => {
		if (result.success) {
			oml(result.success)
		} else if (result.error) {
			oml('오류')
			oml(result.error)
		} else {
			oml('예외')
			oml(result)
		}
	})
	//*////////////////////////////////////////////////////

}



















