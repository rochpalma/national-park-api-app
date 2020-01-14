'use strict';

const apiKey = 'pefW7QOeIChiMN5oYxctfDQ5xBjfqp5gCL9ilnZb'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${key}=${params[key]}`)
  return queryItems.join('&');
}
  
function displayResults(responseJson) {
  console.log(responseJson);
  $('.results-list').empty();
  for(let element of responseJson.data){
    $('.results-list').append(
      `<li><h3>${element.fullName}</h3>
      <p>${element.description}</p>
      <p>State: ${element.states}</p>
      <p><a href ="${element.url}" target="_blank">More Information</a></p>
      </li>
      <p><a href="${element.directionsUrl}" target="_blank">Directions</a></p>`  
    );
  }
    $('.results').removeClass('hidden');
    $('.error').addClass('hidden');
}
  
function getParks(state, maxResults) {
  const params = {
    stateCode: state,
    limit: maxResults,
    api_key: apiKey  
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('.error').text(`Something went wrong: ${err.message}`);
    });
}

function getStates(){
  const selectedStates = [];
  $('select option:selected').each(function(){selectedStates.push($(this).val());})
  return selectedStates;
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const selectedStates =getStates();
    const maxResults = $('#max-results').val();
    getParks(selectedStates, maxResults);
  });
}

$(watchForm);