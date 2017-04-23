$(function(){
//ajax加载头尾
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
	});

	//加载尾部
	$('#footer').load("com.html .foot_wapper");
	//购物车


	//购物车
	$('#shop-car').load('right-sideBar.html',function(){
		//购物车的显示与隐藏
		$('.car').click(function(){

			$('.right-sidebar').toggleClass('r0');
			sc_msg();
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


















	//ajax 加载导航栏
	$('#header').load("bl-head.html",function(){
		//侧边栏的划出
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
			});
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

		$('.nav_left').mouseenter(function(){
			$('.sideBar_list').css('display','block');
		});
		$('.nav_left').mouseleave(function(){
			$('.sideBar_list').css('display','none');
			$('.sideBar_list').mouseenter(function(){
				$(this).css("display","block");
			});
			$('.sideBar_list').mouseleave(function(){
				$(this).css("display","none");
			});
		});
		$('.sideBar_list').mouseleave(function(){
			$(this).css('display','none');
		})
	});

	// ajax 加载品牌商标
	$.ajax({
		url:'json/list-brand.json',
		type:'get',
		success:function(res){
			var str = '<ul class="clearfix">';
			for(var i =0 ; i < res.length ; i++ ){
				str += '<li><i>'+res[i].name+'</i>'
				str += '<span><img src="'+res[i].url+'" /></span></li>';
			}
			str += '</ul>';
			$('.filter_right').eq(1).html(str);

			//品牌商标的移入移出效果
			$('.filter_right').eq(1).children().on('mouseenter','li',function(){
				$(this).addClass('brandShow')
				$(this).children().eq(0).css('display','block')
				.siblings().css('display','none');
			});

			$('.filter_right').eq(1).children().on('mouseleave','li',function(){
				$(this).removeClass('brandShow')
				$(this).children().eq(0).css('display','none')
				.siblings().css('display','block');
			});
		}
	});
	//更多选择按钮实现
	$('.rest').hover(function(){
		$('.rest').children().eq(0).css('borderColor','#ddd')
		$('.rest').children().eq(1).css('display','block')
	},function(){
		$('.rest').children().eq(0).css('borderColor','#fff')
		$('.rest').children().eq(1).css('display','none')
	})
	// ajax 加载商品列表
	var n = 0;   //分页下标
	var num;
	$.ajax({
		url:"json/phone_list.json",
		type:"get",
		success:function(res){
			var PriceFalt = true;
			num = Math.ceil(res.length/15);
			fn1(res);
			//下一页
			function next(){
				if( n == num-1){
					n = 0;
				}else{
					n++;
				}
				fn1(res)
			}
			$('.nextPage').click(next);
			$('.btnR').click(function(){
				$(this).addClass('page').siblings().removeClass('page');
				next();
			});
			//上一页
			function pageUp(){
				if(n == 0){
					n = num -1;
				}else{
					n--;
				}
				fn1(res)
			}
			$('.pageUp').click(pageUp);
			$('.btnL').click(function(){
				$(this).addClass('page').siblings().removeClass('page');
				pageUp();
			});
			//数字点击切换
			$('.pages').children().eq(1).on("click",'li',function(){
				$(this).addClass('page').siblings().removeClass('page');
				n = $(this).index();
				fn1(res);
				$('body,html').animate({scrollTop:"0"});
			});
			//排序方式
			$("#sort-mode").children().click(function(){
				var mode = $(this).data("id");
				var obj;
				if(mode === "comprehensive"){ //综合
					fn1(res);
				}else if(mode === "volume"){
					res.sort(function(a,b){
						return parseInt(b.Sales_volume, 10) - parseInt(a.Sales_volume, 10);
					});
					fn1(res)
					$(this).children().addClass("clickA")
					$(this).siblings().children().removeClass("clickA");
				}else if(mode === "Price"){  //销量
					if(PriceFalt){
						res.sort(function(a,b){
							return parseInt(b.proMoney, 10) - parseInt(a.proMoney, 10);
						});
						PriceFalt = false;
					}else{
						res.sort(function(a,b){
							return parseInt(a.proMoney, 10) - parseInt(b.proMoney, 10);
						});
						PriceFalt = true;
					}
					$(this).children().addClass("clickA")
					$(this).siblings().children().removeClass("clickA");
					fn1(res)
				}else if(mode === "evaluate"){  //评价数
					res.sort(function(a,b){
						return parseInt(b.proAssess1, 10) - parseInt(a.proAssess1, 10);
					});
					$(this).children().addClass("clickA")
					$(this).siblings().children().removeClass("clickA");
					fn1(res)
				}else if(mode === "newGoods"){
					$(this).children().addClass("clickA")
					$(this).siblings().children().removeClass("clickA");
				}
			})
		}
	});
	//加载商品信息函数函数
	function fn1(res){
		$('.sequence_pages').find('span').eq(0).text(n+1);
		$('.sequence_pages').find('span').eq(1).text(num);
		//当前页码颜色的改变
		$('.pages').children().eq(1).children().eq(n)
		.addClass('page').siblings().removeClass('page');
			var str = '<ul>';
			for(var i = n*15 ; i < (n+1)*15 ; i++ ){
				if( i < res.length){
					if((i+1)%5 == 0){
						str += '<li id="'+res[i].id+'" class="m0"><div class="pro-show">';
					}else{
						str += '<li id="'+res[i].id+'"><div class="pro-show">';
					}
					str += '<div class="pro-icon"><img src="'+res[i].proIcon+'"/></div>';
					str += '<div class="pro-img"><img src="'+res[i].proImg+'" /></div>';
					str += '<div class="pro-money"><b><i>￥</i>'+res[i].proMoney+'</b></div>';
					str += '<div class="product-comment"><a href="javascript:;">'+res[i].proCom+'</a>';
					str += '</div>';
					str += '<div class="pro-assess clearfix">';
					str += '<div class="pro-assess-left">'+res[i].proAssess1+'</div>';
					str += '<div class="pro-assess-right">'+res[i].proAssess2+'</div>';
					str += '</div>';
					str += '<div class="pro-assess"><span>'+res[i].proAssess3+'</span></div>';
					str += '<div class="pro-button"><a href="javascript:;">查看详情</a></div></div></li>';
				}
			}
			str += '</ul>';
			$('.goods').html(str);


			//页面的跳转
			$('.goods').children().on('click','li',function(){

				var str = 'bl_details.html?id=' + $(this).attr('id');
				window.location.href = str;

			});
		}
});
