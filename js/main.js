$(function(){
	var data_attrs = data.attrs,
		data_year = data.year,
		data_month = data.month,
		data_day = data.day,
		data_week = data.week,
		data_days = data.days;

	function setHtml(tplTag, tplAttrs, tplOpts){
		if( !tplOpts ){ return; }
		var tpl = '';
		var tplTag;
		var	tplAttr = '';
		tplTag = tplTag || 'div';
		if( tplAttrs ){
			for( var i in tplAttrs ){
				tplAttr += ' ' + i + '="' + tplAttrs[i] + '"';
			}
		}

		var len = tplOpts.length;
		if( !len ) { return; }
		for( var i = 0; i < len; i++ ){
			var attrs,text;
			for( var j in tplOpts[i] ){
				if ( j === 'text' ){
					text = tplOpts[i][j];
				}else{
					attrs = ' ' + j + '="' + tplOpts[i][j] + '"';
				}
			}
			attrs += attrs;
			tpl += '\n\t<' + tplTag + tplAttr + attrs + '>' + text + '</' + tplTag + '>';
		}
		return tpl;
	}

	var yearOption = setHtml('option',null,data_year);
	var monthOption = setHtml('option',null,data_month);
	var dayOption = setHtml('option',null,data_day);
	var weekItem = setHtml('div',data_attrs,data_week);
	// var dayItem = setHtml('div',data_attrs,data_days);
	$('.calendar-year select').html(yearOption);
	$('.calendar-month select').html(monthOption);
	$('.calendar-day select').html(dayOption);
	$('.calendar-week').html(weekItem);
	// $('.calendar-days').html(dayItem);

	function add0(m){return m < 10 ? '0' + m : m; }
	//时间戳转化成时间格式
	function timeFormat(timestamp){
		//timestamp是整数，否则要parseInt转换,不会出现少个0的情况
		var date = new Date(timestamp);
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		// var hours = date.getHours();
		// var minutes = date.getMinutes();
		// var seconds = date.getSeconds();
		var week = date.getDay();
		week = (week == 1 && (week = '一')) || (week == 2 && (week = '二')) || (week == 3 && (week = '三')) || (week == 4 && (week = '四')) || (week == 5 && (week = '五')) || (week == 6 && (week = '六')) || (week == 0 && (week = '日'));
		// return year + '/' + add0(month) + '/' + add0(day) + ' ' + add0(hours) + ':' + add0(minutes) + ':' + add0(seconds);
		return [year,add0(month),add0(day)].join('/') + ' 星期' + week;
	}
	
	// // 当前时间
	// setInterval(function(){
	// 	var date = new Date();
	// 	$('.timenow').html([add0(date.getHours()),add0(date.getMinutes()),add0(date.getSeconds())].join(':'));
	// });

	function displayDate(){
		var year = $('.calendar-year select').val();
		var month = $('.calendar-month select').val();
		var day = $('.calendar-day select').val();
		var timestamp = window.Tools.setDateTime(year, month, day);
		$('.calendar-right-date').html( timeFormat(timestamp) );
		$('.calendar-right-day').html(new Date(timestamp).getDate());
	}

	// 给当前选中元素添加selected类或selected属性
	function selectItem(selector, data){
		$(selector).each(function(){
			var $this = $(this);
			var $value = $this.data('value') || $this.attr('value') || $this.val();
			if( $value == data ){
				if( $this[0].tagName.toLowerCase() !== 'option' ){
					$this.addClass('selected').siblings().removeClass('selected');
				}else{
					$this.attr('selected','selected').siblings().removeAttr('selected');
				}
			}
		});
	}
	// 选中当前选中日期对应的星期
	function selectWeek(year, month, day){
		var date = window.Tools.setDateTime( year, month, day );
		var weekday = date.getDay();
		weekday = weekday ? weekday : 7;
		$('.calendar-week .item').eq(weekday - 1).addClass('selected').siblings().removeClass('selected');
	}
	// 当月1号不为周一时补全从周一开始的部分，当月最后一天不为周日补全到周日结束的部分，用于占位
	function calcCompleteWeek(year, month, day){
		$('.calendar-days').find('.disabled').remove();
		var date = window.Tools.setDateTime( year, month, 1 );
		var week = new Date(date).getDay();
		week = week ? week : 7;
		var html = '<div class="item disabled"></div>';
		var htmlforward = '';
		for( var i = 0; i < week - 1; i++ ){
			htmlforward += html;
		}
		$('.calendar-days').prepend(htmlforward);

		var len = $('.calendar-days .item').length;
		var htmlbackward = '';
		if(len % 7 !== 0){
			for( var i = 0; i < 7 - len % 7; i++ ){
				htmlbackward += html;
			}
			$('.calendar-days').append(htmlbackward);
		}
		// 根据行数确定单元格高度(亦即行高)
		if(len / 7 == 4){
			$('.calendar-days .item').css({'height':'75px'});
		}else if(len / 7 > 5){
			$('.calendar-days .item').css({'height':'50px'});
		}else{
			$('.calendar-days .item').css({'height':'60px'});
		}
	}
	// 添加节气、农历、节日到对应的日期
	function addSolarTermAndLunarDateAndFestival(year, month){
		// 传进来的年月可能是字符串，需要转成数字
		year = parseInt(year);
		month = parseInt(month);
		$('.calendar-days .item.enabled').each(function(){
			var $this = $(this);
			var day = $this.data('value');
			var solarTerm = window.Tools.getSolarTerms(year, month, day);
			var lunarDay = window.Tools.getLunarDate(year, month, day).slice(2);
			var festival = window.Tools.getFestival(year, month, day);
			var festivalText,lunerFestival,festivalTitleText;
			if(lunarDay){
				$this.append('<p class="item-lunar-date">' + lunarDay + '</p>');
			}
			if(solarTerm){
				$this.append('<p class="item-solar-term">' + solarTerm + '</p>');
				$this.find('.item-lunar-date').remove();
			}
			if(festival){
				festivalText = festival.split(' ')[0];
				lunerFestival = festival.split(' ')[1];
				if(festivalText == 'undefined' && lunerFestival == 'undefined'){
					return;
				}else if(festivalText !== 'undefined' && lunerFestival == 'undefined'){
					festivalTitleText = festivalText;
				}else if(festivalText !== 'undefined' && lunerFestival !== 'undefined'){
					festivalTitleText = festivalText + ' ' + lunerFestival;
				}else{
					festivalText = lunerFestival;
					festivalTitleText = lunerFestival;
				}
				$this.append('<p class="item-festival" title="' + festivalTitleText + '">' + festivalText + '</p>');
				$this.find('.item-lunar-date').remove();
				$this.find('.item-solar-term').remove();
			}
		});
	}
	// 通过月份判断该月天数并设置内容
	function judgeMonthAndSetDayItem(year, month, day){
		// 传进来的年月日可能是字符串，需要转成数字
		year = parseInt(year);
		month = parseInt(month);
		day = parseInt(day);
		var data_days_copy = null;
		var leapYear = window.Tools.judgeLeapYear(year);
		var daysNum;
		// 判断该月天数
		if( month == 2 ){
			//判断闰年
			if(leapYear){
				data_days_copy = data_days.slice(0, 29);	// 闰年
				daysNum = 29;
			}else{
				data_days_copy = data_days.slice(0, 28);	// 平年
				daysNum = 28;
			}
		}else if( month == 4 || month == 6 || month == 9 || month == 11 ){
			data_days_copy = data_days.slice(0, 30);
			daysNum = 30;
		}else{
			data_days_copy = data_days.concat();
			daysNum = 31;
		}
		var dayItem = setHtml('div',data_attrs,data_days_copy);
		$('.calendar-days').html(dayItem);

		// 需要先setHtml设置完内容再做其他操作
		addSolarTermAndLunarDateAndFestival(year, month);

		selectItem('.calendar-year option', year);
		selectItem('.calendar-month option', month);
		selectItem('.calendar-day option', day);
		selectItem('.calendar-days .item', day);
		// selectWeek(year, month, day);
		calcCompleteWeek(year, month, day);
		displayDate();
		$('.today-lunar-date').html(window.Tools.getLunarDate(year, month, day));
		if(window.Tools.getSolarTerms(year, month, day)){
			$('.today-lunar-date').append(' ' + window.Tools.getSolarTerms(year, month, day));
		}
		$('.today-lunar-year').html(window.Tools.heavenlyStemsAndEarthlyBranchesYear(year));
		var calcMonth = window.Tools.heavenlyStemsAndEarthlyBranchesMonth(year, month, day);
		var calcDay = window.Tools.heavenlyStemsAndEarthlyBranchesDay(year, month, day);
		$('.today-lunar-md').html(calcMonth + ' ' + calcDay);
	}
	// 事件选择器
	function eventFilter(selector, event, value, childrenSelector){
		$(selector).on(event,childrenSelector,function(){
			var year = (value == 'year') ? $(this).val() : $('.calendar-year select').val();
			var month = (value == 'month') ? $(this).val() : $('.calendar-month select').val();
			var day = (value == 'day') ? ($(this).val() || $(this).data('value')) : $('.calendar-day select').val();
			judgeMonthAndSetDayItem(year, month, day);
		});
	}
	eventFilter('.calendar-year select','change','year');
	eventFilter('.calendar-month select','change','month');
	eventFilter('.calendar-day select','change','day');
	// 因为绑定的对象改变了,所以选择器不能直接写成'.calendar-days .item',
	// 需要写成'.calendar-days',重新绑定'.item.enabled'
	eventFilter('.calendar-days','click','day','.item.enabled');

	// 第一次加载时需要根据当前日期设置
	function today(){
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		judgeMonthAndSetDayItem(year, month, day);
	}
	today();
	$('.back-to-today').click(function(){
		today();
	});
}(data));