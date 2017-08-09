$(function(){
    var subway;
    var policeList = {};
    var dept_id;
    $('.num-ul').find('li a').click(function(){
        $(this).css('color','rgba(46,96,185,1)')
        $(this).parent().siblings().find('a').css('color','#aaa')
        $(this).parent().css({'border': '1px solid rgba(46,96,185,1)', 'border-bottom': 'none', 'border-radius': '3px'})
        $(this).parent().siblings().css('border', 'none')
    })
    window.onload = function () {
        subway = new SubwaySVG(document.getElementById("subwayMap"), {'flowModel': true});
        showMapPoliceTips(subway);
    };

    window.showStationDetail = function(stationId,stationName) {
        window.top.stationMonitor = {
            stationId: stationId,
            stationName: stationName
        };
        $('#iframe',parent.document).attr('src','template/traffic-monitoring/site-monitoring.html')
    };
    window.showPersonDetail = function(userInfo) {
        var userInfo=JSON.parse(userInfo);
        console.log(userInfo)
        var carno='';
        if(userInfo.cardno){
            carno = userInfo.cardno
            $('#iframe',parent.document).attr('src','template/policing-manage/polic-information.html?cardno='+carno)
        }
        if(userInfo.polcieCode){
            carno = userInfo.polcieCode
            $('#iframe', parent.document).attr('src','template/policing-manage/polic-footprint.html?cardno='+carno)
        }

    };
    $('#layerToolControl').on('mouseenter',function(){
        $('#layerToolBody').show()
    })
    $('#layerToolBody').on('mouseleave',function(){
        $(this).hide()
    });
    $(".line-radio").change(function () {
        var type = $(this).val();
        if(type === 'online'){
            showMapPoliceTips(subway);
        }else if(type === 'work'){
            showAllDutyPolice(subway);
        }
    });



    $.ajax({//请求在线警员列表
      type:"get",
      url:serverIP2+"/escopeweb/count/cntservice!getDepartmentPoliceOnlineData.action?timespan=2",//原始ip：http://police.sibat.cn
      async:true,
      dataType: 'json',
      success:function(res){
        console.log(res, 'dfsadf')
        var data = res.stationdata;
        policeList['440396650000'] = data[0]
        console.log(policeList)
      },
      error: function(){
        console.log("请求失败")
      }
    })
    $('.police-selected li').click(function(){
    	$('.station-selected').empty();
        $(this).parent().siblings('input').val($(this).text())
        dept_id=$(this).text()
        switch(dept_id)
            {
                case '布吉公交派出所'              :dept_id=440396650000
                break;
                case '罗湖公交派出所'              :dept_id=440396540000
                break;
                case '龙华公交派出所'              :dept_id=440396630000
                break;
                case '宝安公交派出所'              :dept_id=440396570000
                break;
                case '南山公交派出所'              :dept_id=440396550000
                break;
                case '福田公交派出所'              :dept_id=440396530000
                break;
                case '龙岗公交派出所'              :dept_id=440396580000
                break;
                case '香蜜湖公交派出所'            :dept_id=440396610000
                break;
                case '坪山公交派出所'              :dept_id=440396600000
                break;
                case '东站公交派出所'              :dept_id=440396660000
                break;
                case '北站公交派出所'              :dept_id=440396640000
                break;
                case '福永公交派出所'              :dept_id=440396620000
                break;
                case '福田枢纽公交派出所'          :dept_id=440396710000
                break;
                case '光明公交派出所'              :dept_id=440396590000
                break;
                case '盐田公交派出所'              :dept_id=440396560000
                break;
                
            }

        $.ajax({
            type:'get',
            async:true,
            data:{
                police_id:dept_id
            },
            url:serverIP1+"/police/api/police/gov_station",
            dataType:'json',
            success:function(res){
                console.log(res, '1111111111')
                var data=res.data
                var ListContent=""
                for(var i=0;i<data.length;i++)
                {
                    ListContent+="<li class='ListContent'><a>"+data[i]+"</a></li>"
                }
                $('.station-selected').append(ListContent)
                $('.ListContent').click(function(){
                    $(this).parent().siblings('input').val($(this).text())
                    tableShow($(this).text(),dept_id)
                 })
            },
            error:function(){
            }
        })

    })
    

    function tableShow(station,police){
        $.ajax({
            type:'get',
            async:true,
            data:{
                date:'2017-01-21 12:22:22',
                police_id:police,
                station:station
            },
            url:serverIP1+'/police/api/police/online_police',
            success:function(res){
                console.log(res.data,'22222222222')
                var data=res.data
                $('.polic-table ul').empty()
                var tabContent='<li class="li-header"><span>'+'站点'+'</span><span>'+'警员'+'</span><span>'+'警号'+'</span><span>'+'联系方式'+'</span></li>'
                var phoneNum = ""
                for(var i=0;i<data.length;i++)
                {
                    phoneNum = ""
                    if(data[i].phone.indexOf(',') !== -1)
                    {
                        phoneNum = data[i].phone.split(',')[1]
                    }
                    else 
                    {
                        phoneNum = data[i].phone
                    }
                    tabContent+='<li class="linkTo"><span>'+data[i].station+'</span><span class="li-img"><i><img src="../../img/icon 09.png"></i>'+data[i].policeName+'</span><span>'+data[i].policemanId+'</span><span>'+phoneNum+'</span></li>'
                }
                $('.polic-table ul').append(tabContent)
                $('.linkTo').bind('click',function(){
                    var Cardno = $(this).find('span').eq(2).text()
                    console.log(Cardno)
                    $('#iframe', parent.document).attr('src', 'template/policing-manage/polic-information.html?cardno='+Cardno)
                })
            },
            error:function(){
                alert(2)
            }
        })
    }
    
    var showMapPoliceTips = function(subwayMap,stationId){
        var url = serverIP2 +"/escopeweb/count/cntservice!getStationPoliceOnlineData.action?timespan=2";
        if(stationId)
        {
            url = url + "&bid=" + stationId
        }
        $.ajax({
            url:url,
            dataType:"json",
            success:function(data){
                console.log(data, 'dddd')
                subwayMap.clearTips();
                var policeList = data.stationdata;
                subwayMap.clearTips();
                if(policeList && $.isArray(policeList))
                {
                    $.each(policeList,function(i,obj){
                        if(!obj)
                        {
                            return true
                        }
                        var stationId = obj.bid;
                        subwayMap.createPoliceTips(stationId,obj.user || []);
                    });
                }
            }
        });
    };
    var showAllDutyPolice = function(subwayMap){
        $.ajax({
            url: serverIP1 + '/police/api/police/duty_police?date=2017-05-01 12:00:00',
            dataType:"json",
            success:function(data){
                var policeList = data.data;
                subwayMap.clearTips();
                $.each(policeList,function(i,obj){
                    if(!obj)
                    {
                        return true
                    }
                    var stationId = obj.stationInfo.stationId;
                    subwayMap.createPoliceTips(stationId,obj.duty || []);
                });
            }
        });
    }
});
