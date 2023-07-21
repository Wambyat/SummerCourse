const setupTextarea = document.getElementById('setup-textarea')
const setupInputContainer = document.getElementById('setup-input-container')
const movieBossText = document.getElementById('movie-boss-text')
const setuploading = document.getElementById('output-container')
const locText = document.getElementById('loc-text')
const OPENAI_API_KEY0 = process.OPENAI_API_KEY0;
const OPENAI_API_KEY1 = process.OPENAI_API_KEY1;
const OPENAI_API_KEY2 = process.OPENAI_API_KEY2;
const url = 'https://api.openai.com/v1/completions'
const url1 = 'https://api.openai.com/v1/images/generations'
const url_weather = 'https://api.openweathermap.org/data/2.5/weather?q='
const apik = process.apik;

$(window).on('load',function(){
    $("#output-container").css('display','block');
})

document.getElementById("send-btn").addEventListener("click", () => {
  var url_wea = url_weather + locText.value + "&appid=" + apik;
  var wea = fetchWether(url_wea);
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

  var prompt =  "Generate a food suggestion based on the below feelings such as I live in "+ locText.value + " and the temperature here is "+wea+" , I feel " + feelings + " and want to eat " + foodType +" food.  "+ otherThings + ".say only the name of the food dont say anything else"

  console.log(prompt)
  
  fetchBotReply(prompt).then((botReply) => {
    var food = botReply;
    fetchImagePrompt(food).then((botReply) => {
      var img_desc = botReply;
      console.log("Image description is "+img_desc)
      console.log("Food is "+food)
      fetchImageUrl(img_desc).then(() => {
        console.log("Image generated");
      })
    })
  })
})

async function fetchWether(url_wea){
  fetch(url_wea).then(response => response.json()).then(data => {
    var temp = data['main']['temp'];
    var wndspd = data['wind']['speed'];
    return temp +" "+ wndspd;
  })
}

async function fetchBotReply(prompt){
    //var prompttext = $("#setup-textarea").val();
    var prompttext = prompt;
    fetch(url,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY0}`
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
        outline: 
        message: ${prompttext} `,
        'max_tokens' : 100,
      })
    }).then(response => response.json()).then(data =>{
        setTimeout(function(){
            return data.choices[0].text
        },1000)
      }
    )
}

async function fetchAPI(url, options) {
  const response = await fetch(url, options);
  if (response.status === 429) {
    // Handle rate limit by waiting and retrying the request after a delay
    const retryAfter = parseInt(response.headers.get('Retry-After')) || 1;
    await sleep(retryAfter * 1000);
    return fetchAPI(url, options); // Retry the request
  }
  return response;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchImagePrompt(food) {
  try {
    console.log("food is "+food)
    const response = await fetchAPI(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + OPENAI_API_KEY0
      },
      body: JSON.stringify({
        'model': 'text-davinci-003',
        'prompt': `Give a short description of an image that could be used to describe the following food: ${food}`,
        temperature: 0.8,
        max_tokens: 100
      })
    });
    const data = await response.json();
    const imagePrompt = data.choices[0].text.trim();
    return imagePrompt;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchImageUrl(imagePrompt){
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY0}`
    },
    body: JSON.stringify({
      prompt:`${imagePrompt}. There should be no text in this image.`,
      n: 1,
      size: '512x512',
      response_format: 'b64_json'
    })
  };
  fetch(url1, requestOptions)
  .then(response => response.json())
  .then(data => {
    if (data.data && data.data.length > 0) {
      document.getElementById('output-img-container').innerHTML = `<img src="data:image/png;base64,${data.data[0].b64_json}">`;
      document.getElementById("output-title").innerHTML = imagePrompt;
    }
  })
}