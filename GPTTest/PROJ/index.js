const setupTextarea = document.getElementById('setup-textarea')
const setupInputContainer = document.getElementById('setup-input-container')
const movieBossText = document.getElementById('movie-boss-text')
const setuploading = document.getElementById('output-container')
const locText = document.getElementById('loc-text')
const OPEN_API_KEY = process.env.OPENAI_API_KEY;
const url = 'https://api.openai.com/v1/completions'

$(window).on('load',function(){
    $("#output-container").css('display','block');
})

document.getElementById("send-btn").addEventListener("click", () => {
  movieBossText.innerText = `Ok, just wait a second while my digital brain digests that...`;
  var otherThings = setupTextarea.value;
  // loop thru checkboxs id=feelings-type-1, feelings-type-2 ...6 and save their value if checked into an array
  var feelings = [];
  for (var i = 1; i <= 6; i++) {
    if (document.getElementById("feelings-type-" + i).checked) {
      feelings.push(document.getElementById("feelings-type-" + i).value);
    }
  }
  var foodType = [];
  for (var i = 1; i <= 6; i++) {
    if (document.getElementById("food-type-" + i).checked) {
      foodType.push(document.getElementById("food-type-" + i).value);
    }
  }
  console.log(foodType);
  console.log(locText.value);
  console.log(otherThings);
  console.log(feelings);
  
  // fetchBotReply(otherThings)
  // fetchSynopsis(otherThings)
})

async function fetchBotReply(prompt){
    //var prompttext = $("#setup-textarea").val();
    var prompttext = prompt;
    console.log(prompttext)
    fetch(url,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPEN_API_KEY}`
      },
      body: JSON.stringify({
        'model': 'text-davinci-003',
        'prompt': `Generate feedback to enthusiastically say an outline looks interesting and that you need some minutes to think about it.
        ###
        outline: Two dogs fall in love and move to hawaii and learn to surf
        message: i will need to think about that but the idea is amazing. i love the bit about hawaii.
        ###
        outline: a plane crashes in the jungle and passengers have to walk 100 kms to safety
        message: i'll spend a few moments considering that but i love your ideea. a disaster movie in the jungle.
        ###
        outline:a group of corrupt lawyers trying to dsenf an innocent women to jail.
        message: now that is awesome! corrupt lawyers huh? give me a few moments to think.
        ###
        outline: ${prompttext}
        message: `,
        'max_tokens' : 100,
      })
    }).then(response => response.json()).then(data =>{
        setTimeout(function(){
            //$("#output-container").css('display','block');
            document.getElementById('movie-boss-text').innerText=data.choices[0].text

        },1000)}
    
    )}

async function fetchSynopsis(prompt){
    //var prompttext = $("#setup-textarea").val();
    var prompttext = prompt;

    fetch(url,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPEN_API_KEY}`
      },
      body: JSON.stringify({
        'model': 'text-davinci-003',
        'prompt': "Generate a professional,emotional and market combined good movie story regarding " + prompttext + " what do you think? ",
        'max_tokens' : 600,
      })
    }).then(response => response.json()).then(data =>{
        setTimeout(function(){
            //$("#output-container").css('display','block');
            document.getElementById('output-container').innerText=data.choices[0].text
        },1000)}
    
    )}