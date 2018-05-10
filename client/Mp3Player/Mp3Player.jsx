//
// TinyMP3 Player v1.0
// Written by Vander R. N. Dias - a.k.a. imerso / imersiva.com
//

import React, { Component } from 'react';
import MusicList from './MusicList.jsx';
import './Mp3Player.css';


// The basic MP3 music player
class Mp3Player extends Component
{
	constructor(props)
	{
		super(props);

		// keep note of selected full path and its short name,
		// plus audio current time and play list
		this.state =
		{
			player: new Audio(),
			fullPath: "",
			shortPath: "",
			time: "00:00",
			normtime: 0,
			queue: [],
			currentInQueue: 0
		};

		this.play = this.play.bind(this);
		this.toggleMusic = this.toggleMusic.bind(this);
		this.queuePath = this.queuePath.bind(this);
		this.queueFile = this.queueFile.bind(this);
	}


	// Play a music file
	play(fullPath, shortPath)
	{
		// find the html5 audio component
		var player = this.state.player;

		// stop any playing music
		if (player)
		{
			player.pause();
			player.currentTime = 0;
			this.setState({time: "00:00", normtime: 0});
		}

		// store music info as state
		this.setState({fullPath: fullPath, shortPath: shortPath});
		var _this = this;

		setTimeout(function()
		{
			var player = _this.state.player;
			player.src = fullPath;
			player.load();

			var audioCtx;
			var analyser;
			var source;
			var frequencyData;

			if (_this.state.audioCtx != undefined)
			{
				audioCtx = _this.state.audioCtx;
				analyser = _this.state.analyser;
				source = _this.state.source;
				frequencyData = _this.state.frequencyData;
			}
			else
			{
				if (!window.isMobile)
				{
					audioCtx = new AudioContext();
					analyser = audioCtx.createAnalyser();
					source = audioCtx.createMediaElementSource(player);
					frequencyData = new Uint8Array(analyser.frequencyBinCount);

					source.connect(analyser);
					analyser.connect(audioCtx.destination);
					analyser.fftSize = 32;

					_this.setState({audioCtx:audioCtx, analyser:analyser, source:source, frequencyData:frequencyData});
				}

				setInterval(function ()
				{
					if (player.ended)
					{
						_this.playNext(true);
					}

					// calculate normalized time
					var normtime = (player.duration > 0 ? player.currentTime / player.duration : 0);

					var mins = Math.floor(player.currentTime / 60);
					var secs = Math.floor(player.currentTime - mins*60);
					var strMins = "" + mins;
					var strSecs = "" + secs;
					var time = "00".substring(0, 2-strMins.length)+strMins + ":" + "00".substring(0, 2-strSecs.length)+strSecs;
					_this.setState({time: time, normtime: normtime});
				}, 1000);
			}

	
			function renderFrame()
			{
				analyser.getByteFrequencyData(frequencyData);
				f0.style.height = (100 - (frequencyData[0] * 100) / 256) + "%";
				f1.style.height = (100 - (frequencyData[1] * 100) / 256) + "%";
				f2.style.height = (100 - (frequencyData[2] * 100) / 256) + "%";
				f3.style.height = (100 - (frequencyData[3] * 100) / 256) + "%";
				f4.style.height = (100 - (frequencyData[4] * 100) / 256) + "%";
				f5.style.height = (100 - (frequencyData[5] * 100) / 256) + "%";
				f6.style.height = (100 - (frequencyData[6] * 100) / 256) + "%";
				f7.style.height = (100 - (frequencyData[7] * 100) / 256) + "%";
				f8.style.height = (100 - (frequencyData[8] * 100) / 256) + "%";
				f9.style.height = (100 - (frequencyData[9] * 100) / 256) + "%";

				requestAnimationFrame(renderFrame);
			}

			player.play();
			renderFrame();
		}, 1000);
	}


	// Play next music in the queue
	playNext(inc)
	{
		if (this.state.queue.length > 0)
		{
			var queue = this.state.queue;

			// only increment current music is specifically told to
			if (inc != undefined && inc)
			{
				this.state.currentInQueue = (this.state.currentInQueue + 1) % this.state.queue.length;
			}

			var next = queue[this.state.currentInQueue];
			this.play(next.fullPath, next.shortPath);
		}
	}


	// Play next music in the queue
	playPrevious()
	{
		if (this.state.queue.length > 0)
		{
			this.state.currentInQueue--;
			if (this.state.currentInQueue < 0) this.state.currentInQueue = this.state.queue.length - 1;

			var queue = this.state.queue;
			var next = queue[this.state.currentInQueue];
			this.play(next.fullPath, next.shortPath);
		}
	}


	// Pause or resume current music
	toggleMusic(e)
	{
		var player = this.state.player;

		if (player != undefined)
		{
			// divide the screen on 3 sections,
			// left = previous music on queue
			// center = pause/resume playing music
			// right = next music on queue
			var sec = Math.floor(Math.max(document.documentElement.clientWidth, window.innerWidth || 0) / 3);
			var px = e.screenX;

			if (px < sec)
			{
				// left - previous in queue
				this.playPrevious();
			}
			else if (px > sec*2)
			{
				// right - next in queue
				this.playNext(true);
			}
			else
			{
				// center - toggle playing
				if (player.paused) player.play();
				else player.pause();
			}
		}
	}


	// Add path to queue
	queuePath(pathEntry)
	{
		var queue = this.state.queue;
		for (var m=0; m<pathEntry.files.length; m++)
		{
			var fullPath = pathEntry.path 		//console.log("Added: " + file.shortPath);
			+ "/" + pathEntry.files[m];
			queue.push({fullPath:fullPath, shortPath:pathEntry.files[m]});
		}
		this.setState({queue: queue});

		// start playing the queue if there is no music playing already
		if (this.state.player.paused) this.playNext(false);
	}


	// Add music to queue
	queueFile(file)
	{
		var queue = this.state.queue;
		queue.push(file);
		this.setState({queue: queue});

		// start playing the queue if there is no music playing already
		if (this.state.player.paused) this.playNext(false);
	}


	// Show player
	render()
	{
		// if no music selected yet, show a help message; else, show music short name
		var msg = (this.state.fullPath == "" ? window.texts.selectMusic : this.state.shortPath);

		// render the basic mp3 player
		return (
			<div className="App">
				<div id="mp3-controls">
					<div id="mp3-title">TINY MP3 PLAYER v1.0</div>
				</div>

				{/*
				<button className="mp3-controlbutton">
					<i className="material-icons" style={{fontSize:"8vmin"}}>play_circle_outline</i>
				</button>
				<button className="mp3-controlbutton">
					<i className="material-icons" style={{fontSize:"8vmin"}}>pause</i>
				</button>
				*/}

				{/* fft spectrum bars */}
				<div id="mp3-spectrum" onClick={(e)=>this.toggleMusic(e)}>
					<div id="f0" className="mp3-spectrumbar"></div>
					<div id="f1" className="mp3-spectrumbar"></div>
					<div id="f2" className="mp3-spectrumbar"></div>
					<div id="f3" className="mp3-spectrumbar"></div>
					<div id="f4" className="mp3-spectrumbar"></div>
					<div id="f5" className="mp3-spectrumbar"></div>
					<div id="f6" className="mp3-spectrumbar"></div>
					<div id="f7" className="mp3-spectrumbar"></div>
					<div id="f8" className="mp3-spectrumbar"></div>
					<div id="f9" className="mp3-spectrumbar"></div>

					<div id="mp3-musictitle">{msg}</div>
					<div id="mp3-musictime">{this.state.time}</div>
					<div id="mp3-musicnormtimeback"></div>
					<div id="mp3-musicnormtime" style={{width:(this.state.normtime*50)+"%"}}></div>
				</div>

				{/* music list goes below the player */}
				<MusicList playFunc={this.play} queuePathFunc={this.queuePath} queueFileFunc={this.queueFile} />
			</div>
		);
	}
}

export default Mp3Player;
