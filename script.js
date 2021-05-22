const mainDiv = document.querySelector("#main-row");
const searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", breedSearch);
const placeholderImage = "img/paw.png";
var searchString = "shep";
document.querySelector("#breed-search-box").value = searchString;

getMyDoggos(searchString);

function breedSearch(event) {
    event.preventDefault();
    searchString = document.querySelector("#breed-search-box").value;
    getMyDoggos(searchString);
}

async function populateDogDiv(dogBreed) {
    const newDiv = addNewDogDiv("New", placeholderImage);
    const imageRef = dogBreed.reference_image_id;
    const imageRequestURL = `https://api.thedogapi.com/v1/images/${dogBreed.reference_image_id}`;
    const resImage = await fetch(imageRequestURL, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'x-api-key': '82eed4b3-06a9-4889-81c9-31d0e354c8fa'
        }
    })
    const dataImage = await resImage.json();
    const imageURL = dataImage.url;
    try {
        console.log(`loading background: ${dogBreed.name}`)
        newDiv.firstElementChild.style.backgroundImage = `url("${imageURL}")`;
        console.log(`loaded background\n`);
    }
    catch (err) {
        console.log("Some error occured");
    }
    newDiv.firstElementChild.innerHTML = dogBreed.name;
}

async function getMyDoggos(term) {
    console.log(`Searching for: ${term}`);
    const breedRequestURL = `https://api.thedogapi.com/v1/breeds/search?q=${term}`
    const res = await fetch(breedRequestURL, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'x-api-key': '82eed4b3-06a9-4889-81c9-31d0e354c8fa'
        }
    })

    const data = await res.json();
    console.log(`Number of breeds: ${data.length}`);
    const cleanArray = data.filter(item => item.reference_image_id !== undefined);
    const numOfBreeds = cleanArray.length;
    console.log(`Cleaned number of breeds: ${numOfBreeds}`);
    document.querySelectorAll(".main-col").forEach(item => item.remove());
    if (numOfBreeds === 0) {
        const blankDiv = addNewDogDiv("No breeds found", placeholderImage)
    }

    else cleanArray.forEach((item) => populateDogDiv(item));

}

function addNewDogDiv(breedName, imageURL) {
    const markup = `<div class="panel-doggo">${breedName}</div>`;
    const newDiv = document.createElement("div");
    newDiv.className = "col-md-4 col-sm-6 main-col";

    const panelDiv = document.createElement("div");
    panelDiv.className = "panel-doggo";
    panelDiv.innerText = breedName;
    panelDiv.style.backgroundImage = `url(${imageURL})`;

    newDiv.appendChild(panelDiv);
    mainDiv.appendChild(newDiv);

    return newDiv;

}