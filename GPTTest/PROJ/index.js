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

  var prompt =  "Generate a food suggestion based on the below feelings such as I live in "+ locText.value + " and the temperature here is 20 degrees celsius , I feel " + feelings + " and want to eat " + foodType +" food.  "+ otherThings + ".say only the name of the food dont say anything else"

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
        outline : Generate a food suggestion based on the below feelings such as I live in bengaluru  and the temperature here is 20 degrees celsius , I feel Depressed,Cold/Cough and want to eat Energizing food.  i have thyroid.say only the name of the food dont say anything else.
        message : Quinoa Salad
        ###
        outline : Generate a food suggestion based on the below feelings such as I live in delhi and the temperature here is 10 degrees celsius , I feel Nauseous,Sad and want to eat Comforting food.  i want high protein food.say only the name of the food dont say anything else
        message : Chicken Soup
        ###
        outline : Generate a food suggestion based on the below feelings such as I live in gujarat and the temperature here is 34 degrees celsius , I feel Hungry,Happy and want to eat Filling food.  i want junk food.say only the name of the food dont say anything else
        message : Pav Bhaji
        ###
        outline : Generate a food suggestion based on the below feelings such as I live in kashmir and the temperature here is 07 degrees celsius , I feel Cold/Cough and want to eat Comforting food.  i want something hot and spicy.say only the name of the food dont say anything else
        message : Kashmiri Kahwa
        ###
        outline : Generate a food suggestion based on the below feelings such as I live in mysore and the temperature here is 29 degrees celsius , I feel Sad and want to eat Indulgent food.  ntg.say only the name of the food dont say anything else
        message : Chocolate Brownie
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
        ###
        outline : Generate a appetizing description of Maggi 
        message : A mouthwatering image of Maggi captures slender noodles bathed in a rich golden broth, adorned with vibrant vegetable accents, promising a comforting and delicious experience. The sight entices with its inviting warmth and enticing flavors.
        ###
        outline : Generate a appetizing description of biriyani
        message : A tantalizing picture of biryani showcases fragrant, spiced rice adorned with succulent pieces of tender meat or flavorful vegetables, exuding an irresistible aroma that promises a delightful culinary adventure. The vibrant colors and enticing presentation beckon one to savor the harmonious blend of flavors in this beloved dish.
        ###
        outline : Generate a appetizing description of samosa
        message : A captivating image of samosa presents golden-brown, crispy pastry enveloping a savory filling of spiced potatoes and peas, enticing the taste buds with its crunchy exterior and flavorful interior. The aromatic spices and delightful shape make it an irresistible snack that promises a delightful burst of flavors in every bite.
        ###
        outline : Generate a appetizing description of jalebi
        message : In a tempting portrayal, jalebi graces the frame with its intricate swirls of golden sweetness, enticing the eye with its vibrant hue and glistening syrup. The delectable, crispy yet syrupy texture promises a mouthwatering indulgence, leaving a trail of delightful sugary bliss on the taste buds.                   
        ###
        outline : Generate a appetizing description of kulfi
        message : A captivating picture of kulfi showcases a luscious, creamy dessert, adorned with chopped nuts and saffron strands, enticing one with its rich and indulgent appearance. The frozen treat promises a delightful escape into a world of exquisite flavors, offering a refreshing and satisfying respite from the heat.
        ### 
        'prompt': `Generate a appetizing description of ${food}`,
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
