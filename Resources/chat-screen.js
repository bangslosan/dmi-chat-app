//***---------------------       Chat Window      ---------------------***


var textField = Titanium.UI.createTextArea({
	bottom: 215,
	height: 'auto',
	minHeight: 15,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
	borderColor: 'black',
	borderRadius: 5,
	hintText: "Enter text",
	width: '100%',
	font: {fontFamily: 'Arial', fontSize: 22}
});


var postNums = 0;
var tableView = Titanium.UI.createTableView({
	top: 0,
	height: "42%"
});

var webView = Titanium.UI.createWebView({
	top: 0,
	left: 0,
	url: "http://quiet-journey-1236.herokuapp.com/",
	visible: false
});
//
// create base UI tab and root window
//
var win2 = Titanium.UI.createWindow({  
    title:'',
    backgroundColor:'#fff',
    height: 'auto'
});

var keyLabel = Titanium.UI.createLabel({
	text: "Room key: ",
	color: "#FFF",
	backgroundGradient:{type:'linear',
		colors:['#DA6A00','#BE3E1D'],
		startPoint:{x:0,y:0},
		endPoint:{x:0,y:50},
		backFillStart:false},
	textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
	font: {fontFamily: 'Arial', fontSize: 26},
	top: 0,
	width: "100%",
	height: 50
});

win2.addEventListener("open", function(e) {
	textField.focus();
});

win2.hide();
win2.add(webView);

var exit = Titanium.UI.createButton({
	top: 0,
	left: 20,
	width: 'auto',
	title: "Log out",
	zIndex: 10
});

// win2.add(exit);
exit.addEventListener("click", function(e){
	win2.remove(webView);
	win1.open();
	enterUser.focus();
});

webView.addEventListener('load', function(e) {
	tempWin.open();
	webView.evalJS("setCreds('" + enterCode.value + "','" + enterUser.value + "');");
	keyLabel.setText("Room key: " + enterCode.value);
	// win2.title = "Room key: " + enterCode.value;
	var posts = "";
	var size = 0;
	var successfullLogin = webView.evalJS("success;");
	
	// alert(successfullLogin);
	while(successfullLogin == "")
	{
		successfullLogin = webView.evalJS("success;");
		if(successfullLogin == "false")
		{
			win1.open();
			// win2.close();
			tempWin.close();
			alert("Error: Incorrect Password");
			enterUser.value = "";
			enterCode.value = "";
			enterUser.focus();
		}
	}
	
	
	if(successfullLogin == "true")
	{
		setInterval(function() {
		posts = webView.evalJS("postsToMobile();");
		var newPosts = JSON.parse(posts);
		if(newPosts.length > size)
		{
			for(var i = size; i < newPosts.length; i++)
			{	
				var rowColor = "#FFF";
				if(i % 2)
				{
					rowColor = "#F3F3F4";
				}
				
				var padding = 5;
				var label = Titanium.UI.createLabel({
					height : Titanium.UI.SIZE, 
					text: newPosts[i],
					width: "100%",
					textAlign: "left",
					top: padding,
					bottom: padding,
					left: padding,
					right: padding,
					font: {fontFamily: 'Arial', fontSize: 22}
				});
				
				var rowHeight = Math.max(Titanium.UI.SIZE + 8, label.getHeight);
				
				var row = Titanium.UI.createTableViewRow({
					height : label.getHeight,
					backgroundColor: rowColor
					});
				// row.height += 8;	
				row.add(label);
				tableView.appendRow(row);
				postNums++;
			}
			size = (newPosts.length);
			var temp = size - 1;
			// tableView.scrollToIndex(postNums);
			tableView.scrollToIndex(temp);
			postNums = temp;
			// switch (Titanium.Platform.osname)
			// {
			    // case 'android': 
			        // tableView.scrollToIndex(tableView.data.length);
			        // break;
			    // case 'iphone':
			        // tableView.scrollToIndex(50,{position:Titanium.UI.iPhone.TableViewScrollPosition.BOTTOM});
			        // break;
			// }
	}
	tempWin.close();
	loadingIndicator.hide();
	win2.show();
	textField.focus();
	}, 2000);
	}
	
});

textField.addEventListener("return", function(e) {
	if(e.source.value != null)
	{
		webView.evalJS("document.getElementById('chat_input').value = '"+e.source.value+"';");
		webView.evalJS("$('chat_input').blur();");
		webView.evalJS("$('#send').focus().click();");
		e.source.value = "";
		textField.focus();
		textField.height = 'auto';
		tableView.scrollToIndex(postNums);
	}

});

textField.addEventListener("blur", function(e){
	tableView.height = "95%";
	textField.bottom = 0;
});

textField.addEventListener("focus", function(e){
	tableView.height = "42%";
	textField.bottom = 215;
	tableView.scrollToIndex(postNums);
});

var tableContainer = Titanium.UI.createScrollView({
	top: 50
	// contentHeight: 20
	// height: Ti.Platform.displayCaps.platformHeight + 10
});

tableView.addEventListener("click", function(e){
	textField.blur();
});

tableContainer.add(tableView);

usersList = Titanium.UI.createTableView(function(e){
	height: 300
	// visible: false
});
usersList.hide();

showUsersButton = Titanium.UI.createButton({
	top: 0,
	title: "USERS"
});

function showUsers() {
	usersList.show();
}

showUsersButton.addEventListener("click", function(e){
	showUsers();
});

// win2.addEventListener("click", function(e) {
	// textField.blur();
	// textField.bottom = 0;
// });

// textField.addEventListener("focus", function(e){
	// textField.height = 'auto';
	// textField.bottom = textField.keyboardToolbarHeight;
// });
// 
// textField.addEventListener("blur", function(e){
	// textField.bottom = 0;
	// textField.height = 'auto';
// });
win2.add(keyLabel);
win2.add(tableContainer);
win2.add(textField);
// win2.add(showUsersButton);
// win2.add(usersList);