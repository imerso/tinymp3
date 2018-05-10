const config = require('config');
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

var musicPath = config.get("PATHS.music");
var port = process.env.PORT || config.get("SYSTEM.port");


// Scan all music folders
// and build a memory list
function musicScan()
{
	// always start from the "server" sub-directory
	var curPath;
	var musicList = [];
	var dirsToScan = [];

	dirsToScan.push(musicPath);

	while (dirsToScan.length > 0)
	{
		curPath = dirsToScan.shift();
		var relPath = curPath.substring(musicPath.length+1);
		console.log("Scanning: " + curPath);

		// search files/directories inside the current dir
		var files = fs.readdirSync(curPath)
		var subName = path.basename(curPath);
		var iconURL = "img/folder.png";
		if (fs.existsSync(curPath + "/cover.jpg"))
		{
			iconURL = relPath + "/cover.jpg";
		}

		var entry =
		{
			path: relPath,
			name: subName,
			icon: iconURL,
			files: []
		};

		files.forEach(function (file)
		{
			// differentiate between file and directory
			var stats = fs.lstatSync(curPath + "/" + file);

			if (!stats)
			{
				console.log("Error getting stats for " + file);
			}
			else if (stats.isDirectory() || stats.isSymbolicLink())
			{
				// directory
				dirsToScan.push(curPath + "/" + file);
			}
			else
			{
				// file
				var ext = path.extname(file);
				if (ext == ".mp3")
				{
					entry.files.push(file);
					//console.log("    " + file + " (" + ext + ")");
				}
			}
		});

		// insert to music list
		if (entry.files.length > 0) musicList.push(entry);
	}

	// done
	console.log("Found " + musicList.length + " music directories.");
	return musicList;
}


var jsonList = JSON.stringify(musicScan());

app.get('/list', (req, res) => res.send(jsonList));
app.use(express.static('./server/compiled'));
app.use(express.static('./server'));
app.use(express.static(musicPath));
app.listen(port, () => console.log('Imersiva TinyMP3 Server v1.0 running on port ' + port));
