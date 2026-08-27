import { NextRequest, NextResponse } from 'next/server';

const LM_STUDIO_URL =
  process.env.LM_STUDIO_URL ||
  'http://127.0.0.1:1234/v1/chat/completions';

const LM_STUDIO_MODEL =
  process.env.LM_STUDIO_MODEL || 'google/gemma-4-e4b';

const SYSTEM_PROMPT = `
You are HumanSenses AI Health Assistant.

HumanSenses is an educational health application focused on:
- eyes
- ears
- nose
- tongue and mouth
- skin

Your job is to provide useful, personalized health EDUCATION.

IMPORTANT SAFETY RULES:
- Do not diagnose diseases.
- Do not claim certainty from symptoms or images.
- Do not invent test results.
- Do not invent confidence percentages.
- Do not prescribe medicines or prescription dosages.
- Explain possible causes as possibilities, not confirmed diagnoses.
- If symptoms could require urgent medical attention, clearly recommend professional medical care.
- Encourage the user to speak with an appropriate healthcare professional when necessary.
- Keep answers understandable and reasonably concise.
- Ask follow-up questions when useful.
- Use the user's actual question and previous conversation.
- Do not give the same generic response to every question.
- Do not pretend to be a doctor.
- Clearly say when more information is needed.

Give direct answers first.
Avoid unnecessary long explanations.
Keep normal answers around 100-250 words when possible.

This is educational information, not a medical diagnosis.
`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const messages = Array.isArray(body?.messages)
      ? body.messages
      : [];

    const safeMessages = messages
      .filter(
        (msg: any) =>
          msg &&
          (msg.role === 'user' || msg.role === 'assistant') &&
          typeof msg.content === 'string'
      )
      .slice(-12)
      .map((msg: any) => ({
        role: msg.role,
        content: msg.content.trim().slice(0, 4000),
      }))
      .filter((msg: any) => msg.content.length > 0);

    if (
      !safeMessages.length ||
      !safeMessages.some((msg: any) => msg.role === 'user')
    ) {
      return NextResponse.json(
        {
          error: 'Please provide a valid user message.',
        },
        { status: 400 }
      );
    }

    const lastUserMessage =
      [...safeMessages]
        .reverse()
        .find((msg: any) => msg.role === 'user')
        ?.content || '';

    /*
     * Basic emergency detection.
     * These cases should not depend only on the AI model.
     */
    const emergencyPattern =
      /(cannot breathe|can't breathe|difficulty breathing|chest pain|stroke|face droop|sudden weakness|sudden vision loss|chemical.*eye|eye.*chemical|severe bleeding|unconscious|passed out|seizure)/i;

    if (emergencyPattern.test(lastUserMessage)) {
      return NextResponse.json({
        assistant:
          'This may require urgent medical attention. Please seek appropriate emergency medical care now, especially if symptoms are sudden, severe, or getting worse. HumanSenses is an educational tool and cannot diagnose emergencies.',
        urgent: true,
        fallback: false,
        local: true,
      });
    }

    /*
     * Send the conversation to LM Studio.
     *
     * LM Studio must be running locally.
     */
    const response = await fetch(LM_STUDIO_URL, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        model: LM_STUDIO_MODEL,

        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          ...safeMessages,
        ],

        /*
         * Lower temperature:
         * more focused and consistent answers.
         */
        temperature: 0.5,

        /*
         * Maximum output length.
         * 400 gives enough room for useful answers
         * without making local generation unnecessarily long.
         */
        max_tokens: 400,

        /*
         * Keep this false for now.
         * We can change this to true later
         * when we add word-by-word streaming to your website.
         */
        stream: false,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('LM Studio error:', result);

      return NextResponse.json(
        {
          error:
            result?.error?.message ||
            'LM Studio request failed. Make sure LM Studio Local Server is running.',
        },
        { status: 500 }
      );
    }

    const assistant =
      result?.choices?.[0]?.message?.content;

    if (!assistant) {
      return NextResponse.json(
        {
          error: 'The local AI returned an empty response.',
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      assistant,
      fallback: false,
      local: true,
    });
  } catch (error) {
    console.error('Local AI route error:', error);

    return NextResponse.json(
      {
        error:
          'Unable to connect to LM Studio. Make sure LM Studio Local Server is running.',
      },
      { status: 500 }
    );
  }
}