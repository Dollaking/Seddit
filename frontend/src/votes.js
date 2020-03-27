/*  Name: Aven Au
	zid: z5208734
	Date: 12/08/19 (last edited) 
	Description: This code page is for everything
	that deals with voting	
*/

/* This is the html build for the vote modal, to see
who has upvoted for the clicked post.
*/
function voteForm() {
	let root = document.getElementById("root");
	
	let container = document.createElement("div");
	container.id = "votePopUp";
	container.classList.add("modal");
	
	let content = document.createElement("div");
	content.id = "voteContent";
	content.classList.add("modal-content");
	
	let users = document.createElement("div");
	users.id = "voters";
	
	let close = document.createElement("span");
	close.id = "voteClose";
	close.classList.add("close");
	close.innerText = `x`;
	
	close.addEventListener('click', () => {
		container.style.display = "none";
		while (users.firstChild) {
			users.removeChild(users.firstChild);
		}
		
	});
	
	let voteTitle = document.createElement("h2");
	voteTitle.id = "voteTitle";
	voteTitle.innerText = "Upvotes";
	voteTitle.style.textAlign = "center";
	
	content.appendChild(close);
	content.appendChild(voteTitle);
	content.appendChild(users);
	container.appendChild(content);
	
	root.prepend(container);
	

}

/* Appends all the usernames that have upvoted the post
*/

function appendVoteForm(id, apiUrl) {
	let popup = document.getElementById("voteContent");
 	fetch (`${apiUrl}/post?id=${id}`, {			
 				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Token ${sessionStorage.token}`
				},

			})
				.then(res => res.json())
				.then(response => { 
					let context = document.getElementById("voters");
					for (var voters of response.meta.upvotes) {
					 	fetch (`${apiUrl}/user?id=${voters}`, {			
			 				method: 'GET',
							headers: {
								'Content-Type': 'application/json',
								'Authorization': `Token ${sessionStorage.token}`
							},

						})
							.then(res1 => res1.json())
							.then(response1 => {
								let voter = document.createTextNode(response1.username);
								let br = document.createElement("br");
								context.appendChild(voter);
								context.appendChild(br);
							})
							.catch(error2 => console.error('Error:', error2));
							
					}
				})
				.catch(error => console.error('Error:', error));
		
	
}

export {voteForm, appendVoteForm};
