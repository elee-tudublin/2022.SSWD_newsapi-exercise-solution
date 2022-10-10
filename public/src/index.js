// JavaScript Fetch, see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
//(free version) API key from  https://newsapi.org/

// Default settings
const api_key = 'add your api key here!!!';

// The start of the API URL
const base_url = 'https://newsapi.org/v2/';

// Default news source
const default_source = 'top-headlines?country=ie';

// HTTP request settings
const headers = new Headers();
const req_init = {
  method: "GET",
  headers: headers,
  mode: "cors",
  cache: "default",
};

// Asynchronous Function to call API and get data
// note parameter value default (in case it is missing)
async function getNewsData() {

  // set the defaults
  let news_source = default_source;
  let news_title = "Headlines";

  // 'this' is set when this function is called via an event (clicking on the section links)
  // if it exists then read the data-source and link id
  if (this) {
    news_source = this.dataset.source;
    news_title = this.id;
  }

  // generate the the url 
  const url = `${base_url}${news_source}&apiKey=${api_key}`;

  console.log(url);

  // fetch the data
  try {
    // call the api - await indicates an async call
    // this call is non blocking and will return a promise
    const response = await fetch(url, req_init);

    // get json data from the response - when it arrives
    const json = await response.json();

    // log raw json result
    console.log(json);

    // display the articles and pass the title
    displayData(json.articles, news_title);

    // catch any errors
  } catch (err) {
    console.log(err);
  }
}

// Function accepts an array of news articles
// Articles are parsed and displayed
function displayData(articles, title) {
  // log the articles in the console
  console.log(articles);

  // Set the source element of the page to display news source (from the first [0] article)
  document.getElementById("source").innerHTML = `${title} news from Ireland`;

  // Get articles and add each one to the root element
  // the array map function iterates trough each object element in an array
  // read as 'for each article in articles, do this...'
  let output = articles.map((article) => {
    // returns a template string for each article, values are inserted using ${ }
    // <article> is an HTML5 semantic elememt which matches our needs but div could also be used
    return `<article>
              <h4>${article.title}</h4>
              <p>${article.author || ""}</p>
              <p>${formatDate(article.publishedAt)}</p>
              <img src=${article.urlToImage} alt='article image'>
              <p>${article.description || ""}</p>
              <p><a href='${article.url}'>Read More</a></p>
            </article>`;
  });

  // output, the result of the previous step, is an array of formatted articles
  // Set the innerHTML of the articles root element = output
  let articlesElement = document.getElementById("articles");
  articlesElement.innerHTML = output.join("");
} // end function

// Will this message display before or after the JSON data and why?
console.log("Has getNewsData() finished yet?");

// Initialise when the page is loaded
function initApp() {

  // Get all links in the newsLinks sestion  
  const news_links = document.getElementById("newsLinks").getElementsByTagName('a');

  // Add a click event listeners to the links so that getNewsData() is called when they are clicked
  for (let i=0; i < news_links.length; i++) {
    news_links[i].addEventListener("click", getNewsData);
  }

  // load the default news
  getNewsData();
}

// load the script
initApp();

// see https://dockyard.com/blog/2020/02/14/you-probably-don-t-need-moment-js-anymore
function formatDate(d) {
  return new Date(d).toLocaleDateString(
    'en-ie',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }
  );
}


// Functions to export
export { initApp, getNewsData };
