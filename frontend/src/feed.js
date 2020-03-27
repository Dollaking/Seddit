/*  Name: Aven Au
	zid: z5208734
	Date: 12/08/19 (last edited) 
	Description: This code that is relevant for anything to 
	do with the feed, like updating feed and infinite scroll	
*/ 

import {makePost, appendPost, prependPost} from "./html.js";

/* This function fetches all the feed from the backend, which then is appended into
the user's feed
*/
function updateFeed(apiUrl) {
	let token = sessionStorage.token;
	
	fetch(`${apiUrl}/user/feed`, {
			method: 'GET',
			headers: { 
				'authorization': `Token ${token}`,
				'Content-type': "application/json"
			}
		})
			.then(res => res.json())
			.then(response => {
				if (response.posts) {
					const feed = response.posts.reverse();
					for (const post of feed) {
						prependPost(makePost(post.meta.author, post.title, post.text, post.image, post.meta.upvotes.length, post.meta.published, post.meta.subseddit, post.comments.length, post));
					}
				}
				
			})
			.catch(error => {
				console.error('Error:', error);
			})		
}

/* This is the feed update when infinite scrolling conditions are activate (seen in main.js)
This is a bit different to updateFeed as it needs to tally the number of posts in sessionStorage.
Also a query is needed for fetch to get all the posts.
*/

function scrollFeed(apiUrl) {
	let token = sessionStorage.token;
	let totalFeed = parseInt(sessionStorage.noFeed) + 10;
	fetch(`${apiUrl}/user/feed?p=${totalFeed}`, {
			method: 'GET',
			headers: { 
				'authorization': `Token ${token}`,
				'Content-type': "application/json"
			}
		})
			.then(res => res.json())
			.then(response => {
				if (response.posts) {
					const feed = response.posts.reverse();
					for (const post of feed) {
						appendPost(makePost(post.meta.author, post.title, post.text, post.image, post.meta.upvotes.length, post.meta.published, post.meta.subseddit, post.comments.length, post));
					}
				}
				
				sessionStorage.setItem("noFeed", `${totalFeed}`); 
				
			})
			.catch(error => {
				console.error('Error:', error);
			})		
}

/* This is the post modal which pops up when user clicks on the post button in the main page.
This function builds the modal for post and deals with button events within
*/
function postFeedPopUp () {
	let root = document.getElementById('root'); 
	
	let container = document.createElement("div");
	container.id = "postPopUp";
	container.classList.add("modal");
	
	let content = document.createElement("div");
	content.id = "postContent";
	content.classList.add("modal-content");
	
	let createTitle = document.createElement("input");
	createTitle.id = "createtitle";
	createTitle.placeholder = "Title";
	createTitle.classList.add("postinput");
	let createSub = document.createElement("input");
	createSub.id = "createsub";
	createSub.placeholder = "Subseddit";
	createTitle.classList.add("postinput");
	createTitle.style.margin = "5px auto";
	
	let createText = document.createElement("input");
	createText.id = "createtext";
	createText.placeholder = "Text";
	createText.classList.add("postinput");
	createText.style.height = "200px";
	createText.style.margin = "5px auto";
	
	let createImage = document.createElement("input");
	createImage.id = "createimage";
	createImage.placeholder = "Image";
	createImage.classList.add("postinput");
	createImage.accept = ".png";
	createImage.type = "file";
	
	let close = document.createElement("span");
	close.id = "commentClose";
	close.classList.add("close");
	close.innerText = `x`;
	
	close.addEventListener('click', () => {
		container.style.display = "none";
		createTitle.value = "";
		createText.value = "";
		createSub.value = "";
		createImage.value = "";
	});
	
	let postTitle = document.createElement("h2");
	postTitle.id = "postPopUpTitle";
	postTitle.innerText = "Create Your Post";
	postTitle.style.textAlign = "center";
	
	let postSubmitBtn = document.createElement("button");
	postSubmitBtn.id = "post-submit-button";
	postSubmitBtn.innerText = "Submit";
	postSubmitBtn.classList.add("button-secondary");
	
	content.appendChild(close);
	content.appendChild(postTitle);
	content.appendChild(createSub);
	content.appendChild(createTitle);
	content.appendChild(createText);
	content.appendChild(createImage);
	content.appendChild(postSubmitBtn);
	container.appendChild(content);
	
	root.prepend(container);
	
	postSubmitBtn.addEventListener('click', () => {
		let subTitle = createTitle.value;
		let subText = createText.value;
		let subSeddit = createSub.value;
		var reader = new FileReader();

		reader.onloadend = function () {
			var results = reader.result.split(",").pop();
			var data = { 
					"title": `${subTitle}`,
					"text": `${subText}`,
					"subseddit": `${subSeddit}`,
					"image": `${results}`
				}
				fetch(`${sessionStorage.apiUrl}/post`, {
					method: 'POST',
					body: JSON.stringify(data),
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Token ${sessionStorage.token}`
					},
				})
					.then(res => res.json())
					.then(response => {
						alert("You have successfully made a post!");
						createTitle.value = "";
						createText.value = "";
						createSub.value = "";
						createImage.value = "";
						container.style.display = "none";
					
					})
			
		}
		if (subTitle == "" || subText == "" || subSeddit == ""){
			alert("Your Title and Text MUST NOT be empty!");
		} else if (createImage.files[0]) {
			reader.readAsDataURL(createImage.files[0]);
		} else {
			var data = { 
					"title": `${subTitle}`,
					"text": `${subText}`,
					"subseddit": `${subSeddit}`,
					"image": ``
				}
				fetch(`${sessionStorage.apiUrl}/post`, {
					method: 'POST',
					body: JSON.stringify(data),
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Token ${sessionStorage.token}`
					},
				})
					.then(res => res.json())
					.then(response => {
						alert("You have successfully made a post!");
						createTitle.value = "";
						createText.value = "";
						createSub.value = "";
						createImage.value = "";
						container.style.display = "none";
					})
		}
		
	});
	
}

export {updateFeed, postFeedPopUp, scrollFeed};
