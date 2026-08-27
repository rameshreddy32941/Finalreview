export type LibraryItem = {
  id: string;
  type: 'article' | 'video' | 'infographic' | 'faq';
  title: string;
  description: string;
  organ: string;
  category: string;
  content?: string;
  source?: string;
  url?: string;
  imageUrl?: string;
  videoId?: string;
  videoUrl?: string;
  readTime?: string;
};

export const libraryItems: LibraryItem[] = [
  { id: 'art-1', type: 'article', title: 'Understanding Digital Eye Strain', description: 'How screens affect your eyes and what you can do about it.', organ: 'eye', category: 'Eye Health', content: 'Digital eye strain is common when you spend long hours looking at screens. Reduce fatigue by using the 20-20-20 rule, adjusting lighting, and keeping your screen at a comfortable distance.', source: 'American Academy of Ophthalmology', readTime: '5 min' },
  { id: 'art-2', type: 'article', title: 'The 20-20-20 Rule Explained', description: 'A simple technique to prevent eye fatigue during screen use.', organ: 'eye', category: 'Prevention', readTime: '3 min' },
  { id: 'art-3', type: 'article', title: 'Nutrition for Healthy Vision', description: 'Foods that protect your eyes and support long-term vision health.', organ: 'eye', category: 'Nutrition', readTime: '7 min' },
  { id: 'art-4', type: 'article', title: 'Understanding Glaucoma', description: 'The silent thief of sight — causes, symptoms, and treatment.', organ: 'eye', category: 'Diseases', readTime: '8 min' },
  { id: 'art-5', type: 'article', title: 'Noise-Induced Hearing Loss', description: 'How loud sounds damage your ears and how to prevent it.', organ: 'ear', category: 'Ear Health', content: 'Repeated exposure to loud noise can cause temporary or permanent damage to the hair cells in your inner ear. Use hearing protection in loud settings and keep volume at a safe level.', source: 'National Institute on Deafness and Other Communication Disorders', readTime: '6 min' },
  { id: 'art-6', type: 'article', title: 'Tinnitus Management Strategies', description: 'Practical approaches to living with ringing in the ears.', organ: 'ear', category: 'Conditions', readTime: '5 min' },
  { id: 'art-7', type: 'article', title: 'Earwax: Friend or Foe?', description: 'Why earwax is essential and how to manage it safely.', organ: 'ear', category: 'Hygiene', readTime: '4 min' },
  { id: 'art-8', type: 'article', title: 'Allergic Rhinitis Guide', description: 'Understanding and managing nasal allergies effectively.', organ: 'nose', category: 'Allergies', content: 'Allergic rhinitis can cause congestion, sneezing, itching, and watery eyes. Managing triggers, using saline rinses, and following your clinician’s plan can reduce symptoms.', source: 'Mayo Clinic', readTime: '6 min' },
  { id: 'art-9', type: 'article', title: 'Smell Training for Anosmia', description: 'How repeated odor exposure can help recover your sense of smell.', organ: 'nose', category: 'Recovery', readTime: '5 min' },
  { id: 'art-10', type: 'article', title: 'Sinus Health and Prevention', description: 'Keeping your sinuses clear and infection-free.', organ: 'nose', category: 'Sinus Health', readTime: '7 min' },
  { id: 'art-11', type: 'article', title: 'Oral Hygiene Best Practices', description: 'A complete guide to tongue and mouth health.', organ: 'tongue', category: 'Oral Health', content: 'Good tongue and mouth care helps prevent bad breath, gum disease, and oral discomfort. Brush twice daily, clean your tongue gently, and see your dentist regularly.', source: 'American Dental Association', readTime: '6 min' },
  { id: 'art-12', type: 'article', title: 'Understanding Geographic Tongue', description: 'What causes map-like patches and when to seek help.', organ: 'tongue', category: 'Conditions', readTime: '4 min' },
  { id: 'art-13', type: 'article', title: 'Vitamin B12 and Taste', description: 'How deficiencies affect your taste buds and tongue.', organ: 'tongue', category: 'Nutrition', readTime: '5 min' },
  { id: 'art-14', type: 'article', title: 'Sunscreen Science', description: 'Understanding SPF, UVA, UVB, and proper application.', organ: 'skin', category: 'Sun Protection', content: 'Broad-spectrum sunscreen helps protect your skin from UVA and UVB rays. Apply it daily and reapply after swimming or sweating to lower the risk of sun damage.', source: 'Skin Cancer Foundation', readTime: '6 min' },
  { id: 'art-15', type: 'article', title: 'The ABCDE of Melanoma', description: 'How to check your moles for signs of skin cancer.', organ: 'skin', category: 'Skin Cancer', readTime: '5 min' },
  { id: 'art-16', type: 'article', title: 'Building a Skincare Routine', description: 'A science-based approach to daily skincare for all types.', organ: 'skin', category: 'Skincare', readTime: '8 min' },
  { id: 'art-17', type: 'article', title: 'Understanding Eczema', description: 'Triggers, treatments, and management of atopic dermatitis.', organ: 'skin', category: 'Conditions', readTime: '7 min' },
  { id: 'art-18', type: 'article', title: 'SDG 3 and Global Sensory Health', description: 'How sense organ health connects to UN Sustainable Development Goals.', organ: 'all', category: 'Global Health', readTime: '6 min' },
  { id: 'vid-1', type: 'video', title: 'How the Human Eye Works', description: 'Animated explanation of eye anatomy and function.', organ: 'eye', category: 'Anatomy', videoId: 'qAnpAYGw5kI' },
  { id: 'vid-2', type: 'video', title: 'Understanding Hearing Loss', description: 'Types, causes, and treatments for hearing loss.', organ: 'ear', category: 'Education', videoId: '_kUy4p87_nk' },
  { id: 'vid-3', type: 'video', title: 'How Smell Works', description: 'The science of olfaction explained.', organ: 'nose', category: 'Anatomy', videoId: '0xcLbPkzN9w' },
  { id: 'vid-4', type: 'video', title: 'Taste and the Tongue', description: 'How taste buds detect and process flavors.', organ: 'tongue', category: 'Anatomy', videoId: 'SneTFJc7u7Y' },
  { id: 'vid-5', type: 'video', title: 'Skin Health Explained', description: 'Understanding your body\'s largest organ.', organ: 'skin', category: 'Education', videoId: 'u4GQAScgVC4' },
  { id: 'vid-6', type: 'video', title: 'Eye Exercises for Better Vision', description: 'Simple exercises to reduce eye strain.', organ: 'eye', category: 'Exercises', videoId: 'ETjm6jzlaO0' },
  { id: 'info-1', type: 'infographic', title: 'Eye Anatomy Infographic', description: 'Visual guide to the parts of the human eye.', organ: 'eye', category: 'Anatomy' },
  { id: 'info-2', type: 'infographic', title: 'Hearing Range Chart', description: 'Frequencies humans can hear and how they change with age.', organ: 'ear', category: 'Reference' },
  { id: 'info-3', type: 'infographic', title: 'Nasal Cavity Diagram', description: 'Detailed diagram of the nasal passages and sinuses.', organ: 'nose', category: 'Anatomy' },
  { id: 'info-4', type: 'infographic', title: 'Taste Bud Map', description: 'Understanding taste distribution on the tongue.', organ: 'tongue', category: 'Anatomy' },
  { id: 'info-5', type: 'infographic', title: 'Skin Layers Guide', description: 'The three layers of skin and their functions.', organ: 'skin', category: 'Anatomy' },
  { id: 'faq-1', type: 'faq', title: 'How often should I get an eye exam?', description: 'Adults: every 1-2 years. Those with risk factors: annually.', organ: 'eye', category: 'FAQ' },
  { id: 'faq-2', type: 'faq', title: 'Can hearing loss be reversed?', description: 'Some types can be treated; sensorineural loss is usually permanent.', organ: 'ear', category: 'FAQ' },
  { id: 'faq-3', type: 'faq', title: 'Why can\'t I smell anymore?', description: 'Causes range from infections to nasal polyps to aging.', organ: 'nose', category: 'FAQ' },
  { id: 'faq-4', type: 'faq', title: 'Is geographic tongue dangerous?', description: 'No, it\'s a benign condition requiring no treatment.', organ: 'tongue', category: 'FAQ' },
  { id: 'faq-5', type: 'faq', title: 'How much sunscreen do I need?', description: 'About 1 ounce (shot glass full) for full body coverage.', organ: 'skin', category: 'FAQ' },
];

export const dailyTips = [
  'Follow the 20-20-20 rule: every 20 minutes, look 20 feet away for 20 seconds to reduce eye strain.',
  'Drink at least 8 glasses of water today to support skin hydration and tear production.',
  'Clean your tongue every morning — it removes bacteria and improves taste perception.',
  'Use earplugs in noisy environments to protect against permanent noise-induced hearing loss.',
  'Apply SPF 30+ sunscreen even on cloudy days — UV rays penetrate clouds.',
  'Try saline nasal irrigation to keep your nasal passages clear and healthy.',
  'Eat a handful of walnuts for omega-3s that support eye and brain health.',
  'Practice deep breathing for 5 minutes to reduce stress and improve nasal airflow.',
  'Check your moles using the ABCDE rule: Asymmetry, Border, Color, Diameter, Evolving.',
  'Get 7-8 hours of sleep tonight — your eyes, skin, and immune system need it to recover.',
];

export function getDailyTip(): string {
  const day = new Date().getDate();
  return dailyTips[day % dailyTips.length];
}
