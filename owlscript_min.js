var _4,_3,_16,_8="#000",_7="#fff",_9=1,_24=2*Math.PI,_17="object",_25="undefined",width,height,_11=[],_1=0,_23=0;function set_default_color(a){_8=a}function set_default_line_width(a){_9=a}function set_default_background_color(a){_7=_4.style.backgroundColor=a}function line(a,b,c,d,e,f){with(_3)beginPath(),lineWidth=f||_9,strokeStyle=e||_8,moveTo(a,b),lineTo(c,d),stroke()}function circle(a,b,c,d,e){with(_3)beginPath(),lineWidth=e||_9,strokeStyle=d||_8,arc(a,b,c,0,_24,0),stroke()}function disk(a,b,c,d){with(_3)beginPath(),fillStyle=d||_8,arc(a,b,c,0,_24,0),fill()}function rectangle(a,b,c,d,e,f){with(_3)beginPath(),lineWidth=f||_9,strokeStyle=e||_8,rect(a,b,c-a,d-b),stroke()}function sheet(a,b,c,d,e){with(_3)fillStyle=e||_8,fillRect(a,b,c-a,d-b)}function polygon(a,b,c,d){with(_3){beginPath();lineWidth=d||_9;strokeStyle=c||_8;moveTo(a[0],b[0]);for(c=1;c<a.length;c++)lineTo(a[c],b[c]);closePath();stroke()}}function regular_polygon(a,b,c,d,e,f){d=range(0,360*(1-1/d),360/d);polygon(sin(d).multiply(c).add(a),cos(d).multiply(-c).add(b),e,f)}function clear_canvas(){sheet(0,0,width,height,_7)}function _5(a){var b=document.createElement("canvas");b.width=a.width;b.height=a.height;b.getContext("2d").drawImage(a,0,0);return b}function begin_animation(){_11=[]}function new_frame(){_11.push(_5(_4))}function animate(a){_1=1;_0(0,1E3*a||100)}function _0(a,b){_3.drawImage(_11[a%_11.length],0,0);_23?_23=_1=0:setTimeout(function(){_0(a+1,b)},b)}for(var _15 in _2={add:function(a,b){return a+b},subtract:function(a,b){return a-b},multiply:function(a,b){return a*b},divide:function(a,b){return a/b},negative:function(a){return-a},minus:function(a){return-a}})Array.prototype[_15]=function(a){return function(b){for(var c=this.length,d=[];0<c--;)d[c]=a(this[c],typeof b===_17?b[c%b.length]:b);return d}}(_2[_15]);Array.prototype.loop=function(a){if("function"===typeof a){for(var b=0,c=[];b<this.length;b++)c[b]=a(this[b]);return c}};function loop(a,b,c,d){typeof b===_25&&(_23?_23=_1=0:(_1=1,setTimeout(arguments.callee.caller,1E3*a||100)));"function"===typeof b?range(a).loop(b):range(a,b,c).loop(d)}function _10(a,b){window[a]=function(a){var d=[];if(typeof a===_17)for(var e=a.length;0<e--;d[e]=b(a[e]));else d=b(a);return d}}for(_15 in _2={abs:function(a){return Math.abs(a)},sin:function(a){return Math.sin(a*_24/360)},cos:function(a){return Math.cos(a*_24/360)},round:function(a){return Math.round(a)},sign:function(a){return 0>a?-1:1},sqrt:function(a){return Math.sqrt(a)},sq:function(a){return a*a},minus:function(a){return-a},negative:function(a){return-a}})_10(_15,_2[_15]);function mod(a,b){return a%b}Number.prototype._22=function(a){return Math.pow(this.valueOf(),a)};function random(a,b){if(typeof a===_17)return a[random(0,a.length-1)];if("color"===a){var c="0123456789abcdef".split("");return"#"+random(c)+random(c)+random(c)}c=a+Math.random()*(b-a);return 0===a%1&&0===b%1?Math.round(c):c}function _(a){return typeof a===_17?a:[a]}function min(a,b){a=typeof b===_25?_(a):_(a).concat(b);for(var c=a.length,d=1E50;0<c--;)a[c]<d&&(d=a[c]);return d}function max(a,b){return-min(minus(_(a)),minus(_(b)))}function set_title(a){document.title=a}function print(a,b){_16.innerHTML+='<div style="color:'+(b||_8)+'">'+(a+"").replace(/\s/g,"&nbsp")+"</div>"}function time(){var a=new Date;return{hour:a.getHours(),minute:a.getMinutes(),second:a.getSeconds(),millisecond:a.getMilliseconds()}}function range(a,b,c){typeof b===_25&&(b=a,a=1);c=abs(c)||1;var d=[];if(a<b)for(;a<=b;a+=c)d.push(a);else for(;b<=a;a-=c)d.push(a);return d}function $(a){return document.getElementById(a)}function _20(a){return a.replace(/(\w)\s*{/g,"function($1){").replace(/([(,])\s*,/g,"$1 0,").replace(/loop\s*\((.*,)\s*{/g,"loop($1 function($$$){").replace(/(\w+)\s*\(\s*(\w+)\s*\)\s*=\s*(.*)/g,'_10("$1",function($2){return($3)});').replace(/\s*\**\s*%\s*\**\s*/g,"*(0.01)*").replace(/\^\s*([\w\.]+)\s*/g," ._22($1)").replace(/\s*\^\s*/g," ._22").replace(/function\s+main\s*(\([^()]*\))/,"main=function$1")}function _13(){_4.width=width=window.innerWidth;_4.height=height=window.innerHeight;_1||(_16.innerHTML="",main())}window.onload=function(){var a=document.getElementsByTagName("body")[0];_4=a.appendChild(document.createElement("canvas"));_3=_4.getContext("2d");a.style.margin=0;_16=document.createElement("div");_16.style.position="absolute";_16.style.top="0";_16.style.left="0";_16.style.width="100%";_16.style.height="100%";_16.style.fontFamily="courier";_16.style.overflow="scroll";a.appendChild(_16);var b=$("owlscript"),c=b.innerHTML;b.parentNode.removeChild(b);a.appendChild(document.createElement("script")).innerHTML=_20(c);_13()};window.onresize=function(){_13()};