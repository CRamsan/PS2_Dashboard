function dragResize(edge){
	overwolf.windows.getCurrentWindow(function(result){
		if (result.status=="success"){
			overwolf.windows.dragResize(result.window.id, edge);
		}
	});
};

function formatTime(secondsPlayed) {
	if(secondsPlayed < 3600){
		return Math.round(secondsPlayed/3600) + " M";
	}else{
		 return (Math.round(10 * secondsPlayed/3600) / 10) + " H";
	}
};

function roundFloating(number) {
	return (Math.round(number * 1000)/1000)
};

function dragMove(){
	overwolf.windows.getCurrentWindow(function(result){
		if (result.status=="success"){
			overwolf.windows.dragMove(result.window.id);
		}
	});
};

function runTeamSpeak(){
	overwolf.extensions.launch("lafgmhfbkjljkgoggomibmhlpijaofafbdhpjgif");
};

function search(form){
	refreshCallback(form.charName.value);
	closeWindow("Killboard");
	closeWindow("Outfit");
	closeWindow("Stats");
};

function closeWindows(){
	close();
};

function minimizeWindows(){
	overwolf.windows.getCurrentWindow ( function(result){
		if (result.status=="success"){
			overwolf.windows.minimize(result.window.id);
		}
	});
};

function centerWindow(windowId, windowName){
	var width = screen.width;
	var height = screen.height;
	
	screen_width = 220;
	screen_height = 220;
	
	overwolf.windows.changePosition (windowId, (width/2) - (screen_width/2), (height/2) - (screen_height/2),
	function(result){
		console.log(result);
	});
};

function openWindow(windowName){
	overwolf.windows.obtainDeclaredWindow(windowName, function(result){
		if (result.status == "success"){
			overwolf.windows.restore(result.window.id, function(result){
					console.log(result);
			});
		}
	});
};

function openCenteredWindow(windowName){
	overwolf.windows.obtainDeclaredWindow(windowName, function(result){
		if (result.status == "success"){
			overwolf.windows.restore(result.window.id, function(result){
					console.log(result);
					centerWindow(result.window_id, windowName);
			});
		}
	});
};

function closeWindow(windowName){
	overwolf.windows.obtainDeclaredWindow(windowName, function(result){
		if (result.status=="success"){
			overwolf.windows.close(result.window.id);
		}
	});
};

function addToQueue(queue, sound){
	queue.push(sound);
	console.log("Adding to queue");
	if(queue.length === 1){
		playSoundFromQueue(queue);
	}
};

function playSoundFromQueue(queue){
	console.log("Playing sound");
	sound = queue[0]
	setTimeout(function(){
		if(queue.length > 0){
				console.log("Next");
				queue.shift();
				playSoundFromQueue(queue)
			}
		}, 3000);
	sound[0].volume=0.2;
	sound[0].play();
};

function takeScreenshot(){
	overwolf.media.takeScreenshot(function(result){
		if (result.status == "success"){
		}
	});
};