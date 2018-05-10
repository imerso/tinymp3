TinyMP3 by Vander R. N. Dias a.k.a. "imerso" / imersiva.com

This is a very small HTML5 MP3 streamer created with node.js, express.js, react.js and material-ui-next.

QUICK DEMO:

	https://tinymp3.herokuapp.com

	There I have included a few free sample music from Demoscene -- of course keeping original names and music authors names. Hopefully that is not considered a legal infringement.

HOW TO INSTALL:

	git clone https://github.com/imerso/tinymp3.git

	cd tinymp3
	npm install
	npm run build

HOW TO CONFIGURE MUSIC DIRECTORY:

	Edit config/default.json and change the "music" path to point to the root directory of your own music library, or simply copy some to server/Media/Music.

HOW TO RUN:

	cd tinymp3
	node index.js

	- After running, open your browser at http://localhost:3000

ACCESS REMOTELY:

	Of course it can be accessed remotely, either by installing it on a remote server or opening port 3000 on your home router to access it from anywhere. Opening ports on your home router is something that you only should do if you *know* what you're really doing, though.

FUTURE PLANS:

	I may add new features on it from time to time, but this is not a promise.

LICENSE:

	Use it freely (not commercially though, for that please contact me previously).

	As a rule of thumb:

		The origin of this software must not be misrepresented; you must not
		claim that you wrote the original software. If you use this software
		in a product, an acknowledgment in the product documentation is
		expected and appreciated. Please contact before commercial usage.

	Have fun.

