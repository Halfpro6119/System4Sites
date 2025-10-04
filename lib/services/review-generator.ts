// Generate realistic reviews based on business data
export interface Review {
  text: string;
  reviewer: string;
  rating: number;
}

const firstNames = [
  'Sarah', 'Michael', 'Jennifer', 'David', 'Amanda', 'Robert', 'Lisa', 'James',
  'Jessica', 'William', 'Emily', 'John', 'Ashley', 'Daniel', 'Michelle', 'Christopher',
  'Melissa', 'Matthew', 'Stephanie', 'Andrew', 'Nicole', 'Joshua', 'Elizabeth', 'Brian'
];

const lastInitials = ['M.', 'R.', 'L.', 'K.', 'T.', 'S.', 'W.', 'H.', 'B.', 'C.', 'D.', 'P.', 'G.', 'J.'];

function getRandomName(): string {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastInitial = lastInitials[Math.floor(Math.random() * lastInitials.length)];
  return `${firstName} ${lastInitial}`;
}

export function generateRealisticReviews(
  businessName: string,
  category: string,
  rating: number
): Review[] {
  const reviews: Review[] = [];
  const numReviews = Math.min(5, Math.max(3, Math.floor(rating)));

  // Review templates based on category
  const templates = {
    'Employment agency': [
      `${businessName} helped me find the perfect job! The team was professional, responsive, and really understood what I was looking for. Highly recommend their services.`,
      `Excellent experience working with ${businessName}. They matched me with a great position that fits my skills perfectly. Very professional and supportive throughout the process.`,
      `I've worked with several employment agencies, but ${businessName} stands out. They took the time to understand my career goals and found me an amazing opportunity. Couldn't be happier!`,
      `Professional and efficient service. ${businessName} made the job search process so much easier. They were always available to answer questions and provided great guidance.`,
      `Outstanding service! The staff at ${businessName} went above and beyond to help me find the right position. Very impressed with their professionalism and dedication.`
    ],
    'default': [
      `Excellent service from ${businessName}! They were professional, timely, and exceeded my expectations. Highly recommend their ${category.toLowerCase()} services.`,
      `Very satisfied with the quality of work. The team was knowledgeable and took the time to explain everything. Will definitely use ${businessName} again.`,
      `Great experience overall. Professional staff, fair pricing, and excellent results. One of the best ${category.toLowerCase()} companies I've worked with.`,
      `Outstanding service! ${businessName} went above and beyond to ensure everything was perfect. Couldn't be happier with the results.`,
      `Highly professional and reliable. They delivered exactly what they promised and the quality was top-notch. Would recommend ${businessName} to anyone.`
    ]
  };

  // Get appropriate templates
  const reviewTemplates = templates[category as keyof typeof templates] || templates.default;

  // Generate reviews
  for (let i = 0; i < numReviews; i++) {
    reviews.push({
      text: reviewTemplates[i % reviewTemplates.length],
      reviewer: getRandomName(),
      rating: rating >= 4.5 ? 5 : Math.floor(rating)
    });
  }

  return reviews;
}
