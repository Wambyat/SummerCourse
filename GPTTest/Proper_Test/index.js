// import dotenv from 'dotenv'
// dotenv.config();
// const dotenv = require('dotenv');
// const env = dotenv.config()
// const apiKey = process.env.OPEN_AIKEY;
const url = "https://api.openai.com/v1/completions";

const outputText = document.getElementById("output-text");
const apikey = document.getElementById("API_KEY");

function GPTShit(prompt,apiKey) {
    const outputText = document.getElementById("output-text");
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                'model': 'text-davinci-003',
                "prompt": prompt
                })
            }).then(response => response.json()).then(data => outputText.innerHTML=data.choices[0].text);
}

const setupTextarea = document.getElementById("setup-textarea");

document.getElementById("send-btn").addEventListener("click", () => {
    if (setupTextarea) {
        console.log("Here");
        const pro = setupTextarea.value;
        const apisad = apikey.value;
        console.log(pro,apisad);
        GPTShit(pro,apisad);
    }
});