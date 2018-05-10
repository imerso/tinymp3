//
// TinyMP3 Player v1.0
// Written by Vander R. N. Dias - a.k.a. imerso / imersiva.com
//

import React from 'react';
import ReactDom from 'react-dom';
import Mp3Player from './Mp3Player/Mp3Player.jsx';


// rough mobile device detection
var n = navigator.userAgent;
window.isMobile = (n.match(/Android/i) || n.match(/webOS/i) || n.match(/iPhone/i) || n.match(/iPad/i) || n.match(/iPod/i) || n.match(/BlackBerry/i) || n.match(/Windows Phone/i));


// simple text localization
// (could come from the server, but I decided to keep it really simple for now)
window.texts = new Object();
if (true)		// just toggle the flag to switch between portuguese and english =)
{
	// english
	window.texts.selectMusic = "Select a music";
	window.texts.queuePath = "Add path to queue";
	window.texts.queueFile = "Add music to queue";
	window.texts.queued = "queued";
	window.texts.notimplemented = "Feature not implemented yet";
}
else
{
	window.texts.selectMusic = "Selecione uma música";
	window.texts.queuePath = "Adicionar diretório à lista de reprodução";
	window.texts.queueFile = "Adicionar música à lista de reprodução";
	window.texts.queued = "adicionado";
	window.texts.notimplemented = "Recurso ainda não adicionado";
}


ReactDom.render(
	<Mp3Player />,
	document.getElementById("react-app")
);
