// var product = [{
//     id: 1,
//     img: 'https://i.pinimg.com/236x/9b/69/c2/9b69c2b207a3c6653d6d623c0c87733b.jpg',
//     name: 'Killua',
//     price: 4500,
//     description: 'Killua Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem, hic a quibusdam eaque obcaecati ad.',
//     type: 'hxh'
// }, {
//     id: 2,
//     img: 'https://i.pinimg.com/236x/63/d4/f5/63d4f5013b46d1162ebc0ad8ab093bf5.jpg',
//     name: 'Dimension Breaker Nakroth',
//     price: 3500,
//     description: 'Dimension Breaker Nakroth Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem, hic a quibusdam eaque obcaecati ad.',
//     type: 'dmb'
// }, {
//     id: 3,
//     img: 'https://i.pinimg.com/236x/23/74/a6/2374a6296671600a8846f2ba3ea9a035.jpg',
//     name: 'Gon',
//     price: 2500,
//     description: 'Gon Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem, hic a quibusdam eaque obcaecati ad.',
//     type: 'hxh'
// }];

var product;

$(document).ready(() => {

    $.ajax({
        method: 'get',
        url: './api/getallproduct.php',
        success: function(response) {
            console.log(response)
            if(response.RespCode == 200) {

                product = response.Result;

                var html = '';
                for (let i = 0; i  < product.length; i++) {
                    html += `<div onclick="openProductDetail(${i})" class="product-items ${product[i].type}">
                                <img class="product-img" src="./imgs/${product[i].img}" alt="" >
                                <p style="font-size: 1.2vw;">${product[i].name}</p>
                                <p style="font-size: .9vw;">${numberWithCommas(product[i].price)} THB</p>
                            </div>`;
                }
                $("#productlist").html(html);
            }
        }, error: function(err) {
            console.log(err)
        }
    })    
})  

function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}

function searchsomething(elem) {
    //console.log('#'+elem.id)
    var value = $('#'+elem.id).val()
    console.log(value)
    
    var html = '';
    for (let i = 0; i  < product.length; i++) {
        if( product[i].name.includes(value) ){
            html += `<div onclick="openProductDetail(${i})" class="product-items ${product[i].type}">
                    <img class="product-img" src="./imgs/${product[i].img}" alt="" >
                    <p style="font-size: 1.2vw;">${product[i].name}</p>
                    <p style="font-size: .9vw;">${numberWithCommas(product[i].price)}</p>
                </div>`;
        }
    }
    if(html == '') {
        $("#productlist").html(`<p>Not found product </p>`);   
    } else {
        $("#productlist").html(html); 
    }
}

function searchproduct(param){
    console.log(param)
    $(".product-items").css('display', 'none')
    if(param == 'all'){
        $(".product-items").css('display', 'block')
    } 
    else {
        $("."+param).css('display', 'block')
    }
}

var productindex = 0;
function openProductDetail(index) {
    productindex = index;
    console.log(productindex)
    $("#modalDesc").css('display', 'flex')
    $("#mdd-img").attr('src', './imgs/' + product[index].img);
    $("#mdd-name").text(product[index].name);
    $("#mdd-price").text( numberWithCommas(product[index].price) + ' THB' );
    $("#mdd-desc").text(product[index].description);
}

function closeModal() {
    $(".modal").css('display', 'none')
}

var cart = [];
function addToCart() {
    var pass = true;

    for (let i = 0; i < cart.length; i++) {
        if( productindex == cart[i].index ){
            console.log('found same product')
            cart[i].count++;
            pass = false;  
        }
    }

    if (pass) {
        var obj = {
            index: productindex,
            id: product[productindex].id,
            name: product[productindex].name,
            price: product[productindex].price,
            img: product[productindex].img,
            count: 1
        };
        //console.log(obj)
        cart.push(obj)
    }
    console.log(cart)

    Swal.fire({
        icon: 'success',
        title: 'Add ' + product[productindex].name + ' to cart !'
    })
    $("#cartcount").css('display', 'flex').text(cart.length)
}

function openCart() {
    $('#modalCart').css('display', 'flex')
    renderCart();
}

function renderCart() {
    if(cart.length > 0) {
        var html = '';
        for (let i = 0; i < cart.length; i++) {
            html += `<div class="cartlist-items">
                        <div class="cartlist-left">
                            <img src="./imgs/${cart[i].img}">
                            <div class="cartlist-detail">
                                <p style="font-size: 1.5vw;">${cart[i].name}</p>
                                <p style="font-size: 1.2vw;">${numberWithCommas(cart[i].price * cart[i].count)} THB</p>
                            </div>
                        </div>
                        <div class="cartlist-right">
                            <p onclick="deinitems('-', ${i})" class="btnc">-</p>
                            <p id="countitems${i}" style="margin: 0 10px;">${cart[i].count}</p>
                            <p onclick="deinitems('+', ${i})" class="btnc">+</p>
                        </div>
                    </div>`;
        }
        $('#mycart').html(html)
    }
    else {
        $("#mycart").html(`<p> Not found product list </p>`)
    }
}

function deinitems(action, index) {
    if(action == '-'){
        if(cart[index].count > 0){
            cart[index].count--;
            $("#countitems"+index).text(cart[index].count)

            if(cart[index].count <= 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Are you sure to delete?',
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Delete',
                    cancelButtonText: 'Cancel'
                }).then((res) => {
                    if(res.isConfirmed){
                        cart.splice(index, 1)
                        console.log(cart)
                        renderCart();
                        $("#cartcount").css('display', 'flex').text(cart.length)
                        
                        if(cart.length <= 0) {
                            $("#cartcount").css('display', 'none')
                        }
                    }
                    else {
                        cart[index].count++;
                        $("#countitems"+index).text(cart[index].count)
                    }
                })
            }
        }

    }
    else if(action == '+'){
        cart[index].count++;
        $("#countitems"+index).text(cart[index].count) 
    }
}

function buyNow() {
    $.ajax({
        method: 'post',
        url: './api/buynow.php',
        data: {
            product: cart
        }, success: function(response) {
            console.log(response)
            if(response.RespCode == 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thanks you',
                    html: `<p> Amount : ${response.Amount.Amount}</p>`
                }).then((res) => {
                    if(res.isConfirmed) {
                        cart = [];
                        closeModal();
                        $("#cartcount").css('display','none')
                    }
                })
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Something is went wrong!'
                })
            }
        }, error: function(err) {
            console.log(err)
        }
    })

}