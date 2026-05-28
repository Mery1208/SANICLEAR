import fs from 'fs';


// Parse .env.local manually since dotenv might not be installed
const envContent = fs.readFileSync('.env.local', 'utf8');
const match = envContent.match(/VITE_GEMINI_API_KEY=\"?([^\r\n\"]+)\"?/);
if (match) {
  const key = match[1];
  fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + key)
    .then(r => r.json())
    .then(j => {
      console.log("AVAILABLE MODELS:");
      if (j.models) {
        j.models.forEach(m => console.log(m.name));
      } else {
        console.log(j);
      }
    })
    .catch(e => console.error(e));
} else {
  console.log("No API key found in .env.local");
}
