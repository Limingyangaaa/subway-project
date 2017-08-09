/// <reference path="jquery-1.11.2.js" />
;(function($, window, document,undefined) {
    //定义simpleCanleder的构造函数
    var SimpleCanleder = function(ele, opt) {
        this.$element = ele;
        $(this.$element).attr("readOnly",true);
        this.defaults = {
            'type': 'month'  //month quarter year         
        };
        this.options = $.extend({}, this.defaults, opt);
        this.$type = this.options.type;    
        this.$id = "#simpleCanleder_" + i.toString(); 
        if(this.options.selected != undefined)
        {  
            this.$selected = this.options.selected;
            $(this.$element).val(this.$selected);
        }
        this.boxOffset = {
            that:this,
            get: function () {
                return $(this.that.$element).offset();
            }
        };  
        this.selectedYear = {
            that:this,
            get: function () {
                 if(this.that.$selected != undefined)
                 {  
                     return this.that.$selected.toString().substr(0,4);
                 }else{
                     return new Date().getFullYear();
                 }
            }
        }     
    };
    //定义simpleCanleder的方法
    SimpleCanleder.prototype = {
        _init: function() {
           var that = this;
           var canlederBox = null;
           canlederBox = that._buildCanlederBox();
            $("body").append(canlederBox);
           $(this.$element).click(function(e){
                that._show(e);
           }); 
           return this.$element;
        },
        _show:function(e)
        {
            this._setCur();
            var pointX = e.pageX;
            var pointY = e.pageY;
            var box_height = parseFloat($(this.$element).height());           
            $(this.$id ).css({ "top": this.boxOffset.get().top + box_height + 6, "left": this.boxOffset.get().left});
            $(this.$id).show();
        },
        _documentClick:function(e)
        {
            var that = this;
            canlederBox = $(that.$id);
            var pointX = e.pageX;
            var pointY = e.pageY;
            $box = $(that.$element);
            var isCanlederBox = $(e.target).parents(that.$id);

            if (canlederBox.is(":visible") && $box && e.target != $box[0] && isCanlederBox.size() <= 0) {
                var offset = canlederBox.offset();
                var top = offset.top - 4;
                var left = offset.left - 4;
                var height = top + parseFloat(canlederBox.outerHeight()) + 4;
                var width = left + parseFloat(canlederBox.outerWidth()) + 4;
                if (pointX > left && pointY > top &&
                        pointX < width && pointY < height) {

                } else {
                    canlederBox.hide();
                }
            }
        },
        getSCType: function()
        {
            return this.$type;
        },
        _windowResize:function()
        {
            var that = this;
            canlederBox = $(that.$id);
            var $obj = $(that.$element);
            var box_height = parseFloat($obj.height());
            var box_width = parseFloat($obj.width());
            var boxOffset = $obj.offset();
            canlederBox.css({ "top": boxOffset.top + box_height + 6, "left": boxOffset.left });
        },
        _buildCanlederBox:  function () {
            canlederBox = $("<div style='display:none;'/>");
            var id = this.$id;
            canlederBox.attr("id", id.substr(1, id.length - 1));
            canlederBox.addClass("SimpleCanleder_Year_Month");
            this._buildTitle(canlederBox);
            this._buildBody(canlederBox);
            canlederBox.append($("<div/>").addClass("clear"));
         return canlederBox;

        },
        _buildTitle: function (canlederBox) {
            var $title = $("<div/>").addClass("title").append("<ul/>").appendTo(canlederBox);
            var $title_ul = $title.find("ul");
            for (var i = 0; i < 3; i++) {
                var $li = $("<li/>").append($("<div/>").addClass("inner"));

                $li.hover(function () {
                    $(this).addClass("over");
                }, function () {
                    $(this).removeClass("over");
                });

                $title_ul.append($li);
            }
            var $title_ul_li = $title_ul.find("li");
            var _title_ul_li = ".title ul li";
            var that = this;

            $title_ul_li.eq(0).click(function () {
                var year = that.selectedYear.get(); 
                canlederBox.find(_title_ul_li).eq(1).find("div.inner").html(that._getSelect(--year));
            }).find("div.inner").text(" < ");

            $title_ul_li.eq(1).addClass("middle").click(function () {

            })
			.find("div.inner").addClass("paddingTop").html(this._getSelect(this.selectedYear.get()));

            $title_ul_li.eq(2).click(function () {
                var year = that.selectedYear.get(); 
                canlederBox.find(_title_ul_li).eq(1).find("div.inner").html(that._getSelect(++year));
            }).find("div.inner").text(" > ");
        },
         _buildBody: function (canlederBox) {
            var $body = $("<div/>").addClass("body").append("<ul/>").appendTo(canlederBox);
            var $body_ul = $body.find("ul");
            var _title_ul_li = ".title ul li";
            var count = 12;
            var that = this;
            for (var i = 0; i < count; i++) {
                var $inner = $("<div/>").addClass("inner").text(i + 1);
                var $li = $("<li/>").append($inner).click(function () {
                    var year = canlederBox.find(_title_ul_li).eq(1).find("select").val();
                    var month = $(this).find("div.inner").text() * 1;
                    month = month>9?month:'0'+month
                    var time = year + "-" + month
                    that.$element.val(time);
                    getWarningInfo(serverIP3,serverIP1,time)
                    canlederBox.hide();
                });

                $li.hover(function () {
                    $(this).addClass("over");
                }, function () {
                    $(this).removeClass("over");
                });

                $body_ul.append($li);
            }
        },
        _setCur:function()
        {
            var sel = $(this.$element).val();
            if(sel==null ||sel == undefined)
            {
                return;
            }
            var that = this;
            var canlederBox = $(this.$id);
            var year = sel.toString().substr(0,4);  
            var _title_ul_li = ".title ul li";
            canlederBox.find(_title_ul_li).eq(1).find("div.inner").html(that._getSelect(year));
            var selOtherValue = sel.toString().substr(5,2);            
            
            canlederBox.find(".body li").each(function () {
                if ($(this).text() == selOtherValue) {
                    $(this).addClass("cur");
                } else {
                    $(this).removeClass("cur");
                };                
            });

        },
        _getSelect: function (year) {
            var curYear = new Date().getFullYear();
            var that = this;
            if (!year || year > curYear) {
                year = curYear;
            }
            this.$selected = year;
            var $select = $("<select/>");
            for (var i = 10; i >= 0; i--) {
                $select.append($("<option/>").text(year * 1 - i));
            }
            for (var j = 1; j <= 10; j++) {
                if(year * 1 + j <= curYear)
                $select.append($("<option/>").text(year * 1 + j));
            }
            $select.find("option").each(function () {
                if ($(this).text() == year) {
                    $(this).attr("selected", "selected");
                }
            });
            $select.change(function () {                
                var html = that._getSelect($(this).val());
                $(this).parent().html(html);
            });
            return $select;
        }
    };
    var i = 0;
    //在插件中使用simpleCanleder对象
    $.fn.simpleCanleder = function(options) {
        i++;
        //创建simpleCanleder的实体
        var simpleCanleder = new SimpleCanleder(this, options);
         $(window).resize(function () {
             simpleCanleder._windowResize();
         });
         $(document).click(function (e) {
             simpleCanleder._documentClick(e);
         });
        //调用其方法
        return simpleCanleder._init();
    };
})(jQuery, window, document);