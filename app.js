'use strict';

const { name, role, summary, contact, skills, education, experience } = profile;

const MAX_LEVEL = 5;
const MAX_EXPERIENCE_YEARS = 50;

const qs = (selector) => document.querySelector(selector); // arrow function

class InputError extends Error {} // errors we expect and can explain to the user


function filterSkills(list, query, coreOnly) {
  const text = query.trim().toLowerCase();
  return list.filter((skill) => skill.name.toLowerCase().includes(text) && (!coreOnly || skill.core));
}

function findSkill(list, skillName) {
  return list.find((skill) => skill.name === skillName);
}

function calcSkillScore(list) {
  if (list.length === 0) return { percent: 0, totalYears: 0 };
  const totalLevel = list.reduce((sum, skill) => sum + skill.level, 0);
  const totalYears = list.reduce((sum, skill) => sum + skill.years, 0);
  return { percent: Math.round((totalLevel / (list.length * MAX_LEVEL)) * 100), totalYears };
}

function getScoreMessage(percent) {
  if (percent >= 80) return 'Expert level: ready for complex projects.';
  if (percent >= 60) return 'Strong foundation and growing fast.';
  if (percent >= 40) return 'Solid basics: keep practising.';
  return 'Just starting out: plenty to explore.';
}

function yearsSince(year, today = new Date()) {
  return today.getFullYear() - year;
}

function parseExperience(raw) {
  const years = Number(raw);
  if (raw.trim() === '' || Number.isNaN(years)) {
    throw new InputError('Please enter your experience as a number, for example 2.');
  }
  if (years < 0 || years > MAX_EXPERIENCE_YEARS) {
    throw new InputError(`Experience must be between 0 and ${MAX_EXPERIENCE_YEARS} years.`);
  }
  return years;
}

function buildReply({ fullName, years, interests }) {
  const firstName = fullName.trim().split(' ')[0];
  const topic = interests.length > 0 ? interests.join(' and ') : 'technology';
  let level = 'beginner';
  if (years >= 3) level = 'experienced';
  else if (years >= 1) level = 'growing';
  return `Thanks ${firstName}! Your ${level} background and interest in ${topic} sound great. Feel free to reach out to ${name}.`;
}

/* ---------- rendering ---------- */

const byLevelDesc = (a, b) => b.level - a.level; // sort callback

const skillChip = ({ name: skillName, level, core }) =>
  `<li class="skill-item${core ? ' skill-item--core' : ''}">` +
  `<button type="button" class="skill-item__btn" data-skill="${skillName}">${skillName} · ${level}/${MAX_LEVEL}</button></li>`;

function updateSkillView() {
  const query = qs('#skill-search').value;
  const matches = filterSkills(skills, query, qs('#core-only').checked);
  const sorted = [...matches].sort(byLevelDesc); // spread: copy, so the original order is kept
  qs('#skill-list').innerHTML = sorted.map(skillChip).join('');

  const status = qs('#skill-status');
  if (matches.length === 0) status.textContent = `No skills match "${query.trim()}". Try another word.`;
  else if (matches.length === skills.length) status.textContent = `Showing all ${skills.length} skills.`;
  else status.textContent = `Showing ${matches.length} of ${skills.length} skills.`;
}

function renderProfile() {
  qs('#profile-name').textContent = name;
  qs('#profile-role').textContent = role;
  qs('#profile-summary').textContent = summary;
  qs('#contact-info').innerHTML =
    `<a href="mailto:${contact.email}">${contact.email}</a> · ${contact.location}`;

  qs('#education-list').innerHTML = education
    .map(({ degree, school, year }) => {
      const when = year ? `${year}, ${yearsSince(year)} years ago` : 'in progress';
      return `<li>${degree}, ${school} (${when})</li>`;
    })
    .join('');

  qs('#experience-list').innerHTML = experience
    .map(({ role: jobRole, org }) => `<li>${jobRole}, ${org}</li>`)
    .join('');

  const { percent, totalYears } = calcSkillScore(skills);
  qs('#skill-score').textContent =
    `Skill score: ${percent}% across ${totalYears} years of practice. ${getScoreMessage(percent)}`;
}

/* ---------- events ---------- */

qs('#skill-search').addEventListener('input', updateSkillView);
qs('#core-only').addEventListener('change', updateSkillView);

qs('#skill-list').addEventListener('click', (event) => {
  const button = event.target.closest('[data-skill]');
  if (!button) return;
  const { name: skillName, level, years } = findSkill(skills, button.dataset.skill);
  qs('#skill-detail').textContent =
    `${skillName}: level ${level}/${MAX_LEVEL}, about ${years} year${years === 1 ? '' : 's'} of practice.`;
});

qs('#contact-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.target;
  const message = qs('#form-message');
  try {
    const years = parseExperience(form.elements.experience.value);
    const interests = [...form.querySelectorAll('input[name="interests"]:checked')].map(
      (box) => box.labels[0].textContent
    );
    message.textContent = buildReply({ fullName: form.elements.fullname.value, years, interests });
    message.className = 'message message--ok';
    form.reset();
  } catch (error) {
    message.textContent =
      error instanceof InputError ? error.message : 'Something went wrong. Please try again.';
    message.className = 'message message--error';
  } finally {
    message.hidden = false;
  }
});

renderProfile();
updateSkillView();
