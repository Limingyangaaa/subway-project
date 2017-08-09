$(function(){
	getTime()//获取当前时间
	setInterval(getTime,1000)
	function getTime(){
		var myDate = new Date()
		var years = myDate.getFullYear()
		var month = timeFormat(myDate.getMonth()+1)
		var day = timeFormat(myDate.getDate())
		var week = weekFormat(myDate.getDay());
		var hours = timeFormat(myDate.getHours())
		var minutes = timeFormat(myDate.getMinutes())
		var seconds = timeFormat(myDate.getSeconds())
		$(".time1").find(".years").text(years)
		$(".time1").find(".month").text(month)
		$(".time1").find(".day").text(day)
		$(".time1").find(".week").text(week)
		$(".time2").find(".hour").text(hours)
		$(".time2").find(".minute").text(minutes)
		$(".time2").find(".second").text(seconds)
	}
	function timeFormat(time){//格式化时间
		return time<10?("0"+time):time
	}
	function weekFormat(week){//格式化星期
		switch (week){
			case 0: return "星期日"
				break;
			case 1: return "星期一"
				break;
			case 2: return "星期二"
				break;
			case 3: return "星期三"
				break;
			case 4: return "星期四"
				break;
			case 5: return "星期五"
				break;
			case 6: return "星期六"
				break;
			default:
				break;
		}
	}
	$(".left-nav").on("mouseleave",function(){//菜单展开
		$(this).stop().animate({width:"80px"})
	})
	$('.left-nav').on('mouseenter',function(){//菜单关闭
		$(this).stop().animate({width:"235px"})
	})
	$('.conspan').on('click', function(event){//点击一级菜单
		thisRotate = $(this).find('.drop-img').find('img').css('transform')
		$('.drop-img').find('img').css('transform','rotate(0deg)')
		if(thisRotate=='matrix(-1, 1.22465e-16, -1.22465e-16, -1, 0, 0)'){
			$(this).find('.drop-img').find('img').css('transform','rotate(0deg)')
		}else{
			$(this).find('.drop-img').find('img').css('transform','rotate(180deg)')
		}
		event.preventDefault();
		$(this).toggleClass('submenu-open').next('.dropDown-menu').slideToggle(200).end().parent('.dropdown').siblings('.dropdown').children('.conspan').removeClass('submenu-open').next('.dropDown-menu').slideUp(200);
	});
	$('.dropDown-menu').find('li').on('click',function(){//点击二级菜单
		$('.conspan').attr('isdisable','')
		$(this).parent('.dropDown-menu').siblings('.conspan').attr('isdisable','disable')
		for(var i=1;i<6;i++){
			$(".conspan").eq(i-1).find('img').eq(0).attr('src','img/icon'+i+'.png')
		}
		$(".conspan").css({'color':'#ccc','background-color':'#fff'})
		$(this).parent('.dropDown-menu').siblings('.conspan').css({'color':'#2e61bc','background-color':'#eff0f5'}).attr('isdisable','disable').find('img').eq(0).attr('src','img/icon'+$(this).parent('.dropDown-menu').siblings('.conspan').find('img').eq(0).attr('index')+'_active.png')
		$(this).css({'color':'#2e61bc','background-color':'#eff0f5'})
		$('.dropDown-menu').find('li').css('background-color','#fff').removeClass('active').find('a').css('color','#ccc')
		$(this).addClass('active').css('background-color','#eff0f5').find('a').css('color','#2e61bc')
	})
	$('.m-hover').hover(function(){//鼠标滑动效果
		var disable=$(this).attr('isdisable')
		var thisClass = $(this).attr('class')
		if(!((thisClass.indexOf('active')!=-1)||(disable=='disable'))){
			$(this).css({'color':'#2e61bc','background-color':'#eff0f5'}).find('a').css('color','#2e61bc')
		}
	},function(){
		var disable=$(this).attr('isdisable')
		var thisClass = $(this).attr('class')
		if(!((thisClass.indexOf('active')!=-1)||(disable=='disable'))){
			$(this).css({'color':'#ccc','background-color':'#fff'}).find('a').css('color','#ccc')
		}
	})
})