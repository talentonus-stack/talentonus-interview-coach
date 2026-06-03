export const INDUSTRIES = [
  'Information Technology',
  'Healthcare',
  'Finance & Accounting',
  'Sales & Marketing',
  'Human Resources',
  'Manufacturing',
  'Education',
  'Retail & E-Commerce',
  'Logistics & Supply Chain',
  'Customer Support',
  'Banking',
  'Construction'
]

export const DEPARTMENTS_BY_INDUSTRY: Record<string, string[]> = {
  'Information Technology': [
    'Software Development',
    'QA & Testing',
    'UI/UX Design',
    'DevOps',
    'Data Science',
    'Cyber Security',
    'IT Support',
    'Product Management',
    'Sales & Marketing',
    'HR'
  ],
  'Sales & Marketing': [
    'Sales',
    'Digital Marketing',
    'Performance Marketing',
    'SEO',
    'Content Marketing',
    'Business Development'
  ],
  'Human Resources': [
    'Recruitment',
    'Talent Acquisition',
    'HR Operations',
    'Payroll',
    'Learning & Development'
  ],
  // Fallback for others to avoid empty states
  'Healthcare': ['Nursing', 'Doctors', 'Administration'],
  'Finance & Accounting': ['Accounting', 'Financial Planning', 'Auditing'],
  'Manufacturing': ['Production', 'Quality Control', 'Maintenance'],
  'Education': ['Teaching', 'Administration', 'Counseling'],
  'Retail & E-Commerce': ['Store Operations', 'Merchandising', 'Customer Service'],
  'Logistics & Supply Chain': ['Warehouse Management', 'Transportation', 'Procurement'],
  'Customer Support': ['Technical Support', 'Client Success', 'Call Center'],
  'Banking': ['Retail Banking', 'Investment Banking', 'Risk Management'],
  'Construction': ['Project Management', 'Engineering', 'Safety']
}

export const SKILLS_BY_DEPARTMENT: Record<string, string[]> = {
  'Software Development': [
    'PHP', 'Laravel', 'CodeIgniter', 'React', 'Angular', 'VueJS',
    'Node.js', 'Express.js', 'Python', 'Django', 'Flask', 'Java',
    'Spring Boot', 'C#', '.NET', 'MySQL', 'PostgreSQL', 'MongoDB',
    'REST API', 'GraphQL', 'Git'
  ],
  'QA & Testing': [
    'Manual Testing', 'Automation Testing', 'Selenium', 'Cypress',
    'JMeter', 'API Testing', 'Test Cases'
  ],
  'UI/UX Design': [
    'Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Wireframing', 'Prototyping'
  ],
  'Recruitment': [
    'Sourcing', 'Boolean Search', 'LinkedIn Recruiting', 'Screening',
    'Interview Coordination', 'ATS Management'
  ],
  'Sales': [
    'B2B Sales', 'Cold Calling', 'Negotiation', 'CRM Management', 'Lead Generation'
  ],
  'Digital Marketing': [
    'SEO', 'SEM', 'Social Media Marketing', 'Google Ads', 'Analytics'
  ],
  'HR Operations': [
    'Onboarding', 'Employee Relations', 'Compliance', 'Benefits Administration'
  ],
  'Data Science': [
    'Machine Learning', 'Data Visualization', 'Pandas', 'TensorFlow', 'SQL', 'R'
  ],
  'DevOps': [
    'Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Azure', 'Linux'
  ],
  'Cyber Security': [
    'Penetration Testing', 'Network Security', 'Cryptography', 'Risk Assessment'
  ]
}
