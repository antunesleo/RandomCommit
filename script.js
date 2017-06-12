//Global variables
var repos = []; //hold a list of repos of the user
var commits = []; // hold a list of commits of the user
var head; //head element of the page, used by jsonp requests
var userName; //github username, used by a lot of functions

window.onload = function () {
	var buttonValidate = document.getElementById("buttonValidate");
	var buttonRandom = document.getElementById("buttonRandom");

	head = document.getElementsByTagName("head")[0];
	userName = document.getElementById("inputUser");
	buttonValidate.addEventListener("click", triggerRest);
	buttonRandom.addEventListener("click", randomCommit);
}

/*
 * This function receives the response from the github rest API (JSONP)
 * for each repository, the function will create a new scrip JSONP element
 * for retrieve all commit per repository
 */
function getRepos(response) {

	var data = response.data; //Getting data of the response provided by the github api containg all repositories
	for (i = 0; i < data.length; i++) {
		repos.push(data[i].name); //add the repo to the array

		//constructing the url, passing user name and repository name 
		var urli = "https://api.github.com/repos/" + userName.value + "/" + data[i].name + "/commits?callback=getCommits"; 
		var scriptElementi = document.createElement("script"); //creates a new dom element Script
		scriptElementi.setAttribute("src", urli); //passing the url for the element
		scriptElementi.setAttribute("id","jsonpCommits" + data[i].name); //setting an id for the script element jsonpCommit + repositoryName
		head.appendChild(scriptElementi); //append the script tag for the head element
	}
}


/*
 * This is the trigger function for all rest request stuff
 * 
 */
function triggerRest() {
	var url = "https://api.github.com/users/" + userName.value + "/repos?callback=getRepos"; //url to get all repos passing user name
	var scriptElement = document.createElement("script"); //creating a jsonp script element
	scriptElement.setAttribute("src", url); //passing de url for the script element
	scriptElement.setAttribute("id","jsonpRepo"); //set and id for the element
	head.appendChild(scriptElement); //adding the script element to the head element
	document.getElementById("buttonRandom").style.display = "inline";
}

/*
 * this function gets the response from the Github API rest
 * the response contains all the commit on the repository
 * each commit message is saved on the array commits
 */
function getCommits(response) {

	var data = response.data;

	for (i = 0; i < data.length; i++) {
		commits.push(data[i].commit.message);
	}
}

/*
 * This function get a random commit message stored on the array and 
 * add in a div for the user
 */
function randomCommit() {
	var commitDiv = document.getElementById("commit");
	while (commitDiv.firstChild) { //if exists a commit message being showed, will be removed
		commitDiv.removeChild(commitDiv.firstChild);
	}
	var div = document.createElement("div");
	div.setAttribute("class", "commitMessage");
	var commitIndex = Math.floor((Math.random() * commits.length)+1);
	div.innerHTML = 'git commit -m "' + commits[commitIndex] + '"';
	commitDiv.appendChild(div);
}

