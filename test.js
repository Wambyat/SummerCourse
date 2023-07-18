const thingy = require('dotenv');
thingy.config();

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{"role": "system", "content": "You are a helpful assistant."}, {role: "user", content: "Hello world"}],
});

console.log(completion.data.choices[0].message);

console.log("Howdy folks");

// a for loop going thru a list of names
var names = ["ooga","booga"];
for (var i = 0; i < names.length; i++) {
    console.log(names[i]);
}

let thingy = document.getElementById("thingy");
// change the text of the thingy
thingy.innerHTML = "This be chaging";

let buttonThingy = document.getElementById("buttonThingy");
// add an event listener to the button
buttonThingy.addEventListener("click", GPTTest);

//define a function test that changes thingy to something else
function test() {
    thingy.innerHTML = "This is a test";
}

function GPTTest() {
    thingy.innerHTML = completion.data.choices[0].message;
}