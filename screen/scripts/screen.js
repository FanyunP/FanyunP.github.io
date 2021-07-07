$(document).ready(function() {
    $("#btnSubmit").click(function(){
        var text = $('#submitext').val();
        if(text !== ""){
        	$('#dispaly').text(text);
        	var length = $('#dispaly').text().length * 16;
            var width = $(window).width();
            if(width>= 800){
              $.keyframe.define([{
                name:'move',
                from:{
                    left: 700
                },
                to:{
                    left:-1 * length
                }
                }])  
            }
        	else{
                $.keyframe.define([{
                name:'move',
                from:{
                    left: width * 0.55
                },
                to:{
                    left:-1 * length
                }
                }])  
            }
        	// console.log(length);
        }
    }); 
});
