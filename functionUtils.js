
<script type="text/javascript">
 
window.onunload = function(e) {
// Firefox || IE
e = e || window.event;
 
var y = e.pageY || e.clientY;
 
if(y < 0)  alert("Window closed");
else alert("Window refreshed");
 
}
</script>
