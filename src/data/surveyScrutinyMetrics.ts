import { type OutcomeCorrelationSeries } from '@/lib/types';

export const SYNTHETIC_SURVEY_OUTCOMES: OutcomeCorrelationSeries[] = [
  {
    id: 'listing-error-rate',
    metricName: 'Schedule 0.0 Listing Error Rate (%)',
    metricNameHi: 'अनुसूची 0.0 प्रविष्टि त्रुटि दर (%)',
    competencyId: 'comp-boundary-demarcation',
    competencyName: 'Census Boundary Demarcation & Listing',
    yAxisLabel: 'Listing Scrutiny Error Rate (%)',
    yAxisLabelHi: 'सूचीकरण संवीक्षा त्रुटि दर (%)',
    xAxisLabel: 'Boundary Demarcation Competency Level (L1–L5)',
    xAxisLabelHi: 'सीमा निर्धारण कौशल स्तर (L1–L5)',
    regressionSlope: -3.2,
    pValue: 0.008,
    rSquared: 0.89,
    narrativeInsight:
      'Each +1 level in Boundary Demarcation corresponds to a 3.2% reduction in Schedule 0.0 listing scrutiny errors (p < 0.01).',
    narrativeInsightHi:
      'सीमा निर्धारण में प्रत्येक +1 स्तर अनुसूची 0.0 सूचीकरण संवीक्षा त्रुटियों में 3.2% की कमी दर्शाता है (p < 0.01)।',
    methodologyNote:
      'Simulated benchmark based on NSS 78th Round Scrutiny Guidelines and Field Operations Division inspection manuals via mospi.gov.in (PRD §9.4.5).',
    provenance: 'SYNTHETIC_DEMO_DATA',
    dataPoints: [
      { id: 'p1', departmentCode: 'FOD-BR', departmentName: 'FOD Bihar (Q1 2025)', competencyLevel: 1.2, errorRatePercent: 19.8, sampleSize: 520 },
      { id: 'p2', departmentCode: 'FOD-UPE', departmentName: 'FOD UP East', competencyLevel: 2.1, errorRatePercent: 15.4, sampleSize: 610 },
      { id: 'p3', departmentCode: 'FOD-OD', departmentName: 'FOD Odisha', competencyLevel: 2.8, errorRatePercent: 11.2, sampleSize: 480 },
      { id: 'p4', departmentCode: 'FOD-WB', departmentName: 'FOD West Bengal', competencyLevel: 3.1, errorRatePercent: 9.5, sampleSize: 550 },
      { id: 'p5', departmentCode: 'FOD-MH', departmentName: 'FOD Maharashtra', competencyLevel: 3.6, errorRatePercent: 6.8, sampleSize: 740 },
      { id: 'p6', departmentCode: 'FOD-TN', departmentName: 'FOD Tamil Nadu', competencyLevel: 4.2, errorRatePercent: 3.9, sampleSize: 620 },
      { id: 'p7', departmentCode: 'FOD-KL', departmentName: 'FOD Kerala (Post-StatVidya)', competencyLevel: 4.8, errorRatePercent: 1.9, sampleSize: 580 },
    ],
  },
  {
    id: 'recall-inconsistency-rate',
    metricName: 'HCES 7-day vs 30-day Recall Inconsistency (%)',
    metricNameHi: 'HCES 7-दिवसीय बनाम 30-दिवसीय स्मरण विसंगति (%)',
    competencyId: 'comp-hces-collection',
    competencyName: 'Household Consumption Expenditure Survey Protocol',
    yAxisLabel: 'Recall Inconsistency Rate (%)',
    yAxisLabelHi: 'स्मरण विसंगति दर (%)',
    xAxisLabel: 'HCES Survey Protocol Competency Level (L1–L5)',
    xAxisLabelHi: 'HCES सर्वेक्षण प्रोटोकॉल कौशल स्तर (L1–L5)',
    regressionSlope: -2.8,
    pValue: 0.012,
    rSquared: 0.84,
    narrativeInsight:
      'Mastery in perishable vs. durable recall schedules correlates with a 2.8% decrease in scrutiny audit flags.',
    narrativeInsightHi:
      'विनाशी बनाम टिकाऊ उपभोग अनुसूचियों में प्रवीणता संवीक्षा विसंगतियों में 2.8% की कमी से संबंधित है।',
    methodologyNote:
      'Simulated based on NSSO Household Consumption Expenditure Survey scrutiny schedules (PRD §9.4.5).',
    provenance: 'SYNTHETIC_DEMO_DATA',
    dataPoints: [
      { id: 'r1', departmentCode: 'FOD-MP', departmentName: 'FOD Madhya Pradesh', competencyLevel: 1.4, errorRatePercent: 17.2, sampleSize: 410 },
      { id: 'r2', departmentCode: 'FOD-RJ', departmentName: 'FOD Rajasthan', competencyLevel: 2.3, errorRatePercent: 13.8, sampleSize: 490 },
      { id: 'r3', departmentCode: 'FOD-AP', departmentName: 'FOD Andhra Pradesh', competencyLevel: 3.2, errorRatePercent: 8.7, sampleSize: 530 },
      { id: 'r4', departmentCode: 'FOD-GJ', departmentName: 'FOD Gujarat', competencyLevel: 3.9, errorRatePercent: 5.4, sampleSize: 600 },
      { id: 'r5', departmentCode: 'FOD-KA', departmentName: 'FOD Karnataka', competencyLevel: 4.6, errorRatePercent: 2.8, sampleSize: 570 },
    ],
  },
  {
    id: 'outlier-rejection-rate',
    metricName: 'Enterprise Survey Outlier Audit Rejection (%)',
    metricNameHi: 'उद्यम सर्वेक्षण बाह्य-मूल्य संवीक्षा अस्वीकृति (%)',
    competencyId: 'comp-data-scrutiny',
    competencyName: 'Annual Survey of Industries (ASI) Scrutiny',
    yAxisLabel: 'Outlier Rejection Rate (%)',
    yAxisLabelHi: 'बाह्य-मूल्य अस्वीकृति दर (%)',
    xAxisLabel: 'Data Scrutiny & Validation Competency (L1–L5)',
    xAxisLabelHi: 'डेटा संवीक्षा और सत्यापन कौशल (L1–L5)',
    regressionSlope: -4.1,
    pValue: 0.003,
    rSquared: 0.91,
    narrativeInsight:
      'Advanced data scrutiny proficiency (L4+) prevents unverified production volume outliers from reaching final aggregation.',
    narrativeInsightHi:
      'उन्नत डेटा संवीक्षा प्रवीणता (L4+) असत्यापित उत्पादन विसंगतियों को अंतिम एकत्रीकरण तक पहुँचने से रोकती है।',
    methodologyNote:
      'Simulated based on Annual Survey of Industries scrutiny error distributions (PRD §9.4.5).',
    provenance: 'SYNTHETIC_DEMO_DATA',
    dataPoints: [
      { id: 'o1', departmentCode: 'SSS-DL', departmentName: 'SSS Delhi Regional', competencyLevel: 1.8, errorRatePercent: 22.4, sampleSize: 310 },
      { id: 'o2', departmentCode: 'SSS-PB', departmentName: 'SSS Punjab Unit', competencyLevel: 2.6, errorRatePercent: 16.1, sampleSize: 340 },
      { id: 'o3', departmentCode: 'SSS-HR', departmentName: 'SSS Haryana Unit', competencyLevel: 3.4, errorRatePercent: 10.3, sampleSize: 290 },
      { id: 'o4', departmentCode: 'SSS-TS', departmentName: 'SSS Telangana Unit', competencyLevel: 4.4, errorRatePercent: 3.7, sampleSize: 380 },
    ],
  },
];
