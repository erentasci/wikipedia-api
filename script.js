// Select items
let searchInput = document.querySelector("#input");
let submitButton = document.querySelector("#submit");
let errorArea = document.querySelector("#error");
let contentResult = document.querySelector("#results");


// Identify endpoint and params

const endPoint = 'https://en.wikipedia.org/w/api.php?';

const params = {
    origin: '*',
    format: 'json',
    action: 'query',
    prop: 'extracts',
    exchars: 250,
    exintro: true,
    explaintext: true,
    generator: 'search',
    gsrlimit: 20,
};



// Change UI disable state
const changeUiState = (isDisabled)=>{
    searchInput.disabled = isDisabled;
    submitButton.disabled = isDisabled;
}

// Clear input 
const clearInput = () => {
    searchInput.value = "";

}

// Clear previous results
const clearPreviousResult = () => {
    contentResult.innerHTML = "";
    errorArea.innerHTML = "";
}


// İs it empty?
const isInputEmpty = (input) => {
    if(!input || input === ""){
        return true
    }else{
        return false
    }
}


const showError = (err) => {
    errorArea.innerHTML = `🚨 ${err} 🚨`

}


const handleKey = (e) => {
    if(e.key === "Enter"){
        getData(searchInput.value);

    }
}

const eventHandlers = ()=>{
    searchInput.addEventListener("keydown",handleKey);
    submitButton.addEventListener("click",getData);
}

const getData = async (inputValue) => {

    

    const userInput = inputValue;
    if (isInputEmpty(userInput)) return;

    params.gsrsearch = userInput;
    clearPreviousResult();
    changeUiState(true);

    try {
        const { data } = await axios.get(endPoint, { params });
        if (data.error) throw new Error(data.error.info);
        gatherData(data.query.pages);
    } catch (error) {
        showError(error);
    } finally {
        changeUiState(false)
    }

}

const gatherData = (gatherDataValues) => {

    const results = Object.values(gatherDataValues).map(page => ({
        pageId: page.pageid,
        title: page.title,
        intro: page.extract,
    }));

    showResults(results);
}

const showResults = (results) => {
    results.forEach( (result) => {
        contentResult.innerHTML += 
        `
        <div class="results__item">
            <a href="https://en.wikipedia.org/?curid=${result.pageId}" target="_blank" class="card animated bounceInUp">
                <h2 class="results__item__title">${result.title}</h2>
                <p class="results__item__intro">${result.intro}</p>
            </a>
        </div>
        `
    })

    clearInput();

}


eventHandlers();