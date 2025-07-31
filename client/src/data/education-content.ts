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
    sections: [
      {
        subtitle: "What is Thalassemia?",
        content: `Thalassemia is an inherited blood disorder that affects the body's ability to produce healthy red blood cells and hemoglobin. There are two main types:

        • Alpha Thalassemia: Caused by reduced or absent alpha globin chains
        • Beta Thalassemia: Caused by reduced or absent beta globin chains

        The severity ranges from mild (thalassemia minor/trait) to severe (thalassemia major).`
      },
      {
        subtitle: "Key Symptoms",
        content: `Common symptoms include:
        • Fatigue and weakness
        • Pale skin and mucous membranes
        • Shortness of breath
        • Slow growth in children
        • Bone deformities (in severe cases)
        • Dark urine

        Seek immediate help if you experience severe fatigue, chest pain, or difficulty breathing.`
      },
      {
        subtitle: "Diagnosis",
        content: `Thalassemia is diagnosed through:
        • Complete Blood Count (CBC)
        • Hemoglobin electrophoresis
        • DNA analysis
        • Family history assessment
        • Prenatal screening for at-risk pregnancies`
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
    sections: [
      {
        subtitle: "Regular Blood Transfusions",
        content: `Blood transfusions are the cornerstone of thalassemia treatment:

        What to expect:
        • Usually given every 2-4 weeks
        • Takes 2-4 hours per session
        • Pre-transfusion blood tests required

        Safety tips:
        • Always verify blood compatibility
        • Report any unusual symptoms immediately
        • Stay hydrated before and after

        Possible side effects:
        • Mild fever or chills
        • Allergic reactions (rare)
        • Iron overload (managed with chelation)`
      },
      {
        subtitle: "Iron Chelation Therapy",
        content: `Iron chelation removes excess iron from your body:

        Why it's needed:
        • Regular transfusions cause iron buildup
        • Excess iron damages organs

        When to start:
        • Usually after 10-20 transfusions
        • Based on ferritin levels

        How it's managed:
        • Daily oral medications (Deferasirox, Deferiprone)
        • Injectable options (Deferoxamine)
        • Regular monitoring of iron levels`
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
    sections: [
      {
        subtitle: "Healthy Living Tips",
        content: `Nutrition:
        • Limit iron-rich foods (red meat, fortified cereals)
        • Increase vitamin C for better iron absorption control
        • Maintain balanced diet with adequate calcium
        • Avoid alcohol to protect liver

        Exercise:
        • Regular low-impact activities
        • Swimming, walking, yoga
        • Listen to your body and rest when needed
        • Consult doctor before starting new exercise`
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
    sections: [
      {
        subtitle: "Maintaining Schedule",
        content: `Transfusion schedule:
        • Never skip scheduled transfusions
        • Plan around travel and events
        • Communicate delays to healthcare team
        • Keep emergency contacts handy`
      }
    ]
  }
];

export type EducationSection = typeof educationContent[number];