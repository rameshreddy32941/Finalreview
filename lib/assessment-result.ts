import { Assessment } from './assessment-data';

export type AssessmentResultData = {
  score: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  overallScore: number;
  summary: string;
  suggestions: string[];
  remedies: string[];
  prevention: string[];
  nutrition: string[];
  exercises: string[];
  lifestyle: string[];
  warningSigns: string[];
  whenToSeeDoctor: string;
};

const organData: Record<string, {
  suggestions: string[];
  remedies: string[];
  prevention: string[];
  nutrition: string[];
  exercises: string[];
  lifestyle: string[];
  warningSigns: string[];
  whenToSeeDoctor: string;
}> = {
  eye: {
    suggestions: [
      'Follow the 20-20-20 rule: every 20 minutes, look 20 feet away for 20 seconds',
      'Ensure proper lighting when reading or working on screens',
      'Wear UV-protective sunglasses when outdoors',
      'Get a comprehensive eye exam every 1-2 years',
    ],
    remedies: [
      'Apply warm compresses to relieve eye strain',
      'Use preservative-free artificial tears for dryness',
      'Try palming: rub hands warm and cup over closed eyes',
      'Cucumber slices on closed eyes reduce puffiness',
    ],
    prevention: [
      'Wear UV-protective sunglasses outdoors',
      'Maintain screen distance of 20-28 inches',
      'Avoid rubbing your eyes',
      'Take regular screen breaks',
    ],
    nutrition: [
      'Vitamin A: carrots, sweet potatoes, spinach',
      'Lutein & Zeaxanthin: kale, eggs, corn',
      'Omega-3 fatty acids: salmon, walnuts, flaxseed',
      'Vitamin C: citrus fruits, bell peppers',
    ],
    exercises: [
      'Palming: rub hands warm, cup over closed eyes for 30 seconds',
      'Figure-8: trace a large figure-8 with eyes 10 times',
      'Near-far focus: switch between thumb and distant object',
      'Eye rolling: roll eyes clockwise and counterclockwise 10 times',
    ],
    lifestyle: [
      'Take regular screen breaks using the 20-20-20 rule',
      'Ensure proper lighting when reading or working',
      'Get 7-8 hours of sleep for eye recovery',
      'Stay hydrated to support tear production',
    ],
    warningSigns: [
      'Sudden vision loss or changes',
      'Flashes of light or new floaters',
      'Persistent eye pain or pressure',
      'Double vision',
    ],
    whenToSeeDoctor:
      'Consult an ophthalmologist immediately if you experience sudden vision loss, flashes of light with new floaters, persistent eye pain, or any rapid change in vision quality.',
  },
  ear: {
    suggestions: [
      'Use ear protection in noisy environments (earplugs, earmuffs)',
      'Follow the 60/60 rule: 60% volume for 60 minutes max',
      'Avoid inserting objects into your ear canal',
      'Get regular hearing checks, especially after age 50',
    ],
    remedies: [
      'Warm compress for ear pain relief',
      'Olive oil drops to soften earwax naturally',
      'Steam inhalation for Eustachian tube congestion',
      'Keep head elevated to reduce ear pressure',
    ],
    prevention: [
      'Use ear protection in loud environments',
      'Keep volume at 60% max on audio devices',
      'Dry ears after swimming',
      'Avoid cotton swabs in the ear canal',
    ],
    nutrition: [
      'Omega-3 fatty acids: fish, walnuts',
      'Folate: spinach, lentils',
      'Magnesium: pumpkin seeds, almonds',
      'Vitamin B12: eggs, dairy',
    ],
    exercises: [
      'Eustachian tube equalization: yawn or swallow to pop ears',
      'Head turns: slowly turn head left and right 10 times',
      'Balance training: stand on one foot for 30 seconds',
      'Sound focus: identify sounds from different directions',
    ],
    lifestyle: [
      'Limit exposure to loud noise',
      'Take listening breaks from headphones',
      'Manage stress to reduce tinnitus impact',
      'Quit smoking to protect hearing',
    ],
    warningSigns: [
      'Sudden hearing loss',
      'Persistent tinnitus affecting sleep',
      'Severe dizziness or vertigo',
      'Ear discharge or bleeding',
    ],
    whenToSeeDoctor:
      'See an ENT specialist immediately for sudden hearing loss, persistent tinnitus, severe vertigo, or any discharge from the ear. Early treatment of sudden hearing loss greatly improves outcomes.',
  },
  nose: {
    suggestions: [
      'Identify and avoid known allergens',
      'Use a HEPA air purifier at home',
      'Try saline nasal irrigation to clear congestion',
      'Track seasonal triggers and prepare accordingly',
    ],
    remedies: [
      'Saline nasal rinse (neti pot) to clear congestion',
      'Steam inhalation with eucalyptus oil',
      'Warm compress over sinuses for pain relief',
      'Ginger tea for anti-inflammatory benefits',
    ],
    prevention: [
      'Identify and avoid known allergens',
      'Use a HEPA air purifier at home',
      'Wash hands regularly to prevent infections',
      'Avoid smoking and secondhand smoke',
    ],
    nutrition: [
      'Vitamin C: citrus, bell peppers',
      'Quercetin: onions, apples',
      'Zinc: pumpkin seeds, lentils',
      'Omega-3 fatty acids: fish, flaxseed',
    ],
    exercises: [
      'Alternate nostril breathing (Nadi Shodhana)',
      'Deep breathing exercises to improve airflow',
      'Facial massage around sinuses for drainage',
      'Humming to help sinus ventilation',
    ],
    lifestyle: [
      'Track and avoid personal allergy triggers',
      'Keep indoor air clean with HEPA filtration',
      'Shower after outdoor activities during pollen season',
      'Use dust-mite-proof bedding covers',
    ],
    warningSigns: [
      'Persistent congestion beyond 10 days',
      'Chronic sinus pain',
      'Loss of smell lasting beyond an illness',
      'Frequent nosebleeds',
    ],
    whenToSeeDoctor:
      'Consult an ENT specialist if you have persistent nasal congestion beyond 10 days, chronic sinus pain, loss of smell that persists, or frequent severe nosebleeds.',
  },
  tongue: {
    suggestions: [
      'Brush teeth twice daily and clean your tongue',
      'Stay hydrated to maintain saliva production',
      'Visit the dentist every 6 months',
      'Avoid tobacco and excessive alcohol',
    ],
    remedies: [
      'Saltwater gargle for oral hygiene and soothing',
      'Baking soda rinse to balance oral pH',
      'Yogurt with probiotics for fungal infections',
      'Aloe vera juice for burning sensation',
    ],
    prevention: [
      'Maintain excellent oral hygiene',
      'Stay well-hydrated throughout the day',
      'Limit sugary and acidic foods',
      'Visit the dentist every 6 months',
    ],
    nutrition: [
      'Vitamin B12: meat, fish, dairy',
      'Iron: spinach, lentils, red meat',
      'Folate: leafy greens, beans',
      'Zinc: pumpkin seeds, chickpeas',
    ],
    exercises: [
      'Tongue stretching: stick tongue out and hold',
      'Tongue sweep: move in a full circle around the mouth',
      'Tongue press: press against the roof of the mouth',
      'Side-to-side: move tongue from one corner to the other',
    ],
    lifestyle: [
      'Maintain excellent oral hygiene',
      'Stay well-hydrated throughout the day',
      'Limit sugary and acidic foods',
      'Quit smoking and limit alcohol',
    ],
    warningSigns: [
      'Persistent white or red patches',
      'Sores or ulcers lasting more than 2 weeks',
      'Persistent taste changes or loss',
      'Burning sensation without obvious cause',
    ],
    whenToSeeDoctor:
      'See a dentist or oral specialist if you have sores or ulcers lasting more than 2 weeks, persistent white or red patches, ongoing taste changes, or a burning sensation that does not resolve.',
  },
  skin: {
    suggestions: [
      'Apply broad-spectrum SPF 30+ sunscreen daily',
      'Keep skin clean and moisturized',
      'Stay hydrated by drinking enough water',
      'Perform regular skin self-examinations',
    ],
    remedies: [
      'Aloe vera gel for sunburn and irritation',
      'Oatmeal baths for eczema and itching',
      'Coconut oil for dry skin',
      'Cold compress for inflammation and itching',
    ],
    prevention: [
      'Apply broad-spectrum SPF 30+ sunscreen daily',
      'Avoid tanning beds and excessive sun exposure',
      'Keep skin clean and moisturized',
      'Stay hydrated by drinking enough water',
    ],
    nutrition: [
      'Vitamin C: citrus, berries',
      'Vitamin E: almonds, avocados',
      'Omega-3 fatty acids: fish, walnuts',
      'Vitamin A: carrots, sweet potatoes',
    ],
    exercises: [
      'Facial massage to improve circulation',
      'Yoga for stress reduction and skin glow',
      'Cardio exercise to boost blood flow to skin',
      'Facial yoga for muscle tone',
    ],
    lifestyle: [
      'Use sunscreen every day, even on cloudy days',
      'Moisturize immediately after bathing',
      'Avoid hot showers that strip skin oils',
      'Manage stress to prevent flare-ups',
    ],
    warningSigns: [
      'New or changing moles (ABCDE signs)',
      'Persistent rashes or skin irritation',
      'Severe or cystic acne',
      'Spreading skin infections',
    ],
    whenToSeeDoctor:
      'See a dermatologist if you notice new or changing moles (especially with ABCDE signs), persistent rashes, severe acne, or any spreading skin infection. Early detection of skin cancer is critical.',
  },
};

export function generateResult(
  assessment: Assessment,
  answers: number[]
): AssessmentResultData {
  const totalPossible = assessment.questions.length * 10;
  const earned = answers.reduce((sum, a) => sum + a, 0);
  const score = Math.round((earned / totalPossible) * 100);

  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
  if (score < 40) riskLevel = 'High';
  else if (score < 70) riskLevel = 'Medium';

  const data = organData[assessment.organ];
  const overallScore = Math.round(score * 0.9 + Math.random() * 5);

  const summary = `Your ${assessment.title} result indicates ${riskLevel.toLowerCase()} risk with a score of ${score}/100 and overall health ${overallScore}/100. Focus on ${data.suggestions[0].toLowerCase()} and follow the care recommendations provided.`;

  return {
    score,
    riskLevel,
    overallScore,
    summary,
    suggestions: data.suggestions,
    remedies: data.remedies,
    prevention: data.prevention,
    nutrition: data.nutrition,
    exercises: data.exercises,
    lifestyle: data.lifestyle,
    warningSigns: data.warningSigns,
    whenToSeeDoctor: data.whenToSeeDoctor,
  };
}
