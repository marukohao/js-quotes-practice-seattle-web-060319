// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
const quotesUrl ="http://localhost:3000/quotes?_embed=likes";
// let likesNumber = null;
function fetchQuotesData() {
  fetch(quotesUrl)
  .then(resp => resp.json())
  .then(json => renderQuotes(json));
}

function renderQuotes(json) {
  json.forEach(quote => {
    let likesNumber = quote.likes.length;
    createQuoteElements(quote, likesNumber);
  })
}

function createQuoteElements(quote, likesNumber) {
  const ul = document.getElementById('quote-list');
  const author = quote.author;
  const content = quote.quote;
  const quoteId = quote.id;
  // const likesNumber = quote.likes.length;
  const li = document.createElement('li');
  const blockquote = document.createElement('blockquote');
  blockquote.className = 'blockquote';
  //create p footer buttons
  const p = document.createElement('p');
  p.className = 'mb-0';
  p.innerText = content;
  const footer = document.createElement('footer');
  footer.className = 'blockquote-footer';
  footer.innerText = author;
  const br = document.createElement('br');
  const button1 = document.createElement('button');
  button1.className = 'btn-success';
  button1.innerText = 'Likes: ';
  const span = document.createElement('span');
  span.innerText = likesNumber;
  button1.appendChild(span);
  const button2 = document.createElement('button');
  button2.className = 'btn-danger';
  button2.innerText = 'Delete';
  const button3 = document.createElement('button');
  button3.className = 'btn-success';
  button3.innerText = 'Edit';
  blockquote.appendChild(p);
  blockquote.appendChild(footer);
  blockquote.appendChild(br);
  blockquote.appendChild(button1);
  blockquote.appendChild(button2);
  blockquote.appendChild(button3);
  li.appendChild(blockquote);
  ul.appendChild(li);
  //add eventlistener to delete button
  button2.addEventListener('click', function(e) {
    fetchDeleteData(quoteId);
    li.remove();
  })
  //add eventlistener to like button
  button1.addEventListener('click', function(e) {
    fetchAddLike(quoteId);
    likesNumber += 1
    span.innerText = likesNumber;
  })
  //add eventlistener to edit button
  button3.addEventListener('click', function(e) {
    createEditForm(blockquote, author, content, quoteId, p, footer);
    // fetchAddLike(quoteId);
  })
}

function createEditForm(blockquote, author, content, quoteId, p, footer) {
  const form = document.createElement('form');
  const authorInput = document.createElement('input');
  authorInput.type = 'text';
  authorInput.placeholder = author;
  const quoteInput = document.createElement('input');
  quoteInput.type = 'text';
  quoteInput.placeholder = content;
  const submitEditButton = document.createElement('button');
  submitEditButton.type = 'submit';
  submitEditButton.innerText = 'Submit';
  form.appendChild(authorInput);
  form.appendChild(quoteInput);
  form.appendChild(submitEditButton);
  blockquote.appendChild(form);
  //add eventlistener to submit edit button
  submitEditButton.addEventListener('click', function(e) {
     fetchUpdateData(blockquote, quoteInput, authorInput, quoteId, p, footer);
  })
}


//add event listener to submit button to create new quote
function newQuote() {
  const submitButton = document.querySelector("button[type='submit']");
  submitButton.addEventListener('click', function(e) {
    e.preventDefault();
    const inputAuthor = document.getElementById('author').value;
    const inputQuote = document.getElementById('new-quote').value; 
    fetchNewQuoteData(inputAuthor, inputQuote);
  })
}

function createNewQuote(json) {
  const likesNumber = 0;
  console.log(json);
  createQuoteElements(json, likesNumber);
}

function fetchNewQuoteData(inputAuthor, inputQuote) {
  return fetch("http://localhost:3000/quotes", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      quote: inputQuote,
      author: inputAuthor
    })
  })
  .then(response => response.json())
  .then(json => createNewQuote(json));
}

function fetchDeleteData(quoteId) {
  return fetch(`http://localhost:3000/quotes/${quoteId}`, {
    method: 'DELETE'
  })
  .then(response => response.json())
}

function fetchUpdateData(blockquote, quoteInput, authorInput, quoteId, p, footer) {
  return fetch(`http://localhost:3000/quotes/${quoteId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      id: quoteId,
      quote: quoteInput.value,
      author: authorInput.value
    })
  })
  .then(response => response.json())
  .then(json => udpateQuoteData(blockquote, quoteInput, authorInput, quoteId, p, footer))
}

function udpateQuoteData(blockquote, quoteInput, authorInput, quoteId, p, footer) {
  footer.innerText = authorInput.value;
  p.innerText = quoteInput.value;
}

function fetchAddLike(quoteId) {
  return fetch("http://localhost:3000/likes", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      quoteId: quoteId
    })
  })
  .then(response => response.json())
}


document.addEventListener('DOMContentLoaded', function() {
  fetchQuotesData();
  newQuote();
});

