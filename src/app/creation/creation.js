/* eslint-disable max-len */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
import $ from 'jquery';
import {
  uniq, find, propEq, sort,
} from 'ramda';

export let tshirtDisplay = [];
const tshirtDisplayMale = [];
const tshirtDisplayFemale = [];

export const getTshirtArray = function (tshirts) {
  const maleShirts = tshirts.filter((tee) => tee.gender === 'M');
  const femaleShirts = tshirts.filter((tee) => tee.gender === 'F');
  for (const tshirt of maleShirts) {
    tshirt.size = [tshirt.size];
    if (find(propEq('productId', tshirt.productId))(tshirtDisplayMale)) {
      tshirtDisplayMale[tshirt.productId].size += ` ${tshirt.size}`; // Ca c'est un peu de la bidouille, c'est optimisable
    } else {
      tshirtDisplayMale.push(tshirt);
    }
  }
  for (const tshirt of femaleShirts) {
    tshirt.size = [tshirt.size];
    if (find(propEq('productId', tshirt.productId))(tshirtDisplayFemale)) {
      tshirtDisplayFemale[tshirt.productId].size += ` ${tshirt.size}`;
    } else {
      tshirtDisplayFemale.push(tshirt);
    }
  }
  tshirtDisplay = sort(((a, b) => a.productId - b.productId), [...tshirtDisplayMale, ...tshirtDisplayFemale]);

  tshirtDisplay.forEach((tee) => {
	  tee.size = (tee.size.length > 1) ? tee.size.split(' ') : [tee.size];
	  tee.size.push('any');
  });
};

export const createTshirtDiv = function (arrayofShirts) {
  for (const tee of arrayofShirts) {
    const { gender } = tee;
    const uniqueSizes = uniq(tee.size);
    const sizesDisplay = uniqueSizes.map((e) => ((e !== 'any') ? `<span>${e}</span>` : '')).join('');
    const genderIconUrl = (gender === 'F') ? 'public/assets/images/female.png' : 'public/assets/images/male.png';
    const divTee = $(`
		<div id="tShirt">
			<img src="${tee.imageUrl}" alt="${tee.category} t-shirt"/>
			<div id="tshirtText">
				<div>
					<p>${tee.price}<sup>€</sup></p>
					<img src="${genderIconUrl}" alt="" id="genderIcon"/>
				</div>
				<div>
					${sizesDisplay}
				</div>
			</div>
		</div>`);
    divTee.appendTo($('section'));
  }
};

export const createSizeButtons = function (arrayOfShirts) {
  const uniqueSizes = uniq(arrayOfShirts.map((tee) => tee.size)
	  .join(',')
	  .split(','))
	  .map((size) => ((size !== 'any') ? `<button class="btn-filter">${size}</button>` : ''))
	  .join('');
  const buttonsSize = $(`${uniqueSizes}`);
  buttonsSize.appendTo($('#sizeFilter'));
};

export const createCatButtons = function (arrayOfShirts) {
  const categories = uniq(arrayOfShirts.map((shirt) => shirt.category))
	  .map((category) => `<button class="btn-filter">${category}</button>`)
	  .join('');
  const buttonsCat = $(`${categories}`);
  buttonsCat.appendTo($('#catFilter'));
};

export const filteredTshirtDisplay = (arrayOfShirts, currGender, currSize, currCategory, currPrice) => arrayOfShirts.filter((shirt) => (shirt.gender === currGender || currGender === '')
        && shirt.size.includes(currSize)
        && (shirt.category === currCategory || currCategory === '')
		&& shirt.price <= currPrice);
