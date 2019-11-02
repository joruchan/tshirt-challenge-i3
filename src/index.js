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
    getTshirtArray(tshirts);
  })
  .then(() => {
    createSizeButtons(tshirtDisplay);
    createCatButtons(tshirtDisplay);
    createTshirtDiv(tshirtDisplay);
  })
  .then(() => {
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


$('#uploadSubmit').on('click', (e) => {
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
