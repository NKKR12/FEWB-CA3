const randomDiv = document.getElementById("randomDiv")
const searchResultDiv = document.getElementById("searchResultDiv")
const searchButton = document.getElementById("searchButton")
const searchBox = document.getElementById("searchBox")
const ingredientDiv = document.getElementById("ingredientBox")
const ingredientUpdateDiv = document.getElementById("ingredients")
var searchUpdate = ""
var ingredientUpdate = ""

window.addEventListener("load",generateRandomMeal)
searchButton.addEventListener("click",checkSearchBox)
window.addEventListener("click", displayNone)
document.addEventListener('keypress', (event) => {
    if (event.key == "Enter") {
      checkSearchBox()
    }
  });


function displayNone() {
    ingredientDiv.style.display = "none"
}

function generateRandomMeal() {                                                  
    fetch ("https://www.themealdb.com/api/json/v1/1/random.php").then((response) => 
    response.json()).then((data) => {
        getNameAndLink(data)
    })
}

function getNameAndLink(details) {                                              
    const mealId = details.meals[0].idMeal
    const mealName = details.meals[0].strMeal
    const imgLink = details.meals[0].strMealThumb
    updateRandomMeal(mealName,imgLink,mealId)
}

function updateRandomMeal(mealName,imgLink,mealId) {                                   
    let randomUpdate = `<div class="dataDiv" id=${mealId}><img src=${imgLink} alt="" srcset="" class="mealImg">
    <h2 class="mealName">${mealName}</h2></div>`
    randomDiv.innerHTML = randomUpdate;
    setOnclick("random")
}

function checkSearchBox() {                                                     
    let searchedKeyword = searchBox.value
    if (searchedKeyword == "") {                                              
        prepareToUpdateSearchedMeals()
        window.alert("Enter something to search!")
    } else {
        prepareToUpdateSearchedMeals()
        generateSearchedMeals(searchedKeyword)
    }
}

function prepareToUpdateSearchedMeals() {                                    
    searchResultDiv.innerHTML= ""                                            
    searchUpdate = ""                                                        
    document.getElementById("searchTitle").innerText = ""                   
    document.getElementById("searchSubTitle").innerText = ""                 

}

function generateSearchedMeals(searchedKeyword) {                                           
    fetch (`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchedKeyword}`).then((response) =>
    response.json()).then((data) => {
        if(data.meals==null) {                                                             
            window.alert("Sorry no results for your search :(")
        } else {
            document.getElementById("searchTitle").innerText = `Results for "${searchedKeyword}"`      
            document.getElementById("searchSubTitle").innerText = `(${data.meals.length} meals matched your search)`     
            data.meals.forEach((details)=> {                                    
                getNameAndLinkForSearch(details)
            })
            setOnclick("searched")
        }
    })
}

function getNameAndLinkForSearch(details) {                                
    let mealId = details.idMeal
    let mealName = details.strMeal
    let imgLink = details.strMealThumb
    updateSearchedMeals(mealName,imgLink,mealId)
}

function updateSearchedMeals(mealName, imgLink,mealId) {                              
    searchUpdate+= `<div class="dataDiv" id=${mealId}><img src=${imgLink} alt="" srcset="" class="mealImg">
    <h2 class="mealName">${mealName}</h2></div>`
    searchResultDiv.innerHTML = searchUpdate;
}

function setOnclick(client) {
    let meals = document.getElementsByClassName("dataDiv")
    if(client=="searched") {                                                      
        for(let i=1; i<meals.length; i++) {
            meals[i].addEventListener("click", (e) => {
                getMealId(e)
            }, {capture : true})
          };
    } else {
        Array.from(meals, child => {
            child.addEventListener("click", (e) => {
                getMealId(e)
            }, {capture : true})
        });
    }
} 
    

function getMealId(event) {
    var clickedMealId = event.target.parentNode.id
    if(clickedMealId=="randomDiv" || clickedMealId=="searchResultDiv") {
        clickedMealId = event.target.id 
    }
    fetchIngredientsData(clickedMealId)
}

function fetchIngredientsData(mealId) {
    fetch (`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`).then((response) =>
    response.json()).then((data) => {
        let mealData = data.meals[0]
        let allKeys = Object.keys(mealData)
        filterIngredients(allKeys,mealData)
    })
}

function filterIngredients(allKeys,mealData) {
    ingredientDiv.style.display = "flex"
    ingredientUpdate = ""
    Array.from(allKeys, keyStr => {
        if (keyStr.match("Ingredient")) {
            let search = "mealData." + keyStr
            if(eval(search)!=""  && eval(search)!=null ) {
               updateIngredients(eval(search))
            }
        }
    });
}

function updateIngredients(ingredient) {
    ingredientUpdate += `<li class="list">${ingredient}</li>`
    ingredientUpdateDiv.innerHTML = ingredientUpdate
}