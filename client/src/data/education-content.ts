export const educationContent = [
  {
    id: "thalassemia-basics",
    title: "Thalassemia Basics",
    category: "thalassemia-basics",
    type: "article",
    description: "Understanding the fundamentals of thalassemia, its types, symptoms, and diagnosis methods.",
    readingTime: "8 min read",
    difficulty: "Beginner",
    tags: ["basics", "symptoms", "diagnosis"],
    url: "/education/thalassemia-basics",
    content: `Thalassemia is an inherited blood disorder that affects the body's ability to produce healthy red blood cells and hemoglobin. There are two main types:

• Alpha Thalassemia: Caused by reduced or absent alpha globin chains
• Beta Thalassemia: Caused by reduced or absent beta globin chains

The severity ranges from mild (thalassemia minor/trait) to severe (thalassemia major).

Key Symptoms:
• Fatigue and weakness
• Pale skin and mucous membranes
• Shortness of breath
• Slow growth in children
• Bone deformities (in severe cases)
• Dark urine

Diagnosis includes Complete Blood Count (CBC), hemoglobin electrophoresis, DNA analysis, and family history assessment.`,
    sections: [
      {
        subtitle: "What is Thalassemia?",
        content: "Thalassemia is an inherited blood disorder that affects the body's ability to produce healthy red blood cells and hemoglobin."
      },
      {
        subtitle: "Key Symptoms", 
        content: "Common symptoms include fatigue, weakness, pale skin, shortness of breath, and slow growth in children."
      },
      {
        subtitle: "Diagnosis",
        content: "Thalassemia is diagnosed through CBC, hemoglobin electrophoresis, DNA analysis, and family history assessment."
      }
    ]
  },
  {
    id: "understanding-treatment",
    title: "Understanding Treatment",
    category: "transfusion-care",
    type: "guide",
    description: "Comprehensive guide to blood transfusions, iron chelation therapy, and other treatment options.",
    readingTime: "12 min read",
    difficulty: "Intermediate",
    tags: ["treatment", "transfusion", "chelation", "therapy"],
    url: "/education/understanding-treatment",
    content: `Blood transfusions are the cornerstone of thalassemia treatment. Regular transfusions are usually given every 2-4 weeks and take 2-4 hours per session. Pre-transfusion blood tests are required for safety.

Safety tips include verifying blood compatibility, reporting unusual symptoms immediately, and staying hydrated. Possible side effects include mild fever, chills, and rare allergic reactions.

Iron chelation therapy removes excess iron from your body, which builds up from regular transfusions. Treatment typically starts after 10-20 transfusions and includes daily oral medications like Deferasirox or Deferiprone, with regular monitoring of iron levels.`,
    sections: [
      {
        subtitle: "Regular Blood Transfusions",
        content: "Blood transfusions are given every 2-4 weeks, take 2-4 hours per session, and require pre-transfusion blood tests."
      },
      {
        subtitle: "Iron Chelation Therapy",
        content: "Iron chelation removes excess iron buildup from regular transfusions using daily oral medications."
      }
    ]
  },
  {
    id: "living-with-thalassemia",
    title: "Living with Thalassemia",
    category: "lifestyle",
    type: "guide",
    description: "Tips for healthy living, nutrition, exercise, and mental health support for thalassemia patients.",
    readingTime: "10 min read",
    difficulty: "Beginner",
    tags: ["lifestyle", "nutrition", "exercise", "mental-health"],
    url: "/education/living-with-thalassemia",
    content: `Living well with thalassemia involves careful attention to nutrition and exercise. Limit iron-rich foods like red meat and fortified cereals, while maintaining a balanced diet with adequate calcium. Avoid alcohol to protect your liver.

Regular low-impact exercise like swimming, walking, and yoga can help maintain strength and energy. Always listen to your body and rest when needed. Consult your doctor before starting new exercise routines.

Mental health support is equally important. Connect with support groups, maintain social relationships, and don't hesitate to seek professional counseling when needed.`,
    sections: [
      {
        subtitle: "Nutrition Guidelines",
        content: "Limit iron-rich foods, maintain balanced diet with adequate calcium, and avoid alcohol."
      },
      {
        subtitle: "Exercise Recommendations", 
        content: "Regular low-impact activities like swimming, walking, and yoga are recommended."
      }
    ]
  },
  {
    id: "preventing-complications",
    title: "Preventing Complications",
    category: "iron-management",
    type: "article",
    description: "Guidelines for maintaining treatment schedules, monitoring iron levels, and preventing complications.",
    readingTime: "15 min read",
    difficulty: "Advanced",
    tags: ["complications", "monitoring", "prevention", "iron-levels"],
    url: "/education/preventing-complications",
    content: `Preventing complications in thalassemia requires strict adherence to treatment schedules and regular monitoring. Never skip scheduled transfusions and plan around travel and events by communicating with your healthcare team.

Regular monitoring of iron levels through serum ferritin tests is crucial. Watch for signs of organ damage including liver problems, heart complications, and endocrine issues.

Maintain regular follow-ups with your healthcare team and keep emergency contacts readily available. Early detection and intervention are key to preventing serious complications.`,
    sections: [
      {
        subtitle: "Treatment Adherence",
        content: "Never skip scheduled transfusions and maintain regular communication with your healthcare team."
      },
      {
        subtitle: "Monitoring Guidelines",
        content: "Regular monitoring of iron levels and watching for signs of organ complications is essential."
      }
    ]
  }
];

export type EducationSection = typeof educationContent[number];