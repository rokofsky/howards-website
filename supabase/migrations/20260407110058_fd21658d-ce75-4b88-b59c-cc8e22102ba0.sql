
CREATE TABLE public.webinars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.webinars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view webinars" ON public.webinars FOR SELECT TO public USING (true);
CREATE POLICY "Allow insert for anon" ON public.webinars FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow update for anon" ON public.webinars FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete for anon" ON public.webinars FOR DELETE TO anon USING (true);

INSERT INTO public.webinars (slug, title, description) VALUES
  ('6-elements-of-persuasion', '6 Elements of Persuasion', ''),
  ('intro-to-oral-storytelling', 'Intro to Oral Storytelling', ''),
  ('3-step-assertiveness-technique', 'The 3-step Assertiveness technique', ''),
  ('cognitive-biases', 'Cognitive Biases - enemies of our brain', ''),
  ('constructive-feedback', 'Constructive Feedback — giving and getting', ''),
  ('cultural-intelligence', 'Cultural Intelligence', ''),
  ('dealing-with-difficult-people', 'Dealing with Difficult People', ''),
  ('emotional-intelligence', 'Emotional Intelligence EQ', ''),
  ('get-better-customer-service', 'GET Better Customer Service', ''),
  ('google-ngram-viewer', 'Google Ngram Viewer', ''),
  ('highly-sensitive-people', 'Highly Sensitive People (HSP)', ''),
  ('improve-your-storytelling-skills', 'Improve Your Storytelling Skills', ''),
  ('multiple-intelligences-theory', 'Multiple Intelligences Theory', ''),
  ('intro-to-nlp', 'Intro to Neurolinguistic Programming', ''),
  ('six-hats-technique', 'Six Hats Technique for Meetings', ''),
  ('the-four-agreements', 'The Four Agreements (based on the book)', ''),
  ('behavioral-economics', 'Basics of Behavioral Economics', ''),
  ('zazen-meditation', 'Zazen Meditation for Anyone', '');
