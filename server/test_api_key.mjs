import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
console.log('Testing API Key:', apiKey.substring(0, 25) + '...\n');

const openai = new OpenAI({ apiKey });

try {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: "Say 'works'" }],
    max_tokens: 5
  });
  
  console.log('✅ SUCCESS! API Key works!');
  console.log('Response:', response.choices[0].message.content);
  process.exit(0);
  
} catch (error) {
  console.log('❌ FAILED:', error.message);
  console.log('Status:', error.status);
  console.log('Type:', error.type);
  
  if (error.status === 429) {
    console.log('\n⚠️  THIS KEY HAS NO CREDITS!');
  } else if (error.status === 401) {
    console.log('\n⚠️  INVALID API KEY!');
  }
  
  process.exit(1);
}
