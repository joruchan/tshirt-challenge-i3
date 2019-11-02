/* eslint-disable max-len */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
import $ from 'jquery';
import { get, post } from 'axios';
import {
  max,
} from 'ramda';
import validator from 'validator';
import {
  createTshirtDiv, getTshirtArray, tshirtDisplay, createSizeButtons, createCatButtons, filteredTshirtDisplay,
} from './app/creation/creation';

let currentGender = '';
let currentSize = '';
let currentCat = '';
let highestPrice = '';
const setValues = () => {
  currentSize = currentSize || 'any';
  currentGender = currentGender || '';
  highestPrice = highestPrice || tshirtDisplay.map((shirt) => shirt.price).reduce((a, b) => max(a, b), 0);
  currentCat = currentCat || '';
};

get('http://localhost:3000/t-shirts')
  .then((response) => response.data)
  .then((tshirts) => {
    getTshirtArray(tshirts); // Crée un array de tshirt formatté afin de pouvoir exploiter les données correctement
  })
  .then(() => {
    createSizeButtons(tshirtDisplay); // Crée un bouton pour chaque taille disponible
    createCatButtons(tshirtDisplay); // Crée un bouton pour chaque catégorie disponible
    createTshirtDiv(tshirtDisplay); // Crée une div pour chaque Tshirt, no doublon (id/gender)
  })
  .then(() => { // Tous les events on click se trouvent ici
    $('#genderFilter > button').on('click', (e) => {
      setValues();
      currentGender = e.target.innerHTML;
      const newTshirtDisplay = filteredTshirtDisplay(tshirtDisplay, currentGender, currentSize, currentCat, highestPrice);
      $('section').empty();
      createTshirtDiv(newTshirtDisplay);
    });

    $('#sizeFilter > button').on('click', (e) => {
      setValues();
      currentSize = e.target.innerHTML;
      const newTshirtDisplay = filteredTshirtDisplay(tshirtDisplay, currentGender, currentSize, currentCat, highestPrice);
      $('section').empty();
      createTshirtDiv(newTshirtDisplay);
    });

    $('#catFilter > button').on('click', (e) => {
      setValues();
      currentCat = e.target.innerHTML;
      const newTshirtDisplay = filteredTshirtDisplay(tshirtDisplay, currentGender, currentSize, currentCat, highestPrice);
      $('section').empty();
      createTshirtDiv(newTshirtDisplay);
    });

    $('#maxPriceInput').on('input', (e) => {
      setValues();
      highestPrice = e.target.valueAsNumber;
      const newTshirtDisplay = filteredTshirtDisplay(tshirtDisplay, currentGender, currentSize, currentCat, highestPrice);
      if (isNaN(highestPrice)) {
        highestPrice = tshirtDisplay.map((shirt) => shirt.price).reduce((a, b) => max(a, b), 0);
      }
      $('section').empty();
      createTshirtDiv(newTshirtDisplay);
    });

    $('#allShirts > button').on('click', () => {
      $('section').empty();
      createTshirtDiv(tshirtDisplay);
    });
  });

// Poster un nouveau t-shirt selon ce qui a été input
$('#uploadSubmit').on('click', () => {
  if (validator.isIn($('#sizeUpload').val(), ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'])
      && validator.isNumeric($('#priceUpload').val())
      && validator.isIn($('#genderUpload').val(), ['M', 'F'])
      && validator.isURL($('#shirtImgUpload').val(), { allow_underscores: true })) {
    post('http://localhost:3000/t-shirts', {
      id: tshirtDisplay.map((shirt) => shirt.productId).reduce((a, b) => max(a, b), 0) + 1,
      productId: tshirtDisplay.map((shirt) => shirt.productId).reduce((a, b) => max(a, b), 0) + 1,
      price: $('#priceUpload').val(),
      size: $('#sizeUpload').val(),
      gender: $('#genderUpload').val(),
      imageUrl: $('#shirtImgUpload').val(),
      category: $('#catUpload').val(),
    })
      .then(() => {
        location.reload();
      });
  } else {
    alert('Please enter a correct URL, a size between XXS and XXL, a correct gender (F or M) and a correct price');
  }
});

// Filtrer par prix : ne marche que sur l'ensemble, flemme de faire en sorte que cela reprenne les filtres précédents
$('#filterByPrice').on('click', () => {
  tshirtDisplay.sort((a, b) => a.price - b.price);
  $('section').empty();
  createTshirtDiv(tshirtDisplay);
});

// Filtrer par taille ::: Ne fonctionne pas - trop fatiguée pour trouver la solution 😩

// $('#filterBySize').on('click', () => {
//   const sizesAvailable = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
//   tshirtDisplay.forEach((tee) => {
//     tee.size = tee.size.reduce((a, b) => a.concat(b), []).join(',').split(',').reduce((a, b) => max(sizesAvailable[sizesAvailable.indexOf(a)], sizesAvailable[sizesAvailable.indexOf(b)]));
//   });
//   $('section').empty();
//   createTshirtDiv(tshirtDisplay);
// });
