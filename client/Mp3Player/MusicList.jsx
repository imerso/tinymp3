//
// TinyMP3 Player v1.0
// Written by Vander R. N. Dias - a.k.a. imerso / imersiva.com
//

import React, { Component } from 'react';
import './MusicList.css';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Collapse from 'material-ui/transitions/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';


// Some basic listitem custom styling
const styles = theme =>
({
	root:
	{
		width: "100%",
		fontFamily: "exo2b",
		color: "#FFFFFF",
		textWeight: "bold",

		background: "linear-gradient(to bottom, rgba(125,126,125,1) 0%,rgba(14,14,14,1) 100%)"
	},
	nested:
	{
		fontFamily: "exo2b",
		background: "linear-gradient(to bottom, rgba(254,255,232,1) 0%,rgba(214,219,191,1) 100%)",
		color: "#202020",
		textWeight: "bold",
		paddingLeft: theme.spacing.unit * 8,
	},
});


// Generic xml request - yeah, I know, there is a package for that.
function xmlRequest(url, successCallback, failureCallback)
{
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.overrideMimeType('text/plain');
	request.setRequestHeader('Content-Type', 'text/plain');

	var _this = this;

	function success(e)
	{
		if (successCallback != null) successCallback(e.target.response);
	}

	function failure(e)
	{
		if (failureCallback) failureCallback(e);
	}

	request.addEventListener('load', success);
	request.addEventListener('error', failure);
	request.addEventListener('abort', failure);
	request.send();
}


// The music list class itself
// it will list all the directories that have musics inside,
// on a collapsed list where the nested list have the musics.
// Clicking on a music will play it.
class MusicList extends Component
{
	constructor(props)
	{
		super(props);

		// keeps track of an "open" boolean for each directory,
		// plus the complete list
		this.state =
		{
			open: [],
			list: [],
			msg: undefined,
			toastTimer: undefined
		};

		// clicking on a directory will toggle the musics list inside that
		this.onClickPath = this.onClickPath.bind(this);

		// clicking on a file will play it
		this.onClickFile = this.onClickFile.bind(this);

		// clicking on a path queue will add the entire path to queue
		this.onClickQueuePath = this.onClickQueuePath.bind(this);

		// clicking on a file queue will add that file to queue
		this.onClickQueueFile = this.onClickQueueFile.bind(this);
	}


	// Request the full list on mount
	componentDidMount()
	{
		this.reqFiles();
	}


	// Ask server for the full directories and musics list
	// (should not be a problem unless you have a really, really huge library)
	reqFiles()
	{
		var _this = this;

		xmlRequest('/list', 
			function(res)
			{
				var list = JSON.parse(res);

				// set all directories as closed on start
				var open = [];
				for (var d=0; d<list.length; d++)
				{
					open.push(false);
				}

				// store as state
				_this.setState({ list: list, open: open });
			},
			function()
			{
				// something went wrong
				_this.setState({ list: [] });
			});
	}


	// Play a clicked file
	onClickFile(index, musicEntry)
	{
		var fullPath = this.state.list[index].path + "/" + musicEntry;
		this.props.playFunc(fullPath, musicEntry);
	}


	// Toggle (open or close) a directory music list
	onClickPath(index)
	{
		var open = this.state.open;
		open[index] = !open[index];
		this.setState({ open: open });
	}

	
	// Add an entire path entry with all its musics to queue
	onClickQueuePath(index)
	{
		this.props.queuePathFunc(this.state.list[index]);
		this.toast(this.state.list[index].name + " " + window.texts.queued);
	}


	// Add a music to queue
	onClickQueueFile(index, musicEntry)
	{
		var fullPath = this.state.list[index].path + "/" + musicEntry;
		this.props.queueFileFunc({fullPath:fullPath, shortPath:musicEntry});
		this.toast(musicEntry + " " + window.texts.queued);
	}


	// Toast
	toast(msg)
	{
		if (this.state.toastTimer != undefined)
		{
			// cancel old timeout
			clearTimeout(this.state.toastTimer);
		}

		var _this = this;
		var timer = setTimeout(function(){_this.setState({msg: undefined});}, 2000);
		this.setState({msg: msg, toastTimer: timer});
	}


	// Show list and handle clicks
	render()
	{
		// for styling
		const { classes } = this.props;

		// Loop through all directories on the list, building the nested items
		var items = [];
		for (var d=0; d<this.state.list.length; d++)
		{
			// inner files of current directory
			const pathIndex = d;
			const fileItems = this.state.list[d].files.map((entry, index) =>
				<ListItem button className={classes.nested} key={index}>
					<ListItemIcon onClick={() => this.onClickFile(pathIndex, entry) }>
						<i className="material-icons">play_circle_outline</i>
					</ListItemIcon>
					<ListItemText classes={{ primary: classes.nested }} onClick={() => this.onClickFile(pathIndex, entry)} inset primary={entry} />
					<ListItemIcon onClick={() => this.onClickQueueFile(pathIndex, entry)}>
						<i className="material-icons" title={window.texts.queueFile}>add_to_queue</i>
					</ListItemIcon>
				</ListItem>
			);

			var dirKey = "dir" + d;
			const openIndex = d;

			// directory list item
			items.push(
				<div key={dirKey}>
					<ListItem button className={classes.root}>
						<ListItemIcon onClick={() => this.onClickPath(openIndex)}>
							<img src={this.state.list[d].icon} />
						</ListItemIcon>
						<ListItemText classes={{ primary: classes.root }} onClick={() => this.onClickPath(openIndex)} inset primary={this.state.list[d].path} />
						{this.state.open[openIndex] ? <ExpandLess /> : <ExpandMore />}
						<ListItemIcon onClick={() => this.onClickQueuePath(openIndex)}>
							<i className="material-icons" title={window.texts.queuePath}>add_to_queue</i>
						</ListItemIcon>
					</ListItem>
					<Collapse in={this.state.open[openIndex]} timeout="auto" unmountOnExit>
						{fileItems}
					</Collapse>
				</div>
			);
		}

		// and finally render them
		return (
			<div className="mp3-musiclist">
				<div className="collection">
					{items}
				</div>
				{this.state.msg != undefined && (<div className="ms-toast">{this.state.msg}</div>)}
			</div>
		);
	}
}

// for styling
MusicList.propTypes = {
	classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(MusicList);
