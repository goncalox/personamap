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
  ('walter-white', 'Walter White', 'fictional', 'Breaking Bad', 'A chemistry teacher whose meticulous planning and pride transform him into a criminal strategist.', 'https://images.unsplash.com/photo-1535406208535-1429839cfd13?auto=format&fit=crop&w=900&q=80'),
  ('light-yagami', 'Light Yagami', 'fictional', 'Death Note', 'A brilliant student whose idealism hardens into control, secrecy, and ruthless long-range tactics.', 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80'),
  ('lelouch-lamperouge', 'Lelouch Lamperouge', 'fictional', 'Code Geass', 'A theatrical tactician who manipulates systems, symbolism, and people to remake political reality.', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80'),
  ('tony-stark', 'Tony Stark', 'fictional', 'Marvel', 'An inventive, provocative engineer driven by novelty, improvisation, and public reinvention.', 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80'),
  ('sherlock-holmes', 'Sherlock Holmes', 'fictional', 'Sherlock Holmes', 'A detached investigator who prizes internal models, precise observation, and elegant explanations.', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=80'),
  ('hermione-granger', 'Hermione Granger', 'fictional', 'Harry Potter', 'A disciplined, principled student who uses preparation and rules to protect the people she loves.', 'https://images.unsplash.com/photo-1455885666463-9b6c1b96c1f3?auto=format&fit=crop&w=900&q=80'),
  ('wednesday-addams', 'Wednesday Addams', 'fictional', 'The Addams Family', 'A severe, independent observer with a taste for emotional restraint and darkly exact standards.', 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=900&q=80'),
  ('batman-bruce-wayne', 'Batman / Bruce Wayne', 'fictional', 'DC Comics', 'A vigilant strategist who channels trauma into discipline, contingency planning, and moral restraint.', 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80')
on conflict (slug) do update set
  name = excluded.name,
  category = excluded.category,
  source_title = excluded.source_title,
  description = excluded.description,
  image_url = excluded.image_url;

insert into votes (profile_id, user_id, typing_system_id, type_option_id)
select p.id, v.user_id::uuid, ts.id, o.id
from (
  values
    ('walter-white','00000000-0000-4000-8000-000000000001','MBTI','INTJ'),
    ('walter-white','00000000-0000-4000-8000-000000000002','MBTI','INTJ'),
    ('walter-white','00000000-0000-4000-8000-000000000003','MBTI','INTJ'),
    ('walter-white','00000000-0000-4000-8000-000000000004','MBTI','ENTJ'),
    ('walter-white','00000000-0000-4000-8000-000000000005','ENNEAGRAM','5w6'),
    ('tony-stark','00000000-0000-4000-8000-000000000001','MBTI','ENTP'),
    ('tony-stark','00000000-0000-4000-8000-000000000002','MBTI','ENTP'),
    ('tony-stark','00000000-0000-4000-8000-000000000003','ENNEAGRAM','7w8'),
    ('sherlock-holmes','00000000-0000-4000-8000-000000000001','MBTI','INTP'),
    ('sherlock-holmes','00000000-0000-4000-8000-000000000002','ENNEAGRAM','5w6'),
    ('batman-bruce-wayne','00000000-0000-4000-8000-000000000001','MBTI','INTJ')
) as v(profile_slug, user_id, system_code, option_code)
join profiles p on p.slug = v.profile_slug
join typing_systems ts on ts.code = v.system_code
join type_options o on o.typing_system_id = ts.id and o.code = v.option_code
on conflict (user_id, profile_id, typing_system_id) do update set
  type_option_id = excluded.type_option_id,
  updated_at = now();

insert into evidence_cards (profile_id, user_id, typing_system_id, type_option_id, title, body, stance, score)
select p.id, e.user_id::uuid, ts.id, o.id, e.title, e.body, e.stance, e.score
from (
  values
    ('walter-white','00000000-0000-4000-8000-000000000001','MBTI','INTJ','Long-range identity construction','Walter repeatedly chooses strategies that preserve a private vision of competence and legacy, even when faster emotional repairs are available.','for',18),
    ('walter-white','00000000-0000-4000-8000-000000000002','MBTI','ENTJ','Direct control under pressure','His best moments often involve asserting command, structuring people around goals, and measuring success through external leverage.','against',9),
    ('tony-stark','00000000-0000-4000-8000-000000000003','MBTI','ENTP','Prototype-first problem solving','Tony explores possibilities by building, sparring, testing limits, and revising quickly instead of protecting one fixed master plan.','for',21)
) as e(profile_slug, user_id, system_code, option_code, title, body, stance, score)
join profiles p on p.slug = e.profile_slug
join typing_systems ts on ts.code = e.system_code
join type_options o on o.typing_system_id = ts.id and o.code = e.option_code;
