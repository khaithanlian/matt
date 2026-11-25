let bibleData=null, bookIndex=0, chapterIndex=0;
const $=id=>document.getElementById(id);
const bookSelect=$("bookSelect"), chapterGrid=$("chapterGrid"), chapterContent=$("chapterContent");
function currentBook(){return bibleData.books[bookIndex]}
function currentChapter(){return currentBook().chapters[chapterIndex]}
function render(){
  const book=currentBook(), chapter=currentChapter();
  $("crumbBook").textContent=book.name;
  $("crumbChapter").textContent="Chapter "+chapter.number;
  $("chapterPosition").textContent=`${chapterIndex+1} of ${book.chapters.length}`;
  $("prevChapter").disabled=$("prevBottom").disabled=(bookIndex===0&&chapterIndex===0);
  $("nextChapter").disabled=$("nextBottom").disabled=(bookIndex===bibleData.books.length-1&&chapterIndex===book.chapters.length-1);
  [...chapterGrid.children].forEach((el,i)=>el.classList.toggle("active",i===chapterIndex));
  chapterContent.innerHTML="";
  const h=document.createElement("h1");h.className="chapter-title";h.textContent=book.name+" "+chapter.number;chapterContent.append(h);
  chapter.items.forEach(item=>{
    if(item.type==="heading"){const heading=document.createElement("h2");heading.className="section-heading";heading.textContent=item.text;chapterContent.append(heading);}
    else{const p=document.createElement("p");p.className="verse";const n=document.createElement("sup");n.className="verse-number";n.textContent=item.number;p.append(n,document.createTextNode(item.text));chapterContent.append(p);}
  });
  $("translationName").textContent=bibleData.translation.name;
  bookSelect.value=String(bookIndex);
}
function buildBookOptions(){
  bibleData.books.forEach((b,i)=>{const o=document.createElement("option");o.value=i;o.textContent=b.name;bookSelect.append(o)});
  $("libraryStatus").textContent=`${bibleData.books.length} book${bibleData.books.length===1?"":"s"} · ${bibleData.books.reduce((n,b)=>n+b.chapters.length,0)} chapters`;
}
function buildChapters(){
  chapterGrid.innerHTML="";
  currentBook().chapters.forEach((ch,i)=>{const btn=document.createElement("button");btn.className="chapter-button";btn.textContent=ch.number;btn.addEventListener("click",()=>{chapterIndex=i;render()});chapterGrid.append(btn)});
}
function selectBook(i){bookIndex=Number(i);chapterIndex=0;buildChapters();render()}
function moveChapter(delta){
  const next=chapterIndex+delta;
  if(next>=0&&next<currentBook().chapters.length){chapterIndex=next}
  else if(next<0&&bookIndex>0){bookIndex--;chapterIndex=currentBook().chapters.length-1;buildChapters()}
  else if(next>=currentBook().chapters.length&&bookIndex<bibleData.books.length-1){bookIndex++;chapterIndex=0;buildChapters()}
  render();
}
bookSelect.addEventListener("change",e=>selectBook(e.target.value));
$("prevChapter").addEventListener("click",()=>moveChapter(-1));$("prevBottom").addEventListener("click",()=>moveChapter(-1));
$("nextChapter").addEventListener("click",()=>moveChapter(1));$("nextBottom").addEventListener("click",()=>moveChapter(1));
$("themeToggle").addEventListener("click",()=>document.body.classList.toggle("dark"));
$("searchToggle").addEventListener("click",()=>{$("searchPanel").hidden=!$("searchPanel").hidden;if(!$("searchPanel").hidden)$("searchInput").focus()});
$("closeSearch").addEventListener("click",()=>{$("searchPanel").hidden=true;$("searchInput").value="";$("searchResults").innerHTML=""});
$("searchInput").addEventListener("input",e=>{
  const q=e.target.value.trim().toLocaleLowerCase(), results=$("searchResults");results.innerHTML="";
  if(q.length<2)return;
  let count=0;
  for(let bi=0;bi<bibleData.books.length&&count<100;bi++){
    const b=bibleData.books[bi];
    for(let ci=0;ci<b.chapters.length&&count<100;ci++){
      const ch=b.chapters[ci];
      for(const item of ch.items){
        if(item.text.toLocaleLowerCase().includes(q)){
          const btn=document.createElement("button");btn.className="result";
          const strong=document.createElement("strong");strong.textContent=`${b.name} ${ch.number}${item.type==="verse"?":"+item.number:" · Heading"}`;
          const span=document.createElement("span");span.textContent=item.text;
          btn.append(strong,span);btn.addEventListener("click",()=>{bookIndex=bi;chapterIndex=ci;buildChapters();render();$("searchPanel").hidden=true});
          results.append(btn);count++;if(count>=100)break;
        }
      }
    }
  }
  if(!count){const p=document.createElement("div");p.className="no-results";p.textContent="No matches found.";results.append(p)}
});
fetch("./bible.json").then(r=>{if(!r.ok)throw new Error("Could not load Bible data");return r.json()}).then(data=>{
  bibleData=data;buildBookOptions();buildChapters();render();
}).catch(err=>{chapterContent.innerHTML='<p class="loading">Unable to load Bible data. Please refresh the page.</p>';console.error(err)});
if("serviceWorker" in navigator && location.protocol!=="file:"){window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(console.warn))}
