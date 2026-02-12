const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a highly capable personal assistant named Aria. You help your user manage their daily life efficiently and professionally. Your core capabilities include:

1. **Email Management**: Draft, reply to, and summarize emails. Match the tone and formality of the context. Be concise but thorough.

2. **Dinner Reservations**: Help find restaurants, suggest options based on preferences (cuisine, location, budget, ambiance), and draft reservation requests. Ask clarifying questions when needed.

3. **Task Management**: Help organize, prioritize, and track tasks. Suggest deadlines and break down complex tasks into actionable steps.

4. **General Assistance**: Answer questions, help with scheduling, provide reminders, and offer suggestions proactively.

Personality traits:
- Warm but professional
- Proactive — anticipate needs and suggest next steps
- Concise — respect the user's time
- Detail-oriented — never miss important information

When drafting emails or messages, always present them in a clear format so the user can review before sending. When making suggestions, provide 2-3 options when possible.

Always respond in a structured, easy-to-read format using markdown.`;

async function chat(messages, conversationHistory = []) {
  const formattedMessages = conversationHistory.concat(
    messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }))
  );

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: formattedMessages,
  });

  return {
    content: response.content[0].text,
    usage: response.usage,
  };
}

async function draftEmail({ context, tone, recipientName, subject }) {
  const prompt = `Draft an email with the following details:
- To: ${recipientName || 'the recipient'}
- Subject: ${subject || '(suggest an appropriate subject)'}
- Tone: ${tone || 'professional'}
- Context: ${context}

Please provide:
1. A suggested subject line (if not provided)
2. The full email draft
3. A brief note on the tone/approach taken`;

  return chat([{ role: 'user', content: prompt }]);
}

async function replyToEmail({ originalEmail, instructions, tone }) {
  const prompt = `I received the following email and need help replying:

---ORIGINAL EMAIL---
${originalEmail}
---END EMAIL---

Instructions for my reply: ${instructions}
Desired tone: ${tone || 'match the original email tone'}

Please provide:
1. Your analysis of the original email (key points, tone, urgency)
2. A draft reply
3. Any suggested follow-up actions`;

  return chat([{ role: 'user', content: prompt }]);
}

async function findRestaurant({ cuisine, location, occasion, partySize, budget, preferences }) {
  const prompt = `Help me find a restaurant with these preferences:
- Cuisine: ${cuisine || 'open to suggestions'}
- Location/Area: ${location || 'not specified'}
- Occasion: ${occasion || 'casual dining'}
- Party size: ${partySize || '2'}
- Budget: ${budget || 'moderate'}
- Other preferences: ${preferences || 'none'}

Please suggest 3 restaurant options with:
1. Restaurant name and why it fits
2. Price range
3. Best dishes / what they're known for
4. Ambiance description
5. A draft message/call script for making a reservation`;

  return chat([{ role: 'user', content: prompt }]);
}

module.exports = { chat, draftEmail, replyToEmail, findRestaurant };
