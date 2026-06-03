export const INDUSTRIES = [
  'Information Technology',
  'Healthcare',
  'Finance & Financial Services',
  'Manufacturing & Heavy Industry',
  'Education & EdTech',
  'Retail & E-Commerce',
  'Logistics & Supply Chain',
  'Construction & Real Estate'
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
    'Human Resources',
    'Customer Support'
  ],
  'Healthcare': [
    'Medical Staff',
    'Administration',
    'Healthcare IT',
    'Human Resources',
    'Customer Support'
  ],
  'Finance & Financial Services': [
    'Accounting',
    'Investment Banking',
    'Risk Management',
    'Sales & Marketing',
    'Human Resources',
    'Customer Support'
  ],
  'Manufacturing & Heavy Industry': [
    'Production',
    'Quality Control',
    'Maintenance',
    'Supply Chain',
    'Human Resources',
    'Sales & Marketing'
  ],
  'Education & EdTech': [
    'Teaching & Instruction',
    'Administration',
    'Counseling',
    'Sales & Marketing',
    'Human Resources',
    'Customer Support'
  ],
  'Retail & E-Commerce': [
    'Store Operations',
    'Merchandising',
    'E-Commerce Tech',
    'Sales & Marketing',
    'Human Resources',
    'Customer Support'
  ],
  'Logistics & Supply Chain': [
    'Warehouse Management',
    'Transportation',
    'Procurement',
    'Sales & Marketing',
    'Human Resources',
    'Customer Support'
  ],
  'Construction & Real Estate': [
    'Project Management',
    'Engineering',
    'Safety',
    'Sales & Marketing',
    'Human Resources'
  ]
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
  'Human Resources': [
    'Recruitment', 'Talent Acquisition', 'Sourcing', 'Boolean Search',
    'LinkedIn Recruiting', 'Screening', 'Interview Coordination', 'ATS Management',
    'Onboarding', 'Employee Relations', 'Compliance', 'Benefits Administration',
    'HR Operations', 'Payroll', 'Learning & Development'
  ],
  'Sales & Marketing': [
    'B2B Sales', 'Cold Calling', 'Negotiation', 'CRM Management', 'Lead Generation',
    'SEO', 'SEM', 'Social Media Marketing', 'Google Ads', 'Analytics',
    'Digital Marketing', 'Performance Marketing', 'Content Marketing', 'Business Development'
  ],
  'Customer Support': [
    'Technical Support', 'Client Success', 'Call Center', 'Ticketing Systems', 'Zendesk', 'Intercom'
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
