var repos = [];
var commits = [];
var head;
var userName;

window.onload = function () {
  var buttonValidate = document.getElementById("buttonValidate");
	var buttonRandom = document.getElementById("buttonRandom");

	head = document.getElementsByTagName("head")[0];
	userName = document.getElementById("inputUser");
	buttonValidate.addEventListener("click", showACommitRandonly);
	previewHandler();
}


function showACommitRandonly() {
  var url = "https://api.github.com/users/{}/repos?callback=getRepositories".format(userName.value);
  
  console.log(url);

	var scriptElement = document.createElement("script");
	scriptElement.setAttribute("src", url);
	scriptElement.setAttribute("id","jsonpRepo");
	head.appendChild(scriptElement);
}

function getRepositories(response) {

  var data = response.data; 
  try {
    if (data.message === 'Not Found') alert('not found')
  } catch (err) {
    
  }
	for (i = 0; i < data.length; i++) {
		repos.push(data[i].name);

    var urli = "https://api.github.com/repos/{}/{}/commits?callback=getCommits".format(userName.value, data[i].name);
		var scriptElementi = document.createElement("script");
		scriptElementi.setAttribute("src", urli);
		scriptElementi.setAttribute("id","jsonpCommits" + data[i].name);
    head.appendChild(scriptElementi);

    randomCommit();
  }
}

function getCommits(response) {

  var data = response.data;

	for (i = 0; i < data.length -1; i++) {
		commits.push(data[i].commit.message);
  }

}

function randomCommit() {
	var commitDiv = document.getElementById("commit");
	while (commitDiv.firstChild) {
		commitDiv.removeChild(commitDiv.firstChild);
	}
	var div = document.createElement("div");
	div.setAttribute("class", "commitMessage");
	var commitIndex = Math.floor((Math.random() * commits.length)+1);
	div.innerHTML = '$  git commit -m "' + commits[commitIndex] + '"';
	commitDiv.appendChild(div);

	var context = document.getElementById("canvasCommit").getContext("2d");
}

function previewHandler() {
	var canvas = document.getElementById("canvasCommit");
	var context = canvas.getContext("2d");
	context.canvas.width  = window.innerWidth;
	fillBackgroundColor(canvas, context);

	for (var squares = 0; squares < 800; squares++) {
		drawSquares(canvas, context);
	}
}

function drawSquares(canvas, context) {

	var w = Math.floor(Math.random() * 15);

	var x = Math.floor(Math.random() * canvas.width);

	var y = Math.floor(Math.random() * canvas.height);

	context.fillStyle = randomColorHexa();
	context.fillRect(x, y, w, w);
}

function fillBackgroundColor(canvas, context) {
	context.fillStyle = "white";
	context.fillRect(0, 0, 600, 200);
}

function randomColorHexa() {
	var colors = ["#D6E685","#8CC665","#44A340","#1E6823"];
	return colors[Math.floor(Math.random() * 4)];
}

String.prototype.format = function () {
  var i = 0, args = arguments;
  return this.replace(/{}/g, function () {
    return typeof args[i] != 'undefined' ? args[i++] : '';
  });
};