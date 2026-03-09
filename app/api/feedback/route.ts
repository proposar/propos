import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { score, feedback, email, timestamp, url } = await request.json();

    // Validate score
    if (typeof score !== 'number' || score < 0 || score > 10) {
      return NextResponse.json({ error: 'Invalid score' }, { status: 400 });
    }

    // Insert feedback into database
    const { data, error } = await supabase
      .from('user_feedback')
      .insert([
        {
          nps_score: score,
          feedback_text: feedback || null,
          user_email: email || null,
          feedback_url: url || null,
          created_at: timestamp,
        },
      ]);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to save feedback' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Feedback saved successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing feedback:', error);
    return NextResponse.json(
      { error: 'Failed to process feedback' },
      { status: 500 }
    );
  }
}

// GET endpoint for analytics (admin only)
export async function GET(request: NextRequest) {
  try {
    // Get all feedback
    const { data, error } = await supabase
      .from('user_feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch feedback' },
        { status: 500 }
      );
    }

    // Calculate NPS
    const scores = (data as any[]).map((item) => item.nps_score);
    const promoters = scores.filter((s) => s >= 9).length;
    const detractors = scores.filter((s) => s <= 6).length;
    const nps = ((promoters - detractors) / scores.length) * 100;

    return NextResponse.json({
      total_responses: scores.length,
      average_score: (
        scores.reduce((a, b) => a + b, 0) / scores.length
      ).toFixed(1),
      nps_score: nps.toFixed(1),
      distribution: {
        promoters,
        passives: scores.filter((s) => s >= 7 && s <= 8).length,
        detractors,
      },
      recent_feedback: data?.slice(0, 10) || [],
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}
