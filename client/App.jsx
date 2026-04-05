//
// TinyMP3 Player v1.0
// Written by Vander R. N. Dias - a.k.a. imerso / imersiva.com
//

import React from 'react';
import ReactDom from 'react-dom';
import Mp3Player from './Mp3Player/Mp3Player.jsx';

// SAFE IMPORTS for Webpack 3
const MuiThemeProviderV1 = require('@material-ui/core/styles/MuiThemeProvider').default || require('@material-ui/core/styles/MuiThemeProvider');
const createMuiTheme = require('@material-ui/core/styles/createMuiTheme').default || require('@material-ui/core/styles/createMuiTheme');
const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default || require('material-ui/styles/MuiThemeProvider');
const getMuiTheme = require('material-ui/styles/getMuiTheme').default || require('material-ui/styles/getMuiTheme');

const themeV1 = createMuiTheme();
const themeV0 = getMuiTheme();

// rough mobile device detection
var n = navigator.userAgent;
window.isMobile = (n.match(/Android/i) || n.match(/webOS/i) || n.match(/iPhone/i) || n.match(/iPad/i) || n.match(/iPod/i) || n.match(/BlackBerry/i) || n.match(/Windows Phone/i));

// simple text localization
window.texts = new Object();
if (true) {
	window.texts.selectMusic = "Select a music";
	window.texts.queuePath = "Add path to queue";
	window.texts.queueFile = "Add music to queue";
	window.texts.queued = "queued";
	window.texts.notimplemented = "Feature not implemented yet";
} else {
	window.texts.selectMusic = "Selecione uma música";
	window.texts.queuePath = "Adicionar diretório à lista de reprodução";
	window.texts.queueFile = "Adicionar música à lista de reprodução";
	window.texts.queued = "adicionado";
	window.texts.notimplemented = "Recurso ainda não adicionado";
}

// Wrap with BOTH providers to support old and new components
ReactDom.render(
	<MuiThemeProviderV1 theme={themeV1}>
		<MuiThemeProvider muiTheme={themeV0}>
			<Mp3Player />
		</MuiThemeProvider>
	</MuiThemeProviderV1>,
	document.getElementById("react-app")
);