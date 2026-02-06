// ========== EASY CONFIG: add questions, truths, dares, and meme paths ==========

window.VALENTINE_CONFIG = {
  // Nicknames for her (used in the copy)
  nicknames: ["Anu", "Bubbu", "my love"],

  // Formspree: create a form at https://formspree.io → get your form ID → paste below.
  // You'll get her answers by email when she clicks "Submit my answers".
  formspreeFormId: "mykdgorr",

  // Trivia: MCQs. Change questions/options here.
  // Each item: q (question), options (array of strings), meme (optional).
  // optionImages (optional): show an image when she picks that option, e.g. { "All day every day": "images/trivia/react.gif" }
  // requiredToProceed (optional): she can only click Next when she picks this option (or one of these). e.g. "All day every day" or ["Option A", "Option B"]
  trivia: [
    {
      q: "How many times a day does your bae want to have sex?",
      options: ["1", "2–3", "5", "7", "10+", "All day every day"],
      meme: "images/trivia/q1.gif",
      optionImages: { "All day every day": "images/trivia/p5.gif", "2–3": "images/trivia/-1.gif", "5": "images/trivia/p2.gif", "7": "images/trivia/p3.gif", "10+": "images/trivia/p4.gif", "1": "images/trivia/p6.gif" },
      requiredToProceed: "All day every day"
    },
    {
      q: "What are you thinking of gifting him?",
      options: ["A hug", "Something spicy", "A trip", "His favourite food", "Myself (obviously)", "Surprise me"],
      meme: "images/trivia/q2.gif",
      optionImages: { "Myself (obviously)": "images/trivia/p7.gif"},

    },
    {
      q: "Where will you take your bae with your FTE salary?",
      options: ["Maldives", "Dinner every week", "Road trip", "Staycation", "Wherever he wants", "Nowhere, he pays"],
      meme: "images/trivia/q3.gif",
      optionImages: { "Nowhere, he pays": "images/trivia/p8.gif"},
    },
    {
      q: "Kitna dahej milega?",
      options: [ "Priceless (I'm the dahej)", "Bohot zyada", "Jo bhi mile share karenge", "Tum kya do ge?"],
      meme: "images/trivia/q4.gif",
      optionImages: { "Priceless (I'm the dahej)": "images/trivia/p9.gif", "Jo bhi mile share karenge": "images/trivia/p10.gif", "Tum kya do ge?": "images/trivia/p11.gif"},
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
    "Draw Chetan and whatsapp it to me.",
    "Send me a pic of Chetan you love the most.",
    "Send me a pic of me you love and adore the most."
  ]
};
