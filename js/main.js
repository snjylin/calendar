$(function(){
	var data_attrs = data.attrs,
		data_year = data.year,
		data_month = data.month,
		data_day = data.day,
		data_week = data.week,
		data_days = data.days;

	function setHtml(tplTag,tplAttrs,tplOpts){
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
	$('.canlender-year select').html(yearOption);
	$('.canlender-month select').html(monthOption);
	$('.canlender-day select').html(dayOption);
	$('.canlender-week').html(weekItem);
	// $('.canlender-days').html(dayItem);

	function add0(m){return m < 10 ? '0' + m : m; }
	//时间戳转化成时间格式
	function timeFormat(timestamp){
		//timestamp是整数，否则要parseInt转换,不会出现少个0的情况
		var date = new Date(timestamp);
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var seconds = date.getSeconds();
		// return year + '/' + add0(month) + '/' + add0(day) + ' ' + add0(hours) + ':' + add0(minutes) + ':' + add0(seconds);
		return [year,add0(month),add0(day)].join('/') + ' ' + [add0(hours),add0(minutes),add0(seconds)].join(':');
	}

	// 设置日期时间返回时间
	function setTime($year, $month, $day){
		var date = new Date();
		if( !$year && !$month && !$day ){
			return date;
		}else{
			$year = parseInt($year) || date.getFullYear();
			$month = (parseInt($month) - 1) || date.getMonth();
			$day = parseInt($day) || date.getDate();
		}
		timestamp = date.setFullYear($year);
		date = new Date(timestamp);
		timestamp = date.setMonth($month);
		date = new Date(timestamp);
		timestamp = date.setDate($day);
		date = new Date(timestamp);
		return date;
	}

	setInterval(function(){
		var timestamp = new Date().getTime();
		$('.timenow').html( timeFormat(timestamp) );
	});

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
	function selectWeek($year,$month,$day){
		var date = setTime( $year, $month, $day );
		var weekday = date.getDay();
		weekday = weekday ? weekday : 7;
		$('.canlender-week .item').eq(weekday - 1).addClass('selected').siblings().removeClass('selected');
	}
	// 当月1号不为周一时补全从周一开始的部分
	function calcCompleteWeek($year,$month,$day){
		$('.canlender-days').find('.disabled').remove();
		var date = setTime( $year, $month, 1 );
		var week = new Date(date).getDay();
		week = week ? week : 7;
		var html = '<div class="item disabled"></div>';
		var htmlforward = '';
		for( var i = 0; i < week - 1; i++ ){
			htmlforward += html;
		}
		$('.canlender-days').prepend(htmlforward);

		var len = $('.canlender-days .item').length;
		var htmlbackward = '';
		if(len % 7 !== 0){
			for( var i = 0; i < 7 - len % 7; i++ ){
				htmlbackward += html;
			}
			$('.canlender-days').append(htmlbackward);
		}
		if(len / 7 < 5){
			$('.canlender-days .item').css({'height':'60px'});
		}else{
			$('.canlender-days .item').css({'height':'50px'});
		}

	}
	function today(){
		var date = new Date();
		var $year = date.getFullYear();
		var $month = date.getMonth() + 1;
		var $day = date.getDate();
		judgeMonthAndSetDayItem($year, $month, $day);
	}
	today();
	$('.back-to-today').click(function(){
		today();
	});
	// 判断月份确定该月天数并设置内容
	function judgeMonthAndSetDayItem($year, $month, $day){
		var data_days_copy = null;
		if( $month == 2 ){
			if(($year % 400 == 0) || ($year % 4 == 0) && ($year % 100 != 0)){
				data_days_copy = data_days.slice(0, 29);
			}else{
				data_days_copy = data_days.slice(0, 28);
			}
		}else if( $month == 1 || $month == 3 || $month == 5 || $month == 7 || $month == 8 || $month == 10 || $month == 12 ){
			data_days_copy = data_days.concat();
		}else{
			data_days_copy = data_days.slice(0, 30);
		}
		var dayItem = setHtml('div',data_attrs,data_days_copy);
		$('.canlender-days').html(dayItem);

		selectItem('.canlender-year option', $year);
		selectItem('.canlender-month option', $month);
		selectItem('.canlender-day option', $day);
		selectItem('.canlender-days .item', $day);
		selectWeek($year, $month, $day);
		calcCompleteWeek($year, $month, $day);
	}
	$('.canlender-year select').on('change',function(){
		var $value = $(this).val();
		var $month = $('.canlender-month select').val();
		var $day = $('.canlender-day select').val();

		judgeMonthAndSetDayItem($value, $month, $day);
	});
	$('.canlender-month select').on('change',function(){
		var $value = $(this).val();
		var $year = $('.canlender-year select').val();
		var $day = $('.canlender-day select').val();

		judgeMonthAndSetDayItem($year, $value, $day);
	});
	$('.canlender-day select').on('change',function(){
		var $value = $(this).val();
		var $month = $('.canlender-month select').val();
		var $year = $('.canlender-year select').val();

		judgeMonthAndSetDayItem($year, $month, $value);
	});
	// $('.canlender-days .item').on('click',function(){ 
	// 这样写会有问题，只能点击一次，再次点击就没有反应了，因为绑定的对象改变了，可以改成下面这种
	$('.canlender-days').on('click','.item',function(){
		var $value = $(this).data('value');
		var $month = $('.canlender-month select').val();
		var $year = $('.canlender-year select').val();

		judgeMonthAndSetDayItem($year, $month, $value);
	});
}(data));