$(function(){
	$('.a-back').on('click',function(){//点击返回
		$('#iframe',parent.document).attr('src','template/policing-manage/polic-RTmonitoring.html')
	})
	var thisSrc = $('#iframe',parent.document).attr('src');
	thisCardno = thisSrc.substring(thisSrc.indexOf('=')+1,thisSrc.length)//获取警员警号
	console.log(thisCardno);
	getPoliceInfo(thisCardno,serverIP2);
	$('#tracksdetail').attr('src',serverIP2+"/escopeweb/content/cn/wifi/tracksdetail.html?type=1&cardno="+thisCardno+"&stime=1480510800")//原始ip:http://police.sibat.cn
	function getPoliceInfo(cardno,serverIP){//获取警员信息函数 cardno为警员警号
		$.ajax({//获取警员基本信息
			type:"get",
			url: serverIP+"/escopeweb/count/cntservice!getPoliceInfo.action",//原始ip：http://police.sibat.cn
			async:true,
			dataType: 'json',
			data: {
	            cardno: cardno,//警号
	        },
			success:function(res){
				var avatar = res.data.avatar.split('.')[0]+'.jpg';
				$('.polic_img').find('img').attr("src",serverIP+"/escopeweb"+avatar)//原始ip：http://police.sibat.cn
				$('.polic_name').text(res.data.realname);
				$('.user-name').text(res.data.realname);
				$('.polic_number').text(res.data.cardno);
				$('.polic_type').text(res.data.usertypename);
				$('.polic_unit').text(res.data.depname);
				var htmlStr="";
				if(res.data.bids){
                    var bids = res.data.bids.split(',');
                    for(var i=0;i<bids.length;i++){
                        htmlStr+="<button>"+bids[i]+"</button>";
                    }
				}else{
                    htmlStr = '暂无'
				}
                $('.bids').html(htmlStr);
                var telephone=res.data.telephone.substring(0,3)+"-"+res.data.telephone.substring(3,7)+"-"+res.data.telephone.substring(7,11)
				$('.polic_tel').text(telephone);
			},
			error: function () {
	            console.log('获取警员信息失败...');
	        }
		});
	}
	getPoliceStationTracks(thisCardno,serverIP2)
	function getPoliceStationTracks(cardno,serverIP){//获取警员值班打卡情况    cardno为警员警号
		var checkin=0;//打卡次数
		var xunchaTime=0;//巡查时间
		var xiuxiTime=0;//休息时间
		var Data={}//轨迹散点图数据对象
		$.ajax({//获取警员值班情况统计
			type:"get",
			url: serverIP+"/escopeweb/count/cntservice!getPoliceStationTracks.action",//原始ip：http://police.sibat.cn
			async:true,
			dataType: 'json',
			data: {
	            cardno: cardno,//警号
	            timespan: 1440//1440小时，刚好一天
	       },
			success:function(res){
				console.log(res);
				Data.site=[];
				if(res.data.length!=0){//存在值班数据
					for(var m=0;m<res.data.length;m++){
						//Data.site.push(res.data[m].bidname);
						var bidtimelist= res.data[m].bidtimelist;
						checkin += parseInt(res.data[m].checkin);//打卡次数
						for(var i=0;i<bidtimelist.length;i++){
							if(bidtimelist[i].staytype=="0"){// 巡查时间对象
								xunchaTime += Math.round((bidtimelist[i].etime-bidtimelist[i].stime)/60);//巡查时间   单位：min
								var startTime=new Date(bidtimelist[i].stime*1000);
								var stime = startTime.getHours()*60*60+startTime.getMinutes()*60+startTime.getSeconds();
								var sLeft = (stime/86400)*100
								var endTime=new Date(bidtimelist[i].etime*1000);
                                var etime = endTime.getHours()*60*60+endTime.getMinutes()*60+endTime.getSeconds()

								if( (endTime-startTime)<86400000 && (startTime.getDate() === endTime.getDate())){//同一天
									var swidth = ((etime-stime)/86400)*100;
									var $xuncha = $("<div style=\"width:"+swidth+"%;height:100%;position:absolute;left:"+sLeft+"%;top:0;background-color: #6DBBEC;\"></div>");
									$xuncha.appendTo($(".time-bar"))
								}else{
									var swidth = ((86400-stime)/86400)*100;
									var $xuncha = $("<div style=\"width:"+swidth+"%;height:100%;position:absolute;left:"+sLeft+"%;top:0;background-color: #6DBBEC;\"></div>");
									$xuncha.appendTo($(".time-bar"))
									swidth = (etime/86400)*100;
									sLeft = 0;
									$xuncha = $("<div style=\"width:"+swidth+"%;height:100%;position:absolute;left:"+sLeft+"%;top:0;background-color: #6DBBEC;\"></div>");
									$xuncha.appendTo($(".time-bar"))
								}
							}else if(bidtimelist[i].staytype=="1"){//休息时间对象
								xiuxiTime += Math.round((bidtimelist[i].etime-bidtimelist[i].stime)/60);//休息时间   单位：min
								var startTime=new Date(bidtimelist[i].stime*1000);
								var stime = startTime.getHours()*60*60+startTime.getMinutes()*60+startTime.getSeconds();
								var sLeft = (stime/86400)*100
								var endTime=new Date(bidtimelist[i].etime*1000);
								var etime = endTime.getHours()*60*60+endTime.getMinutes()*60+endTime.getSeconds()
								var swidth = ((etime-stime)/86400)*100;
								var $xiuxi = $("<div style=\"width:"+swidth+"%;height:100%;position:absolute;left:"+sLeft+"%;top:0;background-color: #92D051;\"></div>");
								$xiuxi.appendTo($(".time-bar"))
							}
						}
					}
					$(".xuncha-time").text(xunchaTime);
					$(".xiuxi-time").text(xiuxiTime);
					$(".checkin").text(checkin);
					Data.hours = ['06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00' ];
					Data.site = ['长岭陂', '深圳北站', '白石龙',
					        '民乐'];
						Data.data1 = [[0,0,0],[0,1,4],[0,2,0],[0,3,0],[0,4,0],[0,5,0],[0,6,0],
								[1,0,0],[1,1,0],[1,2,4],[1,3,4],[1,4,0],[1,5,4],[1,6,0],
								[2,0,0],[2,1,0],[2,2,0],[2,3,0],[2,4,4],[2,5,0],[2,6,0],
								[3,0,0],[3,1,0],[3,2,0],[3,3,0],[3,4,0],[3,5,0],[3,6,0]];
					Data.data2 = [[0,0,0],[0,1,0],[0,2,0],[0,3,0],[0,4,0],[0,5,0],[0,6,4],
								[1,0,0],[1,1,0],[1,2,0],[1,3,0],[1,4,0],[1,5,0],[1,6,0],
								[2,0,0],[2,1,0],[2,2,0],[2,3,0],[2,4,0],[2,5,0],[2,6,0],
								[3,0,0],[3,1,0],[3,2,0],[3,3,0],[3,4,0],[3,5,0],[3,6,0]];
					//[y,x,大小]
				}else{//不存在值班数据，创建一个没有值班的空的轨迹地图,Data.data1位值班数据，Data.data2位休息数据
					Data.hours = ['06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00' ];
					Data.site = ['长岭陂', '深圳北站', '白石龙',
					        '民乐'];
					Data.data1 = [[0,0,0],[0,1,4],[0,2,0],[0,3,0],[0,4,0],[0,5,0],[0,6,0],
								[1,0,0],[1,1,0],[1,2,4],[1,3,4],[1,4,0],[1,5,4],[1,6,0],
								[2,0,0],[2,1,0],[2,2,0],[2,3,0],[2,4,4],[2,5,0],[2,6,0],
								[3,0,0],[3,1,0],[3,2,0],[3,3,0],[3,4,0],[3,5,0],[3,6,0]];
					Data.data2 = [[0,0,0],[0,1,0],[0,2,0],[0,3,0],[0,4,0],[0,5,0],[0,6,4],
								[1,0,0],[1,1,0],[1,2,0],[1,3,0],[1,4,0],[1,5,0],[1,6,0],
								[2,0,0],[2,1,0],[2,2,0],[2,3,0],[2,4,0],[2,5,0],[2,6,0],
								[3,0,0],[3,1,0],[3,2,0],[3,3,0],[3,4,0],[3,5,0],[3,6,0]];
				}
				category("trajectoryChart",Data)
			},
			error: function () {
	            console.log('获取警员值班数据失败...');
	        }
		});
	}
	function category(id, data){//绘制轨迹地图散点图表
		$("#" + id).empty();
		var myChart = echarts.init(document.getElementById(id));
		var hours = data.hours;
		var site = data.site;
		var data1 = data.data1;
		data1 = data1.map(function (item) {
		    return [item[1], item[0], item[2]];
		});
		var data2 = data.data2;
		data2 = data2.map(function (item) {
		    return [item[1], item[0], item[2]];
		});
		option = {
		    tooltip: {
		        position: 'top',
		        formatter: function (params) {
		            return '' + hours[params.value[0]] + '在' + site[params.value[1]];
		        }
		    },
		    grid: {
		    	top:20,
		        left: 10,
		        bottom: 10,
		        right: 30,
		        containLabel: true
		    },
		    xAxis: {
		        type: 'category',
		        data: hours,
		        boundaryGap: false,
		        axisTick: {
		            show: false
		        },
		        splitLine: {
		            show: true,
		            lineStyle: {
		                color: '#ccc',
		                type: 'dashed'
		            }
		        },
		        axisLine: {
		            show: true,
		            lineStyle: {
		                color: '#ccc'
		            }
		        }
		    },
		    yAxis: {
		        type: 'category',
		        data: site,
		        splitLine: {
		            show: false
		        },
		        axisTick: {
		            show: false
		        },
		        axisLine: {
		            show: true,
		            lineStyle: {
		                color: '#ccc'
		            }
				}
		    },
		    series: [{
		        name: '巡查',
		        type: 'scatter',
		        symbolSize: function (val) {
		            return val[2] * 4.2;
		        },
		        data: data1,
		        animationDelay: function (idx) {
		            return idx * 5;
		        },
		        itemStyle: {
		            normal: {
		                shadowBlur: 10,
		                shadowColor: 'rgba(25, 100, 150, 0.5)',
		                shadowOffsetY: 5,
		                color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
		                    offset: 0,
		                    color: 'rgb(129, 227, 238)'
		                }, {
		                    offset: 1,
		                    color: 'rgb(255, 255, 255)'
		                }])
		            }
		        }
		    },{
		        name: '休息',
		        type: 'scatter',
		        symbolSize: function (val) {
		            return val[2] * 4.2;
		        },
		        data: data2,
		        animationDelay: function (idx) {
		            return idx * 5;
		        },
		        itemStyle: {
		            normal: {
		                shadowBlur: 10,
		                shadowColor: 'rgba(25, 100, 150, 0.5)',
		                shadowOffsetY: 5,
		                color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
		                    offset: 0,
		                    color: '#9bd461'
		                }, {
		                    offset: 1,
		                    color: '#fff'
		                }])
		            }
		        }
		    }]
		};
		myChart.setOption(option);
	}
})