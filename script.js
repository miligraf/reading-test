let questions = [
    {
      passage: "Desi has a new puppy. The puppy likes to bark and run fast. The puppy is small, but she will get bigger.",
      prompt: "What word tells how Desi's puppy looks?",
      options: ["run", "bark", "small"],
      answerIndex: 2
    },
    {
      passage: "<strong>Up a Tree</strong><br>The cat sits under a tree.<br>A bird lands in the tree.<br>The cat runs up the tree to catch the bird.<br>Now the cat is stuck.",
      prompt: "Pick the picture that shows what happened at the end of the story.",
      options: [
        "<img src='images/cat1.png' alt='Cat looking up at bird' />",
        "<img src='images/cat2.png' alt='Cat stuck in tree' />",
        "<img src='images/cat3.png' alt='Cat climbing tree' />",
        "<img src='images/cat4.png' alt='Cat lying on ground' />"
      ],
      answerIndex: 1
    },
    {
      passage: "<strong>Skunks</strong><br>Skunks are small animals.<br>Skunks live outside.<br>They eat plants and animals.<br>Skunk spray smells bad.<br><img src='images/skunk_diagram.png' alt='Skunk with labels' style='max-width:300px;'>",
      prompt: "Pick the sentence that tells something you learned from the illustration that is not in the text.",
      options: [
        "Skunks eat plants.",
        "Skunks live outside.",
        "Skunks have short legs.",
        "Skunks have smelly spray."
      ],
      answerIndex: 2
    },
    {
      passage: "<strong>Trees</strong><br>We cut down trees.<br>We make paper from trees.<br>Trees help clean the air.<br>Some trees give us food to eat.",
      prompt: "Pick the sentence that tells what the author thinks about trees.",
      options: [
        "Trees are tall.",
        "Trees are strong.",
        "Trees are useful.",
        "Trees are beautiful."
      ],
      answerIndex: 2
    },
    {
      passage: "<strong>Walking</strong><br><pre>We walked down the street,\nwatching our feet.\n\nWe saw a man named Ted who said,\n\"Watch the street, not your feet.\"</pre>",
      prompt: "Pick the number of stanzas.",
      options: ["1", "2", "4", "5"],
      answerIndex: 1
    },
    {
      passage: "<strong>Birds</strong><br>Birds use their feathered wings to fly.<br>They build nests and lay eggs.<br><br><strong>Bats</strong><br>Bats fly at night to hunt for food.<br>They have fur.<br>Some bats hang in trees.<br><br><em>(Venn Diagram Interaction Not Implemented)</em>",
      prompt: "Move each detail to the correct part of the Venn Diagram to show how birds and bats are alike and different.",
      options: ["lay eggs", "fly", "hang in trees", "have fur"],
      answerIndex: null
    },
    {
      passage: "<strong>Cat Facts</strong><ul><li>Cats can have short or long fur.</li><li>Cats walk quietly.</li><li>Cats can jump from high places.</li><li>Cats are active at night.</li></ul>",
      prompt: "Pick the sentence that tells how cats look.",
      options: [
        "Cats can have short or long fur.",
        "Cats walk quietly.",
        "Cats can jump from high places.",
        "Cats are active at night."
      ],
      answerIndex: 0
    }
  ];
  
  let currentQuestion = 0;
  let correctAnswers = 0;
  let userAnswers = [];
  
  const container = document.getElementById("test-container");
  const results = document.getElementById("results");
  const scoreSummary = document.getElementById("score-summary");
  const feedbackList = document.getElementById("question-feedback");
  const progressDisplay = document.getElementById("question-progress");
  
  showQuestion(currentQuestion);
  
  function showQuestion(index) {
    const q = questions[index];
    container.classList.remove("hidden");
    results.classList.add("hidden");
    container.innerHTML = "";
  
    const section = document.createElement("div");
    section.className = "question";
  
    const title = document.createElement("h2");
    title.textContent = `Question ${index + 1}`;
    section.appendChild(title);
  
    if (q.passage) {
      const passage = document.createElement("p");
      passage.innerHTML = q.passage;
      section.appendChild(passage);
    }
  
    const prompt = document.createElement("p");
    prompt.innerHTML = `<strong>${q.prompt}</strong>`;
    section.appendChild(prompt);
  
    const answerBlock = document.createElement("div");
    answerBlock.className = "answers";
  
    if (q.answerIndex !== null) {
      q.options.forEach((opt, i) => {
        const btn = document.createElement("button");
        btn.innerHTML = `<span>${i + 1}</span>${opt}`;
        btn.onclick = () => handleAnswer(i);
        answerBlock.appendChild(btn);
      });
    } else {
      const skipBtn = document.createElement("button");
      skipBtn.innerHTML = "Next";
      skipBtn.onclick = () => handleAnswer(null);
      answerBlock.appendChild(skipBtn);
    }
  
    section.appendChild(answerBlock);
    container.appendChild(section);
  
    progressDisplay.textContent = `${index + 1}/${questions.length}`;
  }
  
  function handleAnswer(selected) {
    const q = questions[currentQuestion];
    const correct = selected === q.answerIndex;
    userAnswers.push({
      question: currentQuestion + 1,
      selected,
      correct,
      correctAnswer: q.options?.[q.answerIndex],
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
  
    userAnswers.forEach((entry) => {
      const li = document.createElement("li");
      li.textContent = `Q${entry.question}: Your answer: "${entry.selectedAnswer}" — ${entry.correct ? "Correct" : "Wrong (Correct: " + entry.correctAnswer + ")"}`;
      li.style.color = entry.correct ? "green" : "red";
      feedbackList.appendChild(li);
    });
  }
  
  function restartTest() {
    location.reload();
  }
  