$(function(){
    var policName=$('#selectVal').val();
    loadTable(policName,'2017-05-01');//进入加载表格
	$('.polic-menu').find('li').on('click',function(){//选择派出所加载表格并且显示对应的派出所管辖地图
		var policName=$(this).find('a').text();
        var dateTime=$('#inputGroup2 #datetime').text();
        $(this).parent().parent('.dropdown').siblings('#selectVal').val(policName);
        loadTable(policName,dateTime);
		var policImgSrc = $(this).attr('index');
		$('.admin-map').attr('src',"../../image/"+policImgSrc+".png");

	});

	$('#inputGroup2').click(function(){//选择日期加载表格
		var dateTime=$('#inputGroup2 #datetime').text();
		var policName=$('#selectVal').val();
		var inputTime=setInterval(function(){
            var time=$('#inputGroup2 #datetime').text();
            if(!(time==dateTime))
            {
                $('.li-table-list').empty();
                loadTable(policName,time);
                clearInterval(inputTime);
            }
        },500)
	})

    $('.wacthList').on('click','span',function(){//点击名字跳转到详情页
        var policeId = $(this).attr('id');
        $('#iframe', parent.document).attr('src','template/policing-manage/polic-footprint.html?cardno='+policeId)
    })

    function loadTable(policName,time){
        var police_id;
        switch(policName)
        {
            case '布吉公交派出所'				:police_id=440396650000
                break;
            case '罗湖公交派出所'				:police_id=440396540000
                break;
            case '龙华公交派出所'				:police_id=440396630000
                break;
            case '宝安公交派出所'				:police_id=440396570000
                break;
            case '南山公交派出所'				:police_id=440396550000
                break;
            case '福田公交派出所'				:police_id=440396530000
                break;
            case '龙岗公交派出所'				:police_id=440396580000
                break;
            case '香蜜湖公交派出所'			:police_id=440396610000
                break;
            case '坪山公交派出所'				:police_id=440396600000
                break;
            case '东站公交派出所'				:police_id=440396660000
                break;
            case '北站公交派出所'				:police_id=440396640000
                break;
            case '福永公交派出所'				:police_id=440396620000
                break;
            case '福田枢纽公交派出所'			:police_id=440396710000
                break;
            case '光明公交派出所'				:police_id=440396590000
                break;
            case '盐田公交派出所'				:police_id=440396560000
                break;
        }
        $('.wacthList').empty();
        $.ajax({
            type:'get',
            typeData:'json',
            url:serverIP1+'/police/api/police/duty',
            data:{
                date:time,
                police:police_id
            },
            success:function(res) {
                var chartData = [];
                var data = res.data;
                var tableContent='';
                if (data.length != 0) {
                    //比较周一至周日数据数组长度，取最长的为表格头部
                    for(var m=1,max=data[0].detail;m<data.length;m++){
                        if(data[m].detail.length>max.length)
                        {
                            max = data[m].detail
                        }
                    }
                    var detail=max;
                    var startTime = res.data[0].date.replace(/-/g,".");
                    var endTime = res.data[6].date.replace(/-/g,".");
                    tableContent += '<p>'+policName+'值班安排表（'+startTime+'-'+endTime+'）</p>';
                    tableContent+='<table border="0" cellspacing="0" cellpadding="0" class="li-table-list">'+
                        '<tr>'+
                        '<th>时间</th>'+
                        '<th>值班领导<br/>主班/副班</th>'+
                        '<th>所值班民警</th><th>站区班次</th>'
                    var stationArr=[];
                    var stationList=[];
                    var stationTotal={};
                    for(var i=0;i<detail.length;i++)
                    {
                        stationArr.push(detail[i].station)
                        stationList.push(detail[i].eve)
                        tableContent+='<th>'+detail[i].station+'</th>'
                    }
                    stationTotal.x=stationArr;
                    stationTotal.y=stationList;
                    var stationIndex=[];
                    var index;

                    for(var f=0;f<stationTotal.y.length;f++)
                    {
                        index=0
                        var stationLength=0;
                        stationIndex=stationTotal.y[f].split('')
                        for(var k =0;k<stationIndex.length;k++)
                        {
                            if(stationIndex[k]=='，')
                            {
                                index++;
                            }

                            stationTotal.y[f]=index+1
                        }

                    }
                    tableContent+='</tr>'

                    for(var j=0;j<data.length;j++)
                    {
                        if(data[j].leader==null)
                        {
                            data[j].leader='--';
                        }
                        if(data[j].duty==null)
                        {
                            data[j].duty='--';
                        }
                        tableContent+='<tr>'+
                            '<td class="td_time" rowspan="2">'+data[j].date+'<br/>'+data[j].time+'</td>'+
                            '<td rowspan="2">'+data[j].leader+'</td>'+
                            '<td class="td_A1" rowspan="2">'+data[j].duty+'</td>'+
                            '<td><i><img src="../../img/image 30.png"/></i>早班</td>'

                        //遍历表头获取地铁站，遍历每日获取地铁站对比排除地铁站为空
                        for(var n=0;n<max.length;n++){
                            var isEmpty=true;
                            for(var k=0;k<data[j].detail.length;k++){
                                var nameList=[]; var html='';
                                if(max[n].station == data[j].detail[k].station){
                                    if(data[j].detail[k].eve==null)
                                    {
                                        data[j].detail[k].eve='--';
                                    }
                                    nameList = data[j].detail[k].eve;
                                    idList = data[j].detail[k].eveId;
                                    if((nameList.indexOf('，')) !==-1 ){
                                        nameList = nameList.split('，');
                                        idList = idList.split('，');
                                        for(var p=0;p<nameList.length;p++){
                                            if(p === nameList.length-1){
                                                html += '<span id="'+ idList[p] +'">'+ nameList[p] +'</span>'
                                            }else{
                                                html += '<span id="'+ idList[p] +'">'+ nameList[p] +'，</span>'
                                            }
                                        }
                                    }else{
                                        html = '<span id="'+ data[j].detail[k].eveId +'">'+ data[j].detail[k].eve +'</span>'
                                    }
                                    tableContent+='<td>'+html+'</td>'
                                    isEmpty=false;
                                    break
                                }
                            }
                            if(isEmpty){
                                tableContent+='<td>--</td>'
                            }
                        }
                        tableContent+='</tr><tr><td><i><img src="../../img/image 31.png"/>晚班</i></td>'
                        for(var n=0;n<max.length;n++){
                            var isEmpty=true;
                            for(var k=0;k<data[j].detail.length;k++){
                                var nameList=[]; var html='';
                                if(max[n].station == data[j].detail[k].station){
                                    if(data[j].detail[k].mor==null)
                                    {
                                        data[j].detail[k].mor='--';
                                    }
                                    if(data[j].detail[k].mor.indexOf('，') !== -1){
                                         nameList = data[j].detail[k].mor.split('，');
                                         idList = data[j].detail[k].morId.split('，');
                                         for(var p=0;p<nameList.length;p++){
                                             if(p === nameList.length-1){
                                                 html += '<span id="'+ idList[p] +'">'+ nameList[p] +'</span>'
                                             }else{
                                                 html += '<span id="'+ idList[p] +'">'+ nameList[p] +'，</span>'
                                             }
                                         }
                                    }else{
                                        html = '<span id="'+ data[j].detail[k].morId +'">'+ data[j].detail[k].mor +'</span>'
                                    }
                                    tableContent+='<td>'+html+'</td>';
                                    isEmpty=false;
                                    break
                                }
                            }
                            if(isEmpty){
                                tableContent+='<td>--</td>'
                            }
                        }
                        tableContent+='</tr>'
                    }
                    tableContent+='</table>'
                }else {
                    tableContent += '<p style="color:red">暂无相关记录</p>';
                }
                $('.wacthList').append(tableContent);
            }
        })
    }

	function pieChart(id,data){
		$("#" + id).empty();
		var myChart = echarts.init(document.getElementById(id));
		option = {
				

			    tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)"
			    },
			    calculable : false,
			    color:['rgba(97,169,254,1)','rgba(31,31,93,1)','rgba(254,203,0,1)','rgba(146,208,81,1)','rgba(200,56,48,1)','rgba(64,149,230,1)','rgba(224,94,81,1)','pink','yellow'],
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
})
