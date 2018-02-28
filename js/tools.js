/**
 * 工具
 */
(function(){
	// 设置日期时间返回时间
	function setDateTime(year, month, day){
		var date = new Date();
		if( !year && !month && !day ){
			return date;
		}else{
			// 传进来的年月日可能是字符串，需要转成数字
			year = parseInt(year) || date.getFullYear();
			month = (parseInt(month) - 1) || date.getMonth();
			day = parseInt(day) || date.getDate();
		}
		timestamp = date.setFullYear(year);
		date = new Date(timestamp);
		timestamp = date.setMonth(month);
		date = new Date(timestamp);
		timestamp = date.setDate(day);
		date = new Date(timestamp);
		return date;
	}

	// 计算节气
	function getSolarTerms(year, month, day){
		// 传进来的年月日可能是字符串，需要转成数字
		year = parseInt(year) || new Date().getFullYear();
		month = parseInt(month);
		day = parseInt(day);
		var Y = year.toString().slice(2);
		var D = 0.2422;
		var C;
		var L = Math.ceil(Y / 4);

		var arrC20 = new Array();
		var arrC21 = new Array(5.4055,20.12,3.87,18.73,5.63,20.646,4.81,20.1,5.52,21.04,5.678,21.37,7.108,22.83,7.5,23.13,7.646,23.042,8.318,23.438,7.438,22.36,7.18,21.94);
		var arrC22 = new Array();
		function getFormulaSolarTerm(arrC,month){
			var solarTermArr = new Array('小寒','大寒','立春','雨水','惊蛰','春分','清明','谷雨','立夏','小满','芒种','夏至','小暑','大暑','立秋','处暑','白露','秋分','寒露','霜降','立冬','小雪','大雪','冬至');
			var solarTermDay;
			var solarTerm = '';
			function calculate(num){
				solarTermDay = Math.ceil(Y * D + arrC[num]) - L;
				if(day !== solarTermDay){
					return;
				}else{
					solarTerm = solarTermArr[num];
				}
				return solarTerm;
			}
			switch(month){
				case 1:
					return calculate(0) || calculate(1);
					break;
				case 2:
					return calculate(2) || calculate(3);
					break;
				case 3:
					return calculate(4) || calculate(5);
					break;
				case 4:
					return calculate(6) || calculate(7);
					break;
				case 5:
					return calculate(8) || calculate(9);
					break;
				case 6:
					return calculate(10) || calculate(11);
					break;
				case 7:
					return calculate(12) || calculate(13);
					break;
				case 8:
					return calculate(14) || calculate(15);
					break;
				case 9:
					return calculate(16) || calculate(17);
					break;
				case 10:
					return calculate(18) || calculate(19);
					break;
				case 11:
					return calculate(20) || calculate(21);
					break;
				case 12:
					return calculate(22) || calculate(23);
					break;
			}
		}
		if(year > 1900 && year <= 2000){
			return getFormulaSolarTerm(arrC20,month);
		}else if(year > 2000 && year <= 2100){
			return getFormulaSolarTerm(arrC21,month);
		}else if(year > 2100 && year <= 2200){
			return getFormulaSolarTerm(arrC22,month);
		}
	}

	// 干支纪年
	function HeavenlyStemsAndEarthlyBranchesYear(year){
		// 传进来的年可能是字符串，需要转成数字
		year = parseInt(year);
		// 甲->己->庚->癸编号 4->10->0->3 取余对应的编号即为对应的天干
		var heavenlyStems = new Array('甲','乙','丙','丁','戊','己','庚','辛','壬','癸');
		// 子->未->申->亥编号 4->12->0->3 取余对应的编号即为对应的地支
		var earthlyBranches = new Array('子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥');
		var chineseZodiac = new Array('鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪');
		var num1 = (year + 6) % 10;
		var num2 = (year + 8) % 12;
		return heavenlyStems[num1] + earthlyBranches[num2] + '年 【' + chineseZodiac[num2] + '年】';
	}
	// 干支纪月 干支纪日
	function HeavenlyStemsAndEarthlyBranchesMonthAndDay(month){
		month = parseInt(month);
		// 甲->己->庚->癸编号 4->10->0->3 取余对应的编号即为对应的天干
		var heavenlyStems = new Array('甲','乙','丙','丁','戊','己','庚','辛','壬','癸');
		// 子->未->申->亥编号 4->12->0->3 取余对应的编号即为对应的地支
		var earthlyBranches = new Array('子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥');
		var num1 = (month + 6) % 10;
		var num2 = (month + 8) % 12;
		return heavenlyStems[num1] + earthlyBranches[num2] + '月 ' + heavenlyStems[num1] + earthlyBranches[num2] + '日';
	}

	var tools = {};
	tools.setDateTime = setDateTime;
	tools.getSolarTerms = getSolarTerms;
	tools.HeavenlyStemsAndEarthlyBranchesYear = HeavenlyStemsAndEarthlyBranchesYear;
	tools.HeavenlyStemsAndEarthlyBranchesMonthAndDay = HeavenlyStemsAndEarthlyBranchesMonthAndDay;
	window.ZTools = tools;
})();