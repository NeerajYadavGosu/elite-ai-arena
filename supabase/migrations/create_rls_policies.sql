
-- Enable Row Level Security on tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view any profile"
  ON public.profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Challenges policies
CREATE POLICY "Anyone can view published challenges"
  ON public.challenges
  FOR SELECT
  USING (status = 'published');

CREATE POLICY "Hosts can view their own draft challenges"
  ON public.challenges
  FOR SELECT
  USING (
    status = 'draft' AND
    host_id IN (
      SELECT id FROM public.hosts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Hosts can insert challenges"
  ON public.challenges
  FOR INSERT
  WITH CHECK (
    host_id IN (
      SELECT id FROM public.hosts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Hosts can update their own challenges"
  ON public.challenges
  FOR UPDATE
  USING (
    host_id IN (
      SELECT id FROM public.hosts WHERE user_id = auth.uid()
    )
  );

-- Hosts policies
CREATE POLICY "Anyone can view hosts"
  ON public.hosts
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert themselves as hosts"
  ON public.hosts
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Participants policies
CREATE POLICY "Anyone can view participants"
  ON public.participants
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert themselves as participants"
  ON public.participants
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Submissions policies
CREATE POLICY "Anyone can view submissions"
  ON public.submissions
  FOR SELECT
  USING (true);

CREATE POLICY "Participants can insert their own submissions"
  ON public.submissions
  FOR INSERT
  WITH CHECK (
    participant_id IN (
      SELECT id FROM public.participants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Participants can update their own submissions"
  ON public.submissions
  FOR UPDATE
  USING (
    participant_id IN (
      SELECT id FROM public.participants WHERE user_id = auth.uid()
    )
  );

-- Feedback policies
CREATE POLICY "Anyone can view feedback"
  ON public.feedback
  FOR SELECT
  USING (true);

CREATE POLICY "Challenge hosts can insert feedback"
  ON public.feedback
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.submissions s
      JOIN public.challenges c ON s.challenge_id = c.id
      WHERE s.id = submission_id
      AND c.host_id IN (
        SELECT id FROM public.hosts WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Challenge hosts can update feedback"
  ON public.feedback
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.submissions s
      JOIN public.challenges c ON s.challenge_id = c.id
      WHERE s.id = submission_id
      AND c.host_id IN (
        SELECT id FROM public.hosts WHERE user_id = auth.uid()
      )
    )
  );
