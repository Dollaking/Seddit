/*  Name: Aven Au
	zid: z5208734
	Date: 12/08/19 (last edited) 
	Description: This code that is relevant for anything to 
	do with comments and their modals.	
*/ 

/*This function builds the comment modal which allows users
comment and view comments for a post */
function commentForm() {
	let root = document.getElementById("root");
	
	let container = document.createElement("div");
	container.id = "commentPopUp";
	container.classList.add("modal");
	
	let content = document.createElement("div");
	content.id = "commentContent";
	content.classList.add("modal-content");
	
	let users = document.createElement("div");
	users.id = "commenters";
	
	let close = document.createElement("span");
	close.id = "commentClose";
	close.classList.add("close");
	close.innerText = `x`;
	
	//Close button which closes the modal and clears it
	close.addEventListener('click', () => {
		container.style.display = "none";
		while (users.firstChild) {
			users.removeChild(users.firstChild);
		}
		
	});
	
	let commentTitle = document.createElement("h2");
	commentTitle.id = "commentTitle";
	commentTitle.innerText = "Comment";
	commentTitle.style.textAlign = "center";
	
	let myComment = document.createElement("input");
	myComment.id = "mycomment-input";
	myComment.placeholder = "Comment";
	myComment.style.height = "100px";
	myComment.style.width = "97%";
	
	let commentBtn = document.createElement("button");
	commentBtn.id = "comment-button";
	commentBtn.innerText = "Submit";
	
	
	content.appendChild(close);
	content.appendChild(commentTitle);
	content.appendChild(myComment);
	content.appendChild(commentBtn);
	content.appendChild(users);
	container.appendChild(content);
	
	root.prepend(container);
	
	commentBtn.addEventListener('click', (event) => {
		let postID = sessionStorage.commentId;
		postComment(postID, myComment.value);
	})
	

}

/*This functions fetches all the comments on the post and
appends it into the comment box*/
function appendCommentForm(id, apiUrl) {
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
					let commentArray = response.comments.reverse()
					for (var commenters of commentArray) {
						let context = document.getElementById("commenters");
						let commentbox = document.createElement('div');
						commentbox.classList.add ('commentbox');
						let commenter = document.createElement('h3');
						commenter.innerText = commenters.author;
						
						let br = document.createElement('br');
						
						let comment = document.createElement('p');
						comment.innerText = commenters.comment;
						
						commentbox.appendChild(commenter);
						comment.appendChild(br);
						commentbox.appendChild(comment);
						context.appendChild(commentbox);					
					}
				})
				.catch(error => console.error('Error:', error));	
}

/*This function takes the text that the user have written in the comment box
and communicates with the backend and registers it */

function postComment(id, comment) {
	var data = {
	  "comment": `${comment}`
	}
	fetch(`${sessionStorage.apiUrl}/post/comment?id=${id}`, {
		method: 'PUT',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Token ${sessionStorage.token}`
		}
	})
		.then (res => res.json())
		.then (response => {
			let name = JSON.parse(sessionStorage.user).username;
			if (response.message == "success") {
				let context = document.getElementById("commenters");
				let commentbox = document.createElement('div');
				commentbox.classList.add ('commentbox');
				let commenter = document.createElement('h3');
				commenter.innerText = name;
				
				let br = document.createElement('br');
				
				let commentP = document.createElement('p');
				commentP.innerText = comment;
				
				commentbox.appendChild(commenter);
				commentP.appendChild(br);
				commentbox.appendChild(commentP);
				context.prepend(commentbox);
				
			}
		})
}

export {appendCommentForm, commentForm};
