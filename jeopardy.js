// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];
let numCategories =[];

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
    const res = await axios.get('http://jservice.io/api/categories?count=100');
     // console.log(res.data);
    for(let res1 of res.data){
     // getClues(res1.id);
     numCategories.push(res1.id);
     }
      return _.sampleSize(numCategories, 6);
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
    const res1 = await axios.get(`http://jservice.io/api/category?id=${catId}`);
  //  console.log(res1);
   let title = res1.data.title;
   let clue = [];
   for(let res2 of res1.data.clues){
    // console.log(res2.question + " ans:"+ res2.answer);
     clue.push({question: res2.question, answer: res2.answer})
   }
 categories.push
    ({ title: title,
       clues: clue,
       showing: null
      });
    
     return categories;
    
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

function fillTable() {
 // console.log(categories);
   const $jeopardyTable = $('#jeopardy');
   $('thead').empty();
    let th = "";
    for(let val of categories){
     th += '<th>' + val.title + '</th>';     
    }
 const $thead = $("<thead><tr>").append($(th));
$jeopardyTable.append($thead);
$("tbody").empty();
const $tbody = $("<tbody>");
 for(j=0; j < 5; j++){
  let $tr = $("<tr>");
for(let i = 0; i < categories.length; i++){
  let $td = $('<td>').attr('id',`${i}-${j}`).html("?");
   $tr.append($td);
 
    }
    $tbody.append($tr);
}
$jeopardyTable.append($tbody);

}
/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(event) {
   event.preventDefault();
   // alert(event.target.id);
    let DivId = event.target.id;
    let [titleId, clueId]= DivId.split("-");
    let x = categories[titleId].clues[clueId];
   // console.log(x);
      let showVal;
     if(!x["showing"]){
   //   alert("question mark")
     showVal = x.question;
     x["showing"]= "question";
   //  console.log(x);
    }
      else if(x["showing"] === "question"){
    //  alert("question");
      showVal = x.answer;
      x["showing"]= "answer";
    }
 else {
   return;
 }
  $("#" + titleId + "-" + clueId).html(showVal);
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
  $("#jeopardy").empty();
    
  // console.log(catId);
categories=[];
let catId = await(getCategoryIds());
  for(let val of catId) {
    categories = await(getCategory(val));
  }
   await(fillTable());
}

/** On click of restart button, restart game. */
/** On page load, setup and start & add event handler for clicking clues */

$("#restart").on( "click", setupAndStart); 
$(async function() {
  setupAndStart(); 
$( "#jeopardy" ).on( "click", "td", handleClick);
});

