import { chatbotFAQs } from "@/lib/data";

/**
 * The assistant's answer lookup, shared by the site chat panel (Chatbot.tsx) and the app preview (/mobile).
 * Prototype stand-in for the retrieval (RAG) service: it matches keywords against the FAQ entries in
 * lib/data and returns the answer with the document it came from.
 */

export const fallbackAnswer =
  "I don't have specific information on that topic yet. For detailed assistance, please contact PenCom directly at info@pencom.gov.ng or visit our FAQ page for more comprehensive answers.";

export function findAnswer(input: string): { answer: string; source: string } | null {
  const query = input.toLowerCase();
  for (const faq of chatbotFAQs) {
    for (const keyword of faq.keywords) {
      if (query.includes(keyword.toLowerCase())) {
        return { answer: faq.answer, source: faq.source };
      }
    }
  }
  // Check for partial word matches
  const words = query.split(/\s+/);
  for (const faq of chatbotFAQs) {
    let matchCount = 0;
    for (const keyword of faq.keywords) {
      const kwWords = keyword.toLowerCase().split(/\s+/);
      for (const kw of kwWords) {
        if (words.some((w) => w.includes(kw) || kw.includes(w))) {
          matchCount++;
        }
      }
    }
    if (matchCount >= 2) {
      return { answer: faq.answer, source: faq.source };
    }
  }
  return null;
}

export const suggestedPrompts = [
  "What is the Contributory Pension Scheme?",
  "How do I open an RSA?",
  "How can I transfer my RSA?",
  "What is Pension Clearance Certificate?",
  "How do I access my pension?",
  "What is Personal Pension Plan?",
];

