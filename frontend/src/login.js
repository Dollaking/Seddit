/*  Name: Aven Au
	zid: z5208734
	Date: 12/08/19 (last edited) 
	Description: This code that is relevant for anything to 
	do with login and their modals. (Very similar structure to other js files.)	
*/ 
import {updateFeed} from "./feed.js";

/*This function create a modal which is hidden until they click on the 
login button*/
function loginForm () {
	let loginDiv = document.createElement("div");
	loginDiv.setAttribute("id", "loginDiv");
	loginDiv.style.display = "none";
	loginDiv.style.position= "fixed";
	loginDiv.style.left = "0";
	loginDiv.style.top = "0";
	loginDiv.style.width = "auto"
	loginDiv.style.width = "100%";
	loginDiv.style.height = "100%";
	loginDiv.style.zIndex = "1";
	loginDiv.style.paddingTop= "60px";
	loginDiv.style.overflow = "auto";
	loginDiv.style.backgroundColor = "rgba(0,0,0,0.4)";
	let form = document.createElement('div');
	form.setAttribute('id', 'loginForm');
	form.style.backgroundColor = "rgb(255,255,255)";
	form.style.margin = "5% auto 15% auto";
	form.style.border = "1px solid #888";
	form.style.width  = "50%";
	let contentBox = document.createElement('div');
	contentBox.setAttribute('id', 'contentBox');
	contentBox.style.padding = "16px";
	let loginTitle = document.createElement('h2');
	loginTitle.innerText = "Login";
	let uLogin = document.createElement('input');
	let uPassword = document.createElement('input');
	uLogin.setAttribute('id', 'uLogin');
	uLogin.setAttribute('placeholder', 'Enter Username');
	uPassword.setAttribute('id', 'uPassword');
	uPassword.setAttribute('placeholder', 'Enter Password');
	uLogin.style.padding = "16px";
	uPassword.style.padding = "16px";
	let cancelButton = document.createElement('button');
	cancelButton.setAttribute("id", "loginCancel");
	cancelButton.innerText = "Cancel";
	cancelButton.style.padding = "10px 18px";
	cancelButton.style.backgroundColor = "#f44336";
	cancelButton.style.margin = "8px";
	cancelButton.style.border = "none";
	cancelButton.style.color = "white";

	let loginButton = document.createElement('button');
	loginButton.setAttribute("id", "loginLogin");
	loginButton.innerText = "Login";
	loginButton.style.padding = "10px 18px";
	loginButton.style.backgroundColor = "#008000";
	loginButton.style.margin = "8px";
	loginButton.style.border = "none";
	loginButton.style.color = "white";

	contentBox.appendChild(loginTitle);
	contentBox.appendChild(uLogin);
	contentBox.appendChild(uPassword);
	
	form.appendChild(contentBox);
	form.appendChild(cancelButton);
	form.appendChild(loginButton);
	loginDiv.appendChild(form);
	return loginDiv;
}
/*This function used back in main.js when someone clicks on the login button
It will load everything needed in the login modal. This function also deals with
login authorisation by using fetch*/
	
function loginPopUp (mainDiv, apiUrl) {
	
	//Loadup Form and Prepend it into the main
	let popUpForm = loginForm();
	popUpForm.style.display = "block";
	mainDiv.prepend(popUpForm);
	
	//Cancel Button
	var loginCancel = document.getElementById("loginCancel");
	loginCancel.addEventListener('click', (event) => {
		document.getElementById('loginDiv').style.display = "none";
	});
	
	//Login Button
	var loginLogin = document.getElementById("loginLogin");
	loginLogin.addEventListener('click', (event) => {
		let username = document.getElementById("uLogin").value;
		let password = document.getElementById("uPassword").value;
		
		if (username === "" && password === "") {				
			document.getElementById("uLogin").style.borderColor = "rgb(255,0,0)";
			document.getElementById("uPassword").style.borderColor = "rgb(255,0,0)";
			alert("Please Enter your Username and Password!");
		} else if (username === "") {
			document.getElementById("uLogin").style.borderColor = "rgb(255,0,0)";
			alert("Please Enter your Username!");
		} else if (password === "") {
			document.getElementById("uPassword").style.borderColor = "rgb(255,0,0)";
			alert("Please Enter your Password!");		
		} 
		
		var data = { 
			"username": `${username}`,
			"password": `${password}`
		}
		
		fetch(`${apiUrl}/auth/login`, {
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
					alert("You got the incorrect username or password!");
				} else {
					popUpForm.style.display = "none";
					document.getElementsByClassName("button")[0].style.display = "none";
					document.getElementsByClassName("button")[1].style.display = "none";
					sessionStorage.setItem('token', token);
					document.getElementById('logout').style.display = "inline-block";
					document.getElementById('myprofile').style.display = "inline-block";
					alert("You have successfully logged in!");
					
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
	
	export { loginForm, loginPopUp };
