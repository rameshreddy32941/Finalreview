export type Assessment = {
  id: string;
  organ: string;
  title: string;
  description: string;
  questions: { question: string; options: { text: string; score: number }[] }[];
};

export const assessments: Assessment[] = [
  // ============ EYE (10) ============
  {
    id: 'eye-vision',
    organ: 'eye',
    title: 'Visual Acuity Check',
    description: 'Assess your ability to see clearly at various distances.',
    questions: [
      { question: 'How clearly can you read text on a screen at arm\'s length?', options: [
        { text: 'Very clearly', score: 10 }, { text: 'Mostly clear', score: 7 }, { text: 'Slightly blurry', score: 4 }, { text: 'Very blurry', score: 1 } ] },
      { question: 'Can you read distant signs (e.g., road signs) clearly?', options: [
        { text: 'Always clear', score: 10 }, { text: 'Usually clear', score: 7 }, { text: 'Sometimes blurry', score: 4 }, { text: 'Often blurry', score: 1 } ] },
      { question: 'How often do you experience blurred vision?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you squint to see clearly?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'How would you rate your overall vision quality?', options: [
        { text: 'Excellent', score: 10 }, { text: 'Good', score: 7 }, { text: 'Fair', score: 4 }, { text: 'Poor', score: 1 } ] },
    ],
  },
  {
    id: 'eye-color',
    organ: 'eye',
    title: 'Color Vision Test',
    description: 'Evaluate your ability to distinguish between colors.',
    questions: [
      { question: 'Can you easily distinguish between red and green traffic lights?', options: [
        { text: 'Always', score: 10 }, { text: 'Usually', score: 7 }, { text: 'Sometimes struggle', score: 4 }, { text: 'Often struggle', score: 1 } ] },
      { question: 'Do you have difficulty matching clothing colors?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Can you identify numbers in color-patterned images?', options: [
        { text: 'Always', score: 10 }, { text: 'Usually', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Rarely', score: 1 } ] },
      { question: 'Do others point out colors you didn\'t notice?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'How confident are you in color-related tasks?', options: [
        { text: 'Very confident', score: 10 }, { text: 'Confident', score: 7 }, { text: 'Somewhat', score: 4 }, { text: 'Not confident', score: 1 } ] },
    ],
  },
  {
    id: 'eye-strain',
    organ: 'eye',
    title: 'Digital Eye Strain Assessment',
    description: 'Measure the impact of screen time on your eye comfort.',
    questions: [
      { question: 'How many hours per day do you spend on screens?', options: [
        { text: 'Under 2 hours', score: 10 }, { text: '2-4 hours', score: 7 }, { text: '4-8 hours', score: 4 }, { text: '8+ hours', score: 1 } ] },
      { question: 'How often do you take breaks using the 20-20-20 rule?', options: [
        { text: 'Always', score: 10 }, { text: 'Often', score: 7 }, { text: 'Rarely', score: 4 }, { text: 'Never', score: 1 } ] },
      { question: 'Do your eyes feel tired or strained after screen use?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Always', score: 1 } ] },
      { question: 'Do you experience headaches after prolonged screen use?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you use blue light filters or screen glasses?', options: [
        { text: 'Always', score: 10 }, { text: 'Often', score: 7 }, { text: 'Rarely', score: 4 }, { text: 'Never', score: 1 } ] },
    ],
  },
  {
    id: 'eye-dryness',
    organ: 'eye',
    title: 'Dry Eye Assessment',
    description: 'Check for symptoms of dry eye syndrome.',
    questions: [
      { question: 'How often do your eyes feel dry or gritty?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you use eye drops for comfort?', options: [
        { text: 'Never needed', score: 10 }, { text: 'Occasionally', score: 7 }, { text: 'Daily', score: 4 }, { text: 'Multiple times daily', score: 1 } ] },
      { question: 'Do your eyes water excessively as a reaction?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you feel burning or stinging in your eyes?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Are your eyes sensitive to wind or air conditioning?', options: [
        { text: 'Not at all', score: 10 }, { text: 'Slightly', score: 7 }, { text: 'Moderately', score: 4 }, { text: 'Very sensitive', score: 1 } ] },
    ],
  },
  {
    id: 'eye-night',
    organ: 'eye',
    title: 'Night Vision Assessment',
    description: 'Evaluate how well you see in low-light conditions.',
    questions: [
      { question: 'How well do you see while driving at night?', options: [
        { text: 'Very well', score: 10 }, { text: 'Well', score: 7 }, { text: 'With difficulty', score: 4 }, { text: 'Poorly, I avoid it', score: 1 } ] },
      { question: 'How long does it take for your eyes to adjust to darkness?', options: [
        { text: 'Quickly', score: 10 }, { text: 'Moderately', score: 7 }, { text: 'Slowly', score: 4 }, { text: 'Very slowly', score: 1 } ] },
      { question: 'Do you see halos around lights at night?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you have difficulty seeing in dimly lit restaurants?', options: [
        { text: 'No difficulty', score: 10 }, { text: 'Slight', score: 7 }, { text: 'Moderate', score: 4 }, { text: 'Significant', score: 1 } ] },
      { question: 'Do you need extra light for reading at night?', options: [
        { text: 'No', score: 10 }, { text: 'Sometimes', score: 7 }, { text: 'Often', score: 4 }, { text: 'Always', score: 1 } ] },
    ],
  },
  {
    id: 'eye-peripheral',
    organ: 'eye',
    title: 'Peripheral Vision Check',
    description: 'Assess your side (peripheral) vision awareness.',
    questions: [
      { question: 'Do you notice movement to your sides without turning your head?', options: [
        { text: 'Always', score: 10 }, { text: 'Usually', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Rarely', score: 1 } ] },
      { question: 'Have you bumped into objects to your side?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you have trouble with sports requiring peripheral awareness?', options: [
        { text: 'No trouble', score: 10 }, { text: 'Slight', score: 7 }, { text: 'Moderate', score: 4 }, { text: 'Significant', score: 1 } ] },
      { question: 'Do you feel your side vision is as clear as before?', options: [
        { text: 'Yes', score: 10 }, { text: 'Mostly', score: 7 }, { text: 'Somewhat', score: 4 }, { text: 'No', score: 1 } ] },
      { question: 'Has anyone noticed you missing objects to your sides?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
    ],
  },
  {
    id: 'eye-floaters',
    organ: 'eye',
    title: 'Floaters & Flashes Assessment',
    description: 'Check for visual disturbances like floaters or flashes.',
    questions: [
      { question: 'Do you see spots or threads drifting in your vision?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you see flashes of light in the dark?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Have floaters increased recently?', options: [
        { text: 'No', score: 10 }, { text: 'Slightly', score: 7 }, { text: 'Moderately', score: 4 }, { text: 'Significantly', score: 1 } ] },
      { question: 'Do floaters interfere with reading or daily tasks?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Have you noticed a shadow or curtain over your vision?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Yes, recently', score: 1 } ] },
    ],
  },
  {
    id: 'eye-health',
    organ: 'eye',
    title: 'Eye Health & Hygiene',
    description: 'Evaluate your eye care habits and hygiene.',
    questions: [
      { question: 'How often do you get comprehensive eye exams?', options: [
        { text: 'Yearly', score: 10 }, { text: 'Every 2 years', score: 7 }, { text: 'Rarely', score: 4 }, { text: 'Never', score: 1 } ] },
      { question: 'Do you wear UV-protective sunglasses outdoors?', options: [
        { text: 'Always', score: 10 }, { text: 'Often', score: 7 }, { text: 'Rarely', score: 4 }, { text: 'Never', score: 1 } ] },
      { question: 'Do you wash your hands before touching your eyes?', options: [
        { text: 'Always', score: 10 }, { text: 'Usually', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Rarely', score: 1 } ] },
      { question: 'Do you remove eye makeup before sleeping?', options: [
        { text: 'Always', score: 10 }, { text: 'Usually', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Rarely', score: 1 } ] },
      { question: 'Do you eat foods rich in vitamin A and omega-3s?', options: [
        { text: 'Daily', score: 10 }, { text: 'Often', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Rarely', score: 1 } ] },
    ],
  },
  {
    id: 'eye-fatigue',
    organ: 'eye',
    title: 'Eye Fatigue Assessment',
    description: 'Check how easily your eyes become tired.',
    questions: [
      { question: 'Do your eyes feel tired after reading for 30 minutes?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Always', score: 1 } ] },
      { question: 'Do you close your eyes to rest them during the day?', options: [
        { text: 'Never needed', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you experience eye twitching?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do your eyes feel heavy by end of day?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Always', score: 1 } ] },
      { question: 'Do you get enough sleep (7-8 hours)?', options: [
        { text: 'Always', score: 10 }, { text: 'Usually', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Rarely', score: 1 } ] },
    ],
  },
  {
    id: 'eye-focus',
    organ: 'eye',
    title: 'Focus & Coordination',
    description: 'Assess your eyes\' ability to focus and work together.',
    questions: [
      { question: 'Can you switch focus between near and far objects quickly?', options: [
        { text: 'Easily', score: 10 }, { text: 'Usually', score: 7 }, { text: 'With effort', score: 4 }, { text: 'With difficulty', score: 1 } ] },
      { question: 'Do you see double vision occasionally?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do your eyes feel aligned and coordinated?', options: [
        { text: 'Yes', score: 10 }, { text: 'Mostly', score: 7 }, { text: 'Somewhat', score: 4 }, { text: 'No', score: 1 } ] },
      { question: 'Can you maintain focus on a close object for 2 minutes?', options: [
        { text: 'Easily', score: 10 }, { text: 'With slight effort', score: 7 }, { text: 'With difficulty', score: 4 }, { text: 'Cannot', score: 1 } ] },
      { question: 'Do you have difficulty with depth perception?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
    ],
  },

  // ============ EAR (10) ============
  {
    id: 'ear-hearing',
    organ: 'ear',
    title: 'Hearing Acuity Test',
    description: 'Evaluate your ability to hear sounds at various volumes.',
    questions: [
      { question: 'Can you hear conversations clearly in a quiet room?', options: [
        { text: 'Always', score: 10 }, { text: 'Usually', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Rarely', score: 1 } ] },
      { question: 'Do you struggle to hear in noisy environments?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you ask people to repeat themselves?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Can you hear the TV at a normal volume others use?', options: [
        { text: 'Yes', score: 10 }, { text: 'Usually', score: 7 }, { text: 'Need it louder', score: 4 }, { text: 'Much louder', score: 1 } ] },
      { question: 'Do you hear high-pitched sounds (birds, alarms)?', options: [
        { text: 'Always', score: 10 }, { text: 'Usually', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Rarely', score: 1 } ] },
    ],
  },
  {
    id: 'ear-tinnitus',
    organ: 'ear',
    title: 'Tinnitus Assessment',
    description: 'Check for ringing or buzzing sounds in your ears.',
    questions: [
      { question: 'Do you hear ringing in your ears?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you hear buzzing or hissing sounds?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Does tinnitus affect your sleep?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Does tinnitus worsen in quiet environments?', options: [
        { text: 'Not noticeable', score: 10 }, { text: 'Slightly', score: 7 }, { text: 'Moderately', score: 4 }, { text: 'Significantly', score: 1 } ] },
      { question: 'Have you been exposed to loud noise recently?', options: [
        { text: 'No', score: 10 }, { text: 'Once', score: 7 }, { text: 'A few times', score: 4 }, { text: 'Regularly', score: 1 } ] },
    ],
  },
  {
    id: 'ear-noise',
    organ: 'ear',
    title: 'Noise Exposure Assessment',
    description: 'Evaluate your exposure to loud sounds.',
    questions: [
      { question: 'Do you listen to music through headphones at high volume?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you work in a noisy environment?', options: [
        { text: 'No', score: 10 }, { text: 'Occasionally', score: 7 }, { text: 'Regularly', score: 4 }, { text: 'Daily', score: 1 } ] },
      { question: 'Do you attend concerts or loud events?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you use ear protection in loud settings?', options: [
        { text: 'Always', score: 10 }, { text: 'Often', score: 7 }, { text: 'Rarely', score: 4 }, { text: 'Never', score: 1 } ] },
      { question: 'Do your ears ring after loud exposure?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
    ],
  },
  {
    id: 'ear-balance',
    organ: 'ear',
    title: 'Balance & Dizziness Check',
    description: 'Assess your balance and any dizziness episodes.',
    questions: [
      { question: 'Do you experience dizziness or vertigo?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you feel unsteady when walking?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Does changing head position cause dizziness?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Can you stand on one foot for 30 seconds?', options: [
        { text: 'Easily', score: 10 }, { text: 'With effort', score: 7 }, { text: 'Briefly', score: 4 }, { text: 'Cannot', score: 1 } ] },
      { question: 'Have you fallen due to balance issues?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
    ],
  },
  {
    id: 'ear-infection',
    organ: 'ear',
    title: 'Ear Infection Risk',
    description: 'Check for signs and risk of ear infections.',
    questions: [
      { question: 'Do you experience ear pain or pressure?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you have fluid drainage from your ear?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you get frequent colds or sinus infections?', options: [
        { text: 'Rarely', score: 10 }, { text: 'Occasionally', score: 7 }, { text: 'Often', score: 4 }, { text: 'Very often', score: 1 } ] },
      { question: 'Do you swim frequently (risk of swimmer\'s ear)?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Have you had ear infections in the past year?', options: [
        { text: 'None', score: 10 }, { text: 'Once', score: 7 }, { text: '2-3 times', score: 4 }, { text: '4+ times', score: 1 } ] },
    ],
  },
  {
    id: 'ear-wax',
    organ: 'ear',
    title: 'Earwax & Hygiene',
    description: 'Evaluate earwax management and hygiene habits.',
    questions: [
      { question: 'Do you use cotton swabs inside your ear canal?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you feel your ears are blocked?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you experience muffled hearing?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you clean only the outer ear with a cloth?', options: [
        { text: 'Always', score: 10 }, { text: 'Usually', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Never', score: 1 } ] },
      { question: 'Have you had earwax removed professionally?', options: [
        { text: 'Never needed', score: 10 }, { text: 'Once', score: 7 }, { text: 'A few times', score: 4 }, { text: 'Regularly', score: 1 } ] },
    ],
  },
  {
    id: 'ear-social',
    organ: 'ear',
    title: 'Social Hearing Impact',
    description: 'Assess how hearing affects your social life.',
    questions: [
      { question: 'Do you feel left out in group conversations?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you avoid social situations due to hearing?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Can you hear on the phone clearly?', options: [
        { text: 'Always', score: 10 }, { text: 'Usually', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Rarely', score: 1 } ] },
      { question: 'Do you lip-read to help understand speech?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do family members mention your hearing?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
    ],
  },
  {
    id: 'ear-pain',
    organ: 'ear',
    title: 'Ear Pain Assessment',
    description: 'Check for ear pain and related symptoms.',
    questions: [
      { question: 'Do you currently have ear pain?', options: [
        { text: 'No', score: 10 }, { text: 'Mild', score: 7 }, { text: 'Moderate', score: 4 }, { text: 'Severe', score: 1 } ] },
      { question: 'Does the pain worsen when chewing?', options: [
        { text: 'No', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you feel pressure or fullness in your ear?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Is the pain in one or both ears?', options: [
        { text: 'No pain', score: 10 }, { text: 'One, mild', score: 7 }, { text: 'One, severe', score: 4 }, { text: 'Both', score: 1 } ] },
      { question: 'Does the pain affect your sleep?', options: [
        { text: 'No', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
    ],
  },
  {
    id: 'ear-protection',
    organ: 'ear',
    title: 'Hearing Protection Habits',
    description: 'Evaluate your hearing protection practices.',
    questions: [
      { question: 'Do you use earplugs at concerts or loud events?', options: [
        { text: 'Always', score: 10 }, { text: 'Often', score: 7 }, { text: 'Rarely', score: 4 }, { text: 'Never', score: 1 } ] },
      { question: 'Do you use hearing protection at work (if noisy)?', options: [
        { text: 'Always', score: 10 }, { text: 'Often', score: 7 }, { text: 'Rarely', score: 4 }, { text: 'Never', score: 1 } ] },
      { question: 'Do you follow the 60/60 rule for headphones?', options: [
        { text: 'Always', score: 10 }, { text: 'Often', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Never heard of it', score: 1 } ] },
      { question: 'Do you take listening breaks?', options: [
        { text: 'Always', score: 10 }, { text: 'Often', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Rarely', score: 1 } ] },
      { question: 'Have you had a hearing test in the last 2 years?', options: [
        { text: 'Yes', score: 10 }, { text: 'Within 3 years', score: 7 }, { text: 'Over 5 years', score: 4 }, { text: 'Never', score: 1 } ] },
    ],
  },
  {
    id: 'ear-eustachian',
    organ: 'ear',
    title: 'Eustachian Tube Function',
    description: 'Assess pressure regulation and Eustachian tube health.',
    questions: [
      { question: 'Do your ears pop or feel pressure during flights?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Always', score: 1 } ] },
      { question: 'Do you feel ear pressure with altitude changes?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Can you relieve ear pressure by yawning or swallowing?', options: [
        { text: 'Always', score: 10 }, { text: 'Usually', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Rarely', score: 1 } ] },
      { question: 'Do you have allergies that affect your ears?', options: [
        { text: 'No', score: 10 }, { text: 'Mildly', score: 7 }, { text: 'Moderately', score: 4 }, { text: 'Severely', score: 1 } ] },
      { question: 'Do you experience ear fullness after colds?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
    ],
  },

  // ============ NOSE (10) ============
  {
    id: 'nose-smell',
    organ: 'nose',
    title: 'Smell Identification Test',
    description: 'Evaluate your ability to detect and identify odors.',
    questions: [
      { question: 'Can you detect common scents (coffee, flowers, food)?', options: [
        { text: 'Always', score: 10 }, { text: 'Usually', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Rarely', score: 1 } ] },
      { question: 'Can you identify different odors correctly?', options: [
        { text: 'Always', score: 10 }, { text: 'Usually', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Rarely', score: 1 } ] },
      { question: 'Has your sense of smell decreased recently?', options: [
        { text: 'No', score: 10 }, { text: 'Slightly', score: 7 }, { text: 'Moderately', score: 4 }, { text: 'Significantly', score: 1 } ] },
      { question: 'Can you smell smoke or gas for safety?', options: [
        { text: 'Always', score: 10 }, { text: 'Usually', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Rarely', score: 1 } ] },
      { question: 'Do you notice food tastes bland due to smell loss?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
    ],
  },
  {
    id: 'nose-allergy',
    organ: 'nose',
    title: 'Allergic Rhinitis Assessment',
    description: 'Check for allergic reactions affecting your nose.',
    questions: [
      { question: 'Do you sneeze frequently around dust or pollen?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Does your nose run or get congested seasonally?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you have itchy, watery eyes with nasal symptoms?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you take allergy medications regularly?', options: [
        { text: 'Never needed', score: 10 }, { text: 'Occasionally', score: 7 }, { text: 'Seasonally', score: 4 }, { text: 'Daily', score: 1 } ] },
      { question: 'Do your symptoms interfere with daily activities?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
    ],
  },
  {
    id: 'nose-sinus',
    organ: 'nose',
    title: 'Sinus Health Check',
    description: 'Assess sinus pressure, pain, and congestion.',
    questions: [
      { question: 'Do you experience facial pressure or pain?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you have frequent sinus headaches?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you have thick nasal discharge?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do your symptoms last more than 10 days?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you feel pain when bending forward?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
    ],
  },
  {
    id: 'nose-congestion',
    organ: 'nose',
    title: 'Nasal Congestion Assessment',
    description: 'Evaluate chronic and acute nasal congestion.',
    questions: [
      { question: 'How often is your nose blocked or congested?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Always', score: 1 } ] },
      { question: 'Does congestion affect your sleep?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you breathe through your mouth often?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you use decongestant sprays regularly?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Daily', score: 1 } ] },
      { question: 'Is congestion worse at certain times?', options: [
        { text: 'No pattern', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Seasonally', score: 4 }, { text: 'Daily', score: 1 } ] },
    ],
  },
  {
    id: 'nose-bleed',
    organ: 'nose',
    title: 'Nosebleed Assessment',
    description: 'Check frequency and severity of nosebleeds.',
    questions: [
      { question: 'How often do you get nosebleeds?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Monthly', score: 4 }, { text: 'Weekly', score: 1 } ] },
      { question: 'Are your nosebleeds heavy or hard to stop?', options: [
        { text: 'N/A', score: 10 }, { text: 'Mild', score: 7 }, { text: 'Moderate', score: 4 }, { text: 'Severe', score: 1 } ] },
      { question: 'Do you live in a dry climate?', options: [
        { text: 'No', score: 10 }, { text: 'Slightly dry', score: 7 }, { text: 'Moderately', score: 4 }, { text: 'Very dry', score: 1 } ] },
      { question: 'Do you pick or blow your nose frequently?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you take blood-thinning medications?', options: [
        { text: 'No', score: 10 }, { text: 'Occasionally', score: 7 }, { text: 'Yes, prescribed', score: 4 }, { text: 'Yes, regularly', score: 1 } ] },
    ],
  },
  {
    id: 'nose-breathing',
    organ: 'nose',
    title: 'Nasal Breathing Quality',
    description: 'Evaluate how well you breathe through your nose.',
    questions: [
      { question: 'Can you breathe comfortably through both nostrils?', options: [
        { text: 'Always', score: 10 }, { text: 'Usually', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Rarely', score: 1 } ] },
      { question: 'Does one nostril feel more blocked than the other?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Always', score: 1 } ] },
      { question: 'Does nasal breathing improve with exercise?', options: [
        { text: 'Yes', score: 10 }, { text: 'Usually', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'No', score: 1 } ] },
      { question: 'Do you snore or have sleep issues from congestion?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Can you smell while breathing through your nose?', options: [
        { text: 'Always', score: 10 }, { text: 'Usually', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Rarely', score: 1 } ] },
    ],
  },
  {
    id: 'nose-hygiene',
    organ: 'nose',
    title: 'Nasal Hygiene Assessment',
    description: 'Evaluate your nasal care and hygiene habits.',
    questions: [
      { question: 'Do you use saline nasal rinses or sprays?', options: [
        { text: 'Never needed', score: 10 }, { text: 'Occasionally', score: 7 }, { text: 'Daily', score: 4 }, { text: 'Multiple times', score: 1 } ] },
      { question: 'Do you avoid inserting objects into your nose?', options: [
        { text: 'Always', score: 10 }, { text: 'Usually', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you use a humidifier in dry conditions?', options: [
        { text: 'Always', score: 10 }, { text: 'Often', score: 7 }, { text: 'Rarely', score: 4 }, { text: 'Never', score: 1 } ] },
      { question: 'Do you stay hydrated to keep mucus thin?', options: [
        { text: 'Always', score: 10 }, { text: 'Usually', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Rarely', score: 1 } ] },
      { question: 'Do you protect your nose from irritants?', options: [
        { text: 'Always', score: 10 }, { text: 'Often', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Never', score: 1 } ] },
    ],
  },
  {
    id: 'nose-environment',
    organ: 'nose',
    title: 'Environmental Irritant Check',
    description: 'Assess exposure to nasal irritants.',
    questions: [
      { question: 'Are you exposed to dust or pollution regularly?', options: [
        { text: 'No', score: 10 }, { text: 'Occasionally', score: 7 }, { text: 'Often', score: 4 }, { text: 'Daily', score: 1 } ] },
      { question: 'Are you around smoke or strong chemicals?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you use air purifiers at home?', options: [
        { text: 'Always', score: 10 }, { text: 'Often', score: 7 }, { text: 'Rarely', score: 4 }, { text: 'Never', score: 1 } ] },
      { question: 'Do you have pets that trigger symptoms?', options: [
        { text: 'No', score: 10 }, { text: 'Mildly', score: 7 }, { text: 'Moderately', score: 4 }, { text: 'Severely', score: 1 } ] },
      { question: 'Do your symptoms worsen at work or home?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
    ],
  },
  {
    id: 'nose-taste',
    organ: 'nose',
    title: 'Smell & Taste Connection',
    description: 'Assess how smell affects your taste perception.',
    questions: [
      { question: 'Can you taste food fully when your nose is clear?', options: [
        { text: 'Always', score: 10 }, { text: 'Usually', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Rarely', score: 1 } ] },
      { question: 'Does food taste bland when congested?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Always', score: 1 } ] },
      { question: 'Can you distinguish between similar flavors?', options: [
        { text: 'Always', score: 10 }, { text: 'Usually', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Rarely', score: 1 } ] },
      { question: 'Has your taste preference changed recently?', options: [
        { text: 'No', score: 10 }, { text: 'Slightly', score: 7 }, { text: 'Moderately', score: 4 }, { text: 'Significantly', score: 1 } ] },
      { question: 'Do you enjoy eating as much as before?', options: [
        { text: 'Yes', score: 10 }, { text: 'Mostly', score: 7 }, { text: 'Somewhat', score: 4 }, { text: 'No', score: 1 } ] },
    ],
  },
  {
    id: 'nose-polyps',
    organ: 'nose',
    title: 'Nasal Polyp & Structure Check',
    description: 'Check for signs of nasal polyps or structural issues.',
    questions: [
      { question: 'Do you have persistent nasal blockage for 12+ weeks?', options: [
        { text: 'No', score: 10 }, { text: 'Occasionally', score: 7 }, { text: 'Often', score: 4 }, { text: 'Always', score: 1 } ] },
      { question: 'Do you have reduced sense of smell chronically?', options: [
        { text: 'No', score: 10 }, { text: 'Slightly', score: 7 }, { text: 'Moderately', score: 4 }, { text: 'Significantly', score: 1 } ] },
      { question: 'Do you feel something blocking your nasal passage?', options: [
        { text: 'No', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Have you been diagnosed with nasal polyps?', options: [
        { text: 'No', score: 10 }, { text: 'Previously removed', score: 7 }, { text: 'Current, mild', score: 4 }, { text: 'Current, severe', score: 1 } ] },
      { question: 'Do you have chronic postnasal drip?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
    ],
  },

  // ============ TONGUE (10) ============
  {
    id: 'tongue-taste',
    organ: 'tongue',
    title: 'Taste Perception Test',
    description: 'Evaluate your ability to detect all five basic tastes.',
    questions: [
      { question: 'Can you taste sweet, sour, salty, bitter, and umami?', options: [
        { text: 'All clearly', score: 10 }, { text: 'Most clearly', score: 7 }, { text: 'Some reduced', score: 4 }, { text: 'Many reduced', score: 1 } ] },
      { question: 'Has your sense of taste diminished recently?', options: [
        { text: 'No', score: 10 }, { text: 'Slightly', score: 7 }, { text: 'Moderately', score: 4 }, { text: 'Significantly', score: 1 } ] },
      { question: 'Can you distinguish between similar flavors?', options: [
        { text: 'Always', score: 10 }, { text: 'Usually', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Rarely', score: 1 } ] },
      { question: 'Do foods taste metallic or off?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you enjoy food as much as you used to?', options: [
        { text: 'Yes', score: 10 }, { text: 'Mostly', score: 7 }, { text: 'Somewhat', score: 4 }, { text: 'No', score: 1 } ] },
    ],
  },
  {
    id: 'tongue-oral',
    organ: 'tongue',
    title: 'Oral Health Assessment',
    description: 'Evaluate your overall oral and tongue health.',
    questions: [
      { question: 'Do you brush your teeth twice daily?', options: [
        { text: 'Always', score: 10 }, { text: 'Usually', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Rarely', score: 1 } ] },
      { question: 'Do you clean your tongue regularly?', options: [
        { text: 'Daily', score: 10 }, { text: 'Often', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Never', score: 1 } ] },
      { question: 'Do you floss daily?', options: [
        { text: 'Always', score: 10 }, { text: 'Often', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Rarely', score: 1 } ] },
      { question: 'Do you visit the dentist every 6 months?', options: [
        { text: 'Yes', score: 10 }, { text: 'Yearly', score: 7 }, { text: 'Rarely', score: 4 }, { text: 'Never', score: 1 } ] },
      { question: 'Do you have persistent bad breath?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
    ],
  },
  {
    id: 'tongue-coating',
    organ: 'tongue',
    title: 'Tongue Coating Check',
    description: 'Assess the appearance and coating of your tongue.',
    questions: [
      { question: 'Is your tongue pink and clean-looking?', options: [
        { text: 'Always', score: 10 }, { text: 'Usually', score: 7 }, { text: 'Sometimes coated', score: 4 }, { text: 'Often coated', score: 1 } ] },
      { question: 'Do you have a white or colored coating?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Does cleaning your tongue remove the coating?', options: [
        { text: 'Fully', score: 10 }, { text: 'Mostly', score: 7 }, { text: 'Partially', score: 4 }, { text: 'No', score: 1 } ] },
      { question: 'Do you have dry mouth frequently?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Does the coating come back quickly after cleaning?', options: [
        { text: 'No coating', score: 10 }, { text: 'Slowly', score: 7 }, { text: 'Within hours', score: 4 }, { text: 'Immediately', score: 1 } ] },
    ],
  },
  {
    id: 'tongue-burn',
    organ: 'tongue',
    title: 'Burning Mouth Assessment',
    description: 'Check for burning sensation or pain on the tongue.',
    questions: [
      { question: 'Do you feel a burning sensation on your tongue?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Does the burning worsen with certain foods?', options: [
        { text: 'No burning', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Is the burning present throughout the day?', options: [
        { text: 'Never', score: 10 }, { text: 'Briefly', score: 7 }, { text: 'Several hours', score: 4 }, { text: 'All day', score: 1 } ] },
      { question: 'Does the burning affect your eating habits?', options: [
        { text: 'No', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you have dry mouth with the burning?', options: [
        { text: 'No', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
    ],
  },
  {
    id: 'tongue-sores',
    organ: 'tongue',
    title: 'Tongue Sores & Ulcers',
    description: 'Check for sores, ulcers, or lesions on the tongue.',
    questions: [
      { question: 'Do you get canker sores on your tongue?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do sores take more than 2 weeks to heal?', options: [
        { text: 'N/A', score: 10 }, { text: 'No', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Always', score: 1 } ] },
      { question: 'Are the sores painful when eating?', options: [
        { text: 'N/A', score: 10 }, { text: 'Mildly', score: 7 }, { text: 'Moderately', score: 4 }, { text: 'Severely', score: 1 } ] },
      { question: 'Do you have multiple sores at once?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do sores recur frequently?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Monthly', score: 4 }, { text: 'Weekly', score: 1 } ] },
    ],
  },
  {
    id: 'tongue-hydration',
    organ: 'tongue',
    title: 'Oral Hydration Check',
    description: 'Assess hydration and saliva production affecting your tongue.',
    questions: [
      { question: 'Do you drink at least 8 glasses of water daily?', options: [
        { text: 'Always', score: 10 }, { text: 'Usually', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Rarely', score: 1 } ] },
      { question: 'Is your mouth frequently dry?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you have enough saliva to swallow comfortably?', options: [
        { text: 'Always', score: 10 }, { text: 'Usually', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Rarely', score: 1 } ] },
      { question: 'Do you consume caffeine or alcohol frequently?', options: [
        { text: 'Rarely', score: 10 }, { text: 'Sometimes', score: 7 }, { text: 'Daily', score: 4 }, { text: 'Multiple times daily', score: 1 } ] },
      { question: 'Is your tongue dry or cracked?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
    ],
  },
  {
    id: 'tongue-nutrition',
    organ: 'tongue',
    title: 'Nutritional Status Check',
    description: 'Assess nutritional deficiencies affecting tongue health.',
    questions: [
      { question: 'Do you eat foods rich in vitamin B12 regularly?', options: [
        { text: 'Daily', score: 10 }, { text: 'Often', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Rarely', score: 1 } ] },
      { question: 'Is your tongue smooth or glossy (not normal texture)?', options: [
        { text: 'No', score: 10 }, { text: 'Slightly', score: 7 }, { text: 'Moderately', score: 4 }, { text: 'Yes', score: 1 } ] },
      { question: 'Do you eat iron-rich foods (spinach, meat, lentils)?', options: [
        { text: 'Daily', score: 10 }, { text: 'Often', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Rarely', score: 1 } ] },
      { question: 'Have you been diagnosed with vitamin deficiencies?', options: [
        { text: 'No', score: 10 }, { text: 'Previously treated', score: 7 }, { text: 'Current, mild', score: 4 }, { text: 'Current, significant', score: 1 } ] },
      { question: 'Do you follow a restricted diet (vegan without supplements)?', options: [
        { text: 'No', score: 10 }, { text: 'Balanced', score: 7 }, { text: 'Restricted', score: 4 }, { text: 'No supplements', score: 1 } ] },
    ],
  },
  {
    id: 'tongue-geographic',
    organ: 'tongue',
    title: 'Geographic Tongue Check',
    description: 'Check for map-like patches or texture changes.',
    questions: [
      { question: 'Do you have smooth, red patches on your tongue?', options: [
        { text: 'No', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do the patches change location over time?', options: [
        { text: 'N/A', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Are the patches sensitive to spicy or acidic foods?', options: [
        { text: 'No', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you have a family history of geographic tongue?', options: [
        { text: 'No', score: 10 }, { text: 'Unsure', score: 7 }, { text: 'Yes, one relative', score: 4 }, { text: 'Yes, multiple', score: 1 } ] },
      { question: 'Do the patches cause discomfort?', options: [
        { text: 'No', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
    ],
  },
  {
    id: 'tongue-speech',
    organ: 'tongue',
    title: 'Tongue Mobility & Speech',
    description: 'Assess tongue movement and speech clarity.',
    questions: [
      { question: 'Can you move your tongue in all directions freely?', options: [
        { text: 'Yes', score: 10 }, { text: 'Mostly', score: 7 }, { text: 'Somewhat', score: 4 }, { text: 'No', score: 1 } ] },
      { question: 'Do you have difficulty pronouncing certain words?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Can you touch your nose with your tongue?', options: [
        { text: 'Easily', score: 10 }, { text: 'With effort', score: 7 }, { text: 'Barely', score: 4 }, { text: 'Cannot', score: 1 } ] },
      { question: 'Do you have a tongue-tie (ankyloglossia)?', options: [
        { text: 'No', score: 10 }, { text: 'Mild', score: 7 }, { text: 'Moderate', score: 4 }, { text: 'Yes, diagnosed', score: 1 } ] },
      { question: 'Does your tongue feel fatigued after talking?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
    ],
  },
  {
    id: 'tongue-thrush',
    organ: 'tongue',
    title: 'Oral Thrush & Infection Check',
    description: 'Check for signs of fungal or bacterial oral infections.',
    questions: [
      { question: 'Do you have white patches that won\'t scrape off?', options: [
        { text: 'No', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you have a weakened immune system?', options: [
        { text: 'No', score: 10 }, { text: 'Mildly', score: 7 }, { text: 'Moderately', score: 4 }, { text: 'Significantly', score: 1 } ] },
      { question: 'Do you use inhalers without rinsing?', options: [
        { text: 'Don\'t use', score: 10 }, { text: 'Always rinse', score: 7 }, { text: 'Sometimes rinse', score: 4 }, { text: 'Never rinse', score: 1 } ] },
      { question: 'Do you have diabetes or high blood sugar?', options: [
        { text: 'No', score: 10 }, { text: 'Pre-diabetic', score: 7 }, { text: 'Controlled', score: 4 }, { text: 'Uncontrolled', score: 1 } ] },
      { question: 'Do you have redness or soreness in your mouth?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
    ],
  },

  // ============ SKIN (10) ============
  {
    id: 'skin-type',
    organ: 'skin',
    title: 'Skin Type Assessment',
    description: 'Determine your skin type and its characteristics.',
    questions: [
      { question: 'How does your skin feel 2 hours after washing?', options: [
        { text: 'Comfortable, balanced', score: 10 }, { text: 'Slightly oily T-zone', score: 7 }, { text: 'Tight and dry', score: 4 }, { text: 'Very oily all over', score: 1 } ] },
      { question: 'How often do you get breakouts?', options: [
        { text: 'Rarely', score: 10 }, { text: 'Occasionally', score: 7 }, { text: 'Monthly', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'How visible are your pores?', options: [
        { text: 'Barely visible', score: 10 }, { text: 'Visible on nose', score: 7 }, { text: 'Visible on T-zone', score: 4 }, { text: 'Very visible everywhere', score: 1 } ] },
      { question: 'Does your skin react to new products?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'How would you describe your skin overall?', options: [
        { text: 'Normal/combination', score: 10 }, { text: 'Slightly sensitive', score: 7 }, { text: 'Dry', score: 4 }, { text: 'Oily/sensitive', score: 1 } ] },
    ],
  },
  {
    id: 'skin-uv',
    organ: 'skin',
    title: 'UV Exposure Assessment',
    description: 'Evaluate your sun exposure and protection habits.',
    questions: [
      { question: 'Do you apply sunscreen daily?', options: [
        { text: 'Always', score: 10 }, { text: 'Often', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Never', score: 1 } ] },
      { question: 'Do you use SPF 30 or higher?', options: [
        { text: 'Always', score: 10 }, { text: 'Usually', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Rarely', score: 1 } ] },
      { question: 'Do you spend more than 1 hour outdoors daily?', options: [
        { text: 'Less than 30 min', score: 10 }, { text: '30-60 min', score: 7 }, { text: '1-2 hours', score: 4 }, { text: '2+ hours', score: 1 } ] },
      { question: 'Do you reapply sunscreen every 2 hours outdoors?', options: [
        { text: 'Always', score: 10 }, { text: 'Often', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Never', score: 1 } ] },
      { question: 'Do you use tanning beds?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
    ],
  },
  {
    id: 'skin-hydration',
    organ: 'skin',
    title: 'Skin Hydration Check',
    description: 'Assess your skin\'s moisture and hydration levels.',
    questions: [
      { question: 'Does your skin feel dry or tight?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you moisturize daily?', options: [
        { text: 'Twice daily', score: 10 }, { text: 'Daily', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Rarely', score: 1 } ] },
      { question: 'Do you drink at least 8 glasses of water?', options: [
        { text: 'Always', score: 10 }, { text: 'Usually', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Rarely', score: 1 } ] },
      { question: 'Does your skin look flaky or dull?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you use hot water for washing your face?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Always', score: 1 } ] },
    ],
  },
  {
    id: 'skin-acne',
    organ: 'skin',
    title: 'Acne Assessment',
    description: 'Evaluate acne severity and triggers.',
    questions: [
      { question: 'How often do you get acne breakouts?', options: [
        { text: 'Rarely', score: 10 }, { text: 'Occasionally', score: 7 }, { text: 'Monthly', score: 4 }, { text: 'Weekly', score: 1 } ] },
      { question: 'Do you have cystic or painful acne?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Does acne affect your self-confidence?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you pick or pop pimples?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Have you tried treatments without success?', options: [
        { text: 'N/A', score: 10 }, { text: 'Some success', score: 7 }, { text: 'Limited success', score: 4 }, { text: 'No success', score: 1 } ] },
    ],
  },
  {
    id: 'skin-allergy',
    organ: 'skin',
    title: 'Skin Allergy Assessment',
    description: 'Check for allergic skin reactions and triggers.',
    questions: [
      { question: 'Do you get rashes from new products or materials?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you have known skin allergies?', options: [
        { text: 'None', score: 10 }, { text: 'One', score: 7 }, { text: 'A few', score: 4 }, { text: 'Many', score: 1 } ] },
      { question: 'Does your skin itch after contact with certain plants?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you have eczema or dermatitis?', options: [
        { text: 'No', score: 10 }, { text: 'Mild', score: 7 }, { text: 'Moderate', score: 4 }, { text: 'Severe', score: 1 } ] },
      { question: 'Does stress trigger skin reactions?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
    ],
  },
  {
    id: 'skin-aging',
    organ: 'skin',
    title: 'Skin Aging Check',
    description: 'Assess signs of premature skin aging.',
    questions: [
      { question: 'Do you have visible fine lines or wrinkles?', options: [
        { text: 'None', score: 10 }, { text: 'Few', score: 7 }, { text: 'Some', score: 4 }, { text: 'Many', score: 1 } ] },
      { question: 'Does your skin have age spots or pigmentation?', options: [
        { text: 'None', score: 10 }, { text: 'Few', score: 7 }, { text: 'Some', score: 4 }, { text: 'Many', score: 1 } ] },
      { question: 'Has your skin lost elasticity?', options: [
        { text: 'No', score: 10 }, { text: 'Slightly', score: 7 }, { text: 'Moderately', score: 4 }, { text: 'Significantly', score: 1 } ] },
      { question: 'Do you smoke or did you smoke?', options: [
        { text: 'Never', score: 10 }, { text: 'Former, quit', score: 7 }, { text: 'Occasionally', score: 4 }, { text: 'Daily', score: 1 } ] },
      { question: 'Do you use anti-aging skincare products?', options: [
        { text: 'Daily routine', score: 10 }, { text: 'Often', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Never', score: 1 } ] },
    ],
  },
  {
    id: 'skin-moles',
    organ: 'skin',
    title: 'Mole & Skin Cancer Check',
    description: 'Evaluate moles using the ABCDE rule.',
    questions: [
      { question: 'Do you have moles that are asymmetrical?', options: [
        { text: 'No', score: 10 }, { text: 'One', score: 7 }, { text: 'A few', score: 4 }, { text: 'Many', score: 1 } ] },
      { question: 'Do any moles have irregular borders?', options: [
        { text: 'No', score: 10 }, { text: 'One', score: 7 }, { text: 'A few', score: 4 }, { text: 'Many', score: 1 } ] },
      { question: 'Do any moles have varied colors?', options: [
        { text: 'No', score: 10 }, { text: 'One', score: 7 }, { text: 'A few', score: 4 }, { text: 'Many', score: 1 } ] },
      { question: 'Are any moles larger than 6mm (pencil eraser)?', options: [
        { text: 'No', score: 10 }, { text: 'One', score: 7 }, { text: 'A few', score: 4 }, { text: 'Many', score: 1 } ] },
      { question: 'Have any moles changed recently?', options: [
        { text: 'No', score: 10 }, { text: 'Slightly', score: 7 }, { text: 'Moderately', score: 4 }, { text: 'Yes, significantly', score: 1 } ] },
    ],
  },
  {
    id: 'skin-sensitivity',
    organ: 'skin',
    title: 'Skin Sensitivity Assessment',
    description: 'Evaluate skin sensitivity and reactivity.',
    questions: [
      { question: 'Does your skin turn red easily?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Does your skin sting with new products?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Does weather change affect your skin?', options: [
        { text: 'No', score: 10 }, { text: 'Slightly', score: 7 }, { text: 'Moderately', score: 4 }, { text: 'Significantly', score: 1 } ] },
      { question: 'Does your skin feel hot or burning?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you have rosacea or visible blood vessels?', options: [
        { text: 'No', score: 10 }, { text: 'Mild', score: 7 }, { text: 'Moderate', score: 4 }, { text: 'Severe', score: 1 } ] },
    ],
  },
  {
    id: 'skin-routine',
    organ: 'skin',
    title: 'Skincare Routine Check',
    description: 'Evaluate your daily skincare habits.',
    questions: [
      { question: 'Do you cleanse your face twice daily?', options: [
        { text: 'Always', score: 10 }, { text: 'Usually', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Rarely', score: 1 } ] },
      { question: 'Do you remove makeup before bed?', options: [
        { text: 'Always', score: 10 }, { text: 'Usually', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Rarely', score: 1 } ] },
      { question: 'Do you exfoliate 1-2 times per week?', options: [
        { text: 'Yes', score: 10 }, { text: 'Usually', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Never', score: 1 } ] },
      { question: 'Do you use products suited to your skin type?', options: [
        { text: 'Always', score: 10 }, { text: 'Usually', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Never', score: 1 } ] },
      { question: 'Do you apply moisturizer after cleansing?', options: [
        { text: 'Always', score: 10 }, { text: 'Usually', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Rarely', score: 1 } ] },
    ],
  },
  {
    id: 'skin-wound',
    organ: 'skin',
    title: 'Wound Healing Assessment',
    description: 'Evaluate how well your skin heals from cuts and wounds.',
    questions: [
      { question: 'Do minor cuts heal within a week?', options: [
        { text: 'Always', score: 10 }, { text: 'Usually', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Rarely', score: 1 } ] },
      { question: 'Do wounds leave visible scars?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you have slow-healing wounds?', options: [
        { text: 'Never', score: 10 }, { text: 'Rarely', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Often', score: 1 } ] },
      { question: 'Do you have diabetes affecting healing?', options: [
        { text: 'No', score: 10 }, { text: 'Pre-diabetic', score: 7 }, { text: 'Controlled', score: 4 }, { text: 'Uncontrolled', score: 1 } ] },
      { question: 'Do you eat foods rich in vitamin C and zinc?', options: [
        { text: 'Daily', score: 10 }, { text: 'Often', score: 7 }, { text: 'Sometimes', score: 4 }, { text: 'Rarely', score: 1 } ] },
    ],
  },
];

export function getAssessmentsByOrgan(organ: string): Assessment[] {
  return assessments.filter((a) => a.organ === organ);
}

export function getAssessment(id: string): Assessment | undefined {
  return assessments.find((a) => a.id === id);
}
