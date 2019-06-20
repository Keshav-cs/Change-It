$(function(){
	
	chrome.tts.stop();

	let params = {
		active : true,
		currentWindow : true
	} 

	chrome.tabs.query(params,gotTabs);

	function gotTabs(tabs) {

		console.log(tabs[0].url);
		function makeHttpObject() {
	        try {return new XMLHttpRequest();}
	        catch (error) {}
	        try {return new ActiveXObject("Msxml2.XMLHTTP");}
	        catch (error) {}
	        try {return new ActiveXObject("Microsoft.XMLHTTP");}
	        catch (error) {}

	        throw new Error("Could not create HTTP request object.");
        }	

        var HTTPobj = makeHttpObject();
        
        console.log("here");
        var videourl = tabs[0].url;
    	
    	HTTPobj.open("GET", "https://downsub.com/?url="+videourl, true);
    	HTTPobj.send(null);
		HTTPobj.onreadystatechange = function() {
	        if (HTTPobj.readyState == 4)
	        {      
	        	// console.log(HTTPobj.response);
	        	var s = '<div id="myDiv">'+HTTPobj.response+'</div>';
				var htmlObject = document.createElement('div');
				htmlObject.innerHTML = s;
	        	var fragment = document.createDocumentFragment(); fragment.appendChild( htmlObject ); 

	        	console.log(fragment);

	        	let ss = fragment.getElementById('show');
				console.log(ss);

	        	$('h4').text("Preferred Options are: ");

				var to_append = "";
				to_append += ss.outerHTML;

				to_append = to_append.replace(/Download/g,"Select");
				to_append = to_append.replace(/a href=/g,"a id=");
				to_append = to_append.replace(/<\/a> <\/b>&nbsp;&nbsp;/g," <= ");
				to_append = to_append.replace(/<br><b>/g,"</a> <br>");
				to_append = to_append.replace(/<br>Or translate/,"</a><br></b>Less accurately translated <b>");

				console.log(to_append);

				$('div').append(to_append);

				$('a').click(function SendMessage() {
					var index_url = $(this).attr('id');
					console.log(index_url);
					var language = $(this).text().split(' ')[2];
					console.log(language);

					if(language == "Hindi")
					{
						Sound_lang = 'hi';
					}
					else
					{
						Sound_lang = 'en';
					}

					HTTPobj.open("GET","https://downsub.com/"+index_url);
					HTTPobj.send(null);
					HTTPobj.onreadystatechange = function() {
				        if (HTTPobj.readyState == 4){      
				        	console.log(HTTPobj.response);
		    	        	var unprocessed_caption = HTTPobj.responseText;
				        	var processed_caption = "";
				        	var count = 1;
				        	var to_popup = "";
				        	unprocessed_caption.split('\n').forEach(function(c) {
				        		count+=1;
				        		if(count==4)
				        		{
				        			count=0;
				        			var temp = "";
				        			c.split(/<font color="#CCCCCC">|<\/font>|<font color="#E5E5E5">/).forEach(function(d){
				        				processed_caption += d;
				        				temp+=d;
				        			});
				        			// console.log(temp);
				        			to_popup = to_popup + temp + "<br>";
				        			chrome.tts.speak(temp,{'rate': 0.8 ,'lang': Sound_lang, 'enqueue': true});  
				        		}
							});
							var COUNT = 0;
							console.log("bbjhv");
							$('#All').empty();
							$('#All').append("<h3 id = \"StopSound\">Click to play/pause the sound</h3>");
							$('#StopSound').on('click',function () {
								if(COUNT==0)
								{
									COUNT=1;
									chrome.tts.pause();
								}
								else
								{
									COUNT = 0;
									chrome.tts.resume();
								}
								// chrome.tts.isSpeaking doesn't worked
									console.log(COUNT);
							});
							$('#All').append(to_popup);
							// chrome.runtime.sendMessage({toSay: "hello Vikram"}, function() {});
				        }
			    	}
				});
	        }
		}
	}	
});