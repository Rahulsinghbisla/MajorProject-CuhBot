import { graph } from "@/app/api/chat/graph";
import { writeFileSync } from "node:fs";

async function main() {
  // 1. Get the Mermaid graph definition
  // We use drawMermaid() which returns the string representation
  const mermaidSyntax = graph.getGraph().drawMermaid();

  // 2. Save as a .mmd file (can be viewed in VS Code or Mermaid Live Editor)
  const mmdFilePath = "./graph.mmd";
  writeFileSync(mmdFilePath, mermaidSyntax);
  console.log(`Mermaid definition saved to ${mmdFilePath}`);

  // OPTIONAL: If you still want an image and the API is up, 
  // wrap it in a try-catch to prevent the whole script from crashing.
  try {
    const graphStateImage = await graph.getGraph().drawMermaidPng();
    const buffer = Buffer.from(await graphStateImage.arrayBuffer());
    writeFileSync("./graph.png", buffer);
    console.log("PNG successfully saved.");
  } catch (error) {
    console.error("Mermaid.INK API is currently down. Using local text fallback.");
  }
}

main().catch(console.error);