
interface PatientData {
  thalassemiaType?: string;
  recentPreTransfusionHb?: string;
  symptomsBetweenTransfusions?: string;
  transfusionFrequencyPast6Months?: string;
  usualTransfusionHbLevel?: string;
  organIssuesHistory?: string;
  manualTransfusionFrequency?: string;
  poorGrowthHistory?: boolean;
  boneDeformities?: boolean;
  recurrentInfections?: boolean;
}

export function calculateRecommendedTransfusionFrequency(patientData: PatientData): {
  frequency: string;
  reasoning: string[];
  confidence: 'high' | 'medium' | 'low';
} {
  const reasoning: string[] = [];
  let frequencyScore = 0; // Lower score = more frequent transfusions needed
  
  // If manual frequency is specified, use that
  if (patientData.manualTransfusionFrequency) {
    return {
      frequency: patientData.manualTransfusionFrequency,
      reasoning: ["Patient-specified frequency"],
      confidence: 'high'
    };
  }

  // Thalassemia type assessment
  if (patientData.thalassemiaType === 'beta-thalassemia-major') {
    frequencyScore -= 2;
    reasoning.push("β-thalassemia major typically requires regular transfusions");
  } else if (patientData.thalassemiaType === 'thalassemia-intermedia') {
    frequencyScore += 1;
    reasoning.push("Thalassemia intermedia may require less frequent transfusions");
  }

  // Hemoglobin level assessment
  const hbLevel = parseFloat(patientData.recentPreTransfusionHb || '');
  if (!isNaN(hbLevel)) {
    if (hbLevel < 7) {
      frequencyScore -= 2;
      reasoning.push("Low pre-transfusion Hb (<7 g/dL) indicates need for frequent transfusions");
    } else if (hbLevel < 8) {
      frequencyScore -= 1;
      reasoning.push("Moderate pre-transfusion Hb (7-8 g/dL) suggests regular transfusion needs");
    } else if (hbLevel > 9) {
      frequencyScore += 1;
      reasoning.push("Higher pre-transfusion Hb (>9 g/dL) may allow longer intervals");
    }
  }

  // Symptoms assessment
  const symptoms = patientData.symptomsBetweenTransfusions?.toLowerCase() || '';
  if (symptoms.includes('fatigue') || symptoms.includes('shortness') || symptoms.includes('pallor')) {
    frequencyScore -= 1;
    reasoning.push("Symptoms between transfusions indicate need for closer monitoring");
  }

  // Historical frequency
  switch (patientData.transfusionFrequencyPast6Months) {
    case 'every-2-weeks':
      frequencyScore -= 2;
      reasoning.push("Previous 2-week frequency suggests high transfusion needs");
      break;
    case 'every-3-weeks':
      frequencyScore -= 1;
      reasoning.push("Previous 3-week frequency is a good baseline");
      break;
    case 'every-4-weeks':
      frequencyScore += 0;
      reasoning.push("Previous 4-week frequency shows stable condition");
      break;
    case 'every-6-weeks':
      frequencyScore += 1;
      reasoning.push("Previous 6-week frequency suggests milder condition");
      break;
  }

  // Complications assessment
  if (patientData.poorGrowthHistory || patientData.boneDeformities || patientData.recurrentInfections) {
    frequencyScore -= 1;
    reasoning.push("History of complications suggests need for adequate transfusion support");
  }

  // Organ issues
  if (patientData.organIssuesHistory && patientData.organIssuesHistory.trim() !== '') {
    frequencyScore -= 1;
    reasoning.push("Organ complications require careful transfusion management");
  }

  // Determine recommended frequency
  let recommendedFrequency: string;
  let confidence: 'high' | 'medium' | 'low' = 'medium';

  if (frequencyScore <= -4) {
    recommendedFrequency = 'every-2-weeks';
    confidence = 'high';
  } else if (frequencyScore <= -2) {
    recommendedFrequency = 'every-3-weeks';
    confidence = 'high';
  } else if (frequencyScore <= 0) {
    recommendedFrequency = 'every-4-weeks';
    confidence = 'medium';
  } else if (frequencyScore <= 2) {
    recommendedFrequency = 'every-6-weeks';
    confidence = 'medium';
  } else {
    recommendedFrequency = 'every-8-weeks';
    confidence = 'low';
  }

  // Add general reasoning
  reasoning.push("This recommendation should be validated with your healthcare provider");
  reasoning.push("Frequency may need adjustment based on ongoing monitoring");

  return {
    frequency: recommendedFrequency,
    reasoning,
    confidence
  };
}

export function getFrequencyDisplayName(frequency: string): string {
  const displayNames: Record<string, string> = {
    'every-2-weeks': 'Every 2 weeks',
    'every-3-weeks': 'Every 3 weeks', 
    'every-4-weeks': 'Every 4 weeks',
    'every-6-weeks': 'Every 6 weeks',
    'every-8-weeks': 'Every 8 weeks',
    'as-needed': 'As needed'
  };
  
  return displayNames[frequency] || frequency;
}
