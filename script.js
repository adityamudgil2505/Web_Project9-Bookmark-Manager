var bookmarkBtn = $('#bookmarkBtn');
var viewBtn = $('#viewBtn');
var searchBtn = $('#searchBtn');

bookmarkBtn.on('click',() =>{
  $(".bookmarkMenu").show();
  $(".viewMenu").hide();
  $(".searchMenu").hide();
});
viewBtn.on('click',() =>{
  $(".bookmarkMenu").hide();
  $(".viewMenu").show();
  $(".searchMenu").hide();
  linkGet();
});
searchBtn.on('click',() =>{
  $(".bookmarkMenu").hide();
  $(".viewMenu").hide();
  $(".searchMenu").show();
  $("#search").val("");
});

// fetch link from tab and additional details
var bmSubmit = () =>{
  let bookmark;
  chrome.tabs.query({'active': true, 'currentWindow': true}, function (tabs) {
    chrome.storage.sync.get({arr: []},(result) =>{
      var arr = result.arr;
      arr.push({url:tabs[0].url , title:tabs[0].title , detail:$('#details').val()});
      console.log(arr);
      chrome.storage.sync.set({arr: arr}, ()=>
      { 
      });
      console.log(arr);
      $('#details').val("");
    })

  });
}

// on click event or enter event
$('.submit').on('click',bmSubmit);
$('#details').on('keypress',(e) =>{
  if(e.which==13)
  { bmSubmit();
    console.log(e.which);
  }
});

// Clear all button
$('#clearAll').on('click',()=>{
  chrome.storage.sync.clear();
  console.log("All bookmark is deleted");
});

// Download json Format
$('#download').on('click', ()=>{
  chrome.storage.sync.get({arr:[]}, (result)=>{
    console.log(result.arr);
    downloadFile(result.arr);
  })
});
//creating File
function downloadFile(file){
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(file));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href",     dataStr);
  downloadAnchorNode.setAttribute("download", "Bookmark.json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();    
}

//displaying link in view
function linkGet(){
  var file ;
  chrome.storage.sync.get({arr:[]},(result)=>
  { file = result.arr;
    linkDisp(file);
  });
}
function linkDisp(file)
{ var toInsert = $('.viewMenu ul');
  var len = file.length;
  $('.viewMenu ul li').remove();
  for(var i=len-1; i >=0;i--)
  { toInsert.append("<li><div class='linkContent' data-internalid='"+file[i].url+"'>"+file[i].title+"<span class='tooltip'>"+file[i].detail +"</span></div><span class='deleteBtn'>X</span></li>");
  }
}

// delete btn
$('ul').on('click','.deleteBtn',(event) =>{
  var url;
  console.log(event);
  url = event.target.previousSibling.dataset.internalid;
  $(event.target.parentElement).fadeOut(500);
  setTimeout(()=>{
    $(event.target.parentElement).remove();
  },500)
  event.stopPropagation();
  // scaning that url
  chrome.storage.sync.get({arr:[]},(file)=>{
    let detail =file.arr;
    let len = detail.length;
    let i;
    for(i=0;i<len;i++)
    { console.log(detail[i].url);
      if(detail[i].url==url)
      { break;
      }
    }
    detail.splice(i,1);
    console.log(detail);
    chrome.storage.sync.set({arr:detail});
  });
});

//clicking links
$('ul').on('click','.linkContent',(event)=>{
  let url = event.target.dataset.internalid;
  chrome.tabs.create({url: url});
});

// searchBar
$('#search').on('keypress',(e)=>{
  searchIt(event.target.value);
});
// for backspace
$('#search').on('keyup',(e)=>{
  if(e.which==8){
    searchIt(event.target.value);
  }
});
function searchIt(url)
{ let par = $('.searchedContent ul');
  $('.searchedContent ul li').remove();
  chrome.storage.sync.get({arr:[]},(detail)=>{
    let file = detail.arr;
    let len = file.length;
    for(let i=0;i<len;i++)
    { if(file[i].url.includes(url)==1 || file[i].title.toLowerCase().includes(url)==1 || file[i].detail.toLowerCase().includes(url)==1)
      { par.append("<li><div class='linkContent' data-internalid='"+file[i].url+"'>"+file[i].title+"<span class='tooltip'>"+file[i].detail +"</span></div><span class='deleteBtn'>X</span></li>");
      }
    }
  });
}
