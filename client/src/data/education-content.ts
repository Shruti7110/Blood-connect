export const educationContent = [
  {
    id: "thalassemia-basics",
    title: "Understanding Thalassemia",
    category: "thalassemia-basics",
    type: "article",
    description: "Learn about thalassemia, its types, inheritance patterns, and how it affects your body.",
    readingTime: "8 min read",
    difficulty: "Beginner",
    tags: ["basics", "genetics", "inheritance"],
    url: "#",
    content: `Thalassemia is an inherited blood disorder that affects the production of hemoglobin - the protein in red blood cells that carries oxygen throughout your body.

**Types of Thalassemia:**
• Alpha Thalassemia: Affects alpha globin chain production
• Beta Thalassemia: Affects beta globin chain production

**Severity Levels:**
• Thalassemia Trait (Minor): Mild symptoms, carriers
• Thalassemia Intermedia: Moderate symptoms
• Thalassemia Major: Severe symptoms, requires regular transfusions

**How It's Inherited:**
Thalassemia is passed down from parents to children through genes. Both parents must carry the gene for a child to have thalassemia major.

**Common Symptoms:**
• Fatigue and weakness
• Pale appearance
• Shortness of breath
• Delayed growth in children
• Bone problems
• Enlarged spleen`,
    sections: [
      {
        subtitle: "What Causes Thalassemia?",
        content: "Thalassemia is caused by mutations in genes that control hemoglobin production. These mutations are inherited from parents."
      },
      {
        subtitle: "Living With Thalassemia",
        content: "With proper treatment including regular transfusions and iron chelation therapy, people with thalassemia can live full, productive lives."
      }
    ]
  },
  {
    id: "blood-transfusions",
    title: "Blood Transfusion Guide",
    category: "transfusion-care",
    type: "guide",
    description: "Everything you need to know about blood transfusions - preparation, process, and aftercare.",
    readingTime: "12 min read",
    difficulty: "Intermediate",
    tags: ["transfusion", "safety", "procedure"],
    url: "#",
    content: `Blood transfusions are life-saving treatments for people with thalassemia major. Here's what you need to know:

**Before Your Transfusion:**
• Blood tests to check hemoglobin levels
• Cross-matching to ensure compatibility
• Health screening for any infections
• Pre-medication if you have a history of reactions

**During the Transfusion:**
• Takes 2-4 hours depending on units needed
• Continuous monitoring of vital signs
• Immediate reporting of any unusual symptoms
• Stay hydrated and comfortable

**Types of Blood Products:**
• Packed Red Blood Cells (most common)
• Washed cells (for those with reactions)
• Leukocyte-reduced blood (prevents complications)

**Potential Side Effects:**
• Mild fever or chills (common)
• Allergic reactions (rare)
• Iron overload (long-term concern)
• Transfusion reactions (very rare)

**Safety Measures:**
• All blood is screened for infections
• Strict compatibility testing
• Trained medical staff monitoring
• Emergency protocols in place`,
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