var x = 30;
var y = 50;
var itv = 80;
var dx = new Array( 8,-12, 4,-8, 12, -1, 8, -4, 1,-8,0);
var dy = new Array(-12, 4,-8, 8,-8, 8, -1, 12, -4, 1,0);
//var dx = new Array( 12,-20, 8,-16, 20, -4, 16, -8, 4,-12,0);
//var dy = new Array(-20, 8,-16, 12,-12, 16, -4, 20, -8, 4,0);
var cnt = 0;
function quakeimage() {
  document.getElementById("figure").style.right = x + dy[cnt] + 'px';
  document.getElementById("figure").style.bottom = y + dy[cnt] + 'px';
  cnt++;
  if(cnt < dx.length) setTimeout("quakeimage()",itv);
  else cnt = 0;
}
