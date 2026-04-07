-- SMIT Connect Portal - Supabase Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/tgdnjairzprucdvdhind/sql

-- Profiles (auto-created on signup, RLS)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  role text check (role in ('student', 'admin')) not null default 'student',
  cnic text unique,
  roll_no text unique,
  name text,
  email text,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy profile_select on public.profiles for select using (auth.uid() = id);
create policy profile_insert on public.profiles for insert with check (auth.uid() = id);
create policy profile_update on public.profiles for update using (auth.uid() = id);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Courses
create table if not exists public.courses (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  status text check (status in ('open', 'closed')) default 'open',
  created_at timestamptz default now()
);

alter table public.courses enable row level security;
create policy courses_all on public.courses for all using (true); -- Admin RLS later

-- Leaves
create table if not exists public.leaves (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.profiles(id) on delete cascade,
  reason text not null,
  from_date date not null,
  to_date date not null,
  image_url text,
  status text check (status in ('pending', 'approved', 'rejected')) default 'pending',
  created_at timestamptz default now()
);

alter table public.leaves enable row level security;

-- Student own leaves
create policy student_leaves on public.leaves for all using (auth.uid() = student_id);
-- Admin all leaves
create policy admin_leaves on public.leaves for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Storage for leave images
insert into storage.buckets (id, name, public) values ('leaves-images', 'Leaves images', true);

create policy "Public leaves images" on storage.objects
  for select using (bucket_id = 'leaves-images');

-- Applications for Courses (Enrollments)
create table if not exists public.applications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  name text not null,
  email text not null,
  phone text not null,
  cnic text not null,
  status text check (status in ('pending', 'approved', 'rejected')) default 'pending',
  created_at timestamptz default now()
);

alter table public.applications enable row level security;

-- Student own applications
create policy student_applications on public.applications 
  for all using (auth.uid() = user_id);

-- Admin all applications
create policy admin_applications on public.applications 
  for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Sample data for Courses
insert into public.courses (name, description, status) values 
('Web & Mobile Development', 'Master full-stack development with MERN stack', 'open'),
('Graphic Design', 'Learn digital arts and UI/UX fundamentals', 'open'),
('AI & Machine Learning', 'Enter the world of data science and neural networks', 'open'),
('Video Editing', 'High-quality video production and motion graphics', 'open');

-- Indexes
create index on public.profiles (role);
create index on public.leaves (student_id, status);
create index on public.applications (user_id, status);
create index on public.applications (course_id);

-- Enable auth.email confirm (dashboard → Auth → Settings)

