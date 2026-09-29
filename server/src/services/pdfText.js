export async function extractTextFromUpload(file){
  if(!file) return '';
  const type=file.mimetype||'';
  if(type==='text/plain' || type==='text/markdown') return file.buffer.toString('utf8').slice(0,12000);
  return '';
}
