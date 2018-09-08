import { elements } from './base';

/************************
 *  Exported Functions  *
 ************************/

 // Get the input from search query
export const getInput = () => elements.searchInput.value;

// Clear the search query
export const clearInput = () => { 

    elements.searchInput.value = '';
    
};

export const disableInput = () => {

    elements.searchInput.disabled = true;

};

export const enableInput = () => {

    elements.searchInput.disabled = false;

};

// Render the results from the search query
export const renderResults = (recipes, page = 1, resPerPage = 10) => {

    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);

    renderButtons(page, recipes.length, resPerPage);

};

// Clear the results (recipes and buttons)
export const clearResults = () => {

    elements.searchResultList.innerHTML = '';
    elements.searchResultPages.innerHTML = '';

}

export const highlightSelected = id => {

    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    })

    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');

}


/*************************
 *   Private Functions   *
 *************************/

 // Render a recipe to the HTML
const renderRecipe = recipe => {
    const markup = `
    <li>
    <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.publisher}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
    </li>
    `;

    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

// Limit the recipe title
export const limitRecipeTitle = (title, limit = 17) => {

    const newTitle = [];

    if (title.length > limit) {

        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }

            return acc + cur.length;
        }, 0);

        return `${newTitle.join(' ')}...`;
    }

    return title;

};


// Render the pagination buttons
const renderButtons = (page, numResults, resPerPage) => {

    const pages = Math.ceil(numResults / resPerPage);
    let button;

    if (page === 1 && pages > 1) {
        
        button = createButton(page, 'next');

    } else if (page < pages) { 

        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
            `;

    } else if (page === pages && pages > 1) { 

        button = createButton(page, 'prev');

    }
    if (button) {
        elements.searchResultPages.insertAdjacentHTML('afterbegin', button);
    }

};

const createButton = (page, type) => `

    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>

`;
