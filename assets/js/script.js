// Creating method stop() in Audio class
Audio.prototype.stop = function() {
	this.pause();
	this.currentTime = 0;
};

// Flags
var isRinging = false;
var isFlashing = false;

function start() {
	setClock();
	checkAlarm();
}

function setClock(){
	var clockTime = getClockTime();
	var hours = clockTime["hours"];
	var minutes = clockTime["minutes"];
	var seconds = clockTime["seconds"];
	var abbreviation = clockTime["abbreviation"];
	abbreviation = "<span id=abbreviation>" + abbreviation + "</span>";
	var dots;
	if (isFlashing && (seconds % 2) == 0) {
		dots = '<span style="color: transparent;">:</span>';
	} else {
		dots = '<span>:</span>';
	}
	
	var clockText = hours + dots + minutes + dots + seconds + abbreviation;
	document.getElementById("time").innerHTML = clockText;
	setTimeout(setClock, 1000);
}

function writeInsideButton(txt) {
	document.getElementById('show-alarm').innerHTML = txt;
}

function getTimeTxt(time) {
	if (time != null) {
		var hours = time['hours'];
		var minutes = time['minutes'];
		var abbreviation = time['abbreviation'];

		var txt = hours+':'+minutes+abbreviation;
		return txt;
	}
}

function checkAlarm() {
	if (isAlarmSetted()) {
		if (isAlarmTime()) {
			playNoise();
		}
	}		

	setTimeout(checkAlarm, 1000);
}

function unsetAlarm() {
	document.getElementById('alarm-timepicker').value = '';
	writeInsideButton('Set Alarm');
}

// Add zero in front of numbers < 10
function addZero(number) {
	if (number < 10) {
		number = "0" + number;
	}
	return number;
}

// Transform [0h ~ 23h] to [AM/PM]
function checkAbbreviation(hours) {
	if (hours < 12) {
		return('AM');
	} else {
		return('PM');
	}
}

// Transform [0h ~ 23h] to [1h ~ 12h]
function checkHours(hours) {
	hours = parseInt(hours);
	if (hours > 12) {
		return(hours -=12);
	} else if (hours == 0) {
		return(12);
	} else {
		return(hours);
	}
}


function openTimepicker() {
	var elem = document.querySelector('.timepicker');
	var instance = M.Timepicker.getInstance(elem);
	instance.open();
}

function isAlarmSetted() {
	var inputValue = document.getElementById('alarm-timepicker').value;
	if (inputValue != '') {
		writeInsideButton(inputValue);
		return true;
	} else {
		return false;
	}
}

function getAlarmTime() {
	var inputValue = document.getElementById('alarm-timepicker').value;

	if (inputValue != '') {
		var timeAndAbbreviation = inputValue.split(" ");
		var time = timeAndAbbreviation[0];
		var abbreviation = timeAndAbbreviation[1];

		var hoursAndMinutes = time.split(":");
		var hours = hoursAndMinutes[0];
		var minutes = hoursAndMinutes[1];

		minutes = addZero(minutes);

		var splitedInputValue = {hours:hours, minutes:minutes, abbreviation:abbreviation};

		return(splitedInputValue);	
	} else {
		return null;
	}
}

function getClockTime() {
	var currentDate = new Date();
	var clockHours = currentDate.getHours();
	var clockMinutes = currentDate.getMinutes();
	var clockSeconds = currentDate.getSeconds();
	var clockAbbreviation = checkAbbreviation(clockHours);
	clockHours = checkHours(clockHours);
	clockMinutes = addZero(clockMinutes);
	clockSeconds = addZero(clockSeconds);
	
	var clockTime = {hours:clockHours, minutes:clockMinutes, seconds:clockSeconds, abbreviation:clockAbbreviation};
	
	return(clockTime);

}

function isAlarmTime() {
	var clockTime = getClockTime();
	var alarmTime = getAlarmTime();

	// If 'clockTime' == 'alarmTime'
	if ((clockTime['hours'] == alarmTime['hours']) &&
		(clockTime['minutes'] == alarmTime['minutes']) &&
		(clockTime['abbreviation'] == alarmTime['abbreviation'])) {
		return(true);
	} else{
		return(false);
	}
}

function stopNoise() {
	document.getElementById("noise").stop();
	isRinging = false;
}

function playNoise() {
	document.getElementById("noise").play();
	isRinging = true;
}

function turnOff() {
	if (isRinging) {
		stopNoise();
		unsetAlarm();
	}
}