let intervalId;
let isShowingImages = false;
let breedList = []; 

async function fetchBreeds() {
    const response = await fetch('https://dog.ceo/api/breeds/list/all');
    const data = await response.json();
    breedList = Object.keys(data.message); 
    populateBreedList(breedList);
}

function populateBreedList(breeds) {
    const datalist = document.getElementById('breeds');
    datalist.innerHTML = ''; 
    breeds.forEach(breed => {
        const option = document.createElement('option');
        option.value = breed;
        datalist.appendChild(option);
    });
}

async function fetchBreedImages(breed) {
    try {
        const response = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`);
        const data = await response.json();
        
        if (data.status === "error") {
            throw new Error("Breed not found");
        }

        return data.message;
    } catch (error) {
        return null;
    }
}

async function showBreedImages(breed) {
    const errorElement = document.getElementById('error');
    const dogImagesElement = document.getElementById('dog-images');
    const breedInput = document.getElementById('breed-input');

    
    errorElement.textContent = '';

    
    if (!breedList.includes(breed)) {
        errorElement.textContent = 'No such breed';
        return;
    }

    
    if (isShowingImages) {
        clearInterval(intervalId);
        dogImagesElement.innerHTML = '';
        breedInput.disabled = false;
        document.getElementById('show-images').textContent = "Show Images";
        isShowingImages = false;
        return;
    }

    breedInput.disabled = true;
    dogImagesElement.innerHTML = ''; 
    isShowingImages = true;

    intervalId = setInterval(async () => {
        const imageUrl = await fetchBreedImages(breed);

        if (!imageUrl) {
            errorElement.textContent = 'Error fetching image';
            clearInterval(intervalId);
            breedInput.disabled = false;
            isShowingImages = false;
            return;
        }

        
        dogImagesElement.innerHTML = `<img src="${imageUrl}" alt="${breed}">`;
        
    }, 5000);

    document.getElementById('show-images').textContent = "Pause";
}


document.getElementById('show-images').addEventListener('click', () => {
    const breedInput = document.getElementById('breed-input').value.trim().toLowerCase();
    if (breedInput) {
        showBreedImages(breedInput);
    } else {
        document.getElementById('error').textContent = 'Please enter a dog breed';
    }
});

fetchBreeds(); 
