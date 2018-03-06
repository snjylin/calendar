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
			month = month ? (parseInt(month) - 1) : date.getMonth();
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
			var leapYear = window.ZTools.judgeLeapYear(year);
			var monthDayNum1 = new Array(31,29,31,30,31,30,31,31,30,31,30,31);
			var monthDayNum2 = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
			// 计算年内日期序数
			var dayOrdinal = (month == 1) && (31  - (monthDayNum1[month - 1] - day))
				|| (month == 2 && leapYear) && (31 + 29  - (monthDayNum1[month - 1] - day))
				|| (month == 2 && !leapYear) && (31 + 28  - (monthDayNum2[month - 1] - day))
				|| (month < 8 && leapYear) && (30 * (month - 1) + Math.ceil(month / 2) + 29 - (monthDayNum1[month - 1] - day))
				|| (month < 8 && !leapYear) && (30 * (month - 1) + Math.ceil(month / 2) + 28 - (monthDayNum2[month - 1] - day))
				|| (leapYear) && (30 * (month - 1) + Math.floor(month / 2) + 29 - (monthDayNum1[month - 1] - day))
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

	// 计算节假日
	function getFestival(year, month, day){
		// 传进来的年月日可能是字符串，需要转成数字
		year = parseInt(year);
		month = parseInt(month);
		day = parseInt(day);
		var legalHolidaysArr = new Array('元旦','国际妇女节','中国植树节','国际劳动节','中国青年节','国际护士节','国际儿童节','中国共产党诞生日','中国教师节','中华人民共和国国庆节','春节');
		var festivalArr = new Array('元旦','成人节','世界湿地日','“二.七”纪念日','情人节','第三世界青年日','国际海豹节','桃花节','全国爱耳日','风筝节','学雷锋节','青年志愿者服务日','国际妇女节','保护母亲河日','中国植树节','白色情人节','国际警察日','世界消费者权益日','爱尔兰圣帕特里克节','世界森林日','消除种族歧视日','世界睡眠日',
			'世界水日','世界气象日','世界防治结核病日','愚人节','清明节','世界卫生日','世界地球日','世界知识产权日','国际劳动节','中国青年节','国际护士节','中国运动纪念日','世界无烟日','国际儿童节','国际儿童电影节','世界环境日','中国父亲节','全国土地日','国际禁毒日','中国共产党诞生日','中国人民抗日战争纪念日','世界人口日','国际青年节','中国教师节',
			'国际臭氧层保护日','世界旅游日','中华人民共和国国庆节','世界动物日','世界教师日','啤酒节','国际盲人节','世界传统医药日','国际大学生节','世界残疾人日','全国法制宣传日','世界足球日','护士节','圣诞除夕','圣诞节','节礼日','国际生物多样性日');
		var lunarFestivalArr = new Array('除夕','春节','元宵节','侗族芦笙节','侗族芦笙节','侗族芦笙节','侗族芦笙节','侗族芦笙节','填仓节','送穷日','瑶族忌鸟节','春龙节、畲族会亲节','中和节','僳僳族刀杆节','佤族播种节','白族三月街','白族三月街','白族三月街','白族三月街','白族三月街','白族三月街','白族三月街','白族三月街','白族三月街','白族三月街','白族三月街','牛王诞','锡伯族西迁节','端午节','阿昌族泼水节','鄂温克族米阔鲁节','瑶族达努节','壮族祭田节 、瑶族尝新节','火把节','乞巧节','侗族吃新节','中元节','中秋节');
		var festivalDateArr = new Array('1月1日','1月15日','2月2日','2月7日','2月14日','2月24日','3月1日','3月3日','3月3日','3月3日','3月5日','3月5日','3月8日','3月9日','3月12日','3月14日','3月14日','3月15日','3月17日','3月21日','3月21日','3月21日','3月22日','3月23日','3月24日','4月1日','4月5日','4月7日','4月22日','4月26日',
			'5月1日','5月4日','5月12日','5月30日','5月31日','6月1日','6月1日','6月5日','6月18日','6月25日','6月26日','7月1日','7月7日','7月11日','8月12日','9月10日','9月16日','9月27日','10月1日','10月4日','10月5日','10月10日','10月15日','10月22日','11月17日','12月3日','12月4日','12月9日','12月12日','12月24日','12月25日','12月26日','12月29日');
		var lunarFestivalDateArr = new Array('腊月廿九','正月初一','正月十五','正月十六','正月十七','正月十八','正月十九','正月二十','正月廿五','正月廿九','二月初一','二月初二','二月二','二月初八','三月十五','三月十五','三月十六','三月十七','三月十八','三月十九','三月二十','三月廿一','三月廿二','三月廿三','三月廿四','三月廿五','四月初八','四月十八','五月初五','五月十三','五月廿二','五月廿九','六月初六','六月廿四','七月初七','七月十三','七月十五','八月十五');
		var date = month + '月' + day + '日';
		var lunarDate = window.ZTools.getLunarDate(year, month, day);
		var festivalDateArrLen = festivalDateArr.length;
		var lunarFestivalDateArrLen = lunarFestivalDateArr.length;
		var festival,festival1,festival2;
		for(i = 0; i < festivalDateArrLen; i++){
			if(festivalDateArr[i] == date){
				festival1 = festivalArr[i];
			}
		}
		for(i = 0; i < lunarFestivalDateArrLen; i++){
			if(lunarFestivalDateArr[i] == lunarDate){
				festival2 = lunarFestivalArr[i];
			}
		}
		// festival = (festival1 && festival2) && (festival1 + ' ' + festival2) || festival1 && festival1 || festival2 && festival2;
		festival = festival1 + ' ' + festival2;
		/**
		 * [calcFestivalArr description]
		 * 需要计算的节日
		 * 1月最后一个星期日国际麻风节
		 * 3月最后一个完整周的星期一中小学生安全教育日
		 * 3月22-4月25日间的任一天，春分月圆后的第一个星期日复活节
		 * 5月第二个星期日母亲节
		 * 6月第三个星期日父亲节
		 * 9月第三个星期二国际和平日
		 * 9月第四个星期日国际聋人节
		 */
		var calcFestivalArr = new Array('国际麻风节','中小学生安全教育日','复活节','母亲节','父亲节','国际和平日','国际聋人节');
		if(month == 1 && (31 - window.ZTools.setDateTime(year, 1, 1).getDay()) == day){
			festival = calcFestivalArr[0];
		}
		if(month == 3 && (31 - window.ZTools.setDateTime(year, 3, 31).getDay() - 6) == day){
			festival = calcFestivalArr[1];
		}
		if(month == 5 && (14 - window.ZTools.setDateTime(year, 5, 1).getDay() + 1) == day){
			festival = calcFestivalArr[4];
		}
		if(month == 6 && (21 - window.ZTools.setDateTime(year, 6, 1).getDay() + 1) == day){
			festival = calcFestivalArr[5];
		}
		if(month == 9 && (21 + 2 - window.ZTools.setDateTime(year, 9, 1).getDay() + 1) == day){
			festival = calcFestivalArr[6];
		}
		if(month == 9 && (28 - window.ZTools.setDateTime(year, 9, 1).getDay() + 1) == day){
			festival = calcFestivalArr[7];
		}
		return festival;
	}

	// 干支纪年
	function heavenlyStemsAndEarthlyBranchesYear(year){
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
	// 干支纪月
	function heavenlyStemsAndEarthlyBranchesMonth(year, month, day){
		year = parseInt(year);
		month = parseInt(month);
		day = parseInt(day);
		var lunarMonthArr = new Array('腊月','正月','二月','三月','四月','五月','六月','七月','八月','九月','十月','冬月');
		// 甲->己->庚->癸编号 4->10->0->3 取余对应的编号即为对应的天干
		var heavenlyStems = new Array('甲','乙','丙','丁','戊','己','庚','辛','壬','癸');
		// 子->未->申->亥编号 4->12->0->3 取余对应的编号即为对应的地支
		var earthlyBranches = new Array('子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥');
		// 带“寅”的干支只有五个，也就是丙寅、戊寅、庚寅、壬寅和甲寅。
		// 第一年，为甲子年，正月为丙寅，二月为丁卯……十二月为丁丑。
		// 第二年，为乙丑年，正月为戊寅，其他各月依次类推。
		// 第三年，为丙寅年，正月为庚寅，其他各月依次类推。
		// 第四年，为丁卯年，正月为壬寅，其他各月依次类推。
		// 第五年，为戊辰年，正月为甲寅，其他各月依次类推。
		// 再继续下去，到第六年，也就是己已年，正月又为丙寅，二月为丁卯……十二月为丁丑。说明这时候，月的干支又开始了新一轮的五年期的重复。
		var lunarMonth = window.ZTools.getLunarDate(year, month, day).slice(0, 2);
		var heavenlyStemsYear = window.ZTools.heavenlyStemsAndEarthlyBranchesYear(year).slice(0, 1);
		var calcMonth;
		var lunarMonthArrLen = lunarMonthArr.length;
		for(i = 0; i < lunarMonthArrLen; i++){
			if(lunarMonth === lunarMonthArr[i]){
				var num1,num2;
				if(heavenlyStemsYear === '甲' || heavenlyStemsYear === '己'){
					num1 = (i + 2) % 10;
				}else if(heavenlyStemsYear === '乙' || heavenlyStemsYear === '庚'){
					num1 = (i + 4) % 10;
				}else if(heavenlyStemsYear === '丙' || heavenlyStemsYear === '辛'){
					num1 = (i + 6) % 10;
				}else if(heavenlyStemsYear === '丁' || heavenlyStemsYear === '壬'){
					num1 = (i + 8) % 10;
				}else if(heavenlyStemsYear === '戊' || heavenlyStemsYear === '癸'){
					num1 = i % 10;
				}
				num2 = (i + 2) % 12;
				calcMonth = heavenlyStems[num1] + earthlyBranches[num2];
			}
		}
		return calcMonth + '月';
	}
	// 干支纪日
	function heavenlyStemsAndEarthlyBranchesDay(year, month, day){
		month = parseInt(month);
		day = parseInt(day);
		// 甲->己->庚->癸编号 4->10->0->3 取余对应的编号即为对应的天干
		var heavenlyStems = new Array('甲','乙','丙','丁','戊','己','庚','辛','壬','癸');
		// 子->未->申->亥编号 4->12->0->3 取余对应的编号即为对应的地支
		var earthlyBranches = new Array('子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥');
		// g=4C+[C/4]+[5y]+[y/4]+[3*(m+1)/5]+d-3
		// z=8C+[C/4]+[5y]+[y/4]+[3*(m+1)/5]+d+7+i
		// 其中c是世纪数减1.奇数月 i=0,偶数月 i=6,年份前两位,y 是年份后两位,M 是月份,d 是日数.[ ] 表示取整数.
		// 1月和 2月按上一年的 13月和 14月来算,因此C和y也要按上一年的年份来取值.
		// g 除以 10 的余数是天干,z 除以 12 的余数是地支.
		// 如果先求得了g,那么z=g+4C+10+i(奇数月i=0,偶数月i=6)
		var C = year.toString().slice(0,2);
		var y = year.toString().slice(2);
		var g,z,num1,num2;
		i = (month % 2 === 0) ? 6 : 0;

		g = 4*C + Math.floor(C/4) + Math.floor(5*y) + Math.floor(y/4) + Math.floor(3*(month+1)/5) + day - 3;
		z = g + 4*C + 10 + i;

		num1 = (g + 9) % 10;
		num2 = (z + 11) % 12;
		var calcDay = heavenlyStems[num1] + earthlyBranches[num2];
		return calcDay + '日';
	}

	var tools = {};
	tools.setDateTime = setDateTime;
	tools.judgeLeapYear = judgeLeapYear;
	tools.getSolarTerms = getSolarTerms;
	tools.getLunarDate = getLunarDate;
	tools.getFestival = getFestival;
	tools.heavenlyStemsAndEarthlyBranchesYear = heavenlyStemsAndEarthlyBranchesYear;
	tools.heavenlyStemsAndEarthlyBranchesMonth = heavenlyStemsAndEarthlyBranchesMonth;
	tools.heavenlyStemsAndEarthlyBranchesDay = heavenlyStemsAndEarthlyBranchesDay;
	window.ZTools = tools;
})();