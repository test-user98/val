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
    truthOrDareOrder: "truth-first",
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
      state.truthOrDareOrder = p.truthOrDareOrder || "truth-first";
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
        truthOrDareOrder: state.truthOrDareOrder,
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
    if (sectionId === "truth-section") updateTruthSectionButton();
    if (sectionId === "dare-section") updateDareSectionButtons();
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
    if (a.dare) {
      document.querySelectorAll("#dare-list .dare-answer").forEach(function (el, i) {
        if (a.dare[i] !== undefined) el.value = a.dare[i];
      });
    }
  }

  function validateTruth() {
    var list = document.querySelectorAll("#truth-list .truth-answer");
    for (var i = 0; i < list.length; i++) {
      if (!list[i].value.trim()) return false;
    }
    return true;
  }

  function validateDare() {
    var list = document.querySelectorAll("#dare-list .dare-answer");
    for (var i = 0; i < list.length; i++) {
      if (!list[i].value.trim()) return false;
    }
    return true;
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

  function onTruthDareChoice(e) {
    var order = e.target.getAttribute("data-order");
    state.truthOrDareOrder = order;
    saveProgress();
    if (order === "truth-first") show("truth-section");
    else show("dare-section");
  }

  function updateTruthSectionButton() {
    var btn = document.getElementById("truth-continue-btn");
    if (!btn) return;
    btn.textContent = state.truthOrDareOrder === "truth-first" ? "Continue to Dare →" : "Submit my answers";
  }

  function updateDareSectionButtons() {
    var contBtn = document.getElementById("dare-continue-btn");
    var subBtn = document.getElementById("submit-answers");
    if (state.truthOrDareOrder === "truth-first") {
      if (contBtn) contBtn.style.display = "none";
      if (subBtn) subBtn.style.display = "";
    } else {
      if (contBtn) contBtn.style.display = "";
      if (subBtn) subBtn.style.display = "none";
    }
  }

  function onTruthContinue() {
    state.answers = getAnswersFromDom();
    if (!validateTruth()) {
      alert("Please answer all Truth questions before continuing.");
      return;
    }
    saveProgress();
    if (state.truthOrDareOrder === "truth-first") {
      show("dare-section");
    } else {
      onSubmitClick();
    }
  }

  function onDareContinue() {
    state.answers = getAnswersFromDom();
    if (!validateDare()) {
      alert("Please fill in something for every Dare before continuing.");
      return;
    }
    saveProgress();
    show("truth-section");
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
    if (!validateTruth()) {
      alert("Please answer all Truth questions before submitting.");
      return;
    }
    if (!validateDare()) {
      alert("Please fill in something for every Dare before submitting.");
      return;
    }
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
        '<div class="mcq-options">' + optsHtml + '</div>' +
        '<div class="trivia-option-reaction meme-slot" style="display:none"><img src="" alt="" onerror="this.style.display=\'none\'"/></div>';
      triviaEl.appendChild(div);
      var inputs = div.querySelectorAll('input[type="radio"]');
      for (var r = 0; r < inputs.length; r++) {
        inputs[r].addEventListener("change", function (idx, it) {
          return function () {
            onTriviaOptionChange(idx, it);
          };
        }(i, item));
      }
    });
  }

  function getSelectedTriviaOption(index) {
    var radio = document.querySelector('#trivia-questions input[name="trivia_' + index + '"]:checked');
    return radio ? radio.value : "";
  }

  function canProceedTrivia(index) {
    var item = trivia[index];
    if (!item || !item.requiredToProceed) return true;
    var sel = getSelectedTriviaOption(index);
    var allowed = item.requiredToProceed;
    if (Array.isArray(allowed)) return allowed.indexOf(sel) !== -1;
    return sel === allowed;
  }

  function onTriviaOptionChange(index, item) {
    var slide = document.querySelector('#trivia-questions .trivia-slide[data-index="' + index + '"]');
    if (!slide) return;
    var reactionDiv = slide.querySelector(".trivia-option-reaction");
    var reactionImg = reactionDiv ? reactionDiv.querySelector("img") : null;
    var sel = getSelectedTriviaOption(index);
    if (item.optionImages && item.optionImages[sel] && reactionDiv && reactionImg) {
      reactionImg.src = item.optionImages[sel];
      reactionImg.style.display = "";
      reactionDiv.style.display = "block";
    } else if (reactionDiv) {
      reactionDiv.style.display = "none";
    }
    updateTriviaNextButton();
  }

  function updateTriviaNextButton() {
    var nextBtn = document.getElementById("trivia-next");
    if (!nextBtn) return;
    var canGo = canProceedTrivia(state.triviaIndex);
    nextBtn.disabled = !canGo;
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
      updateTriviaNextButton();
    }
    if (progressEl) {
      progressEl.textContent = (idx + 1) + " / " + trivia.length;
    }
    var item = trivia[idx];
    if (item && item.optionImages) {
      onTriviaOptionChange(idx, item);
    }
  }

  function onTriviaNext() {
    var item = trivia[state.triviaIndex];
    if (item && item.requiredToProceed) {
      if (!canProceedTrivia(state.triviaIndex)) {
        alert("Pick the right option first. 😏");
        return;
      }
    }
    saveProgress();
    if (state.triviaIndex < trivia.length - 1) {
      state.triviaIndex++;
      saveProgress();
      updateTriviaSlide();
    } else {
      if (typeof confetti === "function") {
        confetti({ particleCount: 100, spread: 60, origin: { y: 0.6 } });
        setTimeout(function () { confetti({ particleCount: 60, angle: 60, spread: 50, origin: { x: 0.2 } }); }, 150);
        setTimeout(function () { confetti({ particleCount: 60, angle: 120, spread: 50, origin: { x: 0.8 } }); }, 300);
      }
      show("valentine-ask");
    }
  }

  // Truth list: question + textarea each
  var truthList = document.getElementById("truth-list");
  if (truthList) {
    truth.forEach(function (t, i) {
      var li = document.createElement("li");
      li.className = "truth-item";
      li.innerHTML = '<div class="td-q">' + escapeHtml(t) + '</div><textarea class="truth-answer" rows="3" placeholder="Your answer (required)" required></textarea>';
      truthList.appendChild(li);
    });
  }

  // Dare list: dare text + optional note field each
  var dareList = document.getElementById("dare-list");
  if (dareList) {
    dare.forEach(function (d, i) {
      var li = document.createElement("li");
      li.className = "dare-item";
      li.innerHTML = '<div class="td-q">' + escapeHtml(d) + '</div><textarea class="dare-answer" rows="2" placeholder="Your answer (required)" required></textarea>';
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
  document.querySelectorAll(".truth-dare-choice").forEach(function (b) {
    b.addEventListener("click", onTruthDareChoice);
  });
  var truthContBtn = document.getElementById("truth-continue-btn");
  if (truthContBtn) truthContBtn.addEventListener("click", onTruthContinue);
  var dareContBtn = document.getElementById("dare-continue-btn");
  if (dareContBtn) dareContBtn.addEventListener("click", onDareContinue);
  var submitBtn = document.getElementById("submit-answers");
  if (submitBtn) submitBtn.addEventListener("click", onSubmitClick);

  function escapeHtml(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  // Floating love hearts + blossoms
  var bubbleContainer = document.getElementById("bubbles");
  if (bubbleContainer) {
    var hearts = ["💕", "💗", "💖", "💘", "❤️", "💝", "🩷"];
    var blossoms = ["🌸", "🌺", "🌷", "💐", "🌼", "🌻", "🪷"];
    var symbols = hearts.concat(blossoms);
    var count = 28;
    for (var b = 0; b < count; b++) {
      var el = document.createElement("div");
      var isEmoji = b % 2 === 0 || b % 3 === 0;
      el.className = "bubble" + (isEmoji ? " heart" : "");
      var size = 18 + Math.random() * 32;
      var left = Math.random() * 100;
      var duration = 14 + Math.random() * 12;
      var delay = Math.random() * 10;
      el.style.width = size + "px";
      el.style.height = size + "px";
      el.style.left = left + "%";
      el.style.animationDuration = duration + "s";
      el.style.animationDelay = -delay + "s";
      if (isEmoji) {
        el.textContent = symbols[b % symbols.length];
        el.style.fontSize = (size * 0.85) + "px";
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
