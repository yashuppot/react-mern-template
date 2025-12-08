const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/', async (req, res) => {
  try {
    const { text, options } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const {
      school = false,
      company = false,
      location = false,
      email = false,
      phone = false,
    } = options || {};

    let instructions = 'You are a resume defacer. Your goal is to redact specific PII from the provided resume text based on the user\'s preferences. Replace the redacted information with placeholders like [REDACTED SCHOOL], [REDACTED EMAIL], etc.';

    const enabledRedactions = [];
    if (school) enabledRedactions.push('School/University names');
    if (company) enabledRedactions.push('Company/Organization names');
    if (location) enabledRedactions.push('Locations (Cities, States, Addresses)');
    if (email) enabledRedactions.push('Email Addresses');
    if (phone) enabledRedactions.push('Phone Numbers');

    if (enabledRedactions.length === 0) {
      return res.json({ redactedText: text });
    }

    instructions += `\n\nPlease redact the following information:\n- ${enabledRedactions.join('\n- ')}\n\nMaintain the original formatting and other text as much as possible. Return ONLY the redacted text.`;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: instructions },
        { role: 'user', content: text },
      ],
      model: 'gpt-3.5-turbo',
    });

    const redactedText = completion.choices[0].message.content;

    res.json({ redactedText });
  } catch (error) {
    console.error('Error defacing resume:', error);
    res.status(500).json({ error: 'Failed to process resume' });
  }
});

module.exports = router;
