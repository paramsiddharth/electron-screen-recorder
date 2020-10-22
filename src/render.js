// Module imports
// const { desktopCapturer, remote, dialog } = window.electron;
const { writeFile} = require('fs');
const { desktopCapturer, remote } = require('electron');
const { Menu, dialog } = remote;
// const writeFile = window.writeFile;
// const Buffer = window.Buffer;

// Buttons
const videoElement = document.querySelector('video');
const startBtn = document.querySelector('#startBtn');
const stopBtn = document.querySelector('#stopBtn');
const videoSelectBtn = document.querySelector('#videoSelectBtn');
videoSelectBtn.onclick = getVideoSources;

// Handle clicks on the buttons
startBtn.onclick = e => {
	mediaRecorder.start();
	startBtn.classList.add('is-danger');
	startBtn.innerText = 'Recording...';
};
stopBtn.onclick = e => {
	mediaRecorder.stop();
	startBtn.classList.remove('is-danger');
	startBtn.innerText = 'Start';
};

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

let mediaRecorder; // MediaRecorder instance to capture footage
const recorderChunks = [];

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

	// Create the Media Recorder
	const options = { mimeType: 'video/webm; codesc=vp9' };
	mediaRecorder = new MediaRecorder(stream, options);

	// Register Event Handlers
	mediaRecorder.ondataavailable = handleDataAvaiable;
	mediaRecorder.onstop = handleStop;
}

// Capture all recorded chunks
function handleDataAvaiable(e) {
	console.log('Video data available.', e);
	recorderChunks.push(e.data);
}

// Saves the video file on stop
async function handleStop(e) {
	const blob = new Blob(recorderChunks, {
		type: 'video/webm; codesc=vp9'
	});

	const buffer = Buffer.from(await blob.arrayBuffer());

	const { filePath } = await dialog.showSaveDialog({
		buttonLabel: 'Save video',
		defaultPath: `vid-${Date.now()}.webm`,
	});

	console.log(filePath);

	writeFile(filePath, buffer, () => console.log('Video saved successfully!'));
}