import { OpenAI } from 'langchain';
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { HNSWLib } from 'langchain/vectorstores/hnswlib';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import {
  Browser,
  Page,
  PlaywrightWebBaseLoader,
} from 'langchain/document_loaders/web/playwright';

export const conversationalChain = async (model: OpenAI, url: string) => {
  /**
   * Loader uses `page.content()`
   * as default evaluate function
   **/
  const loader = new PlaywrightWebBaseLoader(url, {
    launchOptions: {
      headless: true,
    },
    gotoOptions: {
      waitUntil: 'domcontentloaded',
    },
    /** Pass custom evaluate, in this case you get page and browser instances */
    async evaluate(page: Page, browser: Browser) {
      // await page.waitForResponse(
      //   'https://news.ycombinator.com/item?id=34817881',
      // );

      const result = await page
        .locator('[class*="contentstyle__StyledWrapper"]')
        .allTextContents();
      // const result = await page.evaluate(() => document.body.innerHTML);
      console.log(result);
      await browser.close();
      return result[0];
    },
  });
  const docs = await loader.load();
  const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());

  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorStore.asRetriever(),
  );

  return chain;
};
