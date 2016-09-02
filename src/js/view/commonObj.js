define(["jquery"], function($) {
    return commonObj = {
        //减少商品数量(感觉代码不够高效，可先判断当前项是选中项再进行总合计)
        reduceNum: function() {
            var num = parseInt($(this).next().val());
            if (!isNaN(num)) {
                if (num < 2) {
                    num = 1;
                } else {
                    num -= 1;
                }
            } else {
                num = 1;
            }
            $(this).next().val(num);
            commonObj.total();
        },
        //增加商品数量(感觉代码不够高效，可先判断当前项是选中项再进行总合计)
        increaseNum: function() {
            var num = parseInt($(this).prev().val());
            if (!isNaN(num)) {
                if (num < 1) {
                    num = 1;
                } else {
                    num += 1;
                }
            } else {
                num = 1;
            }
            $(this).prev().val(num);
            commonObj.total();
        },
        //订购数量必须为正整数
        integerNum: function() {
            productNumber = parseInt($(this).val());
            // 输入值必须是正整数
            if ((/^(\+|-)?\d+$/.test(productNumber)) && productNumber > 0) {
                $(this).val(productNumber);
            } else {
                $(this).val(1);
            }
            // commonObj.total();
            commonObj.total();
        },
        //删除订单项
        deleteOrderItem: function(This) {//传入当前项

            This.parents(".goodsItem").remove();
            console.log(This.parents(".goodsItem"));
            var $subBox = $("input[name='subBox']");
            var Flag = $subBox.length == $("input[name='subBox']:checked").length ? true : false;
            console.log(Flag);
            $("#selectAllBtn").find("input[type='checkbox']").prop("checked", Flag);
            commonObj.showEmptyCar();
            commonObj.total();
        },
        //空购物车显示
        showEmptyCar: function() {
            if ($("#OrderForm .goodsItem").length == 0) {
                $("#OrderForm").find(".emptyCarCon").show();
            }
        },
        //选择子项
        selectItem: function() {
            $subBox = $("input[name='subBox']");
            $("#selectAllBtn").find("input[type='checkbox']")
                .prop("checked",
                    $subBox.length == $("input[name='subBox']:checked").length ? true : false);

            //计算总价
            commonObj.total();
        },
        //全选订单
        selectAll: function() {
            //获取当前选择
            var flag = $(this).find("input[type='checkbox']").prop("checked");
            $("#OrderForm .goodsItem .checkBox").find("input[type='checkbox']")
                .prop("checked", flag);
            commonObj.total();
        },
        total: function() {
            var $subBox = $("input[name='subBox']:checked");
            // console.log($subBox.length);
            var goodsItem = $subBox.parents(".goodsItem");
            var len = goodsItem.length;
            // console.log(len);
            var total = 0; //所有子项总价

            for (var i = 0; i < len; i++) {
                var totalItem = 0; //每个订单项的总价
                var price = parseFloat($(goodsItem[i]).find(".price strong").html());
                console.log(price + "," + i);
                var productNumber = $(goodsItem[i]).find(".productNumberInput").val();
                console.log(productNumber + "," + i);
                totalItem = price * productNumber;
                console.log(totalItem + "," + i);
                console.log("---------------");
                total += totalItem;
            }
            //合计总价
            $("#navbar .price .money").html(total);
            // console.log(total);
        },
        //选项卡复用函数
        tabs: function(obj) {
            //选项卡切换
            var _index = 0;
            var tabsDom = obj;
            var tabsTitle = tabsDom.find('.tab-title:first'); //防止多级选项卡对象选中

            tabsTitle.find('li').on("click", function() {
                _index = $(this).index();
                $(this).addClass('active').siblings().removeClass('active');
                tabsDom.find('.tab-content:first .tab-item').eq(_index).show().siblings().hide();
            });

        },
        //动画添加购物车
        addCarAnimate:function(){

          var number=3;//暂时先模拟购物车数量为3

          var productImg=$(this).parents("li").find("img"),//产品图
              carNumsDom=$("#navbar .carNums"),//购物车订单数量
              imgSrc=productImg.data('original'),//产品图地址
              x=productImg.offset().left,//起点位置
              y=productImg.offset().top,
              X=carNumsDom.offset().left,//运动终点位置
              Y=carNumsDom.offset().top;
              //动态创建运动预览图
              if($("#fly").length<=0){
                $("body").append($("<div id='fly'><img src='"+imgSrc+"' width='50' height='50' /></div>"));
              }
              //加入购物车动画
              var $fly=$("#fly");
              if(!$fly.is(":animated")){
                $fly.css({"left":x,"top":y}).animate({"left":X,"top":Y},800,function(){
                  $fly.fadeOut(300,function(){
                    $fly.remove();
                    var carNums=carNumsDom.text()*1+number*1;
                    carNumsDom.text(carNums);
                  });
                })
              }

        }
        // //表单验证
        // validInput: function() {
        //     var noticeDom = $("#loginForm .notice");
        //     noticeDom.html("");
        //     //手机号码
        //     if ($(this).data("type") == 'telPhoneNum') {
        //         //非空
        //         if ($(this).val().trim() == "") {
        //             noticeDom.html('手机号码不能为空！');
        //             return;
        //         }
        //         if (!$(this).val().match(/^(1(([35][0-9])|(47)|[8][01236789]))\d{8}$/)) {
        //             var msg = "手机号码格式错误！";
        //             noticeDom.html(msg);
        //             console.log("错误");
        //             return;
        //         }
        //         console.log("正确");
        //         // return true;
        //     }
        //
        //     //密码验证
        //     if ($(this).data("type") == 'password') {
        //         //非空
        //         if ($(this).val().trim() == "" || $(this).val().length < 6 || $(this).val().length > 20) {
        //             noticeDom.html('请设置6-20位登录密码');
        //             return false;
        //         }
        //         console.log("正确");
        //         // return true;
        //     }
        //     return true;
        // },
        // validForm:function(){
        //   var flag=$("#loginForm :input").trigger("blur");
        //   if(flag){
        //     alert('提交表单');
        //   }
        // }


    }
});
