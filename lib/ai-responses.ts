const knowledgeBase: { keywords: string[]; response: string }[] = [
  {
    keywords: ['eye', 'vision', 'eyesight', 'blurry', 'sight'],
    response:
      'Eye health is vital for quality of life. To maintain good vision: follow the 20-20-20 rule during screen use, wear UV-protective sunglasses, eat foods rich in vitamin A and omega-3s, and get regular eye exams. If you experience sudden vision changes, flashes of light, or persistent pain, consult an ophthalmologist promptly. This is educational guidance, not a diagnosis.',
  },
  {
    keywords: ['ear', 'hearing', 'tinnitus', 'deaf', 'sound'],
    response:
      'Hearing health is often overlooked. Protect your ears by limiting volume to 60% on headphones, using earplugs in noisy environments, and avoiding cotton swabs in the ear canal. If you experience sudden hearing loss, persistent ringing (tinnitus), or dizziness, see an ENT specialist. Early intervention for sudden hearing loss greatly improves recovery. This is educational guidance, not a diagnosis.',
  },
  {
    keywords: ['nose', 'smell', 'congestion', 'sinus', 'allergy', 'runny'],
    response:
      'Nasal health affects breathing, smell, and even taste. For congestion, try saline rinses and steam inhalation. Identify and avoid allergens, use a HEPA air purifier, and stay hydrated. If congestion lasts beyond 10 days, you have chronic sinus pain, or lose your sense of smell persistently, consult an ENT specialist. This is educational guidance, not a diagnosis.',
  },
  {
    keywords: ['tongue', 'taste', 'mouth', 'oral', 'throat'],
    response:
      'Oral and tongue health reflects your overall wellbeing. Brush twice daily, clean your tongue, floss, and stay hydrated. A balanced diet with B12, iron, and folate supports taste bud health. If you have sores lasting more than 2 weeks, white patches, or persistent taste changes, see a dentist or oral specialist. This is educational guidance, not a diagnosis.',
  },
  {
    keywords: ['skin', 'acne', 'rash', 'dermatitis', 'eczema', 'mole'],
    response:
      'Skin is your body\'s largest organ and first line of defense. Protect it with daily SPF 30+ sunscreen, keep it moisturized, and stay hydrated. Monitor moles using the ABCDE rule (Asymmetry, Border, Color, Diameter, Evolving). See a dermatologist for new or changing moles, persistent rashes, or severe acne. This is educational guidance, not a diagnosis.',
  },
  {
    keywords: ['headache', 'migraine', 'head pain'],
    response:
      'Headaches can have many causes including stress, dehydration, eye strain, and sinus issues. Stay hydrated, manage stress, ensure good sleep, and take screen breaks. If headaches are severe, persistent, or accompanied by vision changes or fever, seek medical attention. This is educational guidance, not a diagnosis.',
  },
  {
    keywords: ['sleep', 'insomnia', 'rest', 'tired'],
    response:
      'Quality sleep is essential for all aspects of health. Aim for 7-9 hours, maintain a consistent schedule, limit screens before bed, and create a dark, cool sleeping environment. Persistent sleep issues may indicate underlying conditions — consult a healthcare provider if problems continue. This is educational guidance, not a diagnosis.',
  },
  {
    keywords: ['diet', 'nutrition', 'food', 'eat', 'vitamin'],
    response:
      'A balanced diet supports all five senses. Include colorful fruits and vegetables for antioxidants, omega-3-rich foods for eye and brain health, adequate protein for tissue repair, and plenty of water for hydration. Limit processed foods and excess sugar. This is educational guidance, not a diagnosis.',
  },
  {
    keywords: ['water', 'hydration', 'drink', 'thirst'],
    response:
      'Proper hydration supports skin health, tear production, saliva, and nasal mucus. Aim for 8 glasses of water daily, more in hot weather or during exercise. Signs of dehydration include dry skin, dark urine, fatigue, and dizziness. This is educational guidance, not a diagnosis.',
  },
  {
    keywords: ['exercise', 'workout', 'fitness', 'activity'],
    response:
      'Regular exercise improves blood circulation to all sense organs, supports immune function, and reduces stress. Aim for 150 minutes of moderate activity weekly. Include cardio for circulation, stretching for flexibility, and eye/ear exercises for sensory health. This is educational guidance, not a diagnosis.',
  },
  {
    keywords: ['stress', 'anxiety', 'mental', 'worried'],
    response:
      'Stress can affect all aspects of health, including triggering skin flare-ups, tension headaches, and tinnitus. Practice stress management through deep breathing, meditation, regular exercise, adequate sleep, and social connection. If stress feels overwhelming, consider speaking with a mental health professional. This is educational guidance, not a diagnosis.',
  },
  {
    keywords: ['emergency', 'urgent', 'serious', 'danger'],
    response:
      'For health emergencies, seek immediate medical attention or call your local emergency number. Warning signs requiring urgent care include: sudden vision or hearing loss, severe bleeding, difficulty breathing, severe burns, chemical exposure to eyes, or any sudden neurological changes. Do not delay emergency care. This is educational guidance, not a diagnosis.',
  },
  {
    keywords: ['sdg', 'sustainable', 'goal 3', 'global health'],
    response:
      'SDG 3 (Good Health and Well-being) is a UN Sustainable Development Goal aiming to ensure healthy lives and promote well-being for all ages. HumanSenses supports this by providing accessible health education about the five sense organs, empowering people to take charge of their sensory health. This is educational guidance, not a diagnosis.',
  },
  {
    keywords: ['covid', 'coronavirus', 'pandemic'],
    response:
      'COVID-19 can affect multiple sense organs, particularly smell and taste. Many recover these senses within weeks, though some experience long-term changes. Smell training (repeated exposure to specific odors) may help recovery. Consult a healthcare provider for persistent symptoms. This is educational guidance, not a diagnosis.',
  },
  {
    keywords: ['children', 'kids', 'child', 'baby'],
    response:
      'Children\'s sensory health requires special attention. Ensure regular vision and hearing screenings, teach good eye and ear habits early, maintain oral hygiene routines, and protect skin with sunscreen. Any developmental concerns should be discussed with a pediatrician. This is educational guidance, not a diagnosis.',
  },
  {
    keywords: ['elderly', 'aging', 'old age', 'senior'],
    response:
      'Aging naturally affects all senses — presbyopia (vision), presbycusis (hearing), reduced smell and taste, and thinner skin. Regular check-ups, protective habits, good nutrition, and staying active can slow age-related decline. Report any sudden changes to a healthcare provider immediately. This is educational guidance, not a diagnosis.',
  },
];

export function generateAIResponse(userMessage: string, organHint = '', intentHint = ''): string {
  const lower = userMessage.toLowerCase();

  if (/(emergency|urgent|serious|danger|immediately|seek medical|call your doctor|need help)/.test(lower)) {
    return (
      'If you believe this is an emergency, seek immediate medical care or call your local emergency number. ' +
      'Warning signs include sudden vision or hearing loss, severe pain, difficulty breathing, uncontrolled bleeding, or any sudden neurological changes. ' +
      'This is educational guidance only and not a medical diagnosis.'
    );
  }

  for (const entry of knowledgeBase) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      let response = entry.response;
      if (intentHint === 'specialist') {
        response += ' If you need specialist care, make an appointment with the appropriate provider for this organ.';
      } else if (intentHint === 'prevention') {
        response += ' Focus on prevention and healthy habits to keep the affected sense organ strong.';
      }
      return response;
    }
  }

  if (organHint) {
    const organMap: Record<string, string> = {
      eyes: 'eye',
      ears: 'ear',
      nose: 'nose',
      oral: 'mouth or tongue',
      skin: 'skin',
    };
    return (
      `It sounds like you're asking about ${organMap[organHint]} health. ` +
      'Maintain healthy daily habits, protect the area from injury and irritation, and see a healthcare professional if symptoms persist. ' +
      'I provide educational guidance only, not medical diagnoses.'
    );
  }

  return (
    'I\'m here to provide health education about the five sense organs — eyes, ears, nose, tongue, and skin. ' +
    'You can ask me about symptoms, prevention, nutrition, exercises, or when to see a doctor for any of these. ' +
    'For example, try asking: "How do I protect my eyes from screen strain?" or "What causes tinnitus?" ' +
    'Remember: I provide educational guidance only, not medical diagnoses. Always consult a healthcare professional for personal medical advice.'
  );
}

export const suggestedPrompts = [
  'How do I protect my eyes from screen strain?',
  'What causes ringing in my ears?',
  'How can I improve my sense of smell?',
  'Why does my tongue have a white coating?',
  'How do I know if a mole is dangerous?',
  'What foods support eye health?',
  'When should I see a doctor for hearing loss?',
  'How can I prevent sinus infections?',
  'What should I do if I have a painful rash?',
  'When is it time to see a dentist for a mouth sore?',
];
