
/*  Name: Aven Au
	zid: z5208734
	Date: 12/08/19 (last edited) 
	Description: This code page is the html build for
	majority of the site	
*/
	
import {voteForm, appendVoteForm} from "./votes.js";
import {commentForm, appendCommentForm} from "./comment.js";
import {postFeedPopUp} from "./feed.js";
import {myProfileForm} from "./profile.js";

//This is the main html build. This is called at the beginning of every page refresh
function init(apiUrl) {
	let root = document.getElementById("root");
	commentForm();
	voteForm();
	postFeedPopUp ();
	myProfileForm();
	header();
	main();
	function header() {
		let header = document.createElement("header");
		header.setAttribute('class', 'banner');
		header.setAttribute('id', 'nav');
		let h1 = document.createElement("h1");
		h1.setAttribute('id', 'logo');
		h1.setAttribute('class', 'flex-center');
		h1.innerText = "Seddit";
		let u1 = document.createElement("u1");
		u1.setAttribute('class', 'nav');
		
		let li1 = document.createElement("li");
		li1.setAttribute('class', 'nav-item');
		let searchbox = document.createElement("input");
		searchbox.setAttribute('id', 'search');
		searchbox.setAttribute('placeholder', 'Search Seddit');
		searchbox.setAttribute('type', 'search');
		var dataIdSearch = document.createAttribute("data-id-search");			                           
		searchbox.setAttributeNode(dataIdSearch);  
		
		let li2 = document.createElement("li");
		li2.setAttribute('class', 'nav-item');
		let loginButton = document.createElement("button");
		loginButton.setAttribute('class', 'button');
		loginButton.classList.add('button-primary');
		loginButton.innerText = "Log In";
		var dataIdLogin = document.createAttribute("data-id-login");			                           
		loginButton.setAttributeNode(dataIdLogin); 

		let li3 = document.createElement("li");
		li3.setAttribute('class', 'nav-item');
		let registerButton = document.createElement("button");
		registerButton.setAttribute('class', 'button');
		registerButton.classList.add('button-secondary');
		registerButton.innerText = "Sign Up";
		var dataIdRegister = document.createAttribute("data-id-signup");			                           
		registerButton.setAttributeNode(dataIdRegister); 
		
		let li4 = document.createElement("li");
		li4.setAttribute('class', 'nav-item');
		let logoutButton = document.createElement("button");
		logoutButton.setAttribute('id', 'logout');
		logoutButton.setAttribute('class', 'button');
		logoutButton.classList.add('button-secondary');
		logoutButton.innerText = "Log Out";	
		var dataIdRegister2 = document.createAttribute("data-id-signup");		                           
		logoutButton.setAttributeNode(dataIdRegister2);
		logoutButton.style.display = "none";
		
		let li5 = document.createElement("li");
		li5.setAttribute('class', 'nav-item');
		let profileButton = document.createElement("button");
		profileButton.setAttribute('id', 'myprofile');
		profileButton.setAttribute('class', 'button');
		profileButton.classList.add('button-primary');
		profileButton.innerText = "Profile";	
		var dataIdRegister3 = document.createAttribute("data-id-myprofile");		                           
		profileButton.setAttributeNode(dataIdRegister3);
		profileButton.style.display = "none";
		if (sessionStorage.token) {
			profileButton.style.display = "inline-block";
		}
		
		li1.appendChild(searchbox);
		li2.appendChild(loginButton);
		li3.appendChild(registerButton);
		li4.appendChild(logoutButton);
		li5.appendChild(profileButton);
		u1.appendChild(li1);
		u1.appendChild(li2);
		u1.appendChild(li3);
		u1.appendChild(li5);
		u1.appendChild(li4);
		header.appendChild(h1);
		header.appendChild(u1);
		root.appendChild(header);
	}

	function main() {
		let main = document.createElement("main");
		main.setAttribute('role', 'main');
		let ul = document.createElement("ul");
		ul.setAttribute('id', 'feed');
		var dataIdFeed = document.createAttribute("data-id-feed");
		ul.setAttributeNode(dataIdFeed);
		
		let headerContainer = document.createElement("div");
		headerContainer.setAttribute('id', 'headerContainer');
		
		let feedHeader = document.createElement("div");
		feedHeader.setAttribute('class', 'feed-header');
		let h3 = document.createElement("h3");
		h3.setAttribute('class', 'feed-title');
		h3.classList.add('alt-text');
		h3.innerText = "Popular Posts";
		let postButton = document.createElement("button");
		postButton.setAttribute('class', 'button');
		postButton.setAttribute('id', 'postButton');
		postButton.classList.add('button-secondary');
		postButton.innerText = "Post";
		
		let allPostDiv = document.createElement("div");
		allPostDiv.setAttribute('id', 'allPost');
		if (!sessionStorage.token){
			fetch(`${apiUrl}/post/public`)
				.then(res => res.json())
				.then(resource => {
					const defaultPost = resource.posts.reverse();
					for (let posts of defaultPost) {
						let image = posts.image;
						allPostDiv.prepend(makePost(posts.meta.author, posts.title, posts.text, image, posts.meta.upvotes.length, posts.meta.published, posts.meta.subseddit, posts.comments.length, posts)); 
					}
			})
		}

		feedHeader.appendChild(h3);
		feedHeader.appendChild(postButton);
		headerContainer.appendChild(feedHeader);
		ul.appendChild(headerContainer);
		ul.appendChild(allPostDiv);
		main.appendChild(ul);
		
		root.appendChild(main);
	}	
			
}

/*This function makes a post with the given parameters. This function is used by appendFeed and scrollFeed*/

function makePost(author, title, postContent, image, upvotes, published, subseddit, comments, postArray) {
	let li = document.createElement("li");
	li.setAttribute('class', 'post');
	li.id = postArray.id
	var dataIdPost = document.createAttribute("data-id-post");
	li.setAttributeNode(dataIdPost);
	let vote = document.createElement("div");
	var dataIdUpvotes = document.createAttribute("data-id-upvotes");
	vote.setAttributeNode(dataIdUpvotes);
	vote.setAttribute('class', 'vote');
	
	var voteBtn = document.createElement("button");
	voteBtn.style.lineHeight = "normal";
	voteBtn.innerText = upvotes;
	voteBtn.setAttribute('class', 'button');
	voteBtn.classList.add('button-primary');
	voteBtn.classList.add("voteBtn");
	let marker = document.createAttribute("postid");
	marker.value = postArray.id;
	voteBtn.setAttributeNode(marker);
	voteBtn.style.width = "100%";
	voteBtn.style.display = "block";
	voteBtn.style.margin = "0";
	voteBtn.style.padding = "0";
	voteBtn.style.top = "50%";
	voteBtn.style.transform = "translateY(200%)";	
	
	var upVoteBtn = document.createElement("button");
	upVoteBtn.innerText = "▲";
	upVoteBtn.setAttribute('class', 'button');
	upVoteBtn.classList.add('button-primary');
	upVoteBtn.classList.add("upVoteBtn");
	let marker2 = document.createAttribute("postidup");
	marker2.value = postArray.id;
	upVoteBtn.setAttributeNode(marker2);
	
	let hasVote = document.createAttribute("hasvote");
	hasVote.value = "false";
	if (sessionStorage.token) {
		let upVoteStorage = postArray.meta.upvotes
		let userStorage = JSON.parse(sessionStorage.user);
		hasVote.value = upVoteStorage.includes(userStorage.id).toString();
		upVoteBtn.setAttributeNode(hasVote);
		if (hasVote.value == "true") {
			upVoteBtn.classList.add('button-secondary');
			upVoteBtn.classList.remove('button-primary');
		}
	}
	
	
	upVoteBtn.style.width = "100%";
	upVoteBtn.style.display = "block";
	upVoteBtn.style.padding = "0";
	upVoteBtn.style.top = "50%";
	upVoteBtn.style.transform = "translateY(190%)";
	
	
	
	let content = document.createElement("div");
	content.setAttribute('class', 'content');
	let h4 = document.createElement("h2");
	var dataIdTitle = document.createAttribute("data-id-title");
	h4.setAttributeNode(dataIdTitle);
	h4.setAttribute('class', 'post-title');
	h4.classList.add('alt-text');
	let h5 = document.createElement("h4");
	h5.class = "post-title";
	h5.classList.add('post-title');
	h5.innerText = `s/${subseddit}`;
	
	h4.innerText = `${title}`;
	let postText = document.createElement("p");
	postText.classList.add('alt-text');
	postText.innerText = `${postContent}`;
	
	var time = new Date(parseInt(published, 10)).toUTCString();
	
	let p = document.createElement("p");
	p.classList.add('post-author');
	var dataIdAuthor = document.createAttribute("data-id-author");
	p.setAttributeNode(dataIdAuthor);
	p.innerText = `Posted by @${author} on ${time}`;
	
	let commentBtn = document.createElement("button");
	commentBtn.setAttribute('class', 'button');
	commentBtn.classList.add('button-primary');
	commentBtn.classList.add('alt-text');
	let commentpostid = document.createAttribute('commentpostid');
	commentpostid.value = postArray.id;
	commentBtn.setAttributeNode(commentpostid);
	commentBtn.innerText = `${comments} Comments`; 
	commentBtn.id = "feed-comment";
	
	let img = document.createElement('img');
	if (image) {
		img.src = `data:image/jpeg;base64, ${image}`;
		img.style.margin = "10px auto";
		img.style.width = "100%";
	}

	content.appendChild(h5);
	content.appendChild(h4);
	content.appendChild(postText);
	
	if (image) {
		content.appendChild(img);
	}
	content.appendChild(commentBtn);
	content.appendChild(p);
	vote.appendChild(upVoteBtn);
	vote.appendChild(voteBtn);
	li.appendChild(vote);
	li.appendChild(content);
	
		
	return li;
}

//Appends the post into the feed
function appendPost(post) {
	let feed = document.getElementById('allPost');
	feed.appendChild(post);	
}

//Prepend the post into the feed
function prependPost(post) {
	let feed = document.getElementById('allPost');
	feed.prepend(post);	
}


export {init, makePost, appendPost, prependPost};
