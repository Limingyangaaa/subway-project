//此文件为配置文件   主要是ip配置 及头部导航
//外网测试ip
//var serverIP1="http://192.168.40.99:8997"//谭冠文数据ip
//var serverIP2="http://police.sibat.cn"//汪文军数据ip
//var serverIP3="http://192.168.40.99:8080"//代浩数据ip
//var serverIP4="http://192.168.40.87:8998"//谭冠文数据ip(拥堵指数数据ip)
//公安内网ip
//var serverIP1="http://10.204.113.243:8997"//谭冠文数据ip
//var serverIP2="http://10.204.113.243:8088"//汪文军数据ip
//var serverIP3="http://10.204.113.243:8080"//代浩数据  ip
//var serverIP4="http://10.204.113.243:8998"//谭冠文数据ip(拥堵指数数据ip)
//设置默认为外网IP侧试，IP列表如下：
var serverIP1="http://192.168.40.99:8997"//谭冠文数据ip
var serverIP2="http://police.sibat.cn"//汪文军数据ip
var serverIP3="http://192.168.40.99:8080"//代浩数据ip
var serverIP4="http://192.168.40.99:8998"//谭冠文数据ip(拥堵指数数据ip)
var url = document.location.href
if(url.indexOf('http://10.204.113.243')!=-1){//当为公安内网时，公安内网测试IP列表如下：
	var serverIP1="http://10.204.113.243:8997"//谭冠文数据ip
	var serverIP2="http://10.204.113.243:8088"//汪文军数据ip
	var serverIP3="http://10.204.113.243:8080"//代浩数据ip
	var serverIP4="http://10.204.113.243:8998"//谭冠文数据ip(拥堵指数数据ip)
}
$(function(){//头部导航
	$('.top-nav').find('span').on('click',function(){
		$('.top-nav').find('span').find('a').removeClass('active')
		$(this).find('a').addClass('active')
	})
})
