/*  Name: Aven Au
	zid: z5208734
	Date: 12/08/19 (last edited) 
	Description: This code that is relevant for anything to 
	do with signup and their modals. (Very similar structure to other js files.)	
*/ 

import {updateFeed} from "./feed.js";

/*This function is all the "actions" in register, like cancel and signup up button events
It also deals with username and password verification and also communicates backend to register signup*/
function registerPopUp(mainDiv, apiUrl) {
	
	//Loadup Form and Prepend it into the main
	let popUpForm = registerForm();
	popUpForm.style.display = "block";
	mainDiv.prepend(popUpForm);
	
	//Cancel Button
	var registerCancel = document.getElementById("registerCancel");
	registerCancel.addEventListener('click', (event) => {
		document.getElementById('registerDiv').style.display = "none";
	});
	
	//register Button
	var registerLogin = document.getElementById("registerLogin");
	registerLogin.addEventListener('click', (event) => {
		let username = document.getElementById("rLogin").value;
		let password = document.getElementById("rPassword").value;
		let email = document.getElementById("rEmail").value;
		let name = document.getElementById("rName").value;
		
		//Basic checks for username and password (Make sure they arent empty)
		if (username === "" && password === "") {				
			document.getElementById("rLogin").style.borderColor = "rgb(255,0,0)";
			document.getElementById("rPassword").style.borderColor = "rgb(255,0,0)";
			alert("Please Enter your Username and Password!");
		} else if (username === "") {
			document.getElementById("rLogin").style.borderColor = "rgb(255,0,0)";
			alert("Please Enter your Username!");
		} else if (password === "") {
			document.getElementById("rPassword").style.borderColor = "rgb(255,0,0)";
			alert("Please Enter your Password!");		
		} 
		
		var data = { 
			"username": `${username}`,
			"password": `${password}`,
			"email": `${email}`,
			"name": `${name}`
		}
		
		fetch(`${apiUrl}/auth/signup`, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(res => res.json())
			.then(response => { 
				const token = response.token;
				if (token === undefined) {
					alert("Username Taken!");
				} else {
					//Successful
					//Closes the modal and updates the feed
					popUpForm.style.display = "none";
					document.getElementsByClassName("button")[0].style.display = "none";
					document.getElementsByClassName("button")[1].style.display = "none";
					sessionStorage.setItem('token', token);
					document.getElementById('logout').style.display = "inline-block";
					document.getElementById('myprofile').style.display = "inline-block";
					alert(`You have successfully Signed Up! You are also logged in as ${username}`);
					while (document.getElementById('allPost').firstChild) {
						document.getElementById('allPost').removeChild(document.getElementById('allPost').firstChild);
					}
					updateFeed(apiUrl);
					sessionStorage.setItem('username', username);
					sessionStorage.setItem('password', password);
					fetch (`${apiUrl}/user?username=${username}`, {			
		 				method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Token ${token}`
						}
					})
						.then(res2 => res2.json())
						.then(response2 => {
							sessionStorage.setItem('user', JSON.stringify(response2));
						})
						.catch(error2 => console.error('Error:', error2));
					
				}
			})
			.catch(error => console.error('Error:', error));			
	});	
}

/* This is basically the html of the register modal but with createElement*/

function registerForm () {
	let registerDiv = document.createElement("div");
	registerDiv.setAttribute("id", "registerDiv");
	registerDiv.style.display = "none";
	registerDiv.style.position= "fixed";
	registerDiv.style.left = "0";
	registerDiv.style.top = "0";
	registerDiv.style.width = "auto"
	registerDiv.style.width = "100%";
	registerDiv.style.height = "100%";
	registerDiv.style.zIndex = "1";
	registerDiv.style.paddingTop= "60px";
	registerDiv.style.overflow = "auto";
	registerDiv.style.backgroundColor = "rgba(0,0,0,0.4)";
	let form = document.createElement('div');
	form.setAttribute('id', 'registerForm');
	form.style.backgroundColor = "rgb(255,255,255)";
	form.style.margin = "5% auto 15% auto";
	form.style.border = "1px solid #888";
	form.style.width  = "50%";
	let contentBox = document.createElement('div');
	contentBox.setAttribute('id', 'contentBox');
	contentBox.style.padding = "16px";
	let registerTitle = document.createElement('h2');
	registerTitle.innerText = "Sign Up";
	let rLogin = document.createElement('input');
	let rPassword = document.createElement('input');
	let rName = document.createElement('input');
	let rEmail = document.createElement('input');
	let breakBlock = document.createElement('br');
	rLogin.setAttribute('id', 'rLogin');
	rLogin.setAttribute('placeholder', 'Enter Username');
	rPassword.setAttribute('id', 'rPassword');
	rPassword.setAttribute('placeholder', 'Enter Password');
	rLogin.style.padding = "16px";
	rPassword.style.padding = "16px";
	rEmail.setAttribute('id', 'rEmail');
	rEmail.setAttribute('placeholder', 'Enter Email');
	rEmail.style.padding = "16px";
	rName.setAttribute('id', 'rName');
	rName.setAttribute('placeholder', 'Enter your Name');
	rName.style.padding = "16px";
	let cancelButton = document.createElement('button');
	cancelButton.setAttribute("id", "registerCancel");
	cancelButton.innerText = "Cancel";
	cancelButton.style.padding = "10px 18px";
	cancelButton.style.backgroundColor = "#f44336";
	cancelButton.style.margin = "8px";
	cancelButton.style.border = "none";
	cancelButton.style.color = "white";

	let registerButton = document.createElement('button');
	registerButton.setAttribute("id", "registerLogin");
	registerButton.innerText = "Sign Up";
	registerButton.style.padding = "10px 18px";
	registerButton.style.backgroundColor = "#008000";
	registerButton.style.margin = "8px";
	registerButton.style.border = "none";
	registerButton.style.color = "white";

	contentBox.appendChild(registerTitle);
	contentBox.appendChild(rLogin);
	contentBox.appendChild(rPassword);
	contentBox.appendChild(breakBlock);
	contentBox.appendChild(rEmail);
	contentBox.appendChild(rName);
	
	form.appendChild(contentBox);
	form.appendChild(cancelButton);
	form.appendChild(registerButton);
	registerDiv.appendChild(form);
	return registerDiv;
}

export {registerPopUp, registerForm};
