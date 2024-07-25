// Timer function for 1 minutes
function timer(onTimeUp) {
    let time = 60;
    const interval = setInterval(() => {
        time = time - 1;
        document.querySelector('.timer').textContent = `Time left: ${time} seconds`;
        if (time === 0) {
            clearInterval(interval);
            onTimeUp();
        }
    }, 1000);
    return () => clearInterval(interval); // Return a function to clear the interval
  }
  
  async function fetchQuizQuestions(amount, difficulty) {
    const response = await fetch(`https://opentdb.com/api.php?amount=${amount}&category=17&difficulty=${difficulty}&type=multiple`);
    const data = await response.json();
    return data.results;
  }
  
  async function runQuiz(questions) {
    let score = 0;
  
    const questionElement = document.getElementById('question');
    const choicesElement = document.getElementById('choices');
  
    for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const choices = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);
        
        questionElement.textContent = q.question;
        choicesElement.innerHTML = '';
        
        choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.textContent = choice;
            button.classList.add('choice');
            button.onclick = () => handleAnswer(choice, q.correct_answer);
            choicesElement.appendChild(button);
        });
  
        // Wait for the user to answer
        await new Promise(resolve => {
            window.handleAnswer = (userAnswer, correctAnswer) => {
                if (userAnswer === correctAnswer) {
                    score++;
                    alert("Correct!");
                } else {
                    alert(`Wrong! The correct answer was ${correctAnswer}.`);
                }
                resolve();
            };
        });
    }
  
    return score;
  }
  
  async function startQuiz() {
    const userName = prompt("Are you ready to quiz? What's your name?");
  
    if (userName === null) {
        alert("Quiz canceled.");
        return;
    }
  
    let timerStopped = false;
    const stopTimer = timer(() => {
        timerStopped = true;
        alert("Time's up!");
        console.log("Time's up!");
    });
  
    const audioElement = document.getElementById('quiz-soundtrack');
    audioElement.play();
  
    // Display quiz container
    document.getElementById('overlay').stylesdisplay = 'none';
    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'flex';
  
    const easyQuestions = await fetchQuizQuestions(2, 'easy');
    let score = await runQuiz(easyQuestions);
    if (timerStopped) return;
  
    const mediumQuestions = await fetchQuizQuestions(2, 'medium');
    score += await runQuiz(mediumQuestions);
    if (timerStopped) return;
  
    const hardQuestions = await fetchQuizQuestions(2, 'hard');
    score += await runQuiz(hardQuestions);
    if (timerStopped) return;
  
    stopTimer();
    
    const finalScore = (score / 30) * 100;
    alert(`Thanks for playing, ${userName}! Your final score is ${finalScore}%.`);
  
    if (finalScore === 100) {
        alert("Excellent job! You got all the questions right!");
    } else if (finalScore >= 50) {
        alert("Good job! You got more than half of the questions right.");
    } else {
        alert("Better luck next time. Keep practicing!");
    }
    audioElement.pause();
    audioElement.currentTime = 0;

    // Hide quiz container after quiz ends
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('home-screen').style.display = 'flex';
  }
  
  function showOverlay() {
    document.getElementById('overlay').style.display = 'flex';
  }
  
  function hideOverlay() {
    document.getElementById('overlay').style.display = 'none';
  }

  // audio 
  
    