
import './App.css';
import { useState } from 'react'; //State를 구현 하게 해주는 React 기본 라이브러리

// 기본적으로 함수는 대문자 시작, prams는 props 이라고 부른다.
function Article(props){
  return <article>
    <h2>{props.title}</h2> 
    {props.body}
  </article>
}
// prop.title -> 변화하는 내용을 가지고 올 수 있게 해줌  속성의 title 값을 가져온다.
function Header(props){
  return <header>
    <h1><a href="/" onClick={(event)=>{
      event.preventDefault();
      props.onChangeMode();
    }}>{props.title}</a></h1>
  </header>
// (event)=>{} == function(event){}
// event.preventDefault(); 기본속성의 이벤트를 제거한다.
// props.onChangeMode(); props의 State 값을 가져온다
}
function Nav(props){
  const lis = []
  for(let i=0; i<props.topics.length; i++){
    let t = props.topics[i];
    lis.push(<li key={t.id}>
      <a id={t.id} href={'/read/'+t.id} onClick={event=>{
        event.preventDefault();
        props.onChangeMode(Number(event.target.id));
      }}>{t.title}</a>
    </li>)
  }
  return <nav>
    <ol>
      {lis}
    </ol>
  </nav>
}
//각 target의 id를 읽어와서 매치시켜서 해당하는 타이틀과 내용을 불러옴

function Create(props){
 //p tag 감싸는 방법 Cttl+Shift+p > Emment : Wrap with Abbreviaition 
  return <article>
    <h2>Create</h2>
    <form onSubmit={event=>{
      event.preventDefault();
      const title =  event.target.title.value;
      const body = event.target.body.value;
      props.onCreate(title,body);
    }}>
      <p><input type="text" name="title" placeholder="title"/></p>
      <p><textarea name="body" placeholder="body"></textarea></p>
      <p><input type="submit" value="Create"/></p>
    </form>
  </article>

}
function Update(props){
  const [title,setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return <article>
  <h2>Update</h2>
  <form onSubmit={event=>{
    event.preventDefault();
    const title =  event.target.title.value;
    const body = event.target.body.value;
    props.onUpdate(title,body); 
  }}>
    <p><input type="text" name="title" placeholder="title" value={title} onChange={event=>{
      setTitle(event.target.value)


    }} /></p>
    <p><textarea name="body" placeholder="body" value={body} onChange={event=>{
      setBody(event.target.value)


    }}></textarea></p>
    <p><input type="submit" value="Update"/></p>
  </form>
</article>
}




function App() {
  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4);
  //State 기본설정
  const[topics, setTopics] = useState([
    {id:1, title:'html', body:'html is ...'},
    {id:2, title:'css', body:'css is ...'},
    {id:3, title:'javascript', body:'javascript is ...'}
  ]);

  //content mode -----------------------------
  let content = null;
  let contextControl = null;
  if(mode === 'WELCOME'){
    content = <Article title="Welcome" body="Hello, WEB"></Article>
  } //모드가 WELCOME 이면 Hello Web 출력
  else if(mode === 'READ'){
    let title, body = null;
    for(let i=0; i<topics.length; i++)  {
      console.log(topics[i].id, id)
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      } // 모드가 READ 면 각title과 바디를 출력
      
    }content = <Article title={title} body={body}></Article> 
    contextControl =<>
    <li><a href={'/update/'+id} onClick={event=>{
      event.preventDefault();
      setMode('UPDATE');
    }}>Update </a></li>
     <li><input type="button" value="Delete" onClick={()=>{
      const newTopics = []
      for(let i= 0; i<topics.length; i++){
        if(topics[i].id !== id){
          newTopics.push(topics[i]);
        }
      }
      setTopics(newTopics);
      setMode('WELCOME');
     }}/></li>

    </>
  }

else if(mode ==='CREATE'){
  content = <Create onCreate={(_title, _body)=>{
    const newTopic = {id:nextId, title:_title, body:_body}
    // const [value, setValue] = useState();
    // useState의 props는 PRIMITIVE-> 원시 (string, number, boolean, null) 혹은 Object (object, array) 형태가 있고 
    // object 형태의 state를 반환하려면 값을 복제하여 사용하여야한다 newValue={...value} -> newValue 복사본을 변경
    // setValue(newValue) 복제본 데이터 변경 새로운 newValue 복사본을 변경해야 component가 변경된다.
    const newTopics =[...topics]
    newTopics.push(newTopic);
    setTopics(newTopics); //기존 컴포넌트와 비교하여 상이하면 렌더링을 다시 해준다.
    //상세페이지로 이동
    setMode('READ');
    setId(nextId);
    setNextId(nextId+1);
 }}></Create>
}

else if(mode==='UPDATE'){
  let title, body = null;
    for(let i=0; i<topics.length; i++)  {
      console.log(topics[i].id, id)
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      } 
    }
  content = <Update title={title} body={body} onUpdate={(title,body)=>{
    const newTopics =[...topics]
    const updatedTopic={id:id,title:title,body:body}
    for (let i=0; i<newTopics.length; i++){
      if (newTopics[i].id === id){
          newTopics[i] = updatedTopic;
          break;
      }
    }
    setTopics(newTopics);
    setMode('READ');
  }}></Update>
}
//content mode -------------------------


// APP() Return 
return(
  <div>
  <Header title="WEB" onChangeMode={()=>{
    setMode('WELCOME');
  }}></Header>
  <Nav topics={topics} onChangeMode={(_id)=>{
    setMode('READ');
    setId(_id);
  }}></Nav>
  {content}
  <ul>
  <li>
    <a href="/create" onClick={(event)=>{
    event.preventDefault();
    setMode('CREATE');

  }}>Create</a></li>
  {contextControl}


  </ul>
  </div>
  
  );

}



export default App;
