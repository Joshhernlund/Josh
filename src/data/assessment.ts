export interface Question {
  id: string;
  text: string;
  options: { value: number; label: string }[];
}

export interface Dimension {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  color: string;
  questions: Question[];
}

export interface MaturityLevel {
  level: number;
  name: string;
  range: [number, number];
  description: string;
  color: string;
  bgColor: string;
}

export const MATURITY_LEVELS: MaturityLevel[] = [
  {
    level: 1,
    name: 'Initial',
    range: [0, 20],
    description: 'Ad hoc processes with limited awareness of autonomous transport capabilities.',
    color: '#ef4444',
    bgColor: '#fef2f2',
  },
  {
    level: 2,
    name: 'Developing',
    range: [21, 40],
    description: 'Basic awareness and early-stage pilots, but lacking systematic approach.',
    color: '#f97316',
    bgColor: '#fff7ed',
  },
  {
    level: 3,
    name: 'Defined',
    range: [41, 60],
    description: 'Structured processes and documented standards in place for key areas.',
    color: '#eab308',
    bgColor: '#fefce8',
  },
  {
    level: 4,
    name: 'Managed',
    range: [61, 80],
    description: 'Quantitatively managed with data-driven decisions and broad deployment.',
    color: '#22c55e',
    bgColor: '#f0fdf4',
  },
  {
    level: 5,
    name: 'Optimizing',
    range: [81, 100],
    description: 'Continuously improving, fully integrated, and industry-leading capabilities.',
    color: '#3b82f6',
    bgColor: '#eff6ff',
  },
];

const SCALE = [
  { value: 0, label: 'Not started / No capability' },
  { value: 25, label: 'Initial / Ad hoc' },
  { value: 50, label: 'Developing / Partial' },
  { value: 75, label: 'Defined / Substantial' },
  { value: 100, label: 'Optimizing / Full capability' },
];

export const DIMENSIONS: Dimension[] = [
  {
    id: 'strategy',
    name: 'Strategy & Leadership',
    shortName: 'Strategy',
    description: 'Organizational vision, executive sponsorship, and strategic roadmap for autonomous transport.',
    icon: '🎯',
    color: '#8b5cf6',
    questions: [
      {
        id: 'strategy_1',
        text: 'How clearly defined is your organization\'s autonomous transport strategy and vision?',
        options: SCALE,
      },
      {
        id: 'strategy_2',
        text: 'How committed is executive leadership to driving autonomous transport adoption?',
        options: SCALE,
      },
      {
        id: 'strategy_3',
        text: 'How well does your autonomous transport roadmap align with overall business objectives?',
        options: SCALE,
      },
      {
        id: 'strategy_4',
        text: 'How robust is your investment and funding framework for autonomous transport initiatives?',
        options: SCALE,
      },
    ],
  },
  {
    id: 'technology',
    name: 'Technology & Systems',
    shortName: 'Technology',
    description: 'Deployment of autonomous vehicle technology, sensors, software platforms, and integration capabilities.',
    icon: '⚙️',
    color: '#06b6d4',
    questions: [
      {
        id: 'tech_1',
        text: 'How mature is your current autonomous vehicle technology stack (sensors, compute, software)?',
        options: SCALE,
      },
      {
        id: 'tech_2',
        text: 'How well integrated are your autonomous systems with existing fleet management platforms?',
        options: SCALE,
      },
      {
        id: 'tech_3',
        text: 'How capable are your systems for real-time data processing and decision-making at the edge?',
        options: SCALE,
      },
      {
        id: 'tech_4',
        text: 'How advanced is your organization in testing and validating autonomous system performance?',
        options: SCALE,
      },
    ],
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure & Connectivity',
    shortName: 'Infrastructure',
    description: 'Physical and digital infrastructure including roads, charging, V2X communications, and network coverage.',
    icon: '🏗️',
    color: '#10b981',
    questions: [
      {
        id: 'infra_1',
        text: 'How well-equipped is your physical infrastructure to support autonomous vehicle operations?',
        options: SCALE,
      },
      {
        id: 'infra_2',
        text: 'How comprehensive is your connectivity coverage (5G/V2X) across operational areas?',
        options: SCALE,
      },
      {
        id: 'infra_3',
        text: 'How advanced is your charging/refueling infrastructure for autonomous electric vehicles?',
        options: SCALE,
      },
      {
        id: 'infra_4',
        text: 'How mature are your remote monitoring and operations center capabilities?',
        options: SCALE,
      },
    ],
  },
  {
    id: 'safety',
    name: 'Safety & Compliance',
    shortName: 'Safety',
    description: 'Safety management systems, regulatory compliance, certification, and risk management frameworks.',
    icon: '🛡️',
    color: '#ef4444',
    questions: [
      {
        id: 'safety_1',
        text: 'How comprehensive is your autonomous vehicle safety management system?',
        options: SCALE,
      },
      {
        id: 'safety_2',
        text: 'How well does your organization comply with relevant autonomous transport regulations?',
        options: SCALE,
      },
      {
        id: 'safety_3',
        text: 'How robust are your cybersecurity measures for connected and autonomous vehicles?',
        options: SCALE,
      },
      {
        id: 'safety_4',
        text: 'How mature is your incident response and safety incident management process?',
        options: SCALE,
      },
    ],
  },
  {
    id: 'data',
    name: 'Data & Analytics',
    shortName: 'Data',
    description: 'Data collection, management, AI/ML capabilities, and analytics-driven operational optimization.',
    icon: '📊',
    color: '#f59e0b',
    questions: [
      {
        id: 'data_1',
        text: 'How effective is your data collection and management strategy for autonomous operations?',
        options: SCALE,
      },
      {
        id: 'data_2',
        text: 'How advanced are your AI and machine learning capabilities for autonomous decision-making?',
        options: SCALE,
      },
      {
        id: 'data_3',
        text: 'How well do you use analytics to continuously improve autonomous system performance?',
        options: SCALE,
      },
      {
        id: 'data_4',
        text: 'How robust is your data governance and privacy framework for vehicle data?',
        options: SCALE,
      },
    ],
  },
  {
    id: 'operations',
    name: 'Operations & Workforce',
    shortName: 'Operations',
    description: 'Operational processes, change management, workforce upskilling, and organizational readiness.',
    icon: '👥',
    color: '#ec4899',
    questions: [
      {
        id: 'ops_1',
        text: 'How well-defined are your operational processes for deploying and managing autonomous vehicles?',
        options: SCALE,
      },
      {
        id: 'ops_2',
        text: 'How prepared is your workforce for the transition to autonomous transport operations?',
        options: SCALE,
      },
      {
        id: 'ops_3',
        text: 'How effective is your change management approach for autonomous transport adoption?',
        options: SCALE,
      },
      {
        id: 'ops_4',
        text: 'How mature are your supplier and partner ecosystem relationships for autonomous transport?',
        options: SCALE,
      },
    ],
  },
  {
    id: 'sustainability',
    name: 'Sustainability & Impact',
    shortName: 'Sustainability',
    description: 'Environmental impact, social acceptance, community engagement, and long-term sustainability planning.',
    icon: '🌱',
    color: '#22c55e',
    questions: [
      {
        id: 'sus_1',
        text: 'How well integrated are sustainability goals into your autonomous transport strategy?',
        options: SCALE,
      },
      {
        id: 'sus_2',
        text: 'How effectively does your organization measure and reduce the environmental impact of transport operations?',
        options: SCALE,
      },
      {
        id: 'sus_3',
        text: 'How proactive is your engagement with communities and stakeholders on autonomous transport?',
        options: SCALE,
      },
      {
        id: 'sus_4',
        text: 'How well does your autonomous transport program contribute to broader smart city or mobility goals?',
        options: SCALE,
      },
    ],
  },
];

export function getMaturityLevel(score: number): MaturityLevel {
  return MATURITY_LEVELS.find(l => score >= l.range[0] && score <= l.range[1]) || MATURITY_LEVELS[0];
}

export function getDimensionScore(dimensionId: string, answers: Record<string, number>): number {
  const dimension = DIMENSIONS.find(d => d.id === dimensionId);
  if (!dimension) return 0;
  const questionIds = dimension.questions.map(q => q.id);
  const answeredValues = questionIds.map(id => answers[id] ?? 0);
  return Math.round(answeredValues.reduce((a, b) => a + b, 0) / questionIds.length);
}

export function getOverallScore(answers: Record<string, number>): number {
  const scores = DIMENSIONS.map(d => getDimensionScore(d.id, answers));
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}
