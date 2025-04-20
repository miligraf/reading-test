let questions = [];
let currentQuestion = 0;
let correctAnswers = 0;
let userAnswers = [];

const container = document.getElementById("test-container");
const results = document.getElementById("results");
const scoreSummary = document.getElementById("score-summary");
const feedbackList = document.getElementById("question-feedback");

fetch("questions.json")
  .then(res => res.json())
  .then(data => {
    questions = data;
    showQuestion(currentQuestion);
  });

function showQuestion(index) {
  const q = questions[index];
  container.innerHTML = "";

  const section = document.createElement("div");
  section.className = "question";

  // Title
  const title = document.createElement("h2");
  title.textContent = `Question ${index + 1} / ${questions.length}`;
  section.appendChild(title);

  // Passage, poem, or facts
  if (q.passage) {
    const passage = document.createElement("p");
    passage.innerHTML = q.passage.replace(/\n/g, "<br>");
    section.appendChild(passage);
  }

  if (q.poem) {
    const poem = document.createElement("pre");
    poem.textContent = q.poem;
    section.appendChild(poem);
  }

  if (q.facts) {
    const factsTitle = document.createElement("strong");
    factsTitle.textContent = "Cat Facts";
    section.appendChild(factsTitle);
    const list = document.createElement("ul");
    q.facts.forEach(f => {
      const li = document.createElement("li");
      li.textContent = f;
      list.appendChild(li);
    });
    section.appendChild(list);
  }

  // Image (like skunk diagram)
  if (q.image) {
    const img = document.createElement("img");
    img.src = q.image;
    img.alt = "diagram";
    img.style.maxWidth = "300px";
    section.appendChild(img);
  }

  // Prompt
  const prompt = document.createElement("p");
  prompt.innerHTML = `<strong>${q.prompt}</strong>`;
  section.appendChild(prompt);

  // Venn Diagram placeholder (Question 6)
  if (q.vennDiagram) {
    const info = document.createElement("p");
    info.innerHTML = `<em>(Venn diagram interaction not implemented yet)</em>`;
    section.appendChild(info);
    // You could insert drag-and-drop logic here in the future
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.onclick = () => handleAnswer(null); // we skip scoring for now
    section.appendChild(nextBtn);
    container.appendChild(section);
    return;
  }

  // Multiple choice answers
  const answerBlock = document.createElement("div");
  answerBlock.className = "answers";

  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.innerHTML = `<span>${i + 1}</span>${opt}`;
    btn.onclick = () => handleAnswer(i);
    answerBlock.appendChild(btn);
  });

  section.appendChild(answerBlock);
  container.appendChild(section);
}

function handleAnswer(selected) {
  const q = questions[currentQuestion];
  const correct = selected === q.answerIndex;
  userAnswers.push({
    question: currentQuestion + 1,
    selected,
    correct,
    correctAnswer: q.options?.[q.answerIndex] || null,
    selectedAnswer: selected != null ? q.options?.[selected] : "Skipped"
  });
  if (correct) correctAnswers++;

  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion(currentQuestion);
  } else {
    showResults();
  }
}

function showResults() {
  container.classList.add("hidden");
  results.classList.remove("hidden");

  const percent = Math.round((correctAnswers / questions.length) * 100);
  scoreSummary.textContent = `You got ${correctAnswers} out of ${questions.length} correct (${percent}%)`;

  userAnswers.forEach((entry, i) => {
    const li = document.createElement("li");
    li.textContent = `Q${entry.question}: Your answer: "${entry.selectedAnswer}" — ${entry.correct ? "Correct" : "Wrong (Correct: " + entry.correctAnswer + ")"}`;
    li.style.color = entry.correct ? "green" : "red";
    feedbackList.appendChild(li);
  });
}

function restartTest() {
  location.reload();
}
