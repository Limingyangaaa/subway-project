$(function(){
	$('.clickLink').on('click',function(){//当电击网约车时，出现白块wyc-block用来遮挡头部nav不需要的部分，其他时候隐藏wyc-block
		var iframeSrc = $('#rocordIframe').attr('src')
		if(iframeSrc=='http://10.42.77.245:8080/man/gjfk/zcZtqk?falg=1'){
			$('.wyc-block').show()
		}else{
			$('.wyc-block').hide()
		}
	})
})