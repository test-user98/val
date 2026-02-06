(function () {
  const STORAGE_KEY = "val_progress";
  const config = window.VALENTINE_CONFIG || {};
  const trivia = config.trivia || [];
  const truth = config.truth || [];
  const dare = config.dare || [];
  const formspreeId = (config.formspreeFormId || "").trim();

  var state = {
    step: "home",
    triviaIndex: 0,
    answers: { trivia: [], valentine: null, truth: [], dare: [] }
  };

  function loadProgress() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var p = JSON.parse(raw);
      if (p.submitted) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }
      state.step = p.step || "home";
      state.answers = p.answers || state.answers;
      state.triviaIndex = p.triviaIndex != null ? p.triviaIndex : 0;
      if (!state.answers.truth) state.answers.truth = [];
      if (!state.answers.dare) state.answers.dare = [];
    } catch (e) {}
  }

  function saveProgress() {
    state.answers = getAnswersFromDom();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        step: state.step,
        triviaIndex: state.triviaIndex,
        answers: state.answers,
        submitted: false
      }));
    } catch (e) {}
  }

  function getAnswersFromDom() {
    var out = {
      trivia: [],
      valentine: state.answers.valentine,
      truth: [],
      dare: []
    };
    // Trivia: selected option per question (MCQ)
    trivia.forEach(function (_, i) {
      var radio = document.querySelector('#trivia-questions input[name="trivia_' + i + '"]:checked');
      out.trivia[i] = radio ? radio.value : "";
    });
    document.querySelectorAll("#truth-list .truth-answer").forEach(function (el, i) {
      out.truth[i] = el.value || "";
    });
    document.querySelectorAll("#dare-list .dare-answer").forEach(function (el, i) {
      out.dare[i] = el.value || "";
    });
    return out;
  }

  function show(sectionId) {
    restoreAnswersIntoDom();
    saveProgress();
    state.step = sectionId;
    saveProgress();

    document.querySelectorAll(".screen").forEach(function (el) {
      el.classList.remove("active");
    });
    var el = document.getElementById(sectionId);
    if (el) el.classList.add("active");

    restoreAnswersIntoDom();
    if (sectionId === "trivia") updateTriviaSlide();
  }

  function restoreAnswersIntoDom() {
    var a = state.answers;
    // Trivia MCQ
    if (a.trivia) {
      a.trivia.forEach(function (val, i) {
        var radios = document.querySelectorAll('#trivia-questions input[name="trivia_' + i + '"]');
        for (var r = 0; r < radios.length; r++) {
          if (radios[r].value === val) { radios[r].checked = true; break; }
        }
      });
    }
    // Truth
    if (a.truth) {
      document.querySelectorAll("#truth-list .truth-answer").forEach(function (el, i) {
        if (a.truth[i] !== undefined) el.value = a.truth[i];
      });
    }
    // Dare
    if (a.dare) {
      document.querySelectorAll("#dare-list .dare-answer").forEach(function (el, i) {
        if (a.dare[i] !== undefined) el.value = a.dare[i];
      });
    }
  }

  function setAnswer(key, value) {
    state.answers[key] = value;
    saveProgress();
  }

  function onCtaClick(e) {
    var next = e.target.getAttribute("data-next");
    if (next) show(next);
  }

  function onValentineChoice(e) {
    var outcome = e.target.getAttribute("data-outcome");
    setAnswer("valentine", outcome);
    if (outcome === "no") show("valentine-no");
    else show("valentine-yes");
  }

  function onOptClick(e) {
    var next = e.target.getAttribute("data-next");
    if (next) show(next);
  }

  function buildEmailBody() {
    var a = state.answers;
    var lines = ["Valentine answers from Anu / Bubbu", ""];

    lines.push("--- TRIVIA ---");
    trivia.forEach(function (item, i) {
      lines.push("");
      lines.push((i + 1) + ". " + item.q);
      lines.push("Answer: " + (a.trivia && a.trivia[i] ? a.trivia[i] : "(no answer)"));
    });

    lines.push("");
    lines.push("--- VALENTINE ---");
    lines.push("Will you be my Valentine? " + (a.valentine === "yes" ? "Yes" : a.valentine === "no" ? "No (then said yes)" : "(skipped)"));

    lines.push("");
    lines.push("--- TRUTH ---");
    (truth || []).forEach(function (q, i) {
      lines.push("");
      lines.push((i + 1) + ". " + q);
      lines.push("Answer: " + (a.truth && a.truth[i] ? a.truth[i] : "(no answer)"));
    });

    lines.push("");
    lines.push("--- DARE ---");
    (dare || []).forEach(function (d, i) {
      lines.push("");
      lines.push((i + 1) + ". " + d);
      lines.push("Her note: " + (a.dare && a.dare[i] ? a.dare[i] : "(no answer)"));
    });

    lines.push("");
    lines.push("---");
    return lines.join("\n");
  }

  function onSubmitClick() {
    state.answers = getAnswersFromDom();
    saveProgress();

    if (!formspreeId || formspreeId === "YOUR_FORM_ID") {
      alert("Form isn't set up yet — he needs to add his Formspree form ID in the site config. Your answers are saved on this device.");
      return;
    }

    var btn = document.getElementById("submit-answers");
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Sending...";
    }

    var body = JSON.stringify({
      _subject: "Valentine answers from Anu",
      message: buildEmailBody()
    });

    fetch("https://formspree.io/f/" + formspreeId, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body
    })
      .then(function (r) {
        if (r.ok) {
          try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
          show("thanks");
          if (typeof confetti === "function") {
            confetti({ particleCount: 120, spread: 70, origin: { y: 0.7 } });
            setTimeout(function () { confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0 } }); }, 200);
            setTimeout(function () { confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1 } }); }, 400);
          }
        } else {
          throw new Error("Send failed");
        }
      })
      .catch(function () {
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Submit my answers";
        }
        alert("Something went wrong. Check your connection and try again.");
      });
  }

  // Trivia: one question per slide
  var triviaEl = document.getElementById("trivia-questions");
  if (triviaEl) {
    trivia.forEach(function (item, i) {
      var options = item.options || [];
      var memePath = item.meme || "images/trivia/q" + (i + 1) + ".gif";
      var div = document.createElement("div");
      div.className = "trivia-item trivia-slide";
      div.setAttribute("data-index", i);
      var optsHtml = options.map(function (opt) {
        return '<label class="mcq-opt"><input type="radio" name="trivia_' + i + '" value="' + escapeHtml(opt) + '"> <span>' + escapeHtml(opt) + '</span></label>';
      }).join("");
      div.innerHTML =
        '<div class="trivia-q">' + escapeHtml(item.q) + '</div>' +
        '<div class="meme-slot trivia-meme"><img src="' + escapeHtml(memePath) + '" alt="" onerror="this.style.display=\'none\'"/></div>' +
        '<div class="mcq-options">' + optsHtml + '</div>';
      triviaEl.appendChild(div);
    });
  }

  function updateTriviaSlide() {
    var idx = state.triviaIndex;
    var slides = document.querySelectorAll("#trivia-questions .trivia-slide");
    var nextBtn = document.getElementById("trivia-next");
    var progressEl = document.getElementById("trivia-progress");
    slides.forEach(function (s, i) {
      s.classList.toggle("active", i === idx);
    });
    if (nextBtn) {
      nextBtn.textContent = idx >= trivia.length - 1 ? "Done →" : "Next →";
    }
    if (progressEl) {
      progressEl.textContent = (idx + 1) + " / " + trivia.length;
    }
  }

  function onTriviaNext() {
    saveProgress();
    if (state.triviaIndex < trivia.length - 1) {
      state.triviaIndex++;
      saveProgress();
      updateTriviaSlide();
    } else {
      show("valentine-ask");
    }
  }

  // Truth list: question + textarea each
  var truthList = document.getElementById("truth-list");
  if (truthList) {
    truth.forEach(function (t, i) {
      var li = document.createElement("li");
      li.className = "truth-item";
      li.innerHTML = '<div class="td-q">' + escapeHtml(t) + '</div><textarea class="truth-answer" rows="3" placeholder="Your answer..."></textarea>';
      truthList.appendChild(li);
    });
  }

  // Dare list: dare text + optional note field each
  var dareList = document.getElementById("dare-list");
  if (dareList) {
    dare.forEach(function (d, i) {
      var li = document.createElement("li");
      li.className = "dare-item";
      li.innerHTML = '<div class="td-q">' + escapeHtml(d) + '</div><textarea class="dare-answer" rows="2" placeholder="Done? Link? Note? (optional)"></textarea>';
      dareList.appendChild(li);
    });
  }

  // Buttons
  document.querySelectorAll(".cta[data-next]").forEach(function (b) {
    b.addEventListener("click", onCtaClick);
  });
  var triviaNext = document.getElementById("trivia-next");
  if (triviaNext) triviaNext.addEventListener("click", onTriviaNext);
  document.querySelectorAll("#valentine-ask .btn, #valentine-no .btn").forEach(function (b) {
    b.addEventListener("click", onValentineChoice);
  });
  document.querySelectorAll("#one-more .opt").forEach(function (b) {
    b.addEventListener("click", onOptClick);
  });
  var submitBtn = document.getElementById("submit-answers");
  if (submitBtn) submitBtn.addEventListener("click", onSubmitClick);

  function escapeHtml(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  // Floating love bubbles
  var bubbleContainer = document.getElementById("bubbles");
  if (bubbleContainer) {
    var symbols = ["💕", "💗", "💖", "💘", "❤️", "🌸", "💝"];
    var count = 18;
    for (var b = 0; b < count; b++) {
      var el = document.createElement("div");
      el.className = "bubble" + (b % 3 === 0 ? " heart" : "");
      var size = 20 + Math.random() * 28;
      var left = Math.random() * 100;
      var duration = 12 + Math.random() * 14;
      var delay = Math.random() * 8;
      el.style.width = size + "px";
      el.style.height = size + "px";
      el.style.left = left + "%";
      el.style.animationDuration = duration + "s";
      el.style.animationDelay = -delay + "s";
      if (el.classList.contains("heart")) {
        el.textContent = symbols[b % symbols.length];
        el.style.fontSize = (size * 0.9) + "px";
      }
      el.addEventListener("click", function () {
        this.classList.add("pop");
        var t = this;
        setTimeout(function () {
          if (t.parentNode) t.parentNode.removeChild(t);
        }, 400);
      });
      bubbleContainer.appendChild(el);
    }
  }

  // Init: restore progress or start at home
  loadProgress();
  show(state.step);
})();
