let zf = require('zero-fill')

dcsDataJson = {
	"dcs_server_ip":"",
	"dcs_server_port":"",
	"dcs_fact_cd":"",
	"dcs_data_mch_dt":"",
	"dcs_data_mch_cd":"",
	"dcs_data_val":"",
	"dcs_data_stt":"",
	"dcs_data":{},
	"dcs_data_vals":{},
	"dcs_data_stts":{},
	"dcs_data_info":{}
}

// VAL_01 ~ VAL_40
for (let element_cnt = 1; element_cnt <= 40; element_cnt++) {
	dcsDataJson.dcs_data_vals["VAL_"+zf(2,element_cnt)] = null
}

// STT_01 ~ STT_20
for (let element_cnt = 1; element_cnt <= 20; element_cnt++) {
	dcsDataJson.dcs_data_stts["STT_"+zf(2,element_cnt)] = null
}

/*//////////
// json 데이터를 출력할 수 있는 기본적인 방법
var myJson = {'key':'value', 'key2':'value2'};
for(var myKey in myJson) {
	console.log("key:"+myKey+", value:"+myJson[myKey]);
}
//*//////////

/*//////////
 DCS 클라이언트 장비에서는 각 설비별 데이터를 DCS서버로 설비별 port를 이용하여 전송

 Data 구조:
 일자 : 19자리
 설비코드 : 4자리
 전송값 : 최대40개 => '+'구분자 포함 10자리
 상태정보 : 최대 20개 => 1자리씩 구분자 없이 전송
 끝문자 : '$'

 일자(19)설비코드(4)측정값(10:가변'+000000.00')(상태정보:가변)$

 측정값은 최대 40개 이며 '+' 기호를 구분자로 가진다.
 상태정보는 최대 20개며 1자리씩 구분자 없이 전송된다.
 상태정보는 전송된 순서대로 필드에 저장되지 않으며 12 이런 데이터가 전송되어도 저장될 때는 3번째와 4번째 저장될 수 있다.

 sample : '2018-03-27 17:55:07CC07+000034.13+000030.00+000030.00+000030.00+000030.00+000399.00+000399.00+000000.00+000000.00+000000.00+000000.00+000000.00+000000.00+000000.00+000000.00+000152.00+000000.00+000000.00+000000.0005$'

//*////////

//dcsDataJson.dcs_data_info = aMchDataInfo
dcsDataJson.dcs_data_info = {
	// 가공 설비별 데이터 구조
	"PL60_CC07":{"val_cnt":19, "stt_pos":[0,1,1]},
	"PL60_LE01":{"val_cnt":10, "stt_pos":[1,1]},
	// 압연 설비별 데이터 구조
	"PL50_CC07":{"val_cnt":19, "stt_pos":[1,1]},
	"PL50_LE01":{"val_cnt":10, "stt_pos":[0,1,1]}
}

module.exports = dcsDataJson

if (require.main === module ) {
	//console.log(('0000'+20).slice(-4))
	console.log(dcsDataJson)
}

