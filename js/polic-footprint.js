$(function(){
    $('.a-back').on('click',function(){//点击返回
        $('#iframe',parent.document).attr('src','template/policing-manage/polic-policeList.html')
    });
    var thisSrc = $('#iframe',parent.document).attr('src');
    thisCardno = thisSrc.substring(thisSrc.indexOf('=')+1,thisSrc.length)//获取警员警号

    $.ajax({
        type:"get",
        url:serverIP2+"/escopeweb/count/cntservice!getPoliceInfo.action",//原始ip：http://police.sibat.cn
        async:true,
        dataType: 'json',
        data: {
            cardno: thisCardno,
            stime: '1479139200'
        },
        success:function(res){
        	console.log(res);
            var depname = res.data.depname ? res.data.depname : '暂无'; //所属单位
            var realname = res.data.realname ? res.data.realname : '暂无'; //名字
            var cardno = res.data.cardno ? res.data.cardno : '暂无'; //编号
            var telephone = res.data.telephone; //电话
            if(telephone){
                telephone = telephone.substring(0,3)+"-"+telephone.substring(3,7)+"-"+telephone.substring(7,11)
            }else{
                telephone = "暂无";
            }
            var usertype = res.data.usertype ;//类型
            if(usertype){
                if(usertype === "1"){
                    usertype = "警员"
                }else if(usertype === "2"){
                    usertype = "辅警"
                }else {
                    usertype = "暂无"
                }
            }else{
                usertype = "暂无"
            }
            var avatar = res.data.avatar.split('.')[0]+'.jpg';
            $('.polic_img').find('img').attr("src",serverIP2+"/escopeweb"+avatar)//原始ip：http://police.sibat.cn
            $('.polic_name').text(realname);
            $('.polic_number').text(cardno);
            $('.polic_type').text(usertype);
            $('.polic_unit').text(depname);
            $('.polic_tel').text(telephone);
        }
    });

    var L_calendarDay=$("#L_calendarDay");
    var L_TheYear=new Date().getFullYear();//定义年的变量的初始值
    var L_TheMonth=new Date().getMonth()+1;//定义月的变量的初始值
    $('#L_calendarYears').text(L_TheYear);
    $('#L_calendarMonth').text(L_TheMonth);
    loadCalendar(thisCardno,L_TheYear,L_TheMonth);

    function loadCalendar(no,sYear,sMonth){
		var date = sMonth<10?(sYear+ '-0'+sMonth):(sYear+'-'+sMonth);
        $.ajax({
            type:'get',
            url: serverIP1+'/police/api/police/police_real_duty',
            async:true,
            dataType: 'json',
            data: {
                policeman_id: no,
                date: date   //格式 '2016-11'
            },
            success:function(res){
                var workCount = res.data.workcount?res.data.workcount:0; //已经工作的天数
                var setWorkCount = res.data.setworkcount?res.data.setworkcount:0; // 排班天数
                var workTimeCount = res.data.worktimecount?parseInt((res.data.worktimecount)/3600):0; //巡查时间
                var workList = res.data.worklist;  //巡查日历
                var dutyCalendar = res.data.dutyCalendar; //排版日历
                $('.xuncha-time').text(setWorkCount);
                $('.xiuxi-time').text(workCount);
                $('.checkin').text(workTimeCount);
                CreateHTML(sYear,sMonth,workList,dutyCalendar);
            }
        });
	}



	function compareDate(year,month,day){ //判断时间是今天之前
		var nowDate = new Date().getTime();
		var time = year+'/'+month+'/'+day+' 00:00:00';
		time = (new Date(time)).getTime();
		if(nowDate>time){
			return true
		}else{
			return false
		}
    }

	function CreateHTML(L_TheYear,L_TheMonth,workList,planList){//创建日历 给日历的日期设置class="selectD"  目标日被标记
		MonHead=[31,28,31,30,31,30,31,31,30,31,30,31];//定义阳历中每个月的最大天数
		if(0==L_TheYear%4&&((L_TheYear%100!=0)||(L_TheYear%400==0))){
			MonHead=[31,29,31,30,31,30,31,31,30,31,30,31]
		}
		var L_Firstday=new Date(L_TheYear,L_TheMonth-1,1).getDay();//获取本月第一天星期几
		if(L_Firstday === 0){
			L_Firstday = 7;
		}
		var htmlstr="<ul>\r\n";
		for(var i=1;i<L_Firstday;i++){
			if((L_TheMonth-2) ===-1){
                var sday=MonHead[11]-L_Firstday+i+1;
                htmlstr+="<li style='color:#ccc'>"+sday+"</li>\r\n";
			}else{
                sday=MonHead[L_TheMonth-2]-L_Firstday+i+1;
                htmlstr+="<li style='color:#ccc'>"+sday+"</li>\r\n";
			}
		}
		for(var i=0;i<MonHead[L_TheMonth-1];i++){
			var day=1+i;
            var months = parseInt(L_TheMonth)<10?('0'+L_TheMonth):L_TheMonth
            var days = parseInt(day)<10?('0'+day):day;
			var key = L_TheYear+'-'+months+'-'+days;
			if(compareDate(L_TheYear,months,days)){//判断时间是今天之前
				if(workList === undefined){
                    htmlstr+="<li class='selectDay'>"+day+"</li>\r\n";
                    continue
				}else{
                    switch (workList[key])
                    {
                        case undefined :
                        {
                            break
                        }
                        case 0:
                        {
                            htmlstr+="<li class='selectDay'><span style='background: #81C8F2'>"+day+"</span></li>\r\n";
                            continue
                        }
                        case 1:
                        {
                            htmlstr+="<li class='selectDay'><span style='background: #C0CACC'>"+day+"</span></li>\r\n";
                            continue
                        }
                        case 2:
                        {
                            htmlstr+="<li class='selectDay'><span class='blackAndWhite'>"+day+"</span></li>\r\n";
                            continue
                        }
                    }
				}
			}else{
				if(planList === undefined){
                    htmlstr+="<li class='selectDay'>"+day+"</li>\r\n";
                    continue
				}else{
                    switch (planList[key])
                    {
                        case undefined :
                        {
                            break
                        }
                        case 0:
                        {
                            htmlstr+="<li class='selectDay'><span style='background: #81C8F2'>"+day+"</span></li>\r\n";
                            continue
                        }
                        case 1:
                        {
                            htmlstr+="<li class='selectDay'><span style='background: #C0CACC'>"+day+"</span></li>\r\n";
                            continue
                        }
                        case 2:
                        {
                            htmlstr+="<li class='selectDay'><span class='blackAndWhite'>"+day+"</span></li>\r\n";
                            continue
                        }
                    }
				}
			}
			htmlstr+="<li class='selectDay'>"+day+"</li>\r\n";
		}
		for(var i=0;i<43-(MonHead[L_TheMonth-1]+L_Firstday);i++){
			var eday = 1+i;
			htmlstr+="<li style='color:#ccc'>"+eday+"</li>\r\n";
		}
		htmlstr+="</ul>";
        L_calendarDay.html(htmlstr);
	}

	$('#nextMonth').on("click",function(){
		L_TheMonth++;
		if(L_TheMonth>12){
        L_TheYear++;
        L_TheMonth=1;
		}
		$('#L_calendarYears').text(L_TheYear);
		$('#L_calendarMonth').text(L_TheMonth);
        loadCalendar(thisCardno,L_TheYear,L_TheMonth)
	})
	$('#beforeMonth').on("click",function(){
		L_TheMonth--;
		if(L_TheMonth<1){
			L_TheYear--;
			L_TheMonth=12;
		}
		$('#L_calendarYears').text(L_TheYear);
		$('#L_calendarMonth').text(L_TheMonth);
        loadCalendar(thisCardno,L_TheYear,L_TheMonth)
	})
	$('.click-topnav').on('click',function(){
		$('.click-topnav').removeClass('active');
		$(this).addClass('active');
		var navType = $(this).find('a').text();
		if(navType=="足印档案"){
			console.log("已进入足印档案");
		}else if(navType=="综合排名"){
			console.log("已进入综合排名");
		}
	})
})