export const useAssistantSuggestions = () => {
  const shonacoinSuggestions = [
    "What are contribution types in ShonaCoin?",
    "How do I set up a Financial contribution?",
    "Explain Prime Timeline expectations",
    "What is the Negotiation Adder?",
    "How does outcome sharing work?",
    "Tell me about Marketing contributions",
    "What are Knots in ShonaCoin?",
    "How do I create a timeline?",
    "Explain Smart Rules",
    "What contribution types can I give?",
    "How does AI matching work?",
    "Tell me about Asset contributions",
    "What is a subscription contribution?",
    "How do I track follow-ups?",
    "Explain valuation setup"
  ];

  const getRandomSuggestions = (count: number = 5) => {
    const shuffled = [...shonacoinSuggestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  return {
    shonacoinSuggestions,
    getRandomSuggestions
  };
};
