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
						console.log(price)
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
						console.log(money)
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
	//加载尾部
	$('#footer').load("com.html .foot_wapper");	

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


	$.ajax({
		url:"json/details.json",
		type:'get',
		success:function(res){
			//console.log(res);
			var str = window.location.href;
	
	    	var html = '';
	    	str = str.split('=')[1];
	    	$('.addCart').attr('id',str);
			for(var i=0 ; i < res.length ; i++ ){

				if(res[i].id == str){
			
					html += '<div class="spec-preview">';
					html += '<div class="mark-box"></div>';
					html += '<img class="img" src="'+res[i].img1+'"/>';
					html += '<div class="position-box"></div>';						
					html += '</div>';		
					html += '<div class="b-box">';		
					html += '<div class="b-box-all">';		
					html += '<img class="img" src="'+res[i].img1+'" />';	
					html += '</div>';	
					html +=	'</div>';	
					html += '<div class="items">';			
					html += '<ul class="clearfix imgs">';
					html += '<li><img class="img1" src="'+res[i].img1+'" /></li>';	
					html += '<li><img class="img1" src="'+res[i].img2+'" /></li>';		
					html += '<li><img class="img1" src="'+res[i].img3+'" /></li>';		
					html += '<li><img class="img1" src="'+res[i].img4+'" /></li>';
					html += '<li><img class="img1" src="'+res[i].img5+'" /></li>';
					html += '</ul>';
					html += '</div>';	
						
				}

			}

		  $('.details').html(html);

		 //放大镜效果实现
			//划入划出灰框显示隐藏效果
			$('.mark-box').mouseenter(function(){
				$('.position-box').css('display','block');
				$('.b-box').css('display','block');
			});
			$('.mark-box').mouseleave(function(){
				$('.position-box').css('display','none');
				$('.b-box').css('display','none');
			});
			//移动实现放大镜
			$('.mark-box').mousemove(function(event){
				//偏移量
				var left = event.offsetX - $('.position-box').width()/2;
				var top = event.offsetY - $('.position-box').height()/2;
				//计算可移动的距离
				var borderX =$('.mark-box').width() - $('.position-box').width();
				var borderY =$('.mark-box').height() - $('.position-box').height();
				//控制溢出
				left = left > 0 ? left : 0;
				top = top > 0 ? top : 0;
				left = left > borderX ? borderX : left;
				top = top > borderY ? borderY : top;
				
				//计算两者比例
				var proX = left/ borderX;
				var proY = top / borderY;
				
				//赋值
				left = left + "px";
				top = top + "px";
				$('.position-box').css({
					left:left,
					top:top
				});
				var allX = - (proX * ($('.b-box-all').width() - $('.b-box').width())) + "px";
				var allY = - (proY * ($('.b-box-all').height() - $('.b-box').height())) + "px";
				$('.b-box-all').css({
					left:allX,
					top:allY
				});
			});
			//划入划出显示不同的图片
			$('.imgs').on('mouseenter','li',function(){
				
				var str = $(this).children().attr('src');

				$('.img').attr('src',str);

			});
		}
	})
	
	//分享按钮
	$('.share').eq(0).mouseenter(function(){
		$(this).addClass('share0');
		$(this).children().eq(0).css("background-position-y","-141px");
		$(this).children().eq(1).css("background-position-y","-94px");
	});
	$('.share').eq(0).mouseleave(function(){
		$(this).removeClass('share0');
		$(this).children().eq(0).css("background-position-y","-88px");
		$(this).children().eq(1).css("background-position-y","0");
	});
	//购买
	var buyNum = 1;
	$('.add').click(function(){
		buyNum++;
		$('.num').val(buyNum);
	})
	$('.cut').click(function(){
		if(buyNum == 1){
			buyNum = 1;
		}else{
			buyNum--;
		}
		$('.num').val(buyNum);
	});
	//ajax 加载评论
	$.ajax({
		url:"json/evaluate.json",
		type:"get",
		success:function(res){
                $("#pagination").pagination(3,{
                    num_edge_entries: 2,         //两侧显示的首尾分页的条目数
                    num_display_entries: 4,      //连续分页主体部分显示的分页条目数
                    items_per_page:1,          //每页显示的条目数
                    prev_text: "上一页",
                    next_text: "下一页",
                    callback: function(index){
                        var html='<ul>';
                            for(var i=index*5 ; i<(index+1)*5; i++){
                                if(i<res.length){	
                                  html += '<li class="clearfix">';
                                  html += '<div class="user-info">';
                                  html += '<div class="user-img">';
                                  html += '<img src="'+res[i].url+'"/>';
                                  html += '</div>';
                                  html += '<p>'+res[i].user+'</p>';
                                  html += '<p class="p-time">'+res[i].date+'<br />购买</p>'
								  html += '</div>';
								  html += '<div class="reviewed-info1">',
								  html += '<div class="reviewed-info-fraction clearfix">';
								  for(var j=0; j <5 ; j++){
								  		if(j < res[i].star){
								  			html += '<i class="select"></i>'
								  		}else{
								  			html += '<i></i>';
								  		}
								  		
								  }
									html += '</div>';
									html += '<p class="review-txt">'+res[i].text+'</p>';
									html += '<div class="reviewed-info-time">';
									html += '<span>'+res[i].date+'</span>';
									html += '<a href="#">'+res[i].num+'</a>';
									html += '</div></div></li>';
                            }
                        }
                        html+='</ul>';
                        $('.showComm').html(html);
                    }
                   
                });

            }
       });
    //tab页
    $('.product-tab').on('click','li',function(){
    	var tabIndex = $(this).index();
    	$(this).addClass('current').siblings().removeClass('current');
    	$(this).children().addClass('a-b0').siblings().removeClass('a-b0');
    	//tab页的显示与隐藏
    	$('.tab').children().eq(tabIndex).css('display','block')
    	.siblings().css('display','none');
    });
});
