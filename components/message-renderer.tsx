import { ToolName } from "@/app/api/chat/tools";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageBranch,
  MessageBranchContent,
  MessageBranchNext,
  MessageBranchPage,
  MessageBranchPrevious,
  MessageBranchSelector,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";

import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";
import { UIMessage } from "ai";
import { CopyIcon, RefreshCcwIcon } from "lucide-react";
import { SentimentMeter, SentimentMeterProps } from "./gen-ui/sentiment-meter";
import { NewsCard, NewsCardProps } from "./gen-ui/news-card";
import { CryptoPriceCard, CryptoPriceCardProps } from "./gen-ui/crypto-card";
import { CryptoChart, CryptoChartProps } from "./gen-ui/crypto-chart";
import { Spinner } from "./ui/spinner";

export function MessageRenderer({
  messages,
  regenerate,
}: {
  messages: UIMessage[];
  regenerate: () => void;
}) {
  return (
    <>
      {messages.map((message, index) => (
        <MessageBranch defaultBranch={0} key={`${message.id}${index}`}>
          <MessageBranchContent>
            <Message from={message.role} key={`${message.id}-${message.id}`}>
              <div>
                {/* AI-MSG-SOURCE */}
                {message.role === "assistant" &&
                  message.parts.filter((part) => part.type === "source-url")
                    .length > 0 && (
                    <Sources>
                      <SourcesTrigger
                        count={
                          message.parts.filter(
                            (part) => part.type === "source-url",
                          ).length
                        }
                      />
                      {message.parts
                        .filter((part) => part.type === "source-url")
                        .map((part, i) => (
                          <SourcesContent key={`${message.id}-${i}`}>
                            <Source
                              key={`${message.id}-${i}`}
                              href={part.url}
                              title={part.url}
                            />
                          </SourcesContent>
                        ))}
                    </Sources>
                  )}

                {message.parts.map((part, i) => {
                  if (part.type == "text") {
                    return (
                      <Message key={`${message.id}-${i}`} from={message.role}>
                        <MessageContent>
                          <MessageResponse
                            className={`text-[1.05rem] leading-relaxed ${
                              message.role === "user"
                                ? // USER: Purple gradient bubble matching UniBot send button
                                  "bg-primary px-5 py-3 rounded-2xl"
                                : // ASSISTANT: Clean white card with lavender border
                                  "px-5 py-3 rounded-2xl rounded-bl-sm border"
                            }`}
                          >
                            {part.text}
                          </MessageResponse>
                        </MessageContent>
                        {message.role === "assistant" &&
                          i === messages.length - 1 && (
                            <MessageActions>
                              <MessageAction
                                onClick={() => regenerate()}
                                label="Retry"
                              >
                                <RefreshCcwIcon className="size-4  transition-colors" />
                              </MessageAction>
                              <MessageAction
                                onClick={() =>
                                  navigator.clipboard.writeText(part.text)
                                }
                                label="Copy"
                              >
                                <CopyIcon className="size-4 transition-colors" />
                              </MessageAction>
                            </MessageActions>
                          )}
                      </Message>
                    );
                  }

                  if (part.type == "reasoning") {
                    return (
                      <Reasoning
                        key={`${message.id}-${i}`}
                        className="w-full"
                        isStreaming={
                          status === "streaming" &&
                          i === message.parts.length - 1 &&
                          message.id === messages.at(-1)?.id
                        }
                      >
                        <ReasoningTrigger />
                        <ReasoningContent>{part.text}</ReasoningContent>
                      </Reasoning>
                    );
                  }

                  if (part.type === "dynamic-tool") {
                    switch (part.toolName as ToolName) {
                      case "displayCryptoSentiment":
                        if (part.state === "input-streaming") {
                          return (
                            <div key={`${part.toolCallId}-${i}-loading`} className="text-sm text-[#9B93D8] animate-pulse py-2">
                              Loading Chart...
                            </div>
                          );
                        }
                        if (part.state === "output-available") {
                          const toolOutput = (part.output as any).kwargs.content;
                          return (
                            <div key={`${part.toolCallId}-${i}-output`}>
                              <SentimentMeter
                                {...(JSON.parse(toolOutput) as SentimentMeterProps)}
                              />
                            </div>
                          );
                        }
                        if (part.state === "output-error") {
                          return (
                            <div key={`${part.toolCallId}-${i}-error`} className="text-sm text-red-400 py-2">
                              Error In Stocks: {part.errorText}
                            </div>
                          );
                        } else {
                          return (
                            <div key={`${part.toolCallId}-${i}-other`}>
                              SOME OTHER PART STATE
                            </div>
                          );
                        }

                      case "displayNews":
                        if (part.state === "input-streaming") {
                          return (
                            <div key={`${part.toolCallId}-${i}-loading`} className="text-sm text-[#9B93D8] animate-pulse py-2">
                              Loading News...
                            </div>
                          );
                        }
                        if (part.state === "output-available") {
                          const toolOutput = (part.output as any).kwargs.content;
                          return (
                            <div key={`${part.toolCallId}-${i}-output`} className="my-4 max-w-lg">
                              <NewsCard {...(JSON.parse(toolOutput) as NewsCardProps)} />
                            </div>
                          );
                        }
                        if (part.state === "output-error") {
                          return (
                            <div key={`${part.toolCallId}-${i}-error`} className="text-sm text-red-400 py-2">
                              Error In News: {part.errorText}
                            </div>
                          );
                        } else {
                          return (
                            <div key={`${part.toolCallId}-${i}-other`}>
                              SOME OTHER PART STATE
                            </div>
                          );
                        }

                      case "displayCryptoPrice":
                        if (part.state === "input-streaming") {
                          return (
                            <div key={`${part.toolCallId}-${i}-loading`} className="text-sm text-[#9B93D8] animate-pulse py-2">
                              Loading Crypto Price...
                            </div>
                          );
                        }
                        if (part.state === "output-available") {
                          const toolOutput = (part.output as any).kwargs.content;
                          return (
                            <div key={`${part.toolCallId}-${i}-output`} className="my-4 max-w-lg">
                              <CryptoPriceCard
                                {...(JSON.parse(toolOutput) as CryptoPriceCardProps)}
                              />
                            </div>
                          );
                        }
                        if (part.state === "output-error") {
                          return (
                            <div key={`${part.toolCallId}-${i}-error`} className="text-sm text-red-400 py-2">
                              Error In News: {part.errorText}
                            </div>
                          );
                        } else {
                          return (
                            <div key={`${part.toolCallId}-${i}-other`}>
                              SOME OTHER PART STATE
                            </div>
                          );
                        }

                      case "displayCryptoChart":
                        if (part.state === "input-streaming") {
                          return (
                            <div key={`${part.toolCallId}-${i}-loading`} className="text-sm text-[#9B93D8] animate-pulse py-2">
                              Loading Crypto Price...
                            </div>
                          );
                        }
                        if (part.state === "output-available") {
                          const toolOutput = (part.output as any).kwargs.content;
                          return (
                            <div key={`${part.toolCallId}-${i}-output`} className="my-4 max-w-lg">
                              <CryptoChart
                                {...(JSON.parse(toolOutput) as CryptoChartProps)}
                              />
                            </div>
                          );
                        }
                        if (part.state === "output-error") {
                          return (
                            <div key={`${part.toolCallId}-${i}-error`} className="text-sm text-red-400 py-2">
                              Error In News: {part.errorText}
                            </div>
                          );
                        } else {
                          return (
                            <div key={`${part.toolCallId}-${i}-other`}>
                              SOME OTHER PART STATE
                            </div>
                          );
                        }

                      case "displayWeather": {
                        if (part.state === "input-streaming") {
                          return (
                            <div key={`${part.toolCallId}-${i}-loading`} className="text-sm text-[#9B93D8] animate-pulse py-2">
                              Checking forecast...
                            </div>
                          );
                        }
                        if (part.state === "output-available") {
                          const toolOutput = (part.output as any).kwargs.content;
                          return (
                            <div key={`${part.toolCallId}-${i}-output`}>
                              <WeatherCard
                                {...(JSON.parse(toolOutput) as WeatherCardProps)}
                              />
                            </div>
                          );
                        }
                        if (part.state === "output-error") {
                          return (
                            <div key={`${part.toolCallId}-${i}-error`} className="text-sm text-red-400 py-2">
                              Error: {part.errorText}
                            </div>
                          );
                        }
                        return null;
                      }

                      case "displayProducts": {
                        if (part.state === "input-streaming") {
                          return (
                            <div key={`${part.toolCallId}-${i}-loading`} className="text-sm text-[#9B93D8] animate-pulse py-2">
                              Searching store...
                            </div>
                          );
                        }
                        if (part.state === "output-available") {
                          const toolOutput = (part.output as any).kwargs.content;
                          return (
                            <div key={`${part.toolCallId}-${i}-output`}>
                              <ProductCarousel
                                {...(JSON.parse(toolOutput) as ProductCarouselProps)}
                              />
                            </div>
                          );
                        }
                        if (part.state === "output-error") {
                          return (
                            <div key={`${part.toolCallId}-${i}-error`} className="text-sm text-red-400 py-2">
                              Error: {part.errorText}
                            </div>
                          );
                        }
                        return null;
                      }

                      default:
                        return null;
                    }
                  }
                })}
              </div>
            </Message>
          </MessageBranchContent>
          <MessageBranchSelector>
            <MessageBranchPrevious />
            <MessageBranchPage />
            <MessageBranchNext />
          </MessageBranchSelector>
        </MessageBranch>
      ))}
    </>
  );
}

export function MessageLoading() {
  return (
    <Message from="assistant">
      <MessageContent>
        <div className="flex gap-x-2 items-center">
          <Spinner />
          <span className="text-sm text-[#9B93D8] animate-pulse">
            Thinking...
          </span>
        </div>
      </MessageContent>
    </Message>
  );
}

import { motion } from "motion/react";
import {
  ProductCarousel,
  ProductCarouselProps,
} from "./gen-ui/product-carousel";
import { WeatherCard, WeatherCardProps } from "./gen-ui/weather-card";

export const GeneratingSpinner = () => {
  return (
    <div className="py-2">
      <motion.div
        className="h-3 w-3 rounded-full bg-[#5E50C8]"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};