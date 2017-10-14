//assigns initial global variable values
let timerLength = 25;
let restLength = 3;
let roundNum = 1
//used to track countdown status, to allow for change of displayed minutes when work interval is changed while counter is static
let running = false;
//globally targeting all necessary elements
let banner = document.querySelector('h2 span');
let duration = document.querySelector('#duration');
let rest = document.querySelector('#rest');
let minusDuration = document.querySelector('#minusDuration');
let plusDuration = document.querySelector('#plusDuration');
let minusRest = document.querySelector('#minusRest');
let plusRest = document.querySelector('#plusRest');
let minutes = document.querySelector('#minutes');
let seconds = document.querySelector('#seconds');
let text = document.querySelector('p');
let reset = document.querySelector('#reset');
//controls work and break interval user adjustments from 1-99 mins
minusDuration.addEventListener('click', function() {
	if (timerLength > 1) {timerLength--; adjustTimer();}
});
plusDuration.addEventListener('click', function() {
	if (timerLength < 99) {timerLength++; adjustTimer();}
});
minusRest.addEventListener('click', function() {
	if (restLength > 1) {restLength--; adjustRest();}
});
plusRest.addEventListener('click', function() {
	if (restLength < 99) {restLength++; adjustRest();}
});
//adjusts minutes display of work interval
function adjustTimer() {
	if(timerLength < 10) duration.innerText = '0' + timerLength;
	else duration.innerText = timerLength;
	//adjusts display for time (minutes) when app is static
	if (running === false) {minutes.innerText = timerLength;}
}
//adjusts minutes display of break interval
function adjustRest() {
	if (restLength < 10) rest.innerText = '0' + restLength;
	else rest.innerText = restLength;
}
//initializes app on page load
init();
//gives start button functionality
function init() {
	const start = document.querySelector('#start');
	start.addEventListener('click', function() {
		start.style.display = 'none'; //hides start button
		reset.style.display = 'block'; //unhides reset button
		main(timerLength, 1); //passes work interval time and initial iterator value to main()
		banner.innerText = 'Work Time'; //updates status display
	});
}
//main pomodoro clock action
function main(time, interval) {
	//assigns values to local variables
	let i = interval, m = time, s = 59; 
	if (i > 1) howl(); //initiates alarm on all cycle changes
	running = true; 
	//initializes a 1sec interval counter and calls countdown(), and assigns interval identification number to id for future use in clearing the interval
	let id = setInterval(function() {countdown()}, 1000);
	//adds functionality to reset button
	reset.addEventListener('click', function() {
		initialValues(); //calls function to set initial clock values based on current interval settings
	});
	//controls timer countdowns
	function countdown() {
		//maintains double digit display for single digit second values
		if (s < 10) {seconds.innerText = '0' + s;}
		else seconds.innerText = s; //begins countdown at 59 seconds after initial 1 sec interval
		//decrements minutes when seconds flip form 0 to 59
		if (s === 59) {m--; minutes.innerText = m;} 
		s--; //decrements seconds for each interval
		if (s === -1) {s = 59}  //loops seconds after one minute
		if (m === 0 && s === 0) { //if timer has expired for currect cycle
			seconds.innerText = '00'; //stops seconds display
			clearInterval(id); //clears (stops) the interval
			i++; //increments iterator tracking cycle number
			//displays current cycle is a break if iteratror is even
			if (i % 2 === 0) banner.innerText = 'Break Time';
			else banner.innerText = 'Work Time' //displays current cycle is work, if not a break
			//initiaites long break after four work and three break cycles
			if (i % 8 === 0) {restLength = 15; main(restLength, i);}
			//following long break, resets round number display, and sets rest interval back to user selection
			else if (i % 8 === 1) {restLength = Number(rest.innerText); roundNum = 1; round.innerText = roundNum; main(timerLength, i);}
			else if (i % 2 === 0 ) main(restLength, i); //calls regular break
			else {main(timerLength, i); roundNum++; round.innerText = roundNum;} //calls regular work cycle and updates round number
		}
	}
	//resets initial values, based on current user interval selections
	function initialValues() {
		reset.style.display = 'none'; //hides reset button
		clearInterval(id); //ends interval called in countdown
		start.style.display = 'block'; //displays start button
		restLength = Number(rest.innerText); //assigns the break length the current user selected number
		timerLength = Number(duration.innerText); //assigns the work length the current user selected number
		minutes.innerText = timerLength; //sets minutes/countdown display to user selected value
		seconds.innerText = '00'; //resets seconds in minutes display
		running = false;
		roundNum = 1; //resets round number
		round.innerText = roundNum; //resets round number display
		banner.innerText = 'Ready To Begin'; //changes banner text
	}
}
//controls audio alarm via howler js
function howl() {
	const alarm = document.querySelector('#stopAlarm');
	reset.style.display = 'none'; //hides reset button
	alarm.style.display = 'block'; //unhides alarm off button
	//assigns variable for alarm sound call to howler js
	let sound = new Howl({ 
		src: ['Assets/Sounds/zapsplat_emergency_siren_air_raid_synthesized.mp3'],
		loop: true //loops the alarm mp3
	});
	sound.play(); //plays alarm mp3
	//adds functionalitiy to alarm stop button
	alarm.addEventListener('click', function() {
		sound.stop();
		alarm.style.display = 'none'; //hides alarm button
		reset.style.display = 'block'; //unhides reset button
	});
}
