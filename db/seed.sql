insert into typing_systems (id, code, name) values
  ('11111111-1111-4111-8111-111111111111', 'MBTI', 'Myers-Briggs Type Indicator'),
  ('22222222-2222-4222-8222-222222222222', 'ENNEAGRAM', 'Enneagram')
on conflict (code) do update set name = excluded.name;

insert into type_options (typing_system_id, code, label)
select '11111111-1111-4111-8111-111111111111', code, code
from unnest(array[
  'INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP',
  'ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP'
]) as code
on conflict (typing_system_id, code) do update set label = excluded.label;

insert into type_options (typing_system_id, code, label)
select '22222222-2222-4222-8222-222222222222', code, code
from unnest(array[
  '1w9','1w2','2w1','2w3','3w2','3w4','4w3','4w5','5w4','5w6',
  '6w5','6w7','7w6','7w8','8w7','8w9','9w8','9w1'
]) as code
on conflict (typing_system_id, code) do update set label = excluded.label;

insert into profiles (slug, name, category, source_title, description, image_url) values
  ('walter-white', 'Walter White', 'fictional', 'Breaking Bad', 'A chemistry teacher whose precision, pride, and long-game planning transform him into a criminal strategist.', 'https://images.unsplash.com/photo-1535406208535-1429839cfd13?auto=format&fit=crop&w=900&q=80'),
  ('light-yagami', 'Light Yagami', 'fictional', 'Death Note', 'A brilliant student whose certainty hardens into control, secrecy, and ruthless long-range tactics.', 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80'),
  ('lelouch-lamperouge', 'Lelouch Lamperouge', 'fictional', 'Code Geass', 'A theatrical tactician who uses systems, symbolism, and people to reshape political reality.', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80'),
  ('tony-stark', 'Tony Stark', 'fictional', 'Marvel', 'An inventive engineer driven by novelty, improvisation, and public reinvention.', 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80'),
  ('sherlock-holmes', 'Sherlock Holmes', 'fictional', 'Sherlock Holmes', 'A detached investigator who prizes models, exact observation, and elegant explanations.', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=80'),
  ('hermione-granger', 'Hermione Granger', 'fictional', 'Harry Potter', 'A disciplined, principled student who uses preparation and rules to protect the people she loves.', 'https://images.unsplash.com/photo-1455885666463-9b6c1b96c1f3?auto=format&fit=crop&w=900&q=80'),
  ('wednesday-addams', 'Wednesday Addams', 'fictional', 'The Addams Family', 'A severe, independent observer with a taste for restraint and darkly exact standards.', 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=900&q=80'),
  ('batman-bruce-wayne', 'Batman / Bruce Wayne', 'fictional', 'DC Comics', 'A vigilant strategist who channels trauma into discipline, contingency planning, and moral restraint.', 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80')
on conflict (slug) do update set
  name = excluded.name,
  category = excluded.category,
  source_title = excluded.source_title,
  description = excluded.description,
  image_url = excluded.image_url;

-- Votes and evidence are intentionally not seeded here.
-- Those rows reference auth.users(id), so inserting fake user ids would break
-- foreign keys and undermine the RLS model. Create a user through Supabase Auth,
-- then use the app UI to create votes and evidence.
