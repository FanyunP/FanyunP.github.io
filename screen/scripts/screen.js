$(document).ready(function() {
    $("#btnSubmit").click(function(){
        var text = $('#submitext').val();
        if(text !== ""){
        	$('#dispaly').text(text);
        	var length = $('#dispaly').text().length * 16;
        	$.keyframe.define([{
        		name:'move',
        		from:{
        			left: 700
        		},
        		to:{
        			left:-1 * length
        		}
        	}])
        	// console.log(length);
        }
    }); 
});