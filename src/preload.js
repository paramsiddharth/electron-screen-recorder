const { writeFile} = require('fs');
const { desktopCapturer, remote, dialog } = require('electron');
window.writeFile = writeFile;
window.electron = {
	desktopCapturer: desktopCapturer, 
	remote: remote, 
	dialog: dialog,
};