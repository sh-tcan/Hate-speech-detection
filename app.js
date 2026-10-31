const textBox=document.getElementById('userText');
const count=document.getElementById('charCount');
const analyseButton=document.getElementById('analyseButton');
const clearButton=document.getElementById('clearButton');
const statusLine=document.getElementById('status');
const result=document.getElementById('result');
let modelData=null;

function cleanText(value){
  return value.toLowerCase()
    .replace(/https?:\/\/\S+|www\.\S+/g,'')
    .replace(/@[\p{L}\p{N}_]+/gu,'')
    .replace(/#/g,'')
    .replace(/[^\p{L}\p{N}_\s']/gu,' ')
    .replace(/\s+/g,' ').trim();
}
function tokenise(value){
  // Mirrors CountVectorizer's default token pattern: words with at least 2 characters.
  return value.match(/[\p{L}\p{N}_]{2,}/gu)||[];
}
function predict(value){
  const counts=Object.create(null);
  for(const token of tokenise(cleanText(value))){
    const index=modelData.vocabulary[token];
    if(index!==undefined) counts[index]=(counts[index]||0)+1;
  }
  let node=0;
  while(modelData.children_left[node]!==-1){
    const feature=modelData.feature[node];
    const valueAtFeature=counts[feature]||0;
    node=valueAtFeature<=modelData.threshold[node] ? modelData.children_left[node] : modelData.children_right[node];
  }
  const scores=modelData.values[node];
  let best=0;
  for(let i=1;i<scores.length;i++) if(scores[i]>scores[best]) best=i;
  return Number(modelData.classes[best]);
}
function showResult(category){
  const labels={
    0:{title:'Hate speech detected',description:'The model found patterns associated with hate speech.',badge:'HATE SPEECH',kind:'hate'},
    1:{title:'Offensive language detected',description:'The model found patterns associated with offensive language.',badge:'OFFENSIVE',kind:'offensive'},
    2:{title:'Neither detected',description:'The model classified this text as neither hate speech nor offensive language.',badge:'NEITHER',kind:'neither'}
  };
  const item=labels[category];
  result.className='result '+item.kind;
  document.getElementById('resultTitle').textContent=item.title;
  document.getElementById('resultDescription').textContent=item.description;
  document.getElementById('classBadge').textContent=item.badge;
  result.classList.remove('hidden');
}
textBox.addEventListener('input',()=>{count.textContent=`${textBox.value.length} / 5000 characters`;});
clearButton.addEventListener('click',()=>{textBox.value='';count.textContent='0 / 5000 characters';result.classList.add('hidden');statusLine.textContent='Text cleared. Enter a message to analyse.';textBox.focus();});
analyseButton.addEventListener('click',()=>{
  const value=textBox.value;
  if(!value.trim()){result.classList.add('hidden');statusLine.textContent='Please enter some text before analysing it.';textBox.focus();return;}
  if(!modelData){statusLine.textContent='The model is still loading. Please try again in a moment.';return;}
  const cleaned=cleanText(value);
  if(!cleaned){result.classList.add('hidden');statusLine.textContent='Please enter text containing words that can be analysed.';return;}
  showResult(predict(value));
  statusLine.textContent='Analysis complete. Your original text remains in the input box.';
});
fetch('./model.json').then(response=>{if(!response.ok)throw new Error('Could not load model.json');return response.json();}).then(data=>{modelData=data;statusLine.textContent='AI model loaded. Enter a message to begin.';}).catch(error=>{statusLine.textContent='Could not load the AI model. Check that model.json is uploaded in the repository root.';analyseButton.disabled=true;console.error(error);});
