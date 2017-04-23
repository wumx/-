$(function(){
//加载工具栏
	$('#tools').load("com.html #tool_wapper",function(){

		//划入效果
		$('.tool_hide').mouseenter(function(){
			$(this).find('.tool_show').css('display',"block");
			$(this).css('background',"#fff");
		});
		//划出效果
		$('#tool_wapper').find('.tool_hide').mouseleave(function(){
			$(this).find('.tool_show').css('display',"none");
			$(this).css('background',"#f7f7f7");
		});

	//购物车
	$('#shop-car').load('right-sideBar.html',function(){
		//购物车的显示与隐藏
		$('.car').click(function(){
			$('.right-sidebar').toggleClass('r0');
			sc_msg();
		});
		//购物车点击隐藏
	  $("#side-shop-car").find(".title").children().eq(0).click(function(){
	  	$('.right-sidebar').toggleClass('r0');
			sc_msg();
	  });
	  //点击购物车进入购物车页面
	  $("#side-shop-car").find(".title").children().eq(1).click(function(){
	    window.location.href = "shop-car.html";
	  });
		//商品的划入划出
		$('.many-car').on('mouseenter','li',function(){

			$(this).css('background','#eee');
			$(this).find('.icon').toggleClass('hide');

		});
		$('.many-car').on('mouseleave','li',function(){

			$(this).css('background','#fff');
			$(this).find('.icon').toggleClass('hide');

		});

		sc_msg();
		sc_car();
		$('.addCart').click(function(){
			var id = $(this).attr('id');
			var first = $.cookie('goods')==null?true:false;
			var num = parseInt($(".num").val());  //商品数量
			//console.log(num);
			//判断是否有cookie进行添加
			var same = false;//判断时候已经追加
			//是否是第一次添加
			if(first){
				//第一次添加,建立json结构。
				$.cookie('goods','[{id:'+id+',num:'+num+'}]');
			}else{
				var str = $.cookie('goods');
				var arr = eval(str);
				//遍历所有对象。如果id相同，让该商品数量递增 ;
				for(var attr in arr){
					if(arr[attr].id == id){
						arr[attr].num = arr[attr].num + num;  //让json结构中num自增。
						var cookieStr = JSON.stringify(arr);//将json对象转换成字符串.
						$.cookie('goods',cookieStr);
						same = true;
					}
			}
				if(!same){
					var obj  = {id:id,num:num};
					arr.push(obj);
					var cookieStr = JSON.stringify(arr);
					$.cookie('goods',cookieStr);
				}

			}
		sc_car();
		sc_msg()
	});
		//购物车;
		function sc_car(){
			var sc_str = $.cookie('goods');
			if(sc_str){//如果购物车cookie不为空。
				var sc_obj = eval(sc_str);
				var sc_num = 0 ;
				for(var i in sc_obj){
					sc_num = Number(sc_obj[i].num) + sc_num;
				}
				$('.gengral-num').html(sc_num);
			}
		}
		//商品的拼接
		function sc_msg(){
			$.ajax({
				url:'json/details.json',
				type:'GET',
				success:function(res){
					var sc_str = $.cookie('goods');
					if(sc_str){
						var sc_obj = eval(sc_str);
						var sc_num = 0 ;
						var html = '';
						for(var i in sc_obj){
						if(sc_obj[i].num != 0){

						html += '<li id="'+res[sc_obj[i].id].id+'">';
						html += '<div class="car-img">';
						html += '<img src="'+res[sc_obj[i].id].img1+'" alt="">';
						html += '</div>';
         				html += '<div class="product-news">';
         				html += '<a href="javascript:;" class="">';
         				html += ''+res[sc_obj[i].id].name+'';
        					html += '</a>';

        					//商品價格
         				html += '<p class="sl-show icon" name="'+res[sc_obj[i].id].id+'">';
         				html += '<i class="je">'+res[sc_obj[i].id].price+'</i>  * ';
         				html += '<i class="s1">'+sc_obj[i].num+'</i>';
         				html += '</p>';

         				//商品數量
         				html += '<p class="s2-show clearfix icon hide" name="'+res[sc_obj[i].id].id+'">';
         				html += '<i class="car-cut"> </i>';
         				html += '<span class="s1">'+sc_obj[i].num+'</span>';
         				html += '<i class="car-add"> </i>';
         				html += '</p>';


         				html += '</div>';
         				html += '<div class="product-price" name="'+res[sc_obj[i].id].id+'">';
         				html += '<span><i>￥</i><b class="s2">'+(res[sc_obj[i].id].price * sc_obj[i].num)+'</b></span>';
           				html += '<em class="hide icon del" style="cursor:pointer"></em>';
           				html += '</div>';
           				html += '</li>';
           			}
						}
						$('.many-car').html(html);
					}
					//商品的减少
					$('.car-cut').click(function(){


						var str = $(this).parent().attr('name');

						var num = parseInt($('p[name='+str+']').find('.s1').html());

						var price = parseInt($('p[name='+str+']').find('.je').html());
						if(num <= 1){
							num == 1
						}else{
							num--;
						}

						$('p[name='+str+']').find('.s1').html(num);

						carNum(str,num,price);

					});

					//商品的增加
					$('.car-add').click(function(){

						var str = $(this).parent().attr('name');
						var num = parseInt($('p[name='+str+']').find('.s1').html());
						var price = parseInt($('p[name='+str+']').find('.je').html());
						num++;
						$('p[name='+str+']').find('.s1').html(num);

						carNum(str,num,price);
					});

					//商品數量的函數
					function carNum(name,num,price){
						var str = $.cookie('goods');
						var arr = eval(str);
						//遍历所有对象。如果id相同，让该商品数量递增 ;
						for(var attr in arr){
							if(arr[attr].id == name){
								arr[attr].num = num;
								var cookieStr = JSON.stringify(arr);//将json对象转换成字符串.
								$.cookie('goods',cookieStr);
							}
						}
						//console.log(price);
						var prices = num * price;
						//console.log(prices);
						$('div[name='+name+']').find('b').html(prices)
						sc_car();
						carsMoney();
					}
					//總價
					function carsMoney(){
						var money = 0;
						for(var i = 0 ; i < $('.s2').length ; i++ ){
							money += parseInt($('.s2').eq(i).html());
						}
						$('.general-money').html(money);
					}
					carsMoney();

					//商品删除按钮
					$('.del').click(function(){

						var id = parseInt($(this).parent().parent().attr('id'));
						$(this).parent().parent().css('display',"none");

						var str = $.cookie('goods');
						var arr = eval(str);
						//遍历所有对象。如果id相同，移出商品信息 ;
						for(var attr in arr){
							if(arr[attr].id == id){
								arr[attr].num = 0;
								var cookieStr = JSON.stringify(arr);//将json对象转换成字符串.
								$.cookie('goods',cookieStr);
							}
						}
						$('div[name='+id+']').find('b').html(0);
						sc_car();
						carsMoney();
					})

				}

			});
		}
	});


	//登录注册
	 function userName(callback){
			var user = $.cookie('userStatus');
			var html = '';
			if(user){
 				html += '<a href="bl_login.html" class="login">';
 				html += '<span>'+$.cookie('userId')+'</span></a>';
 				html += '<a href="bl_zc.html" class="register" id="userOut">退出</a>';
			}else{
				html += '<a href="bl_login.html" class="login">';
				html += '<b></b><span>请登录</span></a>';
				html += '<a href="bl_zc.html" class="register">注册</a>';
			}

			$('.login_register').html(html);
			callback();
		}
		userName(function(){
			$("#userOut").click(function(){
				$.cookie('userStatus' , "0");
			})
		});
	});

//加载尾部

	$('#footer').load("com.html .foot_wapper");

//侧边栏的划入

	$('.sideBar_list').find('li').mouseenter(function(){
		var listIndex = $(this).index();
		$(this).css('background',"#fff");          //改变背景色
		$(this).children().eq(0).css("background-position-x","-26px"); //改变 侧栏  i 的背景
		$(this).children().css("color","#E6133C");            //改变 a 链接的字体颜色

		//侧栏心的显示
		$('.left-ul-show').css('display','block');
		$('.left-ul-show').children().eq(1).children().eq(listIndex)
		.css('display','block').siblings().css('display','none');

	});
//侧边栏的划出
	$('.sideBar_list').find('li').mouseleave(function(){
		$(this).css('background',"#E6133C");
		$(this).children().eq(0).css("background-position-x","0");
		$(this).children().css("color","#fff");

		//侧栏心得隐藏
		$('.left-ul-show').css('display','none');

		$('.left-ul-show').mouseenter(function(){
			$(this).css("display","block");
		})
		$('.left-ul-show').mouseleave(function(){
			$(this).css("display","none");
		});
	});
//侧边栏心加载
	$.ajax({
		url:'json/bl.json',
		type:"get",
		success:function(res){
			$('.left-ul-show').html(res[0].message);
			$('.gb-icon').click(function(){
				$('.left-ul-show').css('display','none');
			})
		}
	});


/********焦点图轮播*********/
	var bannerTimer = null;                     //banner图定时器
	var bannerIndex = 0;  						//轮播图下标
	var $bannerLi1 = $('#banner').find("ul").eq(0).children();    //获取轮播图的元素
	var $bannerLi2 = $('#banner').find("ol").eq(0).children();    //获取轮播图下标元素

	function bannerCarousel(){
		if(bannerIndex == $bannerLi1.length -1){
			bannerIndex = 0;
		}else{
			bannerIndex++;
		}
		$bannerLi1.eq(bannerIndex).fadeIn().siblings().fadeOut(); //轮播图切换

		//轮播图中的小圆点切换
		var $a = $bannerLi2.eq(bannerIndex);      //当前小圆点
		$a.animate({
			"width":"30px"
		}).siblings().animate({
			"width":"14px"
		});
		$a.css("background","#E6133C").siblings().css("background","#222");
	}
	//开始轮播
	bannerTimer = setInterval(bannerCarousel,2000);

	//轮播图定时器的开启与关闭
	$('.banner_inner').mouseenter(function(){
		clearInterval(bannerTimer);
		$('.banner_inner').children().eq(1).stop().animate({
			"margin-right":"-382px"
		});
		$('.banner_inner').children().eq(2).stop().animate({
			"margin-left":"-405px"
		});
	});
	$('.banner_inner').mouseleave(function(){
		bannerTimer = setInterval(bannerCarousel,2000);
		$('.banner_inner').children().eq(1).stop().animate({
			"margin-right":"-442px"
		});
		$('.banner_inner').children().eq(2).stop().animate({
			"margin-left":"-445px"
		});
	});
	// 移入小圆点则显示对应的图片
	$bannerLi2.parent().on('mouseenter','li',function(){
		//clearInterval(bannerTimer);
		bannerIndex = $(this).index();
		$bannerLi1.eq(bannerIndex).stop().fadeIn().siblings().stop().fadeOut(); //轮播图切换
		//轮播图中的小圆点切换
		var $a = $bannerLi2.eq(bannerIndex);      //当前小圆点
		$a.stop().animate({
			"width":"30px"
		}).siblings().stop().animate({
			"width":"14px"
		});
		$a.css("background","#E6133C").siblings().css("background","#222");
	});
	//左右点击按钮实现
	//右点击
	$('.banner_inner').children().eq(1).click(function(){
		bannerCarousel();
	});
	$('.banner_inner').children().eq(1).hover(function(){
		$(this).css('background-position-y','-70px')
	},function(){
		$(this).css('background-position-y','0')
	})
	//左点击
	$('.banner_inner').children().eq(2).click(function(){
		clearInterval(bannerTimer);
			bannerIndex = bannerIndex-1;
			if(bannerIndex == -1){
				bannerIndex = $bannerLi1.length -1;
			}
		$bannerLi1.eq(bannerIndex).stop().fadeIn().siblings().stop().fadeOut(); //轮播图切换
		//轮播图中的小圆点切换
		var $a = $bannerLi2.eq(bannerIndex);      //当前小圆点
		$a.stop().animate({
			"width":"30px"
		}).siblings().stop().animate({
			"width":"14px"
		});
		$a.css("background","#E6133C").siblings().css("background","#222");
	});
	$('.banner_inner').children().eq(2).hover(function(){
		$(this).css('background-position-y','-70px')
	},function(){
		$(this).css('background-position-y','0')
	})
/********Ajax加载楼梯**************/
/**ajax 加载楼梯banner**/
	$.ajax({
		url:"json/floorBanner.json",
		type:"get",
		success:function(res){
			for(var i=0;i<res.length;i++){
				var str = '';
					str += '<ul>';
					str += '<li><a href="#"><img src="'+res[i].url1+'"/></a></li>';
					str += '<li><a href="#"><img src="'+res[i].url2+'"/></a></li>';
					str += '<li><a href="#"><img src="'+res[i].url2+'"/></a></li>';
					str += '</ul>';
					str += '<ol>';
					str += '<li></li>';
					str += '<li></li>';
					str += '<li></li>';
					str += '</ol>';
				$('.stairs_inner').children().eq(i).children().eq(1).html(str);
			}
			/*******楼梯轮播图********/
			//1F
			var floorTimer1 = null;
			var floorIndex1 = 0;
			var $floorBanner1 = $('.floor_banner').eq(0);
			var $oUl1 = $floorBanner1.children().eq(0);
			var $oli1 = $floorBanner1.children().eq(1);
			var $aLi1 = $oUl1.children();
			//2F
			var floorTimer2 = null;
			var floorIndex2 = 0;
			var $floorBanner2 = $('.floor_banner').eq(1);
			var $oUl2 = $floorBanner2.children().eq(0);
			var $oli2 = $floorBanner2.children().eq(1);
			var $aLi2 = $oUl2.children();
			//3F
			var floorTimer3 = null;
			var floorIndex3 = 0;
			var $floorBanner3 = $('.floor_banner').eq(2);
			var $oUl3 = $floorBanner3.children().eq(0);
			var $oli3 = $floorBanner3.children().eq(1);
			var $aLi3 = $oUl3.children();
			//4F
			var floorTimer4 = null;
			var floorIndex4 = 0;
			var $floorBanner4 = $('.floor_banner').eq(3);
			var $oUl4 = $floorBanner4.children().eq(0);
			var $oli4 = $floorBanner4.children().eq(1);
			var $aLi4 = $oUl4.children();
			//5F
			var floorTimer5 = null;
			var floorIndex5 = 0;
			var $floorBanner5 = $('.floor_banner').eq(4);
			var $oUl5 = $floorBanner5.children().eq(0);
			var $oli5 = $floorBanner5.children().eq(1);
			var $aLi5 = $oUl5.children();
			//6F
			var floorTimer6 = null;
			var floorIndex6 = 0;
			var $floorBanner6 = $('.floor_banner').eq(5);
			var $oUl6 = $floorBanner6.children().eq(0);
			var $oli6 = $floorBanner6.children().eq(1);
			var $aLi6 = $oUl6.children();
			//7F
			var floorTimer7 = null;
			var floorIndex7 = 0;
			var $floorBanner7 = $('.floor_banner').eq(6);
			var $oUl7 = $floorBanner7.children().eq(0);
			var $oli7 = $floorBanner7.children().eq(1);
			var $aLi7 = $oUl7.children();
			//8F
			var floorTimer8 = null;
			var floorIndex8 = 0;
			var $floorBanner8 = $('.floor_banner').eq(7);
			var $oUl8 = $floorBanner8.children().eq(0);
			var $oli8 = $floorBanner8.children().eq(1);
			var $aLi8 = $oUl8.children();

		//计算ul的宽，并且clone一个li加入ul
			function floorClone(obj0,obj1){
				var $aLi = obj0.eq(0).clone(true);
				obj1.append($aLi);
				var str = (obj0.length+1) * obj0.eq(0).outerWidth() + "px";
				obj1.css("width",str);
			}
			floorClone($aLi1,$oUl1);           	//1F克隆调用
			floorClone($aLi2,$oUl2); 			//2F克隆调用
			floorClone($aLi3,$oUl3); 			//3F克隆调用
			floorClone($aLi4,$oUl4); 			//4F克隆调用
			floorClone($aLi5,$oUl5); 			//5F克隆调用
			floorClone($aLi6,$oUl6); 			//6F克隆调用
			floorClone($aLi7,$oUl7); 			//7F克隆调用
			floorClone($aLi8,$oUl8);			//8F克隆调用
		//轮播函数
			//1F轮播
			function floorCarousel1(){
			/*轮播图下标判断与运行**/
				if(floorIndex1 == $oUl1.children().length - 1){
					floorIndex1 = 1;
					$oUl1.css("left","0");
				}else{
					floorIndex1++;
				}
				var str = -floorIndex1 * $oUl1.children().eq(0).outerWidth() + "px";
				$oUl1.animate({
					"left":str
				});
			/*轮播进度条的判断与运行*/
				if(floor1 == $oli1.children().length - 1){
					floor1 = 0;
				}else{
					floor1++;
				}
				//var $oli = $oli1.children().eq(floor1);
				//console.log($oli.children())
//				$oli.children().animate({
//					"width":"35px"
//				})
				$oli1.children().eq(floor1).css('background',"red").siblings()
						.css("background","#fff");
			}
			floorTimer1 = setInterval(floorCarousel1,2000);
			//开启与关闭定时器事件
			$oUl1.children().mouseenter(function(){
				clearInterval(floorTimer1);
			});
			$oUl1.children().mouseleave(function(){
				floorTimer1 = setInterval(floorCarousel1,2000);
			});
			//轮播图进度条
			var floor1 = 0;
			$oli1.children().eq(floor1).css('background',"red");

			//2F轮播
			function floorCarousel2(){
				/*轮播图的判断与运行*/
				if(floorIndex2 == $oUl2.children().length - 1){
					floorIndex2 = 1;
					$oUl2.css("left","0");
				}else{
					floorIndex2++;
				}

				var str = -floorIndex2 * $oUl2.children().eq(0).outerWidth() + "px";
				$oUl2.animate({
					"left":str
				});
				/*轮播进度条的判断与运行*/
				if(floor2 == $oli2.children().length - 1){
					floor2 = 0;
				}else{
					floor2++;
				}
			//var $oli = $oli1.children().eq(floor1);
				$oli2.children().eq(floor2).css('background',"#7E5C17").siblings()
						.css("background","#fff");
			}
			floorTimer2 = setInterval(floorCarousel2,1000);
			//开启与关闭定时器事件
			$oUl2.children().mouseenter(function(){
				clearInterval(floorTimer2);
			});
			$oUl2.children().mouseleave(function(){
				floorTimer2 = setInterval(floorCarousel2,1000);
			});

			var floor2 = 0;
			$oli2.children().eq(floor2).css('background',"red");
			//3F轮播
			function floorCarousel3(){
				if(floorIndex3 == $oUl3.children().length - 1){
					floorIndex3 = 1;
					$oUl3.css("left","0");
				}else{
					floorIndex3++;
				}
				var str = -floorIndex3 * $oUl3.children().eq(0).outerWidth() + "px";
				$oUl3.animate({
					"left":str
				});

				/*轮播进度条的判断与运行*/
				if(floor3 == $oli3.children().length - 1){
					floor3 = 0;
				}else{
					floor3++;
				}
			//var $oli = $oli1.children().eq(floor1);
				$oli3.children().eq(floor2).css('background',"#CF5B05").siblings()
						.css("background","#fff");
			}
			floorTimer3 = setInterval(floorCarousel3,1000);
			//开启与关闭定时器事件
			$oUl3.children().mouseenter(function(){
				clearInterval(floorTimer3);
			});
			$oUl3.children().mouseleave(function(){
				floorTimer3 = setInterval(floorCarousel3,1000);
			});

			var floor3 = 0;
			$oli3.children().eq(floor2).css('background',"#CF5B05");
			//4F轮播
			function floorCarousel4(){
				if(floorIndex4 == $oUl4.children().length - 1){
					floorIndex4 = 1;
					$oUl4.css("left","0");
				}else{
					floorIndex4++;
				}
				var str = -floorIndex4 * $oUl4.children().eq(0).outerWidth() + "px";
				$oUl4.animate({
					"left":str
				});
				/*轮播进度条的判断与运行*/
				if(floor4 == $oli4.children().length - 1){
					floor4 = 0;
				}else{
					floor4++;
				}
			//var $oli = $oli1.children().eq(floor1);
				$oli4.children().eq(floor2).css('background',"#178FCD").siblings()
						.css("background","#fff");
			}
			floorTimer4 = setInterval(floorCarousel4,1000);
			//开启与关闭定时器事件
			$oUl4.children().mouseenter(function(){
				clearInterval(floorTimer4);
			});
			$oUl4.children().mouseleave(function(){
				floorTimer4 = setInterval(floorCarousel4,1000);
			});

			var floor4 = 0;
			$oli4.children().eq(floor2).css('background',"#178FCD");
			//5F轮播
			function floorCarousel5(){
				if(floorIndex5 == $oUl5.children().length - 1){
					floorIndex5 = 1;
					$oUl5.css("left","0");
				}else{
					floorIndex5++;
				}
				var str = -floorIndex5 * $oUl5.children().eq(0).outerWidth() + "px";
				$oUl5.animate({
					"left":str
				});
				/*轮播进度条的判断与运行*/
				if(floor5 == $oli5.children().length - 1){
					floor5 = 0;
				}else{
					floor5++;
				}
			//var $oli = $oli1.children().eq(floor1);
				$oli5.children().eq(floor2).css('background',"#853796").siblings()
						.css("background","#fff");
			}
			floorTimer5 = setInterval(floorCarousel5,1000);
			//开启与关闭定时器事件
			$oUl5.children().mouseenter(function(){
				clearInterval(floorTimer5);
			});
			$oUl5.children().mouseleave(function(){
				floorTimer5 = setInterval(floorCarousel5,1000);
			});
			var floor5 = 0;
			$oli5.children().eq(floor2).css('background',"#853796");

			//6F轮播
			function floorCarousel6(){
				if(floorIndex6 == $oUl6.children().length - 1){
					floorIndex6 = 1;
					$oUl6.css("left","0");
				}else{
					floorIndex6++;
				}
				var str = -floorIndex6 * $oUl6.children().eq(0).outerWidth() + "px";
				$oUl6.animate({
					"left":str
				});
				/*轮播进度条的判断与运行*/
				if(floor6 == $oli6.children().length - 1){
					floor6 = 0;
				}else{
					floor6++;
				}
			//var $oli = $oli1.children().eq(floor1);
				$oli6.children().eq(floor2).css('background',"#E54535").siblings()
						.css("background","#fff");
			}
			floorTimer6 = setInterval(floorCarousel6,1000);
			//开启与关闭定时器事件
			$oUl6.children().mouseenter(function(){
				clearInterval(floorTimer6);
			});
			$oUl6.children().mouseleave(function(){
				floorTimer6 = setInterval(floorCarousel6,1000);
			});
			var floor6 = 0;
			$oli6.children().eq(floor2).css('background',"#E54535");
			//7F轮播
			function floorCarousel7(){
				if(floorIndex7 == $oUl7.children().length - 1){
					floorIndex7 = 1;
					$oUl7.css("left","0");
				}else{
					floorIndex7++;
				}
				var str = -floorIndex7 * $oUl7.children().eq(0).outerWidth() + "px";
				$oUl7.animate({
					"left":str
				});
				/*轮播进度条的判断与运行*/
				if(floor7 == $oli2.children().length - 1){
					floor7 = 0;
				}else{
					floor7++;
				}
			//var $oli = $oli1.children().eq(floor1);
				$oli7.children().eq(floor2).css('background',"#EB3889").siblings()
						.css("background","#fff");
			}
			floorTimer7 = setInterval(floorCarousel7,1000);
			//开启与关闭定时器事件
			$oUl7.children().mouseenter(function(){
				clearInterval(floorTimer7);
			});
			$oUl7.children().mouseleave(function(){
				floorTimer7 = setInterval(floorCarousel7,1000);
			});
			var floor7 = 0;
			$oli7.children().eq(floor2).css('background',"#EB3889");


			//8F轮播
			function floorCarousel8(){
				if(floorIndex8 == $oUl8.children().length - 1){
					floorIndex8 = 1;
					$oUl8.css("left","0");
				}else{
					floorIndex8++;
				}
				var str = -floorIndex8 * $oUl8.children().eq(0).outerWidth() + "px";
				$oUl8.animate({
					"left":str
				});
				/*轮播进度条的判断与运行*/
				if(floor8 == $oli8.children().length - 1){
					floor8 = 0;
				}else{
					floor8++;
				}
			//var $oli = $oli1.children().eq(floor1);
				$oli8.children().eq(floor2).css('background',"#2B63E2").siblings()
						.css("background","#fff");
			}
			floorTimer8 = setInterval(floorCarousel8,1000);
			//开启与关闭定时器事件
			$oUl8.children().mouseenter(function(){
				clearInterval(floorTimer8);
			});
			$oUl8.children().mouseleave(function(){
				floorTimer8 = setInterval(floorCarousel8,1000);
			});
			var floor8 = 0;
			$oli2.children().eq(floor2).css('background',"#2B63E2");
		}
	});
/*ajax 加载楼梯主要内容**/
	$.ajax({
		url:"json/floors.json",
		type:"get",
		success:function(res){
			for(var i=0;i<res.length;i++){
				switch(i+1){
					case 1:fn_1(res[i],i);break;
					case 2:fn_2478(res[i],i);break;
					case 3:fn_3(res[i],i);break;
					case 4:fn_2478(res[i],i);break;
					case 5:fn_56(res[i],i);break;
					case 6:fn_56(res[i],i);break;
					case 7:fn_2478(res[i],i);break;
					case 8:fn_2478(res[i],i);break;
				}
			}
		}
	});
	//1f 加载主体函数
	function fn_1(obj,index){
		var str = '';
			str += '<div class="floor_t clearfix">';
			str += '<div class="floor_t_l">';
			str += '<a href="#"><img src="'+obj.url1+'"/></a>';
			str += '</div>';
			str += '<div class="floor_t_c">';
			str += '<a href="#"><img src="'+obj.url2+'"/></a>'
			str += '</div>'
			str += '<div class="floor_t_r">'
			str += '<a href="#"><img src="'+obj.url3+'"/></a>'
			str += '</div>'
			str += '</div>'
			str += '<div class="floor_b">'
			str += '<a href="#"><img src="'+obj.url4+'"/></a>'
			str += '<a href="#"><img src="'+obj.url5+'"/></a>'
			str += '<a href="#"><img src="'+obj.url6+'"/></a>'
			str += '<a href="#"><img src="'+obj.url7+'"/></a>'
			str += '</div>'
		$('.stairs_inner').children().eq(index).children().eq(2).html(str);
	}
	//3f 加载主体函数
	function fn_3(obj,index){
		var str = '';
			str += '<div class="floor_t clearfix">'
			str += '<a href="#"><img src="'+obj.fturl1+'"/></a>'
			str += '<a href="#"><img src="'+obj.fturl2+'"/></a>'
			str += '<a href="#"><img src="'+obj.fturl3+'"/></a>'
			str += '<a href="#"><img src="'+obj.fturl4+'"/></a>'
			str += '</div>'
			str += '<div class="floor_b clearfix">'
			str += '<a href="#"><img src="'+obj.fburl1+'"/></a>'
			str += '<a href="#"><img src="'+obj.fburl2+'"/></a>'
			str += '<a href="#"><img src="'+obj.fburl3+'"/></a>'
			str += '<a href="#"><img src="'+obj.fburl4+'"/></a>'
			str += '</div>'
		$('.stairs_inner').children().eq(index).children().eq(2).html(str);
	}
	// 5f/6f ajax 加载主体函数
	function fn_56(obj,index){
		var str = '';
			str += '<div class="floor_t clearfix">'
			str += '<div class="floor_t_l">'
			str += '<a href="#"><img src="'+obj.fturl1+'"/></a>'
			str += '</div>'
			str += '<div class="floor_t_c">'
			str += '<a href="#"><img src="'+obj.fturl2+'"/></a>'
			str += '</div>'
			str += '<div class="floor_t_r">'
			str += '<a href="#"><img src="'+obj.fturl3+'"/></a>'
			str += '<a href="#"><img src="'+obj.fturl4+'"/></a>'
			str += '</div>'
			str += '</div>'
			str += '<div class="floor_m clearfix">'
			str += '<a href="#"><img src="'+obj.fmurl1+'"/></a>'
			str += '<a href="#"><img src="'+obj.fmurl2+'"/></a>'
			str += '<a href="#"><img src="'+obj.fmurl3+'"/></a>'
			str += '<a href="#"><img src="'+obj.fmurl4+'"/></a>'
			str += '</div>'
			str += '<div class="floor_b clearfix">'
			str += '<a href="#"><span></span><img src="'+obj.fburl1+'"/></a>'
			str += '<a href="#"><span></span><img src="'+obj.fburl2+'"/></a>'
			str += '<a href="#"><span></span><img src="'+obj.fburl3+'"/></a>'
			str += '<a href="#"><span></span><img src="'+obj.fburl4+'"/></a>'
			str += '<a href="#"><span></span><img src="'+obj.fburl5+'"/></a>'
			str += '</div>'
		$('.stairs_inner').children().eq(index).children().eq(2).html(str);
	}
	//2f/4f/7f/8f ajax 加载主体函数
	function fn_2478(obj,index){
		var str = '';
			str += '<div class="floor_t clearfix">';
			str += '<a href="#"><img src="'+obj.fturl1+'"/></a>';
			str += '<a href="#"><img src="'+obj.fturl2+'"/></a>';
			str += '<a href="#"><img src="'+obj.fturl3+'"/></a>';
			str += '<a href="#"><img src="'+obj.fturl4+'"/></a>';
			str +=	'</div>';
			str += '<div class="floor_m clearfix">';
			str += '<a href="#"><img src="'+obj.fmurl1+'"/></a>';
			str += '<a href="#"><img src="'+obj.fmurl2+'"/></a>';
			str += '<a href="#"><img src="'+obj.fmurl3+'"/></a>';
			str += '<a href="#"><img src="'+obj.fmurl4+'"/></a>';
			str += '</div>';
			str += '<div class="floor_b clearfix">';
			str += '<a href="#"><span></span><img src="'+obj.fburl1+'"/></a>';
			str += '<a href="#"><span></span><img src="'+obj.fburl2+'"/></a>';
			str += '<a href="#"><span></span><img src="'+obj.fburl3+'"/></a>';
			str += '<a href="#"><span></span><img src="'+obj.fburl4+'"/></a>';
			str += '<a href="#"><span></span><img src="'+obj.fburl5+'"/></a>';
			str += '</div>';
		$('.stairs_inner').children().eq(index).children().eq(2).html(str);
	}
/******楼梯导航效果*******/

	//划入划出效果
	$('#navigation').children().on("mouseenter","li",function(){
		$(this).css("background-position-x","-45px");
	});
	$('#navigation').children().on("mouseleave","li",function(){
		$(this).css("background-position-x","0px");
	});
	//点击跳转
	$('#navigation').children().on("click","li",function(){
		var index = $(this).index();
		if(index == $('#navigation').find("li").length - 1){
			$('body,html').animate({scrollTop:"0"});
		}else{
			var floorTop = $('.stairs_inner').children().eq(index).offset().top;
			$('body,html').animate({scrollTop:floorTop});
		}
	});

	//楼梯导航栏的显示与隐藏
	$(document).scroll(function(){
		if($(document).scrollTop() >= $('.stairs_inner').children().eq(0).offset().top){
			$("#navigation").css("display","block");
		}else{
			$("#navigation").css("display","none");
		}
		var $floors = $('#navigation').find("li");
	//poor 为 当前scrollTop减去0楼的scrollTop值并除以0楼的高
		var poor = $(document).scrollTop() - $('.stairs_inner').children().eq(0).offset().top;
        poor = Math.ceil(poor/$('.stairs_inner').children().eq(0).outerHeight()*1.15);
		switch(poor){
			case 1: navigationShow($floors.eq(0));break;
			case 2: navigationShow($floors.eq(1));break;
			case 3: navigationShow($floors.eq(2));break;
			case 4: navigationShow($floors.eq(3));break;
			case 5: navigationShow($floors.eq(4));break;
			case 6: navigationShow($floors.eq(5));break;
			case 7: navigationShow($floors.eq(6));break;
			case 8: navigationShow($floors.eq(7));break;
			case 9: navigationShow($floors.eq(8));break;
			default:navigationShow($floors.eq(9));
		}
	});

	//当前楼题导航背景图变更函数
	function navigationShow(obj){
		obj.css("background-position-x","-45px")
		.siblings().css("background-position-x","0");
	}


/****Ajax加载商品列表****/
	$.ajax({
		url:"json/index-list.json",
		type:"get",
		success:function(res){
			var str = '<ul class="clearfix">';
			for(var i=0;i<res.length;i++){
				//当li为一行的最后一个时增加一个class属性
				if((i+1)%5 == 0){
					str += '<li class="li_mr0">';
				}else{
					str += '<li>'
				}
				str += '<div class="goods_img"><a href="#">'
				str += '<img src="'+ res[i].url +'"/></a></div>'
				str += '<div class="goods_name"><a href="#">'+res[i].name+'</a></div>'
				str += '<div class="goods_price">￥<b>'+res[i].price+'</b></div></li>';
			}
			str += '</ul>';
			$(".list").html(str);
		}

	});
});
