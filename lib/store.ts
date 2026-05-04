import { OpenAIEmbeddings } from "@langchain/openai";
import { PostgresStore } from "@langchain/langgraph-checkpoint-postgres/store";

const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-small" });

const store = PostgresStore.fromConnString(process.env.DATABASE_URL!, {
  index: {
    "dims": 1536,
    "embed": embeddings,
  },
});

export async function getStore() {
  await store.setup();
  return store;
}
