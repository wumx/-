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
	});

//加载尾
	$('#footer').load("com.html .foot_wapper");

//购物车加载
	$.ajax({

		url:"json/details.json",
		type:'get',
		success:function(res){
			var sc_str = $.cookie('goods');
			if(sc_str){
				var sc_obj = eval(sc_str);
				var sc_num = 0;
				var html = '';
				for(var i in sc_obj){
					if(sc_obj[i].num != 0){

						html += '<li name="'+res[sc_obj[i].id].id+'">';
						html += '<div class="cart-table-line clearfix">';
						html += '<div class="box1">';
						html += '<div class="chk select chkClick"></div>';
						html += '</div>';
						html += '<div class="box2">';
						html += '<a href="javascript:;" class="goods-img">';
						html += '<img src="'+res[sc_obj[i].id].img1+'" />';
						html += '</a>';
						html += '<a href="javascript:;" class="goods-name">';
						html += ''+res[sc_obj[i].id].name+'';
						html += '</a>';
						html += '</div>';
						html += '<div class="box3">';
						html += '￥'+res[sc_obj[i].id].price+'';
						html += '</div>';
						html += '<div class="box4" name="'+res[sc_obj[i].id].id+'">';
						html += '<em class="cut">-</em>';
						html += '<input type="text" class="num" value="'+sc_obj[i].num+'"/>';
						html += '<em class="add">+</em>';
						html += '</div>';
						html += '<div class="box5">';
						html += '￥'+sc_obj[i].num * res[sc_obj[i].id].price+'';
						html += '</div>';
						html += '<div class="box6">';
						html += '<p class="favorite">移入收藏夹</p>';
						html += '<p class="del">删除</p>';
						html += '</div>';
						html += '</div>';
						html += '</li>';

						}
					}

				$('.cart-table-list').html(html); //插入


			} //字符串拼接 end

			//计算总数量函数
			function sc_car(){
				var sc_str = $.cookie('goods');
				if(sc_str){//如果购物车cookie不为空。
					var sc_obj = eval(sc_str);
					var sc_num = 0 ;
					for(var i in sc_obj){
						sc_num = Number(sc_obj[i].num) + sc_num;
					}
					$('.a4').children().html(sc_num);
				}
			} //计算总数量函数 end

			sc_car();

			//商品的减少

			$('.cut').click(function(){

				var str = $(this).parent().attr('name');

				var price = parseInt($('li[name='+str+']').find('.box3').html().split('￥')[1]);

				//获取当前商品数量
				var num = parseInt($('div[name='+str+']').children().eq(1).val());

				if(num <= 1){
					num = 1;
				}else{
					num--;
				}

				carNum(str,num,price);

				$('div[name='+str+']').children().eq(1).val(num);

			}) //商品的减少 end

			//商品的增加
			$('.add').click(function(){

				var str = $(this).parent().attr('name');

				var price = parseInt($('li[name='+str+']').find('.box3').html().split('￥')[1]);

				//获取当前商品数量
				var num = parseInt($('div[name='+str+']').children().eq(1).val());

				num ++;

				carNum(str,num,price);

				$('div[name='+str+']').children().eq(1).val(num);

			}) //商品的增加 end

			//单件商品总金额计算
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
				prices = "￥" + prices;
				$('li[name='+name+']').find('.box5').html(prices)
				sc_car();
				carsMoney();
			}

			//计算商品总金额

			function carsMoney(){

				var money = 0;

				for(var i = 0 ; i < $('.box5').length ; i++ ){

					var str = $('.box1').eq(i).children().eq(0).attr('class').split(' ')[2];

					if(str){

						money += parseInt($('.box5').eq(i).html().split('￥')[1]);

					}

				}
				//console.log(money);

				$('.money').eq(0).children().eq(1).html(money);
				$('.money').eq(1).children().eq(1).html(money);
			}

			carsMoney();

			//单个商品的删除按钮的实现

			$('.del').click(function(){

				var id = parseInt($(this).parent().parent().parent().attr('name'));
				$(this).parent().parent().parent().css('display',"none");

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
				$('div[name='+id+']').children().eq(1).val(0);
				sc_car();
				carsMoney();
			}) //删除按钮 end

			//全选按钮的实现
			var falt = true; //判断是否全选或全部取消

			$('.select-all').click(function(){

				if(falt){
					$('.chk').addClass('chkClick');
					falt = false;
				}else{
					$('.chk').removeClass('chkClick');
					$('.select-all').eq(0).children().eq(0).removeClass('chkClick');
					$('.select-all').eq(1).children().eq(0).removeClass('chkClick');
					falt = true;
				}

				carsMoney();

			});

			//点击单选按钮是判断是否应该是全选的情况
			function selectAll(){
				for(var i = 0 , j = 0 ; i < $('.select').length ; i++ ){

					var str = $('.select').eq(i).attr('class').split(' ')[2];
					//console.log($('.select').eq(i).attr('class').split(' ')[2]);

					if(str){
						j++;
					}
				}
				if( i == j){

					$('.select-all').eq(0).children().eq(0).addClass('chkClick');
					$('.select-all').eq(1).children().eq(0).addClass('chkClick');

				}else{

					$('.select-all').eq(0).children().eq(0).removeClass('chkClick');
					$('.select-all').eq(1).children().eq(0).removeClass('chkClick');

				}

			}


			//单选按钮的实现

			$('.select').click(function(){

				if(!falt){
					$(this).removeClass('chkClick');

					$('.select-all').eq(0).children().eq(0).removeClass('chkClick');
					$('.select-all').eq(1).children().eq(0).removeClass('chkClick');

					falt = true;


				}else{

					$(this).addClass('chkClick');
					selectAll();
					falt = false;
				}

				carsMoney();

			});

			//结算按钮

			$('.buyNow').click(function(){
			})

		} // 购物车success  end

	}); //购物车ajax加载结束

}) //程序结束
