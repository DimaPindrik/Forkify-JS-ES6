import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as likesView from './views/likesView';
import * as listView from './views/listView';
import Search from './models/Search';
import Recipe from './models/Recipe';
import List   from './models/List';
import Likes from './models/Likes';

/** Global state of the app |
 * - Search object          |
 * - Current recipe object  |
 * - Shopping list object   |
 * - Liked recipes          |
 */                         
const state = {};



/***********************
 * SEARCH CONTROLLER  
 ***********************/
const controlSearch = async () => {

    // 1) Get the query from view
    const query = searchView.getInput();
    
    if (query) {
        // New search object and add to state
        state.search = new Search(query);

        // Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        searchView.disableInput();
        renderLoader(elements.searchResult);

        try {

             // Search for recipes
            await state.search.getResults();

            // Render results on UI
            clearLoader();
            searchView.enableInput();
            searchView.renderResults(state.search.results);

        } catch (error) {

            console.log(error);
            alert('Error processing search query');
            clearLoader();

        }
       
    }
}


// Search form button event listener 
elements.searchForm.addEventListener('submit', e => {

    e.preventDefault();
    controlSearch();

});


// Pagination buttons event listener
elements.searchResultPages.addEventListener('click', e => {

    const btn = e.target.closest('.btn-inline');
    
    if (btn) {

        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.results, goToPage);
        
   
    }

});



/***********************
 * RECIPE CONTROLLER  
 ***********************/

const controlRecipe = async () => {

    // Get id from url
    const id = window.location.hash.replace('#', '');
    
    if (id) {

        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search item
        if (state.search) searchView.highlightSelected(id);

        // Create new recipe object
        state.recipe = new Recipe(id);

        try {

            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));

        } catch (error) {

            alert('Error processing recipe');

        }
        
    }

}

// Event listener for the url
 ['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

 // Handling recipe button clicks
 elements.recipe.addEventListener('click', e => {

    if (e.target.matches('.btn-decrease, .btn-decrease *')) {

        if (state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }

    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('inc');
            recipeView.updateServingsIngredients(state.recipe);
        }

    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {

        controlList();

    } else if (e.target.matches('.recipe__love, .recipe__love *')) {

        controlLike();

    }

 });


 /***********************
 * LIST CONTROLLER  
 ***********************/

 const controlList = () => {

    // Create a new list IF there is non yet
    if (!state.list) state.list = new List();

    // Add each inngredient to the list
    state.recipe.ingredients.forEach(el => {

        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);

    });

 };

 // Handle delete and update events
 elements.shopping.addEventListener('click', e => {

    const id = e.target.closest('.shopping__item').dataset.itemid;

    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Handle the delete button
        state.list.deleteItem(id);
        listView.deleteItem(id);

    } else if (e.target.matches('.shopping__count-value')) {
        // Handle the count button
        const val = parseFloat(e.target.value, 10);
        
        state.list.updateCount(id, val);

    }

 });


  /***********************
 * LIKES CONTROLLER  
 ***********************/

// Restore page recipes on page load
window.addEventListener('load', () => {

    state.likes = new Likes();

    // Restore Likes
    state.likes.readStorage();

    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));

})


const controlLike = () => {

    if (!state.likes) state.likes = new Likes();

    const currentId = state.recipe.id;

    if (!state.likes.isLiked(currentId)) {

        // Add the like to the state

        const newLike = state.likes.addLike(currentId, state.recipe.title, state.recipe.author, state.recipe.img);

        // Toggle the like button
        likesView.toggleLikeBtn(true);
        
        // Add like to UI list
        likesView.renderLike(newLike);

    } else {

        state.likes.deleteLike(currentId);

        likesView.toggleLikeBtn(false);

        likesView.deleteLike(currentId);

    }

    likesView.toggleLikeMenu(state.likes.getNumLikes());

}