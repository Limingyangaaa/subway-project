
$(function(){

	$('.input-group .input-group-btn .dropdown-menu li').click(function(){
		$(this).parent().siblings('input').val($(this).text());
	})

		showChart('2016-01-03','2017-05-01','xj','南山公交派出所','ajlx')
	
	$("#checkBtn").click(function(){
	 
	var checkTime=$('.inputGroup2 .search-box').text();
	var timeAttr=(checkTime.split('--'));
	var start=$.trim(timeAttr[0]);
	var end=$.trim(timeAttr[1]);
	var type=$('.inputGroup3 input').val();
	var police=$('.inputGroup6 input').val();
	var dimension=$('.inputGroup7 input').val();
	switch(type){
		case '强戒人员':type='qj'
					break;
		case '刑拘人员':type='xj'
					break;
		case '行拘人员':type='xz'
					break;
		case '逮捕人员':type='cb'
					break;
	}
	switch(dimension){
		case '办案单位':dimension='police'
					break;
		case '处罚类型':dimension='punish'
					break;
		case '案件类型':dimension='ajlx'
					break;
		case '案件性质':dimension='ajxz'
					break;
		case '户籍':dimension='hj'
					break;
		case '性别':dimension='sex'
					break;
		case '年龄':dimension='age'
					break;
	}
	showChart(start,end,type,police,dimension)
	console.log(start,end,type,police,dimension)
	})

	function showChart(start,end,type,police,dimension){
		$.ajax({
		type:'get',
		dataType:'json',
		data:{
			start:start,
			end:end,
			type:type,
			police:police,
			dimension:dimension
		},
		url:serverIP1+'/police/api/suspect/dispose_suspect',
		success:function(res){
			console.log(res)
			console.log(res.data)
			var data=res.data;
			var XX=[];
			var YY=[];
			for(var key in data)
			{
				XX.push(key);
				YY.push(data[key]);
			}
			var chartData={};
			chartData.x=XX;
			chartData.y=YY;
			console.log(chartData)
			$('.chartBox,.chart-page').empty();
			$('.chartBox').append('<div class="chartBoxL chart-page" id="chartBoxL"></div><div class="chartBoxR chart-page" id="chartBoxR"></div>');
			switch(dimension)
			{
				case 'police':break;
				case 'punish':
							chartData.z='嫌疑人处罚类型分析';
							barChart('chartBox',chartData);
							break;
				case 'hj': case'ajlx':chartData.z='';
							$('.chart-page').show();
							$('.chartBoxL').empty();
							barChart('chartBoxR',chartData);
							var content="";
							content+='<table class="table table-hover table-responsive">'+
										'<thead>'+
											'<tr>'+
												'<th>排名</th>'+
												'<th>案件类型</th>'+
												'<th>人数</th>'+
											'</tr>'+
										'</thead><tbody>';
							var i=0;
							for(var k in data)
							{
								i++
							}
							var length=i;
							for(var j=0;j<length;j++)
							{
								if(j<10)var Num='0'+j;
								content+='<tr>'+
											'<td>'+Num+'</td>'+
											'<td>'+chartData.x[j]+'</td>'+
											'<td>'+chartData.y[j]+'</td>'+
										  '</tr>'
								
							}
							content+='</tbody></table>';
							$('.chartBoxL').append(content);
							break;
				case 'ajxz':$('.chart-page').show();
							$('.chartBoxL').empty();
							var content="";
							content+='<table class="table table-hover table-responsive">'+
										'<thead>'+
											'<tr>'+
												'<th>排名</th>'+
												'<th>案件类型</th>'+
												'<th>人数</th>'+
											'</tr>'+
										'</thead><tbody>';
							var i=0;
							for(var k in data)
							{
								i++
							}
							var length=i;
							for(var j=0;j<length;j++)
							{
								if(j<10)var Num='0'+j;
								content+='<tr>'+
											'<td>'+Num+'</td>'+
											'<td>'+chartData.x[j]+'</td>'+
											'<td>'+chartData.y[j]+'</td>'+
										  '</tr>'
								
							}
							content+='</tbody></table>';
							$('.chartBoxL').append(content);
							var XZcontent={},XScontent={};
							for(var key in data)
							{
								if(key=="吸毒"||"猥亵"||"盗窃"||"寻衅滋事"||"殴打他人"||"猥亵他人"||"猥亵她人"||"买卖身份证件"||"使用伪造证件"||"扰乱公共秩序"||"故意伤害他人身体"||"非法持有人民警察警用标志"||"非法携带管制器具"||"使用伪造居民身份证"||"使用伪造的居民身份证"||"非法持有人民警察警用标志")
								{
									XZcontent[key]=data[key]
								}
								else if(key=="抢劫"||"扒窃"||"盗窃"||"贩卖毒品"||"贩毒、制毒"||"买卖身份证件"||"买卖国家机关证件"||"非法持有伪造的发票")
								{
									XScontent[key]=data[key]
								}

							}

							console.log('xz',XZcontent)
							console.log('xs',XScontent)

							var AA=[],BB=[],XZdata={},XSdata={};
							for(var key in XZcontent)
							{
								AA.push(key);
								BB.push(XZcontent[key]);
							}
							XZdata.x=AA;
							XZdata.y=BB;
							var CC=[],DD=[];
							for(var key in XScontent)
							{
								CC.push(key);
								DD.push(XScontent[key]);
							}
							XSdata.x=CC;
							XSdata.y=DD;
							if(XZdata!=null){
								barChart('chartBoxR',XZdata)
							}
							else{
								barChart('chartBoxR',XSdata)
							}
							break;

				case 'sex':
				var pieData={
						z:'嫌疑人性别分析',
						color:['rgba(64,149,230,1)','rgba(224,94,81,1)'],
						legendData:['男性','女性'],
						name:'性别分析',
						data:[
					            {value:chartData.y[0], name:'男性'},
					            {value:chartData.y[1], name:'女性'}
					        ]
						}
						pieChart('chartBox',pieData)
						break;
				case 'age':
					var pieData={
						z:'嫌疑人年龄分析',
						color:['rgba(64,149,230,1)','rgba(224,94,81,1)','pink','yellow'],
						legendData:['<17岁','18-40岁','41-65岁','18-40岁'],
						name:'年龄分析',
						data:[
					            {value:chartData.y[0], name:'<17岁'},
					            {value:chartData.y[1], name:'18-40岁'},
					            {value:chartData.y[2], name:'41-65岁'},
					            {value:chartData.y[3], name:'18-40岁'}
					        ]
						}
						pieChart('chartBox',pieData)
						break;
	
			}

		}
	})
	}
		



})



function barChart(id,data){
		$("#" + id).empty();
		var myChart = echarts.init(document.getElementById(id));
		option = {
		    color: ['#3398DB'],
		    tooltip : {
		        trigger: 'axis',
		        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
		            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'|'cross'
		        }
		    },
		    grid: {
		        left: '10%',
		        right: '10%',
		        top: '10%',
		        containLabel: true
		    },
		    yAxis : [
		        {
		            type : 'category',
		            data : data.x,
		            axisTick: {
		                alignWithLabel: true
		            },
		             axisTick: {
		                show: false
		            },
		            axisLine: {
		                lineStyle: {
		                    color: '#ccc'
		                }
		            },
		            splitLine: {
		                lineStyle: {
		                    type: 'dashed',
		                    color: '#ccc'
		
		                }
		            },
		            axisLabel:{
		            	textStyle:{
		            		fontSize:20,
		            		color:'rgba(145,145,145,1)'
		            	}
		            }
		        }
		    ],
		    xAxis : [
		        {
		        	name :'件',
		        	
		            type : 'value',
		             axisLabel:{
		            	textStyle:{
		            		fontSize:20,
		            		color:'rgba(145,145,145,1)'
		            	}
		            },
		            axisTick: {
		                show: false
		            }, 
		            splitLine: {
		                show: false
		            },
		            axisLine: {
		                lineStyle: {
		                    color: '#ccc'
		                }
		            }
		           
		        }
		    ],
		    series : [
		        {
		            name:'警情数',
		            type:'bar',
		            barWidth: '33%',
		            data: data.y
		        }
		    ]
		};
		myChart.setOption(option);
	}


function pieChart(id,data){
		$("#" + id).empty();
		var myChart = echarts.init(document.getElementById(id));
		option = {
				title: {
		        text: data.z,
		        x:'center',
		        y:'top',
		        textStyle: {color:'#388cfe',fontSize:30},

		    },

			    tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)"
			    },
			    legend: {
			        orient : 'vertical',
			        x : 'left',
			        data:data.legendData,
			        textStyle:{
			        	fontSize:20
			        }
			    },
			    
			    calculable : false,
			    color:data.color,
			    series : [
			        {
			            name:'访问来源',
			            type:'pie',
			            radius : ['50%', '70%'],
			            itemStyle : {
			                normal : {
			                    label : {
			                        show : false
			                    },
			                    labelLine : {
			                        show : false
			                    }
			                },
			                emphasis : {
			                    label : {
			                        show : false,
			                        position : 'center',
			                        textStyle : {
			                            fontSize : '30',
			                            fontWeight : 'bold'
			                        }
			                    }
			                }
			            },
			            data:data.data
			        }
			    ]
			};
		myChart.setOption(option);
	}