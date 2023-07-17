console.log("Howdy folks");

// a for loop going thru a list of names
var names = ["ooga","booga"];
for (var i = 0; i < names.length; i++) {
    console.log(names[i]);
}

let thingy = document.getElementById("thingy");
// change the text of the thingy
thingy.innerHTML = "THis be chaging";

let buttonThingy = document.getElementById("buttonThingy");
// add an event listener to the button
buttonThingy.addEventListener("click", test2);

//define a function test that changes thingy to something else
function test() {
    thingy.innerHTML = "This is a test";
}

function test2() {
    thingy.innerHTML = "This is a test2";
}