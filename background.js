chrome.tts.speak("Hi from Change it",{'rate': 0.7});  

var speechUtteranceChunker = function (utt, settings, callback) {
    settings = settings || {};
    var newUtt;
    var txt = (settings && settings.offset !== undefined ? utt.text.substring(settings.offset) : utt.text);
    if (utt.voice && utt.voice.voiceURI === 'native') { // Not part of the spec
        newUtt = utt;
        newUtt.text = txt;
        newUtt.addEventListener('end', function () {
            if (speechUtteranceChunker.cancel) {
                speechUtteranceChunker.cancel = false;
            }
            if (callback !== undefined) {
                callback();
            }
        });
    }
    else {
        var chunkLength = (settings && settings.chunkLength) || 160;
        var pattRegex = new RegExp('^[\\s\\S]{' + Math.floor(chunkLength / 2) + ',' + chunkLength + '}[.!?,]{1}|^[\\s\\S]{1,' + chunkLength + '}$|^[\\s\\S]{1,' + chunkLength + '} ');
        var chunkArr = txt.match(pattRegex);

        if (chunkArr[0] === undefined || chunkArr[0].length <= 2) {
            //call once all text has been spoken...
            if (callback !== undefined) {
                callback();
            }
            return;
        }
        var chunk = chunkArr[0];
        newUtt = new SpeechSynthesisUtterance(chunk);
        var x;
        for (x in utt) {
            if (utt.hasOwnProperty(x) && x !== 'text') {
                newUtt[x] = utt[x];
            }
        }
        newUtt.addEventListener('end', function () {
            if (speechUtteranceChunker.cancel) {
                speechUtteranceChunker.cancel = false;
                return;
            }
            settings.offset = settings.offset || 0;
            settings.offset += chunk.length - 1;
            speechUtteranceChunker(utt, settings, callback);
        });
    }

    if (settings.modifier) {
        settings.modifier(newUtt);
    }
	
// imp
		var myLang = newUtt.lang;
		newUtt.lang = 'hi';

	// var voiceArr = speechSynthesis.getVoices();
	// newUtt.voice = voiceArr[8];

    console.log(newUtt); //IMPORTANT!! Do not remove: Logging the object out fixes some onend firing issues.
    //placing the speak invocation inside a callback fixes ordering and onend issues.
    setTimeout(function () {
        speechSynthesis.speak(newUtt);
    }, 0);
};

function speakit(message) {
	
	//create an utterance as you normally would...
	var myLongText = message;

	var utterance = new SpeechSynthesisUtterance(myLongText);
	//modify it as you normally would
	
	loadVoicesWhenAvailable();

	function loadVoicesWhenAvailable() {
	     voices = speechSynthesis.getVoices();

	     if (voices.length !== 0) {
	            console.log("start loading voices");
	            console.log(voices);
	        }
	        else {
	            setTimeout(function () { loadVoicesWhenAvailable(); }, 10)
	        }
	}

	var voiceArr = speechSynthesis.getVoices();
	utterance.voice = voiceArr[9];

	console.log(utterance);
	console.log("utterance");
	//pass it into the chunking function to have it played out.
	//you can set the max number of characters by changing the chunkLength property below.
	//a callback function can also be added that will fire once the entire text has been spoken.
	speechUtteranceChunker(utterance, {
	    chunkLength: 120
	}, function () {
	    //some code to execute when done
	    console.log('done');
	});
}

chrome.runtime.onMessage.addListener(function(request) {
	console.log("bjv");

  //       	// speakit(processed_caption);
  //       	// console.log(processed_caption);
});


