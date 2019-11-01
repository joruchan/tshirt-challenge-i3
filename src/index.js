/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
import $ from 'jquery';
import { get } from 'axios';
import {
  find, uniq, prop, propEq,
  map as Rmap, sort,
} from 'ramda';

let tshirtDisplay = [];
const tshirtDisplayMale = [];
const tshirtDisplayFemale = [];

get('http://localhost:3000/t-shirts')
  .then((response) => response.data)
  .then((tshirts) => {
    const maleShirts = tshirts.filter((tee) => tee.gender === 'M');
    const femaleShirts = tshirts.filter((tee) => tee.gender === 'F');

    for (const tshirt of maleShirts) {
      tshirt.size = [tshirt.size];
      if (find(propEq('productId', tshirt.productId))(tshirtDisplayMale)) {
        tshirtDisplayMale[tshirt.productId].size += ` ${tshirt.size}`;
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
    // you stopped here, now to display the correct things, sorted should be finished

    console.log(tshirtDisplay);
    tshirtDisplay.forEach((tee) => {
	  tee.size = tee.size.split(' ');
	   // ?
    });
  })
  .then(() => {
    for (const tee of tshirtDisplay) {
	  const { gender } = tee;
	  const uniqueSizes = uniq(tee.size); // ?
	  const sizesDisplay = uniqueSizes.map((e) => `<span>${e}</span>`).join('');
      const genderIconUrl = (gender === 'F') ? 'public/assets/images/female.png' : 'public/assets/images/male.png';
      const divTee = $(`
		  <div id="tShirt">
			  <img
				  src="${tee.imageUrl}"
				  alt=""
			  />
			  <div id="tshirtText">
				  <div>
					  <p>${tee.price}<sup>€</sup></p>
					  <img
						  src="${genderIconUrl}"
						  alt=""
						  id="genderIcon"
					  />
				  </div>
				  <div>
					  ${sizesDisplay}
				  </div>
			  </div>
		  </div>`);
      divTee.appendTo($('section'));
	  }
  });
// ?
