// Module imports
const { desktopCapturer, remote } = require('electron');
const { Menu } = remote;

// Buttons
const videoElement = document.querySelector('video');
const startBtn = document.querySelector('#startBtn');
const stopBtn = document.querySelector('#stopBtn');
const videoSelectBtn = document.querySelector('#videoSelectBtn');
videoSelectBtn.onclick = getVideoSources;

// Get the available video source
async function getVideoSources() {
	const inputSources = await desktopCapturer.getSources({
		types: ['window', 'screen'],
	});

	// console.log(inputSources);

	const videoOptionsMenu = Menu.buildFromTemplate(
		inputSources.map(source => ({
			label: source.name,
			click: () => selectSource(source),
		}))
	);

	videoOptionsMenu.popup();
}

// Change the videoSource window to record
async function selectSource(source) {
	videoSelectBtn.innerText = source.name;

	const constraints = {
		audio: false,
		video: {
			mandatory: {
				chromeMediaSource: 'desktop',
				chromeMediaSourceId: source.id,
			},
		},
	};

	// Create a stream
	const stream = await navigator.mediaDevices
		.getUserMedia(constraints);
	
	// Preview the source in a video element
	videoElement.srcObject = stream;
	videoElement.play();
}