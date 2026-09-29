import Question from '../models/Question.js';

function fallbackQuestions(topic, count=10){
  const bank=[
    {q:`Which statement best describes ${topic}?`,options:['A fundamental concept','A database command','A network protocol','A hardware port'],correctAnswer:0,explanation:`Review the core definition of ${topic}.`},
    {q:`Which approach is commonly used when studying ${topic}?`,options:['Concept → example → practice','Skip concepts','Only memorize answers','Avoid practice'],correctAnswer:0,explanation:'Conceptual understanding followed by practice is useful.'},
    {q:`A good test question on ${topic} should primarily check:`,options:['Understanding','Guessing','Typing speed','Screen size'],correctAnswer:0,explanation:'Assessment should measure understanding of the topic.'}
  ];
  return Array.from({length:count},(_,i)=>({...bank[i%bank.length],topic,difficulty:i%3===0?'easy':i%3===1?'medium':'hard'}));
}

export async function generateQuestions({topic='General',count=10,notes=''}){
  const key=process.env.OPENAI_API_KEY;
  if(!key) return {provider:'demo',questions:fallbackQuestions(topic,Math.min(Number(count)||10,50))};
  const prompt=`Create ${Math.min(Number(count)||10,50)} high-quality multiple-choice questions for ${topic}. Notes: ${notes.slice(0,12000)}. Return ONLY JSON: {"questions":[{"question":"...","options":["...","...","...","..."],"correctAnswer":0,"explanation":"...","difficulty":"easy|medium|hard"}]}`;
  const r=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${key}`},body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-4o-mini',messages:[{role:'system',content:'You create accurate educational MCQs. Return valid JSON only.'},{role:'user',content:prompt}],temperature:.2})});
  if(!r.ok) throw new Error(`AI provider error: ${r.status}`);
  const data=await r.json();
  const text=data.choices?.[0]?.message?.content||'{}';
  const clean=text.replace(/^```json\s*/,'').replace(/\s*```$/,'');
  return {provider:'openai',questions:JSON.parse(clean).questions||[]};
}

export async function saveGeneratedQuestions(userId, payload){
  const result=await generateQuestions(payload);
  const docs=result.questions.map(x=>({text:x.question,options:x.options,correctOption:x.correctAnswer,explanation:x.explanation,topic:payload.topic||'General',difficulty:x.difficulty||'medium',createdBy:userId}));
  const saved=docs.length?await Question.insertMany(docs):[];
  return {...result,questions:saved};
}
