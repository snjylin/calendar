var data = {};
function createData(start,end,fn){
	var arr = [];
	for(i = start;i<end;i++){
		arr.push(fn(i));
	}
	return arr;
}
data.attrs = {
	class: 'item enabled'
};
data.year = createData(1900,2050,function(i){
	return {value: i,text: i + '年'};
});
data.month = createData(1,12,function(i){
	return {value: i,text: i + '月'};
});
data.day = createData(1,31,function(i){
	return {value: i,text: i + '日'};
});
data.days = createData(1,31,function(i){
	return {'data-value': i, text: i};
});
data.week = [
	{'data-value': 1,text: '星期一<br>Mon.'},
	{'data-value': 2,text: '星期二<br>Tues.'},
	{'data-value': 3,text: '星期三<br>Wed.'},
	{'data-value': 4,text: '星期四<br>Thur.'},
	{'data-value': 5,text: '星期五<br>Fri.'},
	{'data-value': 6,text: '星期六<br>Sat.'},
	{'data-value': 7,text: '星期日<br>Sun.'}
];