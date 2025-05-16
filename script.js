let recipes = JSON.parse(localStorage.getItem("recipes") || "[]");
let currentRecipeIndex = null;

// DOM Elements
const recipesSection = document.getElementById("recipes-section");
const recipeViewSection = document.getElementById("recipe-view-section");
const recipeFormSection = document.getElementById("recipe-form-section");

const recipesList = document.getElementById("recipes-list");
const addRecipeBtn = document.getElementById("add-recipe-btn");
const backToListBtn = document.getElementById("back-to-list");
const editRecipeBtn = document.getElementById("edit-recipe");
const deleteRecipeBtn = document.getElementById("delete-recipe");
const cancelBtn = document.getElementById("cancel-btn");
const recipeForm = document.getElementById("recipe-form");
const formTitle = document.getElementById("form-title");

const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const ingredientsInput = document.getElementById("ingredients");
const instructionsInput = document.getElementById("instructions");
const photoInput = document.getElementById("photo");

// View Mode Elements
const viewTitle = document.getElementById("view-title");
const viewPhoto = document.getElementById("view-photo");
const photoErrorMessage = document.getElementById("photo-error-message");
const viewDescription = document.getElementById("view-description");
const viewIngredients = document.getElementById("view-ingredients");
const viewInstructions = document.getElementById("view-instructions");

// Render the list of recipes
function renderRecipes() {
  recipesList.innerHTML = "";
  if (recipes.length === 0) {
    recipesList.innerHTML = "<p>No recipes yet. Click 'Add New Recipe' to begin!</p>";
    return;
  }
  recipes.forEach((recipe, index) => {
    const div = document.createElement("div");
    div.className = "recipe-list-item";
    div.textContent = recipe.title;
    div.onclick = () => viewRecipe(index);
    recipesList.appendChild(div);
  });
}

// Switch views
function show(section) {
  recipesSection.style.display = "none";
  recipeViewSection.style.display = "none";
  recipeFormSection.style.display = "none";
  section.style.display = "block";
}

// Add recipe button
addRecipeBtn.onclick = () => {
  currentRecipeIndex = null;
  formTitle.textContent = "Add Recipe";
  recipeForm.reset();
  show(recipeFormSection);
};

// Cancel button
cancelBtn.onclick = () => show(recipesSection);

function viewRecipe(index) {
  const recipe = recipes[index];
  currentRecipeIndex = index;

  viewTitle.textContent = recipe.title;
  viewDescription.textContent = recipe.description;
  photoErrorMessage.textContent = "";  // Clear previous errors

  if (recipe.photo) {
    viewPhoto.src = recipe.photo;
    viewPhoto.style.display = "block";

    // Only show error if photo fails to load and photo URL is not empty
    viewPhoto.onerror = () => {
      photoErrorMessage.textContent = "Failed to load photo.";
      viewPhoto.style.display = "none";
    };
    viewPhoto.onload = () => {
      photoErrorMessage.textContent = "";
      viewPhoto.style.display = "block";
    };

  } else {
    // No photo URL, hide image and clear error message
    viewPhoto.src = "";
    viewPhoto.style.display = "none";
    photoErrorMessage.textContent = "";
  }

  viewIngredients.innerHTML = "";
  recipe.ingredients.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    viewIngredients.appendChild(li);
  });

  viewInstructions.innerHTML = "";
  recipe.instructions.forEach(step => {
    const li = document.createElement("li");
    li.textContent = step;
    viewInstructions.appendChild(li);
  });

  show(recipeViewSection);
}


// Edit recipe
editRecipeBtn.onclick = () => {
  const recipe = recipes[currentRecipeIndex];
  formTitle.textContent = "Edit Recipe";

  titleInput.value = recipe.title;
  descriptionInput.value = recipe.description;
  ingredientsInput.value = recipe.ingredients.join("\n");
  instructionsInput.value = recipe.instructions.join("\n");
  photoInput.value = recipe.photo || "";

  show(recipeFormSection);
};

// Delete recipe
deleteRecipeBtn.onclick = () => {
  if (currentRecipeIndex === null) return;

  const confirmed = confirm(`Are you sure you want to delete "${recipes[currentRecipeIndex].title}"?`);
  if (!confirmed) return;

  recipes.splice(currentRecipeIndex, 1);
  localStorage.setItem("recipes", JSON.stringify(recipes));
  currentRecipeIndex = null;
  renderRecipes();
  show(recipesSection);
};

// Back to list
backToListBtn.onclick = () => show(recipesSection);

// Save recipe
recipeForm.onsubmit = (e) => {
  e.preventDefault();

  const newRecipe = {
    title: titleInput.value.trim(),
    description: descriptionInput.value.trim(),
    ingredients: ingredientsInput.value.split("\n").map(i => i.trim()).filter(i => i),
    instructions: instructionsInput.value.split("\n").map(s => s.trim()).filter(s => s),
    photo: photoInput.value.trim()
  };

  if (currentRecipeIndex === null) {
    recipes.push(newRecipe);
    currentRecipeIndex = recipes.length - 1;
  } else {
    recipes[currentRecipeIndex] = newRecipe;
  }

  localStorage.setItem("recipes", JSON.stringify(recipes));
  renderRecipes();
  viewRecipe(currentRecipeIndex);
};

// Initialize app
renderRecipes();
