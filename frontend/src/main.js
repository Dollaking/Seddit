/**
 * Written by A. Hinds with Z. Afzal 2018 for UNSW CSE.
 * 
 * Updated 2019.
 */
 
 /*  Name: Aven Au
	zid: z5208734
	Date: 12/08/19 (last edited) 
	Description: This page of code mainly deals with code
	and elements that are on the main page.
*/ 

// import your own scripts here.
import * as login from "./login.js";
import * as signup from "./signup.js";
import {init, makePost, appendPost} from "./html.js";
import {updateFeed, scrollFeed} from "./feed.js";
import {voteForm, appendVoteForm} from "./votes.js";
import {commentForm, appendCommentForm} from "./comment.js";
import {appendMyProfile} from "./profile.js";

// your app must take an apiUrl as an argument --
// this will allow us to verify your apps behaviour with 
// different datasets.
function initApp(apiUrl) {
  // your app initialisation goes here
//  fetch('http://127.0.0.1:5000')
//  	.then

	//This is startup code
	//Storing Url because sometimes I am too lazy to pass the api
	window.onload = sessionStorage.setItem('apiUrl', apiUrl);
	//This builds to initial html frame
	init(apiUrl);
	//Checks whether user is logged in, which will remove the signup and login buttons
	window.onload = loginCheck();
	//Provide the most up to date feed
	window.onload = updateFeed(apiUrl);
	//This resets the feed count every time reloaded (10 default). Useful
	//for infinite pagination
	window.onload = sessionStorage.setItem("noFeed", "10");
	let mainDiv = document.getElementsByTagName("main")[0];

	//Event for Main Page login button (The one on the header)
	var loginButton = document.getElementsByClassName('button button-primary')[0];
	loginButton.addEventListener('click', () => {
		login.loginPopUp(mainDiv, apiUrl);
	});

	//Event for signup button in the header
	var signupButton = document.getElementsByClassName('button button-secondary')[0];
	signupButton.addEventListener('click', () => {
		signup.registerPopUp(mainDiv, apiUrl);
	});
	
	//Event for logoutButton
	var logoutButton = document.getElementById('logout');
	logoutButton.addEventListener('click', () => {
		sessionStorage.clear();
		document.getElementsByClassName("button")[0].style.display = "inline-block";
		document.getElementsByClassName("button")[1].style.display = "inline-block";
		document.getElementById("logout").style.display = "none";
		alert("You have successfully logged out!");
		location.reload();
	});
	
	//Event for the user's profile button in the header
	var myProfileButton = document.getElementById('myprofile');
	myProfileButton.addEventListener('click', () => {
		document.getElementById('myProfilePopUp').style.display = "block";
		appendMyProfile();
	});
	
	//This is the update profile button inside the user's own profile page
	document.getElementById("myupdate-button").addEventListener('click', () => {	
		var nameValue = document.getElementById("update-name").value;
		var emailValue = document.getElementById("update-email").value;
		var passValue = document.getElementById("update-pass").value;
		
		/* What I did here is a bit hacky. I basically just appended the
		username, password and emails that were not empty. Also made it
		into a form where it is just like JSON.stringify() so it does not
		needs to be stringified*/
		let data = '{';
		
		if (nameValue) {
			data = data.concat(`"name":"${nameValue}",`);
		} 
		
		if (emailValue) {
			data = data.concat(`"email":"${emailValue}"`);
		}
		
		if (passValue) {
			data = data.concat(`"password":"${passValue}"`);
		}

		if (data === '{') {
			alert("There is nothing to update!");
		} else {
			data = data.substring(0, data.length - 1);
			data = data.concat("}");
			fetch (`${sessionStorage.apiUrl}/user`, {		
				method: 'PUT',
				body: data,
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Token ${sessionStorage.token}`
				}
			})
				.then(res => res.json())
				.then(response => {
					if (response.msg === "success") {
						alert ("You have successfully updated your profile");
						document.getElementById("update-name").value = "";
						document.getElementById("update-email").value = "";
						document.getElementById("update-pass").value ="";
						
					} else {
						alert ("You have not filled out the form properly");
					}
				})
		}

	})
	
	//This section is mainly for buttons that dont really have a unique id e.g. The comment button on the feed
	//or the vote button
	document.body.onclick = function (event) {
		
		let clickedButton = event.target;
		
		//This is the button that allows users to view who upvoted for the post
		if (clickedButton.getAttribute('postid')) {		
			if (!sessionStorage.token) {
				alert("You must be logged in to do this!");	
			} else {
				document.getElementById('votePopUp').style.display = "block";
				appendVoteForm(clickedButton.getAttribute('postid'), sessionStorage.apiUrl)
			}
		//This is the button where users click in order to get a comment modal
		} else if (clickedButton.getAttribute('commentpostid')) {
			if (!sessionStorage.token) {
				alert("You must be logged in to do this!");	
			} else {
				document.getElementById('commentPopUp').style.display = "block";
				sessionStorage.setItem('commentId', clickedButton.getAttribute('commentpostid'));
				sessionStorage.setItem('commentButton', event.target);
				appendCommentForm(clickedButton.getAttribute('commentpostid'), sessionStorage.apiUrl);
				
			}		
		//This is the button where users use to vote or retract their vote
		} else if (clickedButton.classList.contains("upVoteBtn")) {
			let postId = clickedButton.getAttribute("postidup");
			let hasVote = clickedButton.getAttribute("hasvote");
			if (!sessionStorage.token) {
				alert("You need to login to do this!");
			//For people who hasnt voted
			} else if (hasVote == "false") {
				fetch (`${apiUrl}/post/vote?id=${postId}`, {
	 				method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Token ${sessionStorage.token}`
					}				
				})
					.then (res => res.json())
					.then (resource => {
						clickedButton.classList.add('button-secondary');
						clickedButton.classList.remove('button-primary');
						clickedButton.setAttribute('hasvote', 'true');
						let voteBtn = document.querySelectorAll(`[postid="${postId}"]`)[0];
						voteBtn.innerText = parseInt(voteBtn.innerText) + 1; 							
					})									
					.catch(error => {
						console.error('Error:', error);
						alert("You need to be logged in to do this!");
					})
			//For people who has voted
			} else {
				fetch (`${apiUrl}/post/vote?id=${postId}`, {
	 				method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Token ${sessionStorage.token}`
					}				
				})
					.then (res => res.json())
					.then (resource => {
						clickedButton.classList.remove('button-secondary');
						clickedButton.classList.add('button-primary');
						clickedButton.setAttribute('hasvote', 'false');
						let voteBtn = document.querySelectorAll(`[postid="${postId}"]`)[0];
						voteBtn.innerText = parseInt(voteBtn.innerText) - 1; 								
					})									
					.catch(error => {
						console.error('Error:', error);
						alert("You need to be logged in to do this!");
					})
			}
		}
	}
	
	//This is scroll event for infinite scroll
	document.addEventListener('scroll', function (event) {
		if ( (document.body.scrollHeight - 1000) < (window.scrollY) ) {
			scrollFeed(apiUrl);
		}
	});
	
	

	
	//This is the post button where people click for Post modal
	var postButton = document.getElementById("postButton");
	postButton.addEventListener('click', () => {
		document.getElementById('postPopUp').style.display = "block";	
		
	});
	
	//The loginCheck from earlier, which would hide sign in and log out buttons 
	function loginCheck() {
		if (sessionStorage.token) {
			document.getElementsByClassName("button")[0].style.display = "none";
			document.getElementsByClassName("button")[1].style.display = "none";
			document.getElementById("logout").style.display = "inline-block";
		}
	
	}
}

export default initApp;
