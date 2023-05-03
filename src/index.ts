import { OpenAI } from 'langchain/llms/openai';
// setup dotenv
import dotenv from 'dotenv';
import { conversationalChain } from './conversational';
dotenv.config();

const openAIApiKey = process.env.OPENAI_API_KEY;

async function main(): Promise<void> {
  const model = new OpenAI({ openAIApiKey, modelName: 'gpt-3.5-turbo' });
  const chain = await conversationalChain(
    model,
    'https://www.coindesk.com/business/2023/04/21/ether-erases-all-gains-from-shanghai-rally-as-bitcoin-crypto-prices-fall/',
  );
  const question = "What's the cause of the price drop?";
  const res = await chain.call({
    question,
    chat_history: [],
  });
  console.log(res);
  console.log('===');
}

main().then(
  () => process.exit(),
  err => {
    console.error(err);
    process.exit(-1);
  },
);
