const head = document.querySelector('.second-sub-head'),
themeBtn = document.querySelector('.theme-btn'),
themeIcon = document.querySelector('.theme-img'),
themeTxt = document.querySelector('.theme-txt'),
selectRegion = document.getElementById('region'),
searchCountry = document.querySelector('.search-icon'),
searchCountryInput = document.getElementById('country'),
wrapper = document.querySelector('.wrapper'),
countryDetailsBox = document.querySelector('.country-details-box'),
backBtn = document.querySelector('.back-btn');

let themeFlag =JSON.parse(localStorage.getItem("themeFlag")) || false;

if(themeFlag){
    themeIcon.src = 'images/sun-icon.svg';
    themeTxt.innerText='Light Mode';
    switchTheme();
}

themeBtn.addEventListener('click', ()=>{
    if(!themeFlag){
        themeIcon.src = 'images/sun-icon.svg';
        themeTxt.innerText='Light Mode';
        switchTheme();
        themeFlag = true;
        localStorage.setItem("themeFlag", themeFlag);
    }else{
        themeIcon.src = 'images/moon-icon.svg';
        themeTxt.innerText='Dark Mode';
        switchTheme();
        themeFlag = false;
        localStorage.setItem("themeFlag", themeFlag);
    }
})

function switchTheme(){
    document.querySelector('body').classList.toggle('theme-class');
}

searchCountry.addEventListener('click',searchCountryFn);

searchCountryInput.addEventListener('keyup', searchCountryFn);

function searchCountryFn(){
    [...wrapper.children].forEach(child => {
        child.classList.add('none');
        if(child.lastElementChild.firstElementChild.innerText.toLowerCase().includes(searchCountryInput.value)){
            child.classList.remove('none');
        }
    });
}

selectRegion.addEventListener('change',()=>{
    [...wrapper.children].forEach(child => {
        child.classList.remove('none');
        if(!child.lastElementChild.children[2].classList.contains(selectRegion.value)){
            child.classList.add('none');
        }
    });
})

countryDetailsBox.addEventListener('click', (e)=>{
    if(e.target.classList.contains('back-btn')){
        head.classList.toggle('none');
        wrapper.classList.toggle('none');
        countryDetailsBox.classList.toggle('none');
        countryDetailsBox.innerHTML='';
    }
})

wrapper.addEventListener('click',(e)=>{
    if(e.target.classList.contains('country-box')){
        const indx = [...wrapper.children].indexOf(e.target);
        
        head.classList.toggle('none');
        wrapper.classList.toggle('none');
        countryDetailsBox.classList.toggle('none');
        getCountryDetails(indx);
    }
})

async function getCountryDetails(idx){
    const countryData = await fetch('data.json');
    const countryResults = await countryData.json();

    const currenciesList = countryResults[idx].currencies;
    const languagesList = countryResults[idx].languages;
    const bordersList = countryResults[idx].borders;

    const div = document.createElement('div');

    div.innerHTML = `
    <button class="back-btn">
    <img src="images/arrow-left.svg" alt="" class="back-img">
    Back
    </button>

    <div class="country-details-grid">
    <img src="${countryResults[idx].flags.svg}" alt="" class="flag">

    <div class="country-info">
    <div class="country-details-grid">
    <div>
    <h3 class="country-name">${countryResults[idx].name}</h3>
    <p class="country-info-para">
        native name: <span>${countryResults[idx].nativeName}</span>
    </p>
    <p class="country-info-para">
        population: <span>${countryResults[idx].population}</span>
    </p>
    <p class="country-info-para">
        region: <span>${countryResults[idx].region}</span>
    </p>
    <p class="country-info-para">
        sub region: <span>${countryResults[idx].subregion}</span>
    </p>
    <p class="country-info-para country-details-capital">
        capital: <span>${countryResults[idx].capital}</span>
    </p>
    </div>
    <div>
    <p class="country-info-para">
    top level domain: <span>b${countryResults[idx].topLevelDomain}</span>
    </p>
    <p class="country-info-para">
        currencies:
    </p>
    <p class="country-info-para">
        languages:
    </p>
    </div>
    </div>
    <h4 class="borders">
            border countries
        </h4>
        <div class="border-box"></div>
    </div>
    </div>
    `;
    const currencyBox = div.lastElementChild.lastElementChild.firstElementChild.lastElementChild.children[1];
    const languageBox = div.lastElementChild.lastElementChild.firstElementChild.lastElementChild.children[2];
    const borderBox = div.lastElementChild.lastElementChild.lastElementChild;
    

    for (let j = 0; j < currenciesList.length; j++) {
        const span = document.createElement('span');
        span.innerText = j==0?currenciesList[j].code:' ,' + currenciesList[j].code;
        currencyBox.append(span);
    }

    for (let m = 0; m < languagesList.length; m++) {
        const spanL = document.createElement('span');
        if(m>0){
            spanL.innerText=', ' + languagesList[m].name;
        }else{
            spanL.innerText=languagesList[m].name;
        }
        languageBox.append(spanL);
    }

    for (let i = 0; i < bordersList.length; i++) {
        const p = document.createElement('p');
        p.classList.add('border');
        p.innerText=bordersList[i];
        borderBox.append(p);
    }
    
    countryDetailsBox.append(div);
}

async function getData(){
    const data = await fetch('data.json');
    const result = await data.json();
    
    for(let i =0; i< result.length; i++){
        const countryBox = document.createElement('div');
        countryBox.classList.add('country-box');
        countryBox.innerHTML=`
        <div class="flag-box">
                    <img src="${result[i].flags.svg}" alt="" class="flag">
                </div>
                <div class="country-info">
                    <h3 class="country-name">${result[i].name}</h3>
                    <p class="country-info-para">
                        population: <span>${result[i].population}</span>
                    </p>
                    <p class="country-info-para ${result[i].region.toLowerCase()}">
                        region: <span>${result[i].region}</span>
                    </p>
                    <p class="country-info-para">
                        capital: <span>${result[i].capital}</span>
                    </p>
                </div>
        `;
        wrapper.append(countryBox);
    }
}

getData();