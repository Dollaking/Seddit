/*  Name: Aven Au
	zid: z5208734
	Date: 12/08/19 (last edited) 
	Description: This code that is relevant for anything to 
	do with user profiles and their modals.	
*/ 


/*This Function builds the user's profile
	Mainly just getElementByIds xD */
function myProfileForm() {
	let root = document.getElementById("root");
	
	let container = document.createElement("div");
	container.id = "myProfilePopUp";
	container.classList.add("modal");
	
	let content = document.createElement("div");
	content.id = "myProfileContent";
	content.classList.add("modal-content");
	
	let statBox = document.createElement("div");
	statBox.id = "myStatBox";
	
	let close = document.createElement("span");
	close.id = "myProfileClose";
	close.classList.add("close");
	close.innerText = `x`;
	
	let myProfileTitle = document.createElement("h2");
	myProfileTitle.id = "myProfileTitle";
	myProfileTitle.innerText = "Profile Page";
	myProfileTitle.style.textAlign = "center";	
	let username = document.createElement('p');
	username.innerText = `Username: `
	username.classList.add("statBoxStats");
	username.id = "myprofile-username";
	let noPosts = document.createElement('p');
	noPosts.innerText = `Number of Posts: `;
	noPosts.classList.add("statBoxStats");
	noPosts.id = "myprofile-noposts";
	let noVotes = document.createElement(`p`);
	noVotes.innerText = "Number of Upvotes: ";
	noVotes.classList.add("statBoxStats");
	noVotes.id = "myprofile-novotes";
	let voteStats = document.createAttribute("vote-results");
	voteStats.value = 0;
	noVotes.setAttributeNode(voteStats);
	
	let updateProfile = document.createElement("div");
	updateProfile.id = "update-profile";
	updateProfile.style.display = "inline-block";
	
	let updateEmail = document.createElement("input");
	updateEmail.id = "update-email";
	updateEmail.placeholder = "Change Email";
	
	let updateName = document.createElement("input");
	updateName.id = "update-name";
	updateName.placeholder = "Change Name";
	
	let updatePass = document.createElement("input");
	updatePass.id = "update-pass";
	updatePass.placeholder = "Change Password";

	let updateBtn = document.createElement("button");
	updateBtn.classList.add("button-secondary");
	updateBtn.id = "myupdate-button";
	updateBtn.innerText = "Update";

	
	updateProfile.appendChild(updateEmail);
	updateProfile.appendChild(updateName);
	updateProfile.appendChild(updatePass);
	updateProfile.appendChild(updateBtn);
	
	statBox.appendChild(username);
	statBox.appendChild(noPosts);
	statBox.appendChild(noVotes);
	content.appendChild(close);
	content.appendChild(myProfileTitle);
	content.appendChild(statBox);
	content.appendChild(updateProfile);
	container.appendChild(content);
	
	root.prepend(container);
	
	//This is the close button which will close the modal and clear everything in it
	close.addEventListener('click', () => {
		container.style.display = "none";
		username.innerText = `Username: `
		noPosts.innerText = `Number of Posts: `;
		noVotes.innerText = "Number of Upvotes: ";
	});
}

//This basically fills out information in the profile page as the user clicks on profile
function appendMyProfile () {

	const url = sessionStorage.apiUrl;
	const token = sessionStorage.token;
	var results = fetch (`${url}/user?username=${sessionStorage.username}`, {			
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Token ${token}`
		}
	})
		.then(res2 => res2.json())
		.then(response2 => {
			document.getElementById("myprofile-username").innerText += ` ${sessionStorage.username}`;
			document.getElementById("myprofile-noposts").innerText += ` ${response2.posts.length}`;
			return response2.posts;
		})
		.catch(error2 => console.error('Error:', error2));
	
	/*Going through all the posts and tallying the upvotes and placing them in arrays
		so I can put the array into Promise.all and get all the results*/
	results.then(posts => {
		let total = 0;
		let arrays = [];
		for (let post of posts) {
			
			arrays[total] = fetch(`${sessionStorage.apiUrl}/post?id=${post}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Token ${sessionStorage.token}`
					},
				})
				.then(res => res.json())
				.then(response => {
					return response.meta.upvotes.length
				})
				.then(number => {
					let element = document.getElementById("myprofile-novotes");
					let realNumber = parseInt(number) + parseInt(element.getAttribute('vote-results'));

					return realNumber;
				})
				.catch(error => console.error('Error:', error));
				
			total++;		
		};
		return Promise.all(arrays);
	})
		.then(promise => {
			let total = 0;
			for (let value of promise) {
				total = total + value;
			}
			document.getElementById("myprofile-novotes").innerText += ` ${total}`;
			total = 0;
		})


}

export {myProfileForm, appendMyProfile};
