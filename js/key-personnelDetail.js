$(function() {
  var thisSrc = $('#iframe',parent.document).attr('src');
  console.log(thisSrc)
  thisStation = thisSrc.substring(thisSrc.indexOf('=')+1,thisSrc.indexOf('=')+10)
  thisPerson = thisSrc.substring(thisSrc.indexOf('&')+8,thisSrc.indexOf('&')+16)
  console.log(thisStation, thisPerson)
  $('#littleMap').attr('src',serverIP2+'/escopeweb/content/cn/wifi/heatmapcamera.html?bid=1268008000');
  $.ajax({
    type: 'get',
    dataType: 'json',
    url: serverIP2 + '/escopeweb/count/cntservice!getUserbadInfo.action?cardno=912345',
    success: function (res) {
      console.log(res.data)
      var data = res.data
      var Sex,Type,Src
      Src=serverIP2+'/escopeweb'+data.avatar
      console.log(Src)
      if(data.gender == "M")
      {
        Sex = '男'
      }
      else {
        Sex = '女'
      }
      if(data.cardtype == 0)
      {
        Type = "身份证"
      }
      var infoContent = ""
      infoContent += '<p><span class="spanL">姓名：<span class="">'+data.realname+'</span></span>'+
        '<span class="spanR">&nbsp;性别：<span class="sec">'+Sex+'</span></span></p>'+
        '<p><span>编号：<span class="">'+data.cardno+'</span></span></p>'+
        '<p><span class="spanL">出生日期：<span class="">'+data.birthday+'</span></span><span class="spanR">&nbsp'+
        '证件类型：<span class="">'+Type+'</span></span></p>'+
        '<p><span>证件号码：<span class="">'+data.cardnumber+'</span></span><i>'+
        '<img src='+Src+'></i></p>'
      $('.person_massage').append(infoContent)
      
    }
  })
   $.ajax({
    type: 'get',
    dataType: 'json',
    data: {
      cardno: thisPerson
    },
    url: serverIP2 + '/escopeweb/count/cntservice!getUserbadStationList.action',
    success: function (res) {
      console.log(res.rows)
      var data = res.rows
      var tableContent=""
      for(var i=0;i<data.length;i++)
      {
        tableContent+='<tr><td>'+data[i].stime+'</td><td>'+data[i].buildingname+'</td><td>'+data[i].staytime+'</td></tr>'
      }
      $('.warningStat').find('table').append(tableContent)
    }
  })
})