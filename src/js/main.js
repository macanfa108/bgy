require.config({
    //js模块化配置
    paths: {
        "jquery": "lib/jquery.min",
        "jquery.Swiper": "plugs/swiper-3.3.1.jquery.min",
        "jquery.lazyload": "plugs/jquery.lazyload.min",
        // "iscroll": "plugs/iscroll",
        "commonObj": "view/commonObj",
        "validator": "view/validator"
    },
    //加载非规范的模块(插件加载)
    shim: {　　　　
        'jquery.lazyload': {　　　　　　
            deps: ['jquery'],
            exports: 'jQuery.fn.lazyload'　　　　
        },
        "jquery.Swiper": {
            deps: ['jquery'],
            exports: 'jQuery.fn.Swiper'
        }　　
    }
});
//依赖关系的顺序要一一对应啊！坑深勿跳
require(["jquery", "commonObj","validator", "jquery.Swiper", "jquery.lazyload"], function($, commonObj,validator) {
    $(function() {

        /*轮播初始化*/
        var mySwiper = new Swiper('.swiper-container', {
            direction: 'horizontal',
            loop: true,
            // 如果需要分页器
            pagination: '.swiper-pagination'
        });
        /*回到顶部按钮*/
        $("#scrollTopBtn").click(function() {
          // var scrollTop = $(document).scrollTop();
          // console.log(scrollTop);
            // $("body").scrollTop(0);
            $('body,html').animate({
                'scrollTop': 0
            }, 800);
            return false;


        });

        /*滚动显示回到顶部按钮*/
        $(document).scroll(function(e) {
            var scrollTop = $(document).scrollTop();
            // console.log(scrollTop);
            if (scrollTop > 100) {
                $("#scrollTopBtn").fadeIn("slow");
            } else {
                $("#scrollTopBtn").fadeOut("slow");
            }
        });
        /*图片懒加载:可以考虑多次实例化，使用不同的预览图*/
        $("img").lazyload({
            // placeholder: "images/loading-brank.jpg", //用图片提前占位
            // placeholder,值为某一图片路径.此图片用来占据将要加载的图片的位置,待图片加载时,占位图则会隐藏
            effect: "fadeIn", // 载入使用何种效果
            // effect(特效),值有show(直接显示),fadeIn(淡入),slideDown(下拉)等,常用fadeIn
            threshold: 100, // 提前开始加载
            // threshold,值为数字,代表页面高度.如设置为200,表示滚动条在离目标位置还有200的高度时就开始加载图片,可以做到不让用户察觉
            // container: $("main"),  // 对某容器中的图片实现效果
            // container,值为某容器.lazyload默认在拉动浏览器滚动条时生效,这个参数可以让你在拉动某DIV的滚动条时依次加载其中的图片
            failurelimit: 10 // 图片排序混乱时
                // failurelimit,值为数字.lazyload默认在找到第一张不在可见区域里的图片时则不再继续加载,但当HTML容器混乱的时候可能出现可见区域内图片并没加载出来的情况,failurelimit意在加载N张可见区域外的图片,以避免出现这个问题.
        });


        /*购物车页面*/
        //购物车为空则显示
        commonObj.showEmptyCar();
        //初始化计算总价
        commonObj.total();
        //购物车计数器
        $(".counter .reduce").on("click", commonObj.reduceNum);
        $(".counter .increase").on("click", commonObj.increaseNum);
        $(".counter .productNumberInput").on('blur', commonObj.integerNum);

        //删除订单子项
        //（加入弹窗感觉不够灵活，待封装拓展2016.8.26）
        // $("#OrderForm .icon").on("click", commonObj.deleteOrderItem);
        $("#OrderForm .icon").on("click",function(){
          var This=$(this);//缓存当前对象
          //弹窗出现
          $(".modal").fadeIn(function(){
            //确定删除
            if($(".modal #sureBtn").length>0){
              $(".modal #sureBtn").off().on("click",function(){
                 commonObj.deleteOrderItem(This);
                 $(".modal").fadeOut();
              });
            }
            //取消
            if($(".modal #cancelBtn").length>0){
              $(".modal #cancelBtn").off().on("click",function(){
                 $(".modal").fadeOut();
              });
            }
          });

          console.log(2);
        });
        //全选
        $("#selectAllBtn").off("click").on("click", commonObj.selectAll);
        //checkbox选中个数等于总个数即为全选
        var parentSubBox = $("#OrderForm .goodsItem .checkBox");
        var $subBox = $("input[name='subBox']");
        parentSubBox.off("click").on("click", $subBox,commonObj.selectItem);

        /*产品详情页面*/

        //选择规格，收藏
        $("#standardCon .standard").on('click',function(){
          $(this).addClass('selected').siblings().removeClass('selected');
        });
        //收藏切换
        $("#standardCon .other").on('click',function(){
            $(this).find('.icon').toggleClass('icon-z4-collect').toggleClass('icon-z5-collected');
        });
        //计数器
        $("#amountCon .reduce").on("click", commonObj.reduceNum);
        $("#amountCon .increase").on("click", commonObj.increaseNum);
        $("#amountCon .productNumberInput").on('blur', commonObj.integerNum);

        //选项卡(代码抽取复用)，通过传入整个tabs容器ID使用
        var tabsDom=$("#tabsCon");
        var tabsTitle=tabsDom.find('.tab-title:first');
        commonObj.tabs(tabsDom);

        // //窗口滚动选项卡定位
        if(tabsDom.length){//限定在有滚动固定选项卡页面才会实现

          var offsetTop=0;
          var scrollTop=0;

          $(window).scroll(function(){
            offsetTop=tabsDom.offset().top;
            scrollTop=$(this).scrollTop();
            if(scrollTop>=offsetTop){
              tabsTitle.addClass('fixed').removeClass('absolute');
            }else{
              tabsTitle.addClass('absolute').removeClass('fixed');
            }
          });
        }


        // 子级选项卡复用
        commonObj.tabs($("#tabs-sm"));
        //加入果篮弹窗提示
        $("#navbar2 .fruitBasket").off().on("click",function(){
          $(".modal").fadeIn(function(){
            $(this).delay(800).fadeOut();
          });
        });


        /*分类页面左右两栏选项卡*/
        commonObj.tabs($("#sortCon"));

        $("#sortCon .tab-item .iconfont").on("click",commonObj.addCarAnimate);




        /*城市列表页面*/
        var ulDom=$("#regionList>ul");
        //初始化加载城市列表
        function cityInit(){
          var html="";
          var data=[{"id":"1","name":"\u5317\u4eac","city":[{"id":"1","pid":"1","name":"\u5317\u4eac\u5e02"}]},{"id":"2","name":"\u5929\u6d25","city":[{"id":"2","pid":"2","name":"\u5929\u6d25\u5e02"}]},{"id":"3","name":"\u6cb3\u5317","city":[{"id":"3","pid":"3","name":"\u77f3\u5bb6\u5e84\u5e02"},{"id":"4","pid":"3","name":"\u5510\u5c71\u5e02"},{"id":"5","pid":"3","name":"\u79e6\u7687\u5c9b\u5e02"},{"id":"6","pid":"3","name":"\u90af\u90f8\u5e02"},{"id":"7","pid":"3","name":"\u90a2\u53f0\u5e02"},{"id":"8","pid":"3","name":"\u4fdd\u5b9a\u5e02"},{"id":"9","pid":"3","name":"\u5f20\u5bb6\u53e3\u5e02"},{"id":"10","pid":"3","name":"\u627f\u5fb7\u5e02"},{"id":"11","pid":"3","name":"\u6ca7\u5dde\u5e02"},{"id":"12","pid":"3","name":"\u5eca\u574a\u5e02"},{"id":"13","pid":"3","name":"\u8861\u6c34\u5e02"}]},{"id":"4","name":"\u5c71\u897f","city":[{"id":"14","pid":"4","name":"\u592a\u539f\u5e02"},{"id":"15","pid":"4","name":"\u5927\u540c\u5e02"},{"id":"16","pid":"4","name":"\u9633\u6cc9\u5e02"},{"id":"17","pid":"4","name":"\u957f\u6cbb\u5e02"},{"id":"18","pid":"4","name":"\u664b\u57ce\u5e02"},{"id":"19","pid":"4","name":"\u6714\u5dde\u5e02"},{"id":"20","pid":"4","name":"\u664b\u4e2d\u5e02"},{"id":"21","pid":"4","name":"\u8fd0\u57ce\u5e02"},{"id":"22","pid":"4","name":"\u5ffb\u5dde\u5e02"},{"id":"23","pid":"4","name":"\u4e34\u6c7e\u5e02"},{"id":"24","pid":"4","name":"\u5415\u6881\u5e02"}]},{"id":"5","name":"\u5185\u8499\u53e4","city":[{"id":"25","pid":"5","name":"\u547c\u548c\u6d69\u7279\u5e02"},{"id":"26","pid":"5","name":"\u5305\u5934\u5e02"},{"id":"27","pid":"5","name":"\u4e4c\u6d77\u5e02"},{"id":"28","pid":"5","name":"\u8d64\u5cf0\u5e02"},{"id":"29","pid":"5","name":"\u901a\u8fbd\u5e02"},{"id":"30","pid":"5","name":"\u9102\u5c14\u591a\u65af\u5e02"},{"id":"31","pid":"5","name":"\u547c\u4f26\u8d1d\u5c14\u5e02"},{"id":"32","pid":"5","name":"\u5df4\u5f66\u6dd6\u5c14\u5e02"},{"id":"33","pid":"5","name":"\u4e4c\u5170\u5bdf\u5e03\u5e02"},{"id":"34","pid":"5","name":"\u5174\u5b89\u76df"},{"id":"35","pid":"5","name":"\u9521\u6797\u90ed\u52d2\u76df"},{"id":"36","pid":"5","name":"\u963f\u62c9\u5584\u76df"}]},{"id":"6","name":"\u8fbd\u5b81","city":[{"id":"37","pid":"6","name":"\u6c88\u9633\u5e02"},{"id":"38","pid":"6","name":"\u5927\u8fde\u5e02"},{"id":"39","pid":"6","name":"\u978d\u5c71\u5e02"},{"id":"40","pid":"6","name":"\u629a\u987a\u5e02"},{"id":"41","pid":"6","name":"\u672c\u6eaa\u5e02"},{"id":"42","pid":"6","name":"\u4e39\u4e1c\u5e02"},{"id":"43","pid":"6","name":"\u9526\u5dde\u5e02"},{"id":"44","pid":"6","name":"\u8425\u53e3\u5e02"},{"id":"45","pid":"6","name":"\u961c\u65b0\u5e02"},{"id":"46","pid":"6","name":"\u8fbd\u9633\u5e02"},{"id":"47","pid":"6","name":"\u76d8\u9526\u5e02"},{"id":"48","pid":"6","name":"\u94c1\u5cad\u5e02"},{"id":"49","pid":"6","name":"\u671d\u9633\u5e02"},{"id":"50","pid":"6","name":"\u846b\u82a6\u5c9b\u5e02"}]},{"id":"7","name":"\u5409\u6797","city":[{"id":"51","pid":"7","name":"\u957f\u6625\u5e02"},{"id":"52","pid":"7","name":"\u5409\u6797\u5e02"},{"id":"53","pid":"7","name":"\u56db\u5e73\u5e02"},{"id":"54","pid":"7","name":"\u8fbd\u6e90\u5e02"},{"id":"55","pid":"7","name":"\u901a\u5316\u5e02"},{"id":"56","pid":"7","name":"\u767d\u5c71\u5e02"},{"id":"57","pid":"7","name":"\u677e\u539f\u5e02"},{"id":"58","pid":"7","name":"\u767d\u57ce\u5e02"},{"id":"59","pid":"7","name":"\u5ef6\u8fb9\u671d\u9c9c\u65cf\u81ea\u6cbb\u5dde"}]},{"id":"8","name":"\u9ed1\u9f99\u6c5f","city":[{"id":"60","pid":"8","name":"\u54c8\u5c14\u6ee8\u5e02"},{"id":"61","pid":"8","name":"\u9f50\u9f50\u54c8\u5c14\u5e02"},{"id":"62","pid":"8","name":"\u9e21\u897f\u5e02"},{"id":"63","pid":"8","name":"\u9e64\u5c97\u5e02"},{"id":"64","pid":"8","name":"\u53cc\u9e2d\u5c71\u5e02"},{"id":"65","pid":"8","name":"\u5927\u5e86\u5e02"},{"id":"66","pid":"8","name":"\u4f0a\u6625\u5e02"},{"id":"67","pid":"8","name":"\u4f73\u6728\u65af\u5e02"},{"id":"68","pid":"8","name":"\u4e03\u53f0\u6cb3\u5e02"},{"id":"69","pid":"8","name":"\u7261\u4e39\u6c5f\u5e02"},{"id":"70","pid":"8","name":"\u9ed1\u6cb3\u5e02"},{"id":"71","pid":"8","name":"\u7ee5\u5316\u5e02"},{"id":"72","pid":"8","name":"\u5927\u5174\u5b89\u5cad\u5730\u533a"}]},{"id":"9","name":"\u4e0a\u6d77","city":[{"id":"73","pid":"9","name":"\u4e0a\u6d77\u5e02"}]},{"id":"10","name":"\u6c5f\u82cf","city":[{"id":"74","pid":"10","name":"\u5357\u4eac\u5e02"},{"id":"75","pid":"10","name":"\u65e0\u9521\u5e02"},{"id":"76","pid":"10","name":"\u5f90\u5dde\u5e02"},{"id":"77","pid":"10","name":"\u5e38\u5dde\u5e02"},{"id":"78","pid":"10","name":"\u82cf\u5dde\u5e02"},{"id":"79","pid":"10","name":"\u5357\u901a\u5e02"},{"id":"80","pid":"10","name":"\u8fde\u4e91\u6e2f\u5e02"},{"id":"81","pid":"10","name":"\u6dee\u5b89\u5e02"},{"id":"82","pid":"10","name":"\u76d0\u57ce\u5e02"},{"id":"83","pid":"10","name":"\u626c\u5dde\u5e02"},{"id":"84","pid":"10","name":"\u9547\u6c5f\u5e02"},{"id":"85","pid":"10","name":"\u6cf0\u5dde\u5e02"},{"id":"86","pid":"10","name":"\u5bbf\u8fc1\u5e02"}]},{"id":"11","name":"\u6d59\u6c5f","city":[{"id":"87","pid":"11","name":"\u676d\u5dde\u5e02"},{"id":"88","pid":"11","name":"\u5b81\u6ce2\u5e02"},{"id":"89","pid":"11","name":"\u6e29\u5dde\u5e02"},{"id":"90","pid":"11","name":"\u5609\u5174\u5e02"},{"id":"91","pid":"11","name":"\u6e56\u5dde\u5e02"},{"id":"92","pid":"11","name":"\u7ecd\u5174\u5e02"},{"id":"93","pid":"11","name":"\u91d1\u534e\u5e02"},{"id":"94","pid":"11","name":"\u8862\u5dde\u5e02"},{"id":"95","pid":"11","name":"\u821f\u5c71\u5e02"},{"id":"96","pid":"11","name":"\u53f0\u5dde\u5e02"},{"id":"97","pid":"11","name":"\u4e3d\u6c34\u5e02"}]},{"id":"12","name":"\u5b89\u5fbd","city":[{"id":"98","pid":"12","name":"\u5408\u80a5\u5e02"},{"id":"99","pid":"12","name":"\u829c\u6e56\u5e02"},{"id":"100","pid":"12","name":"\u868c\u57e0\u5e02"},{"id":"101","pid":"12","name":"\u6dee\u5357\u5e02"},{"id":"102","pid":"12","name":"\u9a6c\u978d\u5c71\u5e02"},{"id":"103","pid":"12","name":"\u6dee\u5317\u5e02"},{"id":"104","pid":"12","name":"\u94dc\u9675\u5e02"},{"id":"105","pid":"12","name":"\u5b89\u5e86\u5e02"},{"id":"106","pid":"12","name":"\u9ec4\u5c71\u5e02"},{"id":"107","pid":"12","name":"\u6ec1\u5dde\u5e02"},{"id":"108","pid":"12","name":"\u961c\u9633\u5e02"},{"id":"109","pid":"12","name":"\u5bbf\u5dde\u5e02"},{"id":"110","pid":"12","name":"\u5de2\u6e56\u5e02"},{"id":"111","pid":"12","name":"\u516d\u5b89\u5e02"},{"id":"112","pid":"12","name":"\u4eb3\u5dde\u5e02"},{"id":"113","pid":"12","name":"\u6c60\u5dde\u5e02"},{"id":"114","pid":"12","name":"\u5ba3\u57ce\u5e02"}]},{"id":"13","name":"\u798f\u5efa","city":[{"id":"115","pid":"13","name":"\u798f\u5dde\u5e02"},{"id":"116","pid":"13","name":"\u53a6\u95e8\u5e02"},{"id":"117","pid":"13","name":"\u8386\u7530\u5e02"},{"id":"118","pid":"13","name":"\u4e09\u660e\u5e02"},{"id":"119","pid":"13","name":"\u6cc9\u5dde\u5e02"},{"id":"120","pid":"13","name":"\u6f33\u5dde\u5e02"},{"id":"121","pid":"13","name":"\u5357\u5e73\u5e02"},{"id":"122","pid":"13","name":"\u9f99\u5ca9\u5e02"},{"id":"123","pid":"13","name":"\u5b81\u5fb7\u5e02"}]},{"id":"14","name":"\u6c5f\u897f","city":[{"id":"124","pid":"14","name":"\u5357\u660c\u5e02"},{"id":"125","pid":"14","name":"\u666f\u5fb7\u9547\u5e02"},{"id":"126","pid":"14","name":"\u840d\u4e61\u5e02"},{"id":"127","pid":"14","name":"\u4e5d\u6c5f\u5e02"},{"id":"128","pid":"14","name":"\u65b0\u4f59\u5e02"},{"id":"129","pid":"14","name":"\u9e70\u6f6d\u5e02"},{"id":"130","pid":"14","name":"\u8d63\u5dde\u5e02"},{"id":"131","pid":"14","name":"\u5409\u5b89\u5e02"},{"id":"132","pid":"14","name":"\u5b9c\u6625\u5e02"},{"id":"133","pid":"14","name":"\u629a\u5dde\u5e02"},{"id":"134","pid":"14","name":"\u4e0a\u9976\u5e02"}]},{"id":"15","name":"\u5c71\u4e1c","city":[{"id":"135","pid":"15","name":"\u6d4e\u5357\u5e02"},{"id":"136","pid":"15","name":"\u9752\u5c9b\u5e02"},{"id":"137","pid":"15","name":"\u6dc4\u535a\u5e02"},{"id":"138","pid":"15","name":"\u67a3\u5e84\u5e02"},{"id":"139","pid":"15","name":"\u4e1c\u8425\u5e02"},{"id":"140","pid":"15","name":"\u70df\u53f0\u5e02"},{"id":"141","pid":"15","name":"\u6f4d\u574a\u5e02"},{"id":"142","pid":"15","name":"\u6d4e\u5b81\u5e02"},{"id":"143","pid":"15","name":"\u6cf0\u5b89\u5e02"},{"id":"144","pid":"15","name":"\u5a01\u6d77\u5e02"},{"id":"145","pid":"15","name":"\u65e5\u7167\u5e02"},{"id":"146","pid":"15","name":"\u83b1\u829c\u5e02"},{"id":"147","pid":"15","name":"\u4e34\u6c82\u5e02"},{"id":"148","pid":"15","name":"\u5fb7\u5dde\u5e02"},{"id":"149","pid":"15","name":"\u804a\u57ce\u5e02"},{"id":"150","pid":"15","name":"\u6ee8\u5dde\u5e02"},{"id":"151","pid":"15","name":"\u83cf\u6cfd\u5e02"}]},{"id":"16","name":"\u6cb3\u5357","city":[{"id":"152","pid":"16","name":"\u90d1\u5dde\u5e02"},{"id":"153","pid":"16","name":"\u5f00\u5c01\u5e02"},{"id":"154","pid":"16","name":"\u6d1b\u9633\u5e02"},{"id":"155","pid":"16","name":"\u5e73\u9876\u5c71\u5e02"},{"id":"156","pid":"16","name":"\u5b89\u9633\u5e02"},{"id":"157","pid":"16","name":"\u9e64\u58c1\u5e02"},{"id":"158","pid":"16","name":"\u65b0\u4e61\u5e02"},{"id":"159","pid":"16","name":"\u7126\u4f5c\u5e02"},{"id":"160","pid":"16","name":"\u6fee\u9633\u5e02"},{"id":"161","pid":"16","name":"\u8bb8\u660c\u5e02"},{"id":"162","pid":"16","name":"\u6f2f\u6cb3\u5e02"},{"id":"163","pid":"16","name":"\u4e09\u95e8\u5ce1\u5e02"},{"id":"164","pid":"16","name":"\u5357\u9633\u5e02"},{"id":"165","pid":"16","name":"\u5546\u4e18\u5e02"},{"id":"166","pid":"16","name":"\u4fe1\u9633\u5e02"},{"id":"167","pid":"16","name":"\u5468\u53e3\u5e02"},{"id":"168","pid":"16","name":"\u9a7b\u9a6c\u5e97\u5e02"},{"id":"169","pid":"16","name":"\u6d4e\u6e90\u5e02"}]},{"id":"17","name":"\u6e56\u5317","city":[{"id":"170","pid":"17","name":"\u6b66\u6c49\u5e02"},{"id":"171","pid":"17","name":"\u9ec4\u77f3\u5e02"},{"id":"172","pid":"17","name":"\u5341\u5830\u5e02"},{"id":"173","pid":"17","name":"\u5b9c\u660c\u5e02"},{"id":"174","pid":"17","name":"\u8944\u6a0a\u5e02"},{"id":"175","pid":"17","name":"\u9102\u5dde\u5e02"},{"id":"176","pid":"17","name":"\u8346\u95e8\u5e02"},{"id":"177","pid":"17","name":"\u5b5d\u611f\u5e02"},{"id":"178","pid":"17","name":"\u8346\u5dde\u5e02"},{"id":"179","pid":"17","name":"\u9ec4\u5188\u5e02"},{"id":"180","pid":"17","name":"\u54b8\u5b81\u5e02"},{"id":"181","pid":"17","name":"\u968f\u5dde\u5e02"},{"id":"182","pid":"17","name":"\u6069\u65bd\u571f\u5bb6\u65cf\u82d7\u65cf\u81ea\u6cbb\u5dde"},{"id":"183","pid":"17","name":"\u7701\u76f4\u8f96\u53bf\u7ea7\u884c\u653f\u5355\u4f4d"}]},{"id":"18","name":"\u6e56\u5357","city":[{"id":"184","pid":"18","name":"\u957f\u6c99\u5e02"},{"id":"185","pid":"18","name":"\u682a\u6d32\u5e02"},{"id":"186","pid":"18","name":"\u6e58\u6f6d\u5e02"},{"id":"187","pid":"18","name":"\u8861\u9633\u5e02"},{"id":"188","pid":"18","name":"\u90b5\u9633\u5e02"},{"id":"189","pid":"18","name":"\u5cb3\u9633\u5e02"},{"id":"190","pid":"18","name":"\u5e38\u5fb7\u5e02"},{"id":"191","pid":"18","name":"\u5f20\u5bb6\u754c\u5e02"},{"id":"192","pid":"18","name":"\u76ca\u9633\u5e02"},{"id":"193","pid":"18","name":"\u90f4\u5dde\u5e02"},{"id":"194","pid":"18","name":"\u6c38\u5dde\u5e02"},{"id":"195","pid":"18","name":"\u6000\u5316\u5e02"},{"id":"196","pid":"18","name":"\u5a04\u5e95\u5e02"},{"id":"197","pid":"18","name":"\u6e58\u897f\u571f\u5bb6\u65cf\u82d7\u65cf\u81ea\u6cbb\u5dde"}]},{"id":"19","name":"\u5e7f\u4e1c","city":[{"id":"198","pid":"19","name":"\u5e7f\u5dde\u5e02"},{"id":"199","pid":"19","name":"\u97f6\u5173\u5e02"},{"id":"200","pid":"19","name":"\u6df1\u5733\u5e02"},{"id":"201","pid":"19","name":"\u73e0\u6d77\u5e02"},{"id":"202","pid":"19","name":"\u6c55\u5934\u5e02"},{"id":"203","pid":"19","name":"\u4f5b\u5c71\u5e02"},{"id":"204","pid":"19","name":"\u6c5f\u95e8\u5e02"},{"id":"205","pid":"19","name":"\u6e5b\u6c5f\u5e02"},{"id":"206","pid":"19","name":"\u8302\u540d\u5e02"},{"id":"207","pid":"19","name":"\u8087\u5e86\u5e02"},{"id":"208","pid":"19","name":"\u60e0\u5dde\u5e02"},{"id":"209","pid":"19","name":"\u6885\u5dde\u5e02"},{"id":"210","pid":"19","name":"\u6c55\u5c3e\u5e02"},{"id":"211","pid":"19","name":"\u6cb3\u6e90\u5e02"},{"id":"212","pid":"19","name":"\u9633\u6c5f\u5e02"},{"id":"213","pid":"19","name":"\u6e05\u8fdc\u5e02"},{"id":"214","pid":"19","name":"\u4e1c\u839e\u5e02"},{"id":"215","pid":"19","name":"\u4e2d\u5c71\u5e02"},{"id":"216","pid":"19","name":"\u6f6e\u5dde\u5e02"},{"id":"217","pid":"19","name":"\u63ed\u9633\u5e02"},{"id":"218","pid":"19","name":"\u4e91\u6d6e\u5e02"}]},{"id":"20","name":"\u5e7f\u897f","city":[{"id":"219","pid":"20","name":"\u5357\u5b81\u5e02"},{"id":"220","pid":"20","name":"\u67f3\u5dde\u5e02"},{"id":"221","pid":"20","name":"\u6842\u6797\u5e02"},{"id":"222","pid":"20","name":"\u68a7\u5dde\u5e02"},{"id":"223","pid":"20","name":"\u5317\u6d77\u5e02"},{"id":"224","pid":"20","name":"\u9632\u57ce\u6e2f\u5e02"},{"id":"225","pid":"20","name":"\u94a6\u5dde\u5e02"},{"id":"226","pid":"20","name":"\u8d35\u6e2f\u5e02"},{"id":"227","pid":"20","name":"\u7389\u6797\u5e02"},{"id":"228","pid":"20","name":"\u767e\u8272\u5e02"},{"id":"229","pid":"20","name":"\u8d3a\u5dde\u5e02"},{"id":"230","pid":"20","name":"\u6cb3\u6c60\u5e02"},{"id":"231","pid":"20","name":"\u6765\u5bbe\u5e02"},{"id":"232","pid":"20","name":"\u5d07\u5de6\u5e02"}]},{"id":"21","name":"\u6d77\u5357","city":[{"id":"233","pid":"21","name":"\u6d77\u53e3\u5e02"},{"id":"234","pid":"21","name":"\u4e09\u4e9a\u5e02"},{"id":"235","pid":"21","name":"\u7701\u76f4\u8f96\u53bf\u7ea7\u884c\u653f\u5355\u4f4d"}]},{"id":"22","name":"\u91cd\u5e86","city":[{"id":"236","pid":"22","name":"\u91cd\u5e86\u5e02"}]},{"id":"23","name":"\u56db\u5ddd","city":[{"id":"237","pid":"23","name":"\u6210\u90fd\u5e02"},{"id":"238","pid":"23","name":"\u81ea\u8d21\u5e02"},{"id":"239","pid":"23","name":"\u6500\u679d\u82b1\u5e02"},{"id":"240","pid":"23","name":"\u6cf8\u5dde\u5e02"},{"id":"241","pid":"23","name":"\u5fb7\u9633\u5e02"},{"id":"242","pid":"23","name":"\u7ef5\u9633\u5e02"},{"id":"243","pid":"23","name":"\u5e7f\u5143\u5e02"},{"id":"244","pid":"23","name":"\u9042\u5b81\u5e02"},{"id":"245","pid":"23","name":"\u5185\u6c5f\u5e02"},{"id":"246","pid":"23","name":"\u4e50\u5c71\u5e02"},{"id":"247","pid":"23","name":"\u5357\u5145\u5e02"},{"id":"248","pid":"23","name":"\u7709\u5c71\u5e02"},{"id":"249","pid":"23","name":"\u5b9c\u5bbe\u5e02"},{"id":"250","pid":"23","name":"\u5e7f\u5b89\u5e02"},{"id":"251","pid":"23","name":"\u8fbe\u5dde\u5e02"},{"id":"252","pid":"23","name":"\u96c5\u5b89\u5e02"},{"id":"253","pid":"23","name":"\u5df4\u4e2d\u5e02"},{"id":"254","pid":"23","name":"\u8d44\u9633\u5e02"},{"id":"255","pid":"23","name":"\u963f\u575d\u85cf\u65cf\u7f8c\u65cf\u81ea\u6cbb\u5dde"},{"id":"256","pid":"23","name":"\u7518\u5b5c\u85cf\u65cf\u81ea\u6cbb\u5dde"},{"id":"257","pid":"23","name":"\u51c9\u5c71\u5f5d\u65cf\u81ea\u6cbb\u5dde"}]},{"id":"24","name":"\u8d35\u5dde","city":[{"id":"258","pid":"24","name":"\u8d35\u9633\u5e02"},{"id":"259","pid":"24","name":"\u516d\u76d8\u6c34\u5e02"},{"id":"260","pid":"24","name":"\u9075\u4e49\u5e02"},{"id":"261","pid":"24","name":"\u5b89\u987a\u5e02"},{"id":"262","pid":"24","name":"\u94dc\u4ec1\u5730\u533a"},{"id":"263","pid":"24","name":"\u9ed4\u897f\u5357\u5e03\u4f9d\u65cf\u82d7\u65cf\u81ea\u6cbb\u5dde"},{"id":"264","pid":"24","name":"\u6bd5\u8282\u5730\u533a"},{"id":"265","pid":"24","name":"\u9ed4\u4e1c\u5357\u82d7\u65cf\u4f97\u65cf\u81ea\u6cbb\u5dde"},{"id":"266","pid":"24","name":"\u9ed4\u5357\u5e03\u4f9d\u65cf\u82d7\u65cf\u81ea\u6cbb\u5dde"}]},{"id":"25","name":"\u4e91\u5357","city":[{"id":"267","pid":"25","name":"\u6606\u660e\u5e02"},{"id":"268","pid":"25","name":"\u66f2\u9756\u5e02"},{"id":"269","pid":"25","name":"\u7389\u6eaa\u5e02"},{"id":"270","pid":"25","name":"\u4fdd\u5c71\u5e02"},{"id":"271","pid":"25","name":"\u662d\u901a\u5e02"},{"id":"272","pid":"25","name":"\u4e3d\u6c5f\u5e02"},{"id":"273","pid":"25","name":"\u666e\u6d31\u5e02"},{"id":"274","pid":"25","name":"\u4e34\u6ca7\u5e02"},{"id":"275","pid":"25","name":"\u695a\u96c4\u5f5d\u65cf\u81ea\u6cbb\u5dde"},{"id":"276","pid":"25","name":"\u7ea2\u6cb3\u54c8\u5c3c\u65cf\u5f5d\u65cf\u81ea\u6cbb\u5dde"},{"id":"277","pid":"25","name":"\u6587\u5c71\u58ee\u65cf\u82d7\u65cf\u81ea\u6cbb\u5dde"},{"id":"278","pid":"25","name":"\u897f\u53cc\u7248\u7eb3\u50a3\u65cf\u81ea\u6cbb\u5dde"},{"id":"279","pid":"25","name":"\u5927\u7406\u767d\u65cf\u81ea\u6cbb\u5dde"},{"id":"280","pid":"25","name":"\u5fb7\u5b8f\u50a3\u65cf\u666f\u9887\u65cf\u81ea\u6cbb\u5dde"},{"id":"281","pid":"25","name":"\u6012\u6c5f\u5088\u50f3\u65cf\u81ea\u6cbb\u5dde"},{"id":"282","pid":"25","name":"\u8fea\u5e86\u85cf\u65cf\u81ea\u6cbb\u5dde"}]},{"id":"26","name":"\u897f\u85cf","city":[{"id":"283","pid":"26","name":"\u62c9\u8428\u5e02"},{"id":"284","pid":"26","name":"\u660c\u90fd\u5730\u533a"},{"id":"285","pid":"26","name":"\u5c71\u5357\u5730\u533a"},{"id":"286","pid":"26","name":"\u65e5\u5580\u5219\u5730\u533a"},{"id":"287","pid":"26","name":"\u90a3\u66f2\u5730\u533a"},{"id":"288","pid":"26","name":"\u963f\u91cc\u5730\u533a"},{"id":"289","pid":"26","name":"\u6797\u829d\u5730\u533a"}]},{"id":"27","name":"\u9655\u897f","city":[{"id":"290","pid":"27","name":"\u897f\u5b89\u5e02"},{"id":"291","pid":"27","name":"\u94dc\u5ddd\u5e02"},{"id":"292","pid":"27","name":"\u5b9d\u9e21\u5e02"},{"id":"293","pid":"27","name":"\u54b8\u9633\u5e02"},{"id":"294","pid":"27","name":"\u6e2d\u5357\u5e02"},{"id":"295","pid":"27","name":"\u5ef6\u5b89\u5e02"},{"id":"296","pid":"27","name":"\u6c49\u4e2d\u5e02"},{"id":"297","pid":"27","name":"\u6986\u6797\u5e02"},{"id":"298","pid":"27","name":"\u5b89\u5eb7\u5e02"},{"id":"299","pid":"27","name":"\u5546\u6d1b\u5e02"}]},{"id":"28","name":"\u7518\u8083","city":[{"id":"300","pid":"28","name":"\u5170\u5dde\u5e02"},{"id":"301","pid":"28","name":"\u5609\u5cea\u5173\u5e02"},{"id":"302","pid":"28","name":"\u91d1\u660c\u5e02"},{"id":"303","pid":"28","name":"\u767d\u94f6\u5e02"},{"id":"304","pid":"28","name":"\u5929\u6c34\u5e02"},{"id":"305","pid":"28","name":"\u6b66\u5a01\u5e02"},{"id":"306","pid":"28","name":"\u5f20\u6396\u5e02"},{"id":"307","pid":"28","name":"\u5e73\u51c9\u5e02"},{"id":"308","pid":"28","name":"\u9152\u6cc9\u5e02"},{"id":"309","pid":"28","name":"\u5e86\u9633\u5e02"},{"id":"310","pid":"28","name":"\u5b9a\u897f\u5e02"},{"id":"311","pid":"28","name":"\u9647\u5357\u5e02"},{"id":"312","pid":"28","name":"\u4e34\u590f\u56de\u65cf\u81ea\u6cbb\u5dde"},{"id":"313","pid":"28","name":"\u7518\u5357\u85cf\u65cf\u81ea\u6cbb\u5dde"}]},{"id":"29","name":"\u9752\u6d77","city":[{"id":"314","pid":"29","name":"\u897f\u5b81\u5e02"},{"id":"315","pid":"29","name":"\u6d77\u4e1c\u5730\u533a"},{"id":"316","pid":"29","name":"\u6d77\u5317\u85cf\u65cf\u81ea\u6cbb\u5dde"},{"id":"317","pid":"29","name":"\u9ec4\u5357\u85cf\u65cf\u81ea\u6cbb\u5dde"},{"id":"318","pid":"29","name":"\u6d77\u5357\u85cf\u65cf\u81ea\u6cbb\u5dde"},{"id":"319","pid":"29","name":"\u679c\u6d1b\u85cf\u65cf\u81ea\u6cbb\u5dde"},{"id":"320","pid":"29","name":"\u7389\u6811\u85cf\u65cf\u81ea\u6cbb\u5dde"},{"id":"321","pid":"29","name":"\u6d77\u897f\u8499\u53e4\u65cf\u85cf\u65cf\u81ea\u6cbb\u5dde"}]},{"id":"30","name":"\u5b81\u590f","city":[{"id":"322","pid":"30","name":"\u94f6\u5ddd\u5e02"},{"id":"323","pid":"30","name":"\u77f3\u5634\u5c71\u5e02"},{"id":"324","pid":"30","name":"\u5434\u5fe0\u5e02"},{"id":"325","pid":"30","name":"\u56fa\u539f\u5e02"},{"id":"326","pid":"30","name":"\u4e2d\u536b\u5e02"}]},{"id":"31","name":"\u65b0\u7586","city":[{"id":"327","pid":"31","name":"\u4e4c\u9c81\u6728\u9f50\u5e02"},{"id":"328","pid":"31","name":"\u514b\u62c9\u739b\u4f9d\u5e02"},{"id":"329","pid":"31","name":"\u5410\u9c81\u756a\u5730\u533a"},{"id":"330","pid":"31","name":"\u54c8\u5bc6\u5730\u533a"},{"id":"331","pid":"31","name":"\u660c\u5409\u56de\u65cf\u81ea\u6cbb\u5dde"},{"id":"332","pid":"31","name":"\u535a\u5c14\u5854\u62c9\u8499\u53e4\u81ea\u6cbb\u5dde"},{"id":"333","pid":"31","name":"\u5df4\u97f3\u90ed\u695e\u8499\u53e4\u81ea\u6cbb\u5dde"},{"id":"334","pid":"31","name":"\u963f\u514b\u82cf\u5730\u533a"},{"id":"335","pid":"31","name":"\u514b\u5b5c\u52d2\u82cf\u67ef\u5c14\u514b\u5b5c\u81ea\u6cbb\u5dde"},{"id":"336","pid":"31","name":"\u5580\u4ec0\u5730\u533a"},{"id":"337","pid":"31","name":"\u548c\u7530\u5730\u533a"},{"id":"338","pid":"31","name":"\u4f0a\u7281\u54c8\u8428\u514b\u81ea\u6cbb\u5dde"},{"id":"339","pid":"31","name":"\u5854\u57ce\u5730\u533a"},{"id":"340","pid":"31","name":"\u963f\u52d2\u6cf0\u5730\u533a"},{"id":"341","pid":"31","name":"\u7701\u76f4\u8f96\u53bf\u7ea7\u884c\u653f\u5355\u4f4d"}]},{"id":"32","name":"\u9999\u6e2f","city":[{"id":"342","pid":"32","name":"\u9999\u6e2f"}]},{"id":"33","name":"\u6fb3\u95e8","city":[{"id":"343","pid":"33","name":"\u6fb3\u95e8"}]},{"id":"34","name":"\u53f0\u6e7e","city":[{"id":"344","pid":"34","name":"\u53f0\u6e7e"}]}];
          //利用城市列表数据操作dom
          for(var i=0;i<data.length;i++){
            //注意当前循环变量的重新初始化创建
            var City=data[i].city;
            var lisDom='';
            var lisParent="";//内容拼接
            //拼接城市
            for(var j=0;j<City.length;j++){
              lisDom+="<li data-id='"+City[j].id+"'>"+City[j].name+"</li>";
            }
            // 拼接省份
            lisParent+="<li class='item'><a data-id='"+data[i].id+"'>"+data[i].name+"</a><ul>"+lisDom+"</ul></li>";
            html+=lisParent;
          }
          ulDom.html(html);
        }

        if(ulDom.length){
          //调用城市列表初始化函数
          cityInit();
          //事件委托
          ulDom.on('click','.item',function(e){
            var target=e.target.tagName.toLowerCase();
            // 点击a标签则展开城市列表
            if(target=='a'){
              $(this).find('ul').slideToggle().end().siblings().find('ul').slideUp();
            }else if(target=='li'){//点击li城市子项则设置当前位置
              var currentPosID=$(e.target).data("id");
              var currentPos=$(e.target).text();
              //使用data()设置的自定义属性是看不到的！而是存在jQuery.cache这个对象上
              $("#currentPos").text(currentPos).data("id",currentPosID);
              // console.log($("#currentPos").data("id"));
              alert('选择当前位置后可跳转回首页位置！');
            }
          });
        }

        /*分类页面*/
        /*图片懒加载:可以考虑多次实例化，使用不同的预览图*/
        // $("img").lazyload({
        //     placeholder: "images/85.jpg", //用图片提前占位
        //     // placeholder,值为某一图片路径.此图片用来占据将要加载的图片的位置,待图片加载时,占位图则会隐藏
        //     effect: "fadeIn", // 载入使用何种效果
        //     // effect(特效),值有show(直接显示),fadeIn(淡入),slideDown(下拉)等,常用fadeIn
        //     threshold: 100, // 提前开始加载
        //     // threshold,值为数字,代表页面高度.如设置为200,表示滚动条在离目标位置还有200的高度时就开始加载图片,可以做到不让用户察觉
        //     container: $("#sortCon"),  // 对某容器中的图片实现效果
        //     // container,值为某容器.lazyload默认在拉动浏览器滚动条时生效,这个参数可以让你在拉动某DIV的滚动条时依次加载其中的图片
        //     failurelimit: 10 // 图片排序混乱时
        //         // failurelimit,值为数字.lazyload默认在找到第一张不在可见区域里的图片时则不再继续加载,但当HTML容器混乱的时候可能出现可见区域内图片并没加载出来的情况,failurelimit意在加载N张可见区域外的图片,以避免出现这个问题.
        // });

        /*表单验证页面*/

        //快捷登录
        if($("#loginForm").length){
          validator.init({id:"loginForm",btnId:"loginBtn",callback:function(){
            //ajax登录模拟
            $.ajax({
              type:'get',
              url:"http://www.runoob.com/try/angularjs/data/Customers_JSON.php",
              dataType:'jsonp',
              success:function(data){
                console.log(data.result);
              },
              error:function(data){
                alert("出错了!");
              }
            });
          }});
        }
        //普通登录
        if($("#normalLoginForm").length){
          validator.init({id:"normalLoginForm",btnId:"normalLoginBtn",callback:function(){
            //ajax登录模拟
            $.ajax({
              type:'get',
              url:"#",
              dataType:'json',
              success:function(data){
                console.log(data);
              },
              error:function(data){
                alert("出错了!");
              }
            });
          }});
        }
        //忘记密码
        if($("#forgetPwdForm").length){
          validator.init({id:"forgetPwdForm",btnId:"forgetPwdBtn",callback:function(){
            //ajax登录模拟
            $.ajax({
              type:'get',
              url:"#",
              dataType:'json',
              success:function(data){
                console.log(data);
              },
              error:function(data){
                alert("出错了!");
              }
            });
          }});
        }
        //注册页面
        if($("#registerForm").length){
          validator.init({id:"registerForm",btnId:"registerBtn",callback:function(){
            //ajax登录模拟
            $.ajax({
              type:'get',
              url:"#",
              dataType:'json',
              success:function(data){
                console.log(data);
              },
              error:function(data){
                alert("出错了!");
              }
            });
          }});
        }

        /*我的订单页面*/
        commonObj.tabs($("#order"));
    });
});
