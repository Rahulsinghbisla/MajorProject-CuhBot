CODERSGPT : AI CHATBOT BUILT WITH LANGCHAIN, LANGGRAPH, AI-SDK 

# FEATURES 
- MINIMAL UI USING SHADCN AI-ELEMENTS
- AUTHENTICATION (BETTER-AUTH)
- POLAR PAYMENTS INTEGRATION (PRO PLAN)
- MULTI MODEL LIKE (T3.CHAT) (SOME MODELS AVAILABLE FOR PRO MEMBERS ONLY)
- TOOL CALLING (WEATHER, NEWS, ECOMMERECE PRICES - GOOGLE SHOPPING API ...)
- STREAMING
- SHORT TERM MEMORY (CONTEXT COMPACTING with summarization)
- GUARDRAILS 
- CONTEXT SUMMARY
- AUTHENTICATION
- LONG TERM MEMORY
- GENERATIVE UI (ECOMMERCE PRODUCTS CAROUSEL)


## SHADCN AI-ELEMENTS
- https://elements.ai-sdk.dev/

## AUTHENTICATION
- https://www.better-auth.com/docs/basic-usage

## POLAR PAYMENTS INTEGRATION
- https://www.better-auth.com/docs/plugins/polar

## MULTI MODEL
- https://elements.ai-sdk.dev/components/model-selector

## SHORT TERM MEMORY
- https://docs.langchain.com/oss/javascript/langgraph/add-memory#manage-short-term-memory

## LONG TERM MEMORY
- STRUCTURED OUTPUT (for getting structured output from llm is anything to remember in message in a proper format if multple return multiple)
- DEDUPLICATION PROBLEM STATERGY
- https://docs.langchain.com/oss/javascript/langgraph/add-memory#add-long-term-memory

## DISCUSSIONS
- how to handle inner unnessecary streams from inner langchain model call like (during strucuted output, getting summary )
- already tried nostream and langsmith:hidden tags
- tags: ["langsmith:hidden", "nostream"] for now calling openai sdk directly 

- summary node with long term memory required or not ? or use trimming or improve performance
- bad logic of handling muliple models for now
- modified ai-elements/prompt-input and ui/input-group to make prompt input component like chagpt
- remove ai-elements/terminal component



# USAGE BASED PAYMENTS

Step 1: Create a Meter
Go to Products > Meters in the Polar dashboard and create a meter:

Name: e.g. llm_tokens
Filter: name equals llm_tokens (or your event name)
Aggregation: Sum over a metadata property like total_tokens
Step 2: Create a Credits Benefit
Go to Benefits and create a new Credits benefit:

Select your llm_tokens meter
Set the credit amount (e.g. 100,000 tokens for Pro)
Optionally enable "Rollover unused credits" if desired
For subscriptions, credits are automatically granted at the beginning of every billing cycle (monthly).

Step 3: Create Your Monthly Pro Product
Create a recurring (monthly) subscription product:

Set the base price (e.g. $29/month)
Attach the Credits benefit you created
Don't add a metered price if you want credits-only (no overage charges). Add one if you want to charge for overages.
Step 4: Ingest Events (Token Usage)
When your LLM processes tokens, ingest events via the API:

await polar.events.ingest({
  events: [{
    name: "llm_tokens",
    customerId: "cus_...", // or externalCustomerId
    metadata: {
      total_tokens: 77, // tokens consumed
      model: "gpt-4"
    }
  }]
});
Step 5: Check Remaining Balance
Before each LLM call, check the customer's remaining credits using the Customer Meters API:

const meters = await polar.customerMeters.list({
  customerId: "cus_...",
});

// Response includes: consumed_units, credited_units, balance
// balance = credited_units - consumed_units
// e.g. credited: 100, consumed: 25, balance: 75
If balance <= 0, block usage or prompt the customer to upgrade.

Step 6: Enforce Limits in Your App
Important: Polar does not automatically block usage when credits run out. You must implement this check yourself:

const meter = meters.items[0];
if (meter.balance <= 0) {
  return "You've used all your monthly tokens. Please upgrade!";
}
// Otherwise, proceed with LLM call and ingest the event
This is all based on the Credits, Meters, and Credits Benefit documentation.