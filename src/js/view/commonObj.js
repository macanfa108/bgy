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
        tabs: function(obj,callback) {
            //选项卡切换
            var _index = 0;
            var tabsDom = obj;
            var tabsTitle = tabsDom.find('.tab-title:first'); //防止多级选项卡对象选中

            tabsTitle.find('li').on("click", function() {
                _index = $(this).index();
                $(this).addClass('active').siblings().removeClass('active');
                tabsDom.find('.tab-content:first .tab-item').eq(_index).show()
                .siblings().hide();
                // 自定义回调函数，根据需要调用，可缺省
                if(callback){
                  callback();
                }
            });


        },
        //动画添加购物车
        addCarAnimate:function(){

          /*分类页面：合理应该选择规格之后统计数量，暂时先模拟快捷加入购物车数量为1*/
          var number=1;

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
                    //本地存储或存储到服务器操作，保持用户数据
                  });
                })
              }

        },
        //我的收藏页面滑动删除（动态设置页面布局，可优化）
        slideToDelete:function(){
          var linewrapper=$(".line-wrapper");
            // 设定每一行的宽度=屏幕宽度+按钮宽度
            $(".line-scroll-wrapper").width(linewrapper.width() + $(".line-btn-delete").width());
            // 设定常规信息区域宽度=屏幕宽度
            $(".line-normal-wrapper").width(linewrapper.width());
            // 设定文字部分宽度（为了实现文字过长时在末尾显示...）
            $(".line-normal-msg").width(linewrapper.width() - 136);

            // 获取所有行，对每一行设置监听
            var lines = $(".line-normal-wrapper");
            var len = lines.length;
            var lastX, lastXForMobile;

            // 用于记录被按下的对象
            var pressedObj; // 当前左滑的对象
            var lastLeftObj; // 上一个左滑的对象

            // 用于记录按下的点
            var start;

            // 网页在移动端运行时的监听
            for (var i = 0; i < len; ++i) {
                lines[i].addEventListener('touchstart', function(e) {
                  $(".line-btn-delete").show();
                    lastXForMobile = e.changedTouches[0].pageX;
                    pressedObj = this; // 记录被按下的对象

                    // 记录开始按下时的点
                    var touches = event.touches[0];
                    start = {
                        x: touches.pageX, // 横坐标
                        y: touches.pageY // 纵坐标
                    };
                });

                lines[i].addEventListener('touchmove', function(e) {
                    // 计算划动过程中x和y的变化量
                    var touches = event.touches[0];
                    delta = {
                        x: touches.pageX - start.x,
                        y: touches.pageY - start.y
                    };

                    // 横向位移大于纵向位移，阻止纵向滚动
                    if (Math.abs(delta.x) > Math.abs(delta.y)) {
                        event.preventDefault();
                    }
                });

                lines[i].addEventListener('touchend', function(e) {
                    var diffX = e.changedTouches[0].pageX - lastXForMobile;
                    if (diffX < -50) {
                        $(pressedObj).animate({
                            marginLeft: "-75px"
                        }, 100); // 左滑
                        lastLeftObj && lastLeftObj != pressedObj &&
                            $(lastLeftObj).animate({
                                marginLeft: "0"
                            }, 100); // 已经左滑状态的按钮右滑
                        lastLeftObj = pressedObj; // 记录上一个左滑的对象
                    } else if (diffX > 50) {
                        // $(pressedObj).animate({
                        //     marginLeft: "0"
                        // }, 100); // 右滑
                        // lastLeftObj = null; // 清空上一个左滑的对象
                        if (pressedObj == lastLeftObj) {
                          $(pressedObj).animate({marginLeft:"0"}, 100); // 右滑
                          lastLeftObj = null; // 清空上一个左滑的对象
                        }
                    }
                });
            }

            // 网页在PC浏览器中运行时的监听
            for (var i = 0; i < len; ++i) {
                $(lines[i]).bind('mousedown', function(e) {
                  // $(".line-btn-delete").show();
                    lastX = e.clientX;
                    pressedObj = this; // 记录被按下的对象
                });

                $(lines[i]).bind('mouseup', function(e) {
                    var diffX = e.clientX - lastX;
                    if (diffX < -50) {
                        $(pressedObj).animate({
                            marginLeft: "-75px"
                        }, 100); // 左滑
                        lastLeftObj && lastLeftObj != pressedObj &&
                            $(lastLeftObj).animate({
                                marginLeft: "0"
                            }, 100); // 已经左滑状态的按钮右滑
                        lastLeftObj = pressedObj; // 记录上一个左滑的对象
                    } else if (diffX > 50) {
                        // $(pressedObj).animate({
                        //     marginLeft: "0"
                        // }, 100); // 右滑
                        // lastLeftObj = null; // 清空上一个左滑的对象
                        if (pressedObj == lastLeftObj) {
                          $(pressedObj).animate({marginLeft:"0"}, 100); // 右滑
                          lastLeftObj = null; // 清空上一个左滑的对象
                        }
                    }
                });
            }

            //删除按钮事件绑定
            $(".line-btn-delete").on("click", function() {
                // console.log(0);
                var This=$(this);
                //layer插件
                layer.open({
                    content: '您确定要删除该收藏吗？',
                    btn: ['确定', '取消'],
                    yes: function(index) {
                      console.log("AJAX数据交互,成功后删除该项！否则关闭该弹窗后提示失败结果!");
                        This.parents(".line-wrapper").remove();
                        layer.close(index);
                    }
                });



            });
        }
        // 我的收藏 end

    }
});
