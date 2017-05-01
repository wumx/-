
  /**********************购物车************************/
$(function(){
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
