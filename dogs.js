let intervalId;
let isShowingImages = false;

async function fetchBreeds() {
    const response = await fetch('https://dog.ceo/api/breeds/list/all');
    const data = await response.json();
    const breeds = Object.keys(data.message);
    populateBreedList(breeds);
}


function populateBreedList(breeds) {
    const breedInput = document.getElementById('breed-input');
    const datalist = document.getElementById('breeds');
    breeds.forEach(breed => {
        const option = document.createElement('option');
        option.value = breed;
        datalist.appendChild(option);
    });
}


async function fetchBreedImages(breed) {
    const response = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`);
    const data = await response.json();
    return data.message;  
}


async function showBreedImages(breed) {
    const errorElement = document.getElementById('error');
    const dogImagesElement = document.getElementById('dog-images');
    const breedInput = document.getElementById('breed-input');

    if (isShowingImages) {
        clearInterval(intervalId); 
        dogImagesElement.innerHTML = ''; 
        breedInput.disabled = false; 
        document.getElementById('show-images').textContent = "Show Images"; 
        isShowingImages = false;
        return;
    }

    try {
        errorElement.textContent = ''; 
        dogImagesElement.innerHTML = '';  
        breedInput.disabled = true; 
        const imageUrl = await fetchBreedImages(breed);
        
        if (!imageUrl) {
            errorElement.textContent = 'No such breed';
            breedInput.disabled = false; 
            return;
        }

        let counter = 0;
        isShowingImages = true;

        intervalId = setInterval(async () => {
            const imageUrl = await fetchBreedImages(breed);
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            dogImagesElement.appendChild(imgElement);
            counter++;

            if (counter >= 5) {
                clearInterval(intervalId); 
                breedInput.disabled = false; 
                document.getElementById('show-images').textContent = "Show Images"; 
                isShowingImages = false;
            }
        }, 5000);  

        document.getElementById('show-images').textContent = "Pause"; 
    } catch (error) {
        errorElement.textContent = 'Error fetching images';
        breedInput.disabled = false; 
        document.getElementById('show-images').textContent = "Show Images"; 
    }
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