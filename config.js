// ========== EASY CONFIG: add questions, truths, dares, and meme paths ==========

window.VALENTINE_CONFIG = {
  // Nicknames for her (used in the copy)
  nicknames: ["Babe", "Pookiee", "my love", "my babe"],

  // Formspree: create a form at https://formspree.io → get your form ID → paste below.
  // You'll get her answers by email when she clicks "Submit my answers".
  formspreeFormId: "mykdgorr",

  // Trivia: MCQs. Change questions/options here.
  // Each item: q (question), options (array of strings), meme (optional).
  // optionImages (optional): show an image when she picks that option, e.g. { "All day every day": "images/trivia/react.gif" }
  // requiredToProceed (optional): she can only click Next when she picks this option (or one of these). e.g. "All day every day" or ["Option A", "Option B"]
  trivia: [
    {
      q: "How does your partner like to express affection on a perfect day?",
      options: ["✨ A mix of everything", "🌹 Romantic gestures", "🎁 Thoughtful surprises or gifts", "🤗 Cuddles & closeness"],
      meme: "images/trivia/q1.gif",
      optionImages: { "✨ A mix of everything": "images/trivia/p5.gif", "🌹 Romantic gestures": "images/trivia/p1.gif", "🎁 Thoughtful surprises or gifts": "images/trivia/p2.gif", "🤗 Cuddles & closeness": "images/trivia/p3.gif"},
      requiredToProceed: "✨ A mix of everything"
    },
    {
      q: "What are you thinking of gifting him?",
      options: ["A hug", "Something spicy", "A trip", "His favourite food", "Myself (obviously)", "Surprise me"],
      meme: "images/trivia/q2.gif",
      optionImages: { "A hug": "images/trivia/p21.gif", "Something spicy": "images/trivia/p22.gif", "A trip": "images/trivia/p23.webp", "His favourite food": "images/trivia/p24.gif", "Myself (obviously)": "images/trivia/p7.gif", "Surprise me": "images/trivia/p50.webp"},

    },
    {
      q: "Where will you take your bae with your FTE salary?",
      options: ["Maldives", "Dinner every week", "Road trip", "Staycation", "Wherever he wants", "Nowhere, he pays"],
      meme: "images/trivia/q3.gif",
      optionImages: { "Maldives": "images/trivia/p26.gif", "Dinner every week": "images/trivia/p27.webp", "Road trip": "images/trivia/p28.gif", "Staycation": "images/trivia/p29.gif", "Wherever he wants": "images/trivia/p51.gif", "Nowhere, he pays": "images/trivia/p8.gif"},
    },
    {
      q: "Kitna dahej milega?",
      options: [ "Priceless (I'm the dahej)", "Bohot zyada", "Jo bhi mile share karenge", "Tum kya do ge?"],
      meme: "images/trivia/q4.gif",
      optionImages: { "Bohot zyada": "images/trivia/p41.gif", "Priceless (I'm the dahej)": "images/trivia/p9.gif", "Jo bhi mile share karenge": "images/trivia/p10.gif", "Tum kya do ge?": "images/trivia/p11.gif"},
      requiredToProceed: "Bohot zyada"
    }
  ],

  truth: [
    "What's your favourite thing about my personality?",
    "Tell me why you love me.",
    "What's something I do that annoys you?",
    "Is there anything I can improve in the bedroom? Be specific.",
    "What's your most messed-up fantasy about me? Chup chaap soch ke btana.",
    "What's my ugliest face angle?"
  ],

  dare: [
    "Take off all your clothes and send me a snap right now.",
    "Send your favorite picture or memory of me.",
    "Send the picture or memory of me that hits you the hardest.",
    "Share the moment or image that makes you smile because of me.."
  ]
};
