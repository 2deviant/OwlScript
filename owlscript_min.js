var _3,_0,_2,_1="#000",_15="#fff",_4=1,_6=2*Math.PI,_8="object",_10="undefined",width,height,_9=[],_5=0,_7=0;function set_default_color(a){_1=a}function set_default_line_width(a){_4=a}function set_default_background_color(a){_15=_3.style.backgroundColor=a}function line(a,b,c,d,e,g){with(_0)beginPath(),lineWidth=g||_4,strokeStyle=e||_1,moveTo(a,b),lineTo(c,d),stroke()}function circle(a,b,c,d,e){with(_0)beginPath(),lineWidth=e||_4,strokeStyle=d||_1,arc(a,b,c,0,_6,0),stroke()}disk=fill_circle=function(a,b,c,d){with(_0)beginPath(),fillStyle=d||_1,arc(a,b,c,0,_6,0),fill()};function rectangle(a,b,c,d,e,g){with(_0)beginPath(),lineWidth=g||_4,strokeStyle=e||_1,rect(a,b,c-a,d-b),stroke()}sheet=fill_rectangle=function(a,b,c,d,e){_0.fillStyle=e||_1;_0.fillRect(a,b,c-a,d-b)};function polygon(a,b,c,d){with(_0){beginPath();lineWidth=d||_4;strokeStyle=c||_1;moveTo(a[0],b[0]);for(c=1;c<a.length;c++)lineTo(a[c],b[c]);closePath();stroke()}}function fill_polygon(a,b,c){with(_0){beginPath();fillStyle=c||_1;moveTo(a[0],b[0]);for(c=1;c<a.length;c++)lineTo(a[c],b[c]);closePath();fill()}}function regular_polygon(a,b,c,d,e,g){d=range(0,360*(1-1/d),360/d);polygon(sin(d).multiply(c).add(a),cos(d).multiply(-c).add(b),e,g)}function fill_regular_polygon(a,b,c,d,e){d=range(0,360*(1-1/d),360/d);fill_polygon(sin(d).multiply(c).add(a),cos(d).multiply(-c).add(b),e)}function clear_canvas(){_2.innerHTML="";sheet(0,0,width,height,_15)}function _19(a){var b=document.createElement("canvas");b.width=a.width;b.height=a.height;b.getContext("2d").drawImage(a,0,0);return b}function begin_animation(){_9=[]}function new_frame(){_9.push(_19(_3))}function animate(a){_5=1;_16(0,1E3*a||100)}function _16(a,b){_0.drawImage(_9[a%_9.length],0,0);_7?_7=_5=0:setTimeout(function(){_16(a+1,b)},b)}(function(){var a,b;for(b in a={add:function(a,b){return a+b},subtract:function(a,b){return a-b},multiply:function(a,b){return a*b},divide:function(a,b){return a/b},negative:function(a){return-a},minus:function(a){return-a}})Array.prototype[b]=function(a){return function(b){for(var e=this.length,g=[];0<e--;)g[e]=a(this[e],typeof b===_8?b[e%b.length]:b);return g}}(a[b])})();Array.prototype.loop=function(a){if("function"===typeof a){for(var b=0,c=[];b<this.length;b++)c[b]=a(this[b]);return c}};function loop(a,b,c,d){typeof b===_10&&(_7?_7=_5=0:(_5=1,setTimeout(arguments.callee.caller,1E3*a||100)));"function"===typeof b?range(a).loop(b):range(a,b,c).loop(d)}function _14(a,b){window[a]=function(a){var d=[];if(typeof a===_8)for(var e=a.length;0<e--;d[e]=b(a[e]));else d=b(a);return d}}(function(){var a,b;for(b in a={abs:function(a){return Math.abs(a)},sin:function(a){return Math.sin(a*_6/360)},cos:function(a){return Math.cos(a*_6/360)},round:function(a){return Math.round(a)},sign:function(a){return 0>a?-1:1},sqrt:function(a){return Math.sqrt(a)},sq:function(a){return a*a},minus:function(a){return-a},negative:function(a){return-a}})_14(b,a[b])})();function mod(a,b){return a%b}Number.prototype._12=function(a){return Math.pow(this.valueOf(),a)};_11=random=function(a,b){if(typeof a===_8)return a[_11(0,a.length-1)];if("string"===typeof a){var c="0123456789abcdef".split(""),d="9abcdef".split(""),e="0123456".split(""),g,f=function(a){return _11(a||e)+_11(c)};switch(a){case "color":return"#"+f(c)+f(c)+f(c);case "red":return"#"+f(d)+f()+f();case "green":return"#"+f()+f(d)+f();case "blue":return"#"+f()+f()+f(d);case "yellow":return"#"+(g=f(d))+g+f();case "violet":return"#"+(g=f(d))+f()+g;case "teal":return"#"+f()+(g=f(d))+g;case "gray":return"#"+(g=f(c))+g+g}}d=a+Math.random()*(b-a);return 0===a%1&&0===b%1?Math.round(d):d};function _(a){return typeof a===_8?a:[a]}function min(a,b){a=typeof b===_10?_(a):_(a).concat(b);for(var c=a.length,d=1E50;0<c--;)a[c]<d&&(d=a[c]);return d}function max(a,b){return-min(minus(_(a)),minus(_(b)))}function set_title(a){document.title=a}function print(a,b){_2.innerHTML+='<div style="color:'+(b||_1)+'">'+(a+"").replace(/\s/g,"&nbsp")+"</div>"}function time(){var a=new Date;return{hour:a.getHours(),minute:a.getMinutes(),second:a.getSeconds(),millisecond:a.getMilliseconds()}}function range(a,b,c){typeof b===_10&&(b=a,a=1);c=abs(c)||1;var d=[];if(a<b)for(;a<=b;a+=c)d.push(a);else for(;b<=a;a-=c)d.push(a);return d}function _17(a){return a.replace(/(\w+)\s*{/g,"function($1){").replace(/([(,])\s*,/g,"$1 0,").replace(/loop\s*\((.*,)\s*{/g,"loop($1 function($$$){").replace(/(\w+)\s*\(\s*(\w+)\s*\)\s*=\s*(.*)/g,'_14("$1",function($2){return($3)});').replace(/\s*\**\s*%\s*\**\s*/g,"*(0.01)*").replace(/\^\s*([\w\.]+)\s*/g," ._12($1)").replace(/\s*\^\s*/g," ._12")}function $(a){return document.getElementById(a)}function _13(){_3.width=width=window.innerWidth;_3.height=height=window.innerHeight;_5||(_2.innerHTML="",_18())}window.onload=function(){_3=document.body.appendChild(document.createElement("canvas"));_0=_3.getContext("2d");document.body.style.margin=0;_2=document.createElement("div");with(_2)style.top="0",style.left="0",style.width="100%",style.height="100%",style.overflow="scroll",style.position="absolute",style.fontFamily="courier";document.body.appendChild(_2);var a=$("owlscript"),a=a.parentNode.removeChild(a).innerHTML;document.body.appendChild(document.createElement("script")).innerHTML="function _18(){"+_17(a)+"}";_13()};window.onresize=function(){_13()};