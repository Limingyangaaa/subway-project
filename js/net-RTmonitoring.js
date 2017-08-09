$(function(){
	var myDate = new Date()
	var years = myDate.getFullYear()
	var month = timeFormat(myDate.getMonth()+1)
	var day = timeFormat(myDate.getDate())
	function timeFormat(time){//格式化时间
		return time<10?("0"+time):time
	}
	var nowDate = years + '-' + month + '-' + day   //当前年月日 格式为2017-05-17

    var subway;
    window.onload = function () {
        subway = new SubwaySVG(document.getElementById("subwayMap"), {'flowModel': true});
        showMapTargetTips(subway);
    };
    window.showStationDetail = function(stationId,stationName) {
        window.top.stationMonitor = {
            stationId: stationId,
            stationName: stationName
        };
        $('#iframe',parent.document).attr('src','template/traffic-monitoring/site-monitoring.html')
    };

    window.showPersonDetail = function(info) {
        var userInfo=JSON.parse(info);
        $('#iframe',parent.document).attr('src','template/important-person/key-personnelDetails.html?bid='+userInfo.bid+'&personId='+userInfo.cardno);
    };
	
	getWarningList(serverIP1,'2017-05-12')//时间暂时固定   若要修改当前时间直接使用nowDate
	function getWarningList(serverIP,date){//获取重点人员预警列表函数
		$.ajax({
			type:"get",
			url: serverIP+'/police/api/suspect/warning_person',//http://192.168.40.99:8997/api/suspect/warning_person
			async:true,
			dataType: 'json',
			data:{
	            date: date,//时间   格式为2017-05-17
	        },
			success:function(res){
				console.log(res, 'dfasf');
				var length=res.data.length;
				var htmlstr="<tr><th>序号</th><th>姓名</th><th>预警时间<img src=\"../../img/image 45.png\"></th><th>人员类型<img src=\"../../img/image 45.png\"></th><th>预警类型<img src=\"../../img/image 45.png\"></th></tr>"
				var index=0;
				for(var i=0;i<length;i++){
					index=i+1;
					index=index>9?index:'0'+index;
					var time = dateTransform(res.data[i].person_path.create_DATE)
					if(res.data[i].state=="普通关注"){
						htmlstr+="<tr class='tableTr'><td>"+index+"</td><td>"+res.data[i].person_path.name+"</td><td>"+time+"</td><td>"+res.data[i].type+"</td><td class=\"aType\">A普通关注</td><td class='stationTd' style=\"display:none\">"+res.data[i].person_path.gxpcs+"</td><td class=\"personId\" style=\"display:none\">"+res.data[i].person_path.id+"</td></tr>"
					}else if(res.data[i].state=="积极关注"){
						htmlstr+="<tr class='tableTr'><td>"+index+"</td><td>"+res.data[i].person_path.name+"</td><td>"+time+"</td><td>"+res.data[i].type+"</td><td class=\"bType\">B积极关注</td><td class='stationTd' style=\"display:none\">"+res.data[i].person_path.gxpcs+"</td><td class=\"personId\" style=\"display:none\">"+res.data[i].person_path.id+"</td></tr>"
					}else if(res.data[i].state=="重点关注"){
						htmlstr+="<tr class='tableTr'><td>"+index+"</td><td>"+res.data[i].person_path.name+"</td><td>"+time+"</td><td>"+res.data[i].type+"</td><td class=\"cType\">C重点关注</td><td class='stationTd' style=\"display:none\">"+res.data[i].person_path.gxpcs+"</td><td class=\"personId\" style=\"display:none\">"+res.data[i].person_path.id+"</td></tr>"
					}else if(res.data[i].state=="立即处理"){
						htmlstr+="<tr class='tableTr'><td>"+index+"</td><td>"+res.data[i].person_path.name+"</td><td>"+time+"</td><td>"+res.data[i].type+"</td><td class=\"dType\">D立即处理</td><td class='stationTd' style=\"display:none\">"+res.data[i].person_path.gxpcs+"</td><td class=\"personId\" style=\"display:none\">"+res.data[i].person_path.id+"</td></tr>"
					}else{
						htmlstr+="<tr class='tableTr'><td>"+index+"</td><td>"+res.data[i].person_path.name+"</td><td>"+time+"</td><td>-</td><td>-</td><td class='stationTd' style=\"display:none\">"+res.data[i].person_path.gxpcs+"</td><td class=\"personId\" style=\"display:none\">"+res.data[i].person_path.id+"</td></tr>"
					}
				}
				$('.warningList').find('table').append(htmlstr)
        $('.tableTr').click(function(){
          console.log($(this).find('.stationTd').text())
          $('#iframe', parent.document).attr('src', 'template/important-person/key-personnelDetails.html?bid='+$(this).find('.stationTd').text()+'&personId='+$(this).find('.personId').text())

        })
			},
			error: function () {
	            console.log('获取重点人员预警列表失败...');
	        }
		});
	}

    //毫秒差转化为yy-mm-dd hh:m:s
    function dateTransform(time){
        var newTime = new Date(time);
        var year = newTime.getFullYear();
        var month = newTime.getMonth() + 1;
        var date = newTime.getDate()<10?'0'+newTime.getDate():newTime.getDate();
        var hours = newTime.getHours()<10?'0'+newTime.getHours():newTime.getHours();
        var minutes = newTime.getMinutes()<10?'0'+newTime.getMinutes():newTime.getMinutes();
        var seconds = newTime.getSeconds()<10?'0'+newTime.getSeconds():newTime.getSeconds();
        return year+'-'+month+'-'+date+' '+hours+':'+minutes+':'+seconds
    }

	getwaringCount(serverIP1,'2017-05-12')//时间暂时固定   若要修改当前时间直接使用nowDate
	function getwaringCount(serverIP,date){//获取重点人员预警统计函数
		$.ajax({
			type:"get",
			url: serverIP+'/police/api/suspect/group_by_police',//http://192.168.40.99:8997/api/suspect/group_by_police
			async:true,
			dataType: 'json',
			data:{
	            date: date,//时间   格式为2017-05-17
	        },
			success:function(res){
				console.log(res);
				var length=res.data.length;
				var chartData={x:[],y:[],mark:[]}
				for(var i=0;i<length;i++){
					chartData.x.push(res.data[i].value)
					chartData.y.push(res.data[i].key)
				}
				crew_chart('crew_chart',chartData)
			},
			error: function () {
	            console.log('获取重点人员预警统计失败...');
	        }
		});
	}
	getwaringType(serverIP1,'2017-05-12')//时间暂时固定   若要修改当前时间直接使用nowDate
	function getwaringType(serverIP,date){//获取预警类型统计函数
		$.ajax({
			type:"get",
			url: serverIP+'/police/api/suspect/group_by_type',//http://192.168.40.99:8997/api/suspect/group_by_type
			async:true,
			dataType: 'json',
			data:{
	            date: date,//时间   格式为2017-05-17
	        },
			success:function(res){
				console.log(res);
				var count = res.data.common + res.data.positive + res.data.emphasis + res.data.immediate_disposal + res.data.other;
				type_AWidth = (res.data.common/count)*100;
				type_BWidth = (res.data.positive/count)*100;
				type_CWidth = (res.data.emphasis/count)*100;
				type_DWidth = (res.data.immediate_disposal/count)*100;
				type_EWidth = (res.data.other/count)*100;
				$('.type_A').css('width',type_AWidth+'%')
				$('.type_B').css('width',type_BWidth+'%')
				$('.type_C').css('width',type_CWidth+'%')
				$('.type_D').css('width',type_DWidth+'%')
				$('.type_E').css('width',type_EWidth+'%')
				$('.span-anum').text(parseInt(type_AWidth))
				$('.span-bnum').text(parseInt(type_BWidth))
				$('.span-cnum').text(parseInt(type_CWidth))
				$('.span-dnum').text(parseInt(type_DWidth))
				$('.span-enum').text(parseInt(type_EWidth))
			},
			error: function () {
	            console.log('获取预警类型统计失败...');
	        }
		});
	}
//	var chartData = {
//		x:[5.80, 5.70, 6.30, 8.0, 10.0, 10.20, 5.80, 5.50, 7.20, 8.70, 9.20],
//		y:['福永所','福田枢纽所','龙华所','东站所','罗湖所','龙岗所','北站所','宝安所','福田所','南山所','分局'],
//		mark:[{name : '北站所', value : '北站所：5.8万人', xAxis: 5.8, yAxis: 6}]
//	}
	function crew_chart(id,data){
		$("#" + id).empty();
		var myChart = echarts.init(document.getElementById(id));
		option = {
		    tooltip: {
		        trigger: 'axis',
		        axisPointer: {
		            type: 'shadow'
		        },
		        formatter: "{a} <br/>{b} : {c}人"
		    },
		    grid: {
		    	top: 0,
		        left: '3%',
		        right: '10%',
		        bottom: '3%',
		        containLabel: true
		    },
		    xAxis: {
		        type: 'value',
		        name: '人',
		        boundaryGap: [0, 0.01],
		        axisTick: {
	                show: false
	            }, 
	            splitLine: {
	                show: false
	            },
	           	axisLine: {
		        	show: false,
	                lineStyle: {
	                    color: '#333'
	                }
	            },
	            splitLine: {
	                lineStyle: {
	                    type: 'dashed',
	                    color: '#ccc'
	
	                }
	            }
		    },
		    color:['#6dbbec'],
		    yAxis: {
		        type: 'category',
		        data: data.y,
		        axisTick: {
	                show: false
	            },
	            axisLine: {
                    show: false,
	                lineStyle: {
	                    color: '#333'
	                }
	            },
		    },
		    series: [{
		        name: '',
		        type: 'bar',
		        data: data.x,
		        markPoint : {
	                data : data.mark
	            }
		    }]
		};
		myChart.setOption(option);
	}
    function showMapTargetTips(subwayMap,stationId){
        var url = serverIP2 + "/escopeweb/count/cntservice!getUserbadOnline.action?timespan=" + 2;
        if(stationId)
        {
            url = url + "&bid=" + stationId
        }
        $.ajax({
            url:url,
            dataType:"json",
            success:function(data){
                var policeList = data.stationdata;
                var targetCount = 0;
                if(policeList && $.isArray(policeList))
                {
                    subwayMap.clearTips();
                    $.each(policeList,function(i,obj){
                        if(!obj)
                        {
                            return true
                        }
                        var stationId = obj.bid;
                        if(obj.data && $.isArray(obj.data))
                        {
                            var normalFocus = [];
                            var importantFocus = [];
                            $.each(obj.data,function(j,focus){
                                if(!focus)
                                {
                                    return true
                                }
                                focus.bid = stationId;
                                if(focus.level == "布控")
                                {
                                    importantFocus.push(focus);
                                }else{
                                    normalFocus.push(focus);
                                }
                                targetCount++;
                            });
                            if(normalFocus.length)
                            {
                                subwayMap.createNormalFocusTips(stationId,normalFocus)
                            }
                            if(importantFocus.length)
                            {
                                subwayMap.createImportantFocusTips(stationId,importantFocus)
                            }
                        }
                    });
                }
            }
        });
    }
})
