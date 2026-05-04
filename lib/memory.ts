import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";

const checkpointer = PostgresSaver.fromConnString(process.env.DATABASE_URL!);

export async function getCheckpoint() {
  await checkpointer.setup();
  return checkpointer;
}


