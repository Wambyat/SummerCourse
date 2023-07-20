const setupTextarea = document.getElementById('setup-textarea') 
const setuploading = document.getElementById('output-container') 
const setupInputContainer = document.getElementById('setup-input-container')
const movieBossText = document.getElementById('movie-boss-text')
const OPENAI_API_KEY = process.env.OPENAI_API_KEY ; 
const outputText = document.getElementById('output-text')
const outputTitle = document.getElementById('output-title')
const outputStars = document.getElementById('output-stars')
const url = "https://api.openai.com/v1/completions"


function makeOutput(title, syn, stars) {
  outputText.innerText = "Title: "+title+"\n"+"Synopsis: "+syn+"\n"+"Stars: "+stars;
}

async function fetchBotReply(prompt) {
  var prompttext = prompt;
  console.log("start");
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + OPENAI_API_KEY
      },
      body: JSON.stringify({
        'model': 'text-davinci-003',
        'prompt': prompttext,
        'max_tokens': 1000,
      })
    });
    const data = await response.json();
    return data.choices[0].text;
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
}

document.getElementById("send-btn").addEventListener("click", () => {
  $("#output-container").css('display','block'); 
  var prompt = "Generate a movie synopsis based on: \""+setupTextarea.value+"\"";
  fetchBotReply(prompt)
    .then((botReply) => {
      var syn = botReply;
      // console.log("Received bot reply:", botReply);
      var prompt = "Generate a movie title based on: \""+syn+"\"";
      fetchBotReply(prompt)
        .then((botReply) => {
          var title = botReply;
          // console.log("Received bot reply:", botReply);
          var prompt = "Tell me a few actors that can act in this: \""+syn+"\"";
          fetchBotReply(prompt)
            .then((botReply) => {
              var actors = botReply;
              // console.log("Received bot reply:", botReply);
              movieBossText.innerText = "Alright below is what I have made!";
              outputTitle.innerHTML = "Title: "+title;
              outputStars.innerHTML = actors;
              outputText.innerHTML = "Synopsis: "+syn;
            })
            .catch((error) => {
              console.error("Error occurred:", error);
            });
        })
        .catch((error) => {
          console.error("Error occurred:", error);
        });
    })
    .catch((error) => {
      console.error("Error occurred:", error);
    });
  
  
});
