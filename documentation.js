(function(){function e(a){var b=new XMLHttpRequest;b.open("get",a,1);b.onreadystatechange=function(){4==b.readyState&&(document.getElementById("view_code").innerHTML=b.responseText.replace(/<[^<>]+>/g,"").replace(/("[^"\\\r\n]*(?:\\.[^"\\\r\n]*)*")/g,"<span class=literal>$1</span>").replace(/('[^'\\\r\n]*(?:\\.[^"\\\r\n]*)*')/g,"<span class=literal>$1</span>").replace(/([{}()+\-\*,])/g,'<span class="control">$1</span>').replace(/([^\/<])\/([^\/])/g,'$1<span class="control">/</span>$2').replace(/(\W)(function|random|rectangle|regular_polygon|loop|end|round|static|star|rotate|opacity|print|line|circle|fill_circle|min|width|height|disk|sheet|fill_\w+|set_default_\w+)(?=\W)/g,'$1<span class="reserved">$2</span>').replace(/(\W)([\d\.]+)(?=\W)/g,'$1<span class="number">$2</span>').replace(/(\/\/.*)[\r\n]/g,'<span class="comment">$1</span>'))};b.send()}function f(){document.getElementById("view_code_close").onclick=function(){c(document.getElementById("view_code_close"));c(document.getElementById("view_code"))};addEventListener("keyup",function(a){27===a.keyCode&&(c(document.getElementById("view_code_close")),c(document.getElementById("view_code")))})}function g(){for(var a=document.querySelectorAll("div.view_code"),b=a.length;0<b--;)a[b].onclick=function(){document.getElementById("view_code").innerHTML="Loading code...";d(document.getElementById("view_code_close"));d(document.getElementById("view_code"));e(this.nextSibling.href)}}function c(a){a.classList.add("hide");setTimeout(function(){a.classList.add("superhide")},250)}function d(a){a.classList.remove("superhide");setTimeout(function(){a.classList.remove("hide")},20)}window.addEventListener("load",function(){g();f()},0)})();