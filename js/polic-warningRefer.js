$(function(){
	$('.hover-show').on('mouseenter',function(){
		$(this).siblings('.bus-or-sub').show()
	})
	$('.bus-or-sub').on('mouseleave',function(){
		$('.bus-or-sub').hide()
	})
	var thisSrc = $('#iframe',parent.document).attr('src');
	thisType = thisSrc.substring(thisSrc.indexOf('=')+1,thisSrc.length)//获取显示的是地铁or公交   1为地铁  2为公交
	if(thisType==1){
		$('#referIframe').attr('src','http://10.42.77.245:8080//man/dtfk/jqcx?checkKey=1')
	}else if(thisType==2){
		$('#referIframe').attr('src','http://10.42.77.245:8080/man/ajzb/gjAjcx')
	}
})
