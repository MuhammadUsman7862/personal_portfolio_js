'use strict';

// All profile content lives here, so app.js only contains UI logic.
// level is 1-5 and years is how long you have practised: change them to match you.
const profile = {
  name: 'Muhammad Usman',
  role: 'AI/ML and Web Development Intern',
  summary:
    'I hold a Bachelor of Science in Computer Science from the University of Wah. ' +
    'I started my career as an AI/ML and IT Intern at the Pakistan Meteorological Department, ' +
    'and I have recently started an internship at Bloomrix.',
  contact: { email: 'usmanmani78621@gmail.com', location: 'Wah Cantt, Pakistan' },
  skills: [
    { name: 'HTML5', level: 4, years: 1, core: true },
    { name: 'CSS3', level: 4, years: 1, core: true },
    { name: 'JavaScript', level: 2, years: 0.5, core: false },
    { name: 'LLMs', level: 3, years: 1, core: false },
    { name: 'RAG', level: 3, years: 1, core: false },
    { name: 'AI Automation', level: 3, years: 1, core: false },
  ],
  education: [
    { degree: 'BS Computer Science', school: 'University of Wah', year: 2023 },
    { degree: 'Self-study: Full-Stack Software Engineer roadmap', school: 'Independent', year: null },
  ],
  experience: [
    { role: 'AI/ML and IT Intern', org: 'Pakistan Meteorological Department' },
    { role: 'Intern', org: 'Bloomrix' },
  ],
};
