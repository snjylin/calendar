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

	// 判断闰年
	function judgeLeapYear(year){
		year = parseInt(year);
		if((year % 400 == 0) || (year % 4 == 0) && (year % 100 != 0)){
			return true;
		}else{
			return false;
		}
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
		// 20世纪C值
		var arrC20 = new Array();
		// 21世纪C值
		var arrC21 = new Array(5.4055,20.12,3.87,18.73,5.63,20.646,4.81,20.1,5.52,21.04,5.678,21.37,7.108,22.83,7.5,23.13,7.646,23.042,8.318,23.438,7.438,22.36,7.18,21.94);
		// 22世纪C值
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
			// 每月有两个节气？
			var calcResult = (month == 1) && (calculate(0) || calculate(1))
				|| (month == 2) && (calculate(2) || calculate(3))
				|| (month == 3) && (calculate(4) || calculate(5))
				|| (month == 4) && (calculate(6) || calculate(7))
				|| (month == 5) && (calculate(8) || calculate(9))
				|| (month == 6) && (calculate(10) || calculate(11))
				|| (month == 7) && (calculate(12) || calculate(13))
				|| (month == 8) && (calculate(14) || calculate(15))
				|| (month == 9) && (calculate(16) || calculate(17))
				|| (month == 10) && (calculate(18) || calculate(19))
				|| (month == 11) && (calculate(20) || calculate(21))
				|| (month == 12) && (calculate(22) || calculate(23));
			return calcResult;
		}
		if(year > 1900 && year <= 2000){
			return getFormulaSolarTerm(arrC20,month);
		}else if(year > 2000 && year <= 2100){
			return getFormulaSolarTerm(arrC21,month);
		}else if(year > 2100 && year <= 2200){
			return getFormulaSolarTerm(arrC22,month);
		}
	}

	// 计算农历日期
	function getLunarDate(year, month, day){
		// 传进来的年月日可能是字符串，需要转成数字
		year = parseInt(year);
		month = parseInt(month);
		day = parseInt(day);
		var lunarMonth,lunarDay;
		$('.canlender-days .item.enabled').each(function(){
			if(day !== $(this).data('value')){
				return;
			}
			var lunarMonthArr = new Array('腊月','正月','二月','三月','四月','五月','六月','七月','八月','九月','十月','冬月');
			var lunarDayArr = new Array('初一','初二','初三','初四','初五','初六','初七','初八','初九','初十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十','廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十');
			var solarTermArr = new Array('小寒','大寒','立春','雨水','惊蛰','春分','清明','谷雨','立夏','小满','芒种','夏至','小暑','大暑','立秋','处暑','白露','秋分','寒露','霜降','立冬','小雪','大雪','冬至');
			var solarTerm = $('.canlender-days .item.enabled').find('.solar-term').eq(0).text();
			var len = solarTermArr.length;
			// 公元年数－1977（或1901）＝4Q(商)＋R(余数)
			var quotient = Math.floor((year - 1977)/4);
			var remainder = (year - 1977 ) % 4;
			var judgeLeapYear = window.ZTools.judgeLeapYear(year);
			var monthDayNum1 = new Array(31,29,31,30,31,30,31,31,30,31,30,31);
			var monthDayNum2 = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
			// 计算年内日期序数
			var dayOrdinal = (month == 1) && (31  - (monthDayNum1[month - 1] - day))
				|| (month == 2 && judgeLeapYear) && (31 + 29  - (monthDayNum1[month - 1] - day))
				|| (month == 2 && !judgeLeapYear) && (31 + 28  - (monthDayNum2[month - 1] - day))
				|| (month < 8 && judgeLeapYear) && (30 * (month - 1) + Math.ceil(month / 2) + 29 - (monthDayNum1[month - 1] - day))
				|| (month < 8 && !judgeLeapYear) && (30 * (month - 1) + Math.ceil(month / 2) + 28 - (monthDayNum2[month - 1] - day))
				|| (judgeLeapYear) && (30 * (month - 1) + Math.floor(month / 2) + 29 - (monthDayNum1[month - 1] - day))
				|| (30 * (month - 1) + Math.floor(month / 2) + 28 - (monthDayNum2[month - 1] - day));
			// 阴历日期=14Q+10.6(R+1)+年内日期序数-29.5n（注:式中Q[quotient:商]、R[remainder:余数]、n均为自然数，R<4）
			var F = (14 * quotient + 10.6 * (remainder + 1) + dayOrdinal);
			var m = (F / 29.5 < 6) && (F / 29.5 + 12) || (F / 29.5);
			var d;
			(F % 29.5 < 1) ? ((d = F % 29.5 + 29.5),(m = m - 1)) : (d = F % 29.5);
			lunarMonth = lunarMonthArr[Math.floor(m) - 6];
			lunarDay = lunarDayArr[Math.floor(d) - 1];
		});
		return lunarMonth + lunarDay;
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
	function HeavenlyStemsAndEarthlyBranchesMonthAndDay(month, day){
		month = parseInt(month);
		day = parseInt(day);
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
	tools.judgeLeapYear = judgeLeapYear;
	tools.getSolarTerms = getSolarTerms;
	tools.getLunarDate = getLunarDate;
	tools.HeavenlyStemsAndEarthlyBranchesYear = HeavenlyStemsAndEarthlyBranchesYear;
	tools.HeavenlyStemsAndEarthlyBranchesMonthAndDay = HeavenlyStemsAndEarthlyBranchesMonthAndDay;
	window.ZTools = tools;
})();