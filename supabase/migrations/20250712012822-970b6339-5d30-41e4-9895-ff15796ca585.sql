
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  user_type TEXT CHECK (user_type IN ('student', 'company', 'admin')) DEFAULT 'student',
  category TEXT CHECK (category IN ('university', 'rural-women', 'youth')) DEFAULT 'university',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  instructor TEXT,
  duration TEXT,
  level TEXT CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')) DEFAULT 'Beginner',
  category TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  students_enrolled INTEGER DEFAULT 0,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create user course enrollments table
CREATE TABLE public.course_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  course_id UUID REFERENCES public.courses NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  completed BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, course_id)
);

-- Create jobs table
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  job_type TEXT CHECK (job_type IN ('Full-time', 'Part-time', 'Contract', 'Remote')) DEFAULT 'Full-time',
  salary_range TEXT,
  description TEXT,
  requirements TEXT[],
  skills_required TEXT[],
  posted_by UUID REFERENCES auth.users,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create job applications table
CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  job_id UUID REFERENCES public.jobs NOT NULL,
  status TEXT CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')) DEFAULT 'pending',
  cover_letter TEXT,
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- Create labs table
CREATE TABLE public.labs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')) DEFAULT 'Beginner',
  duration TEXT,
  participants INTEGER DEFAULT 0,
  icon_name TEXT,
  gradient_colors TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create assignments table
CREATE TABLE public.assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  course_id UUID REFERENCES public.courses,
  due_date TIMESTAMP WITH TIME ZONE,
  max_points INTEGER DEFAULT 100,
  created_by UUID REFERENCES auth.users,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create assignment submissions table
CREATE TABLE public.assignment_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID REFERENCES public.assignments NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  submission_text TEXT,
  file_url TEXT,
  score INTEGER,
  feedback TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  graded_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(assignment_id, user_id)
);

-- Create certificates table
CREATE TABLE public.certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  course_id UUID REFERENCES public.courses,
  certificate_name TEXT NOT NULL,
  issued_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  certificate_url TEXT,
  verification_code TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::TEXT
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles table
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for courses (public read access)
CREATE POLICY "Anyone can view courses" ON public.courses FOR SELECT USING (TRUE);
CREATE POLICY "Only admins can manage courses" ON public.courses FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin')
);

-- Create RLS policies for course enrollments
CREATE POLICY "Users can view their own enrollments" ON public.course_enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can enroll in courses" ON public.course_enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own enrollments" ON public.course_enrollments FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for jobs (public read access)
CREATE POLICY "Anyone can view active jobs" ON public.jobs FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Companies can manage their own jobs" ON public.jobs FOR ALL USING (auth.uid() = posted_by);

-- Create RLS policies for job applications
CREATE POLICY "Users can view their own applications" ON public.job_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can apply to jobs" ON public.job_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Job posters can view applications" ON public.job_applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.jobs WHERE id = job_id AND posted_by = auth.uid())
);

-- Create RLS policies for labs (public read access)
CREATE POLICY "Anyone can view active labs" ON public.labs FOR SELECT USING (is_active = TRUE);

-- Create RLS policies for assignments
CREATE POLICY "Students can view assignments for enrolled courses" ON public.assignments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.course_enrollments WHERE course_id = assignments.course_id AND user_id = auth.uid())
);
CREATE POLICY "Instructors can manage assignments" ON public.assignments FOR ALL USING (auth.uid() = created_by);

-- Create RLS policies for assignment submissions
CREATE POLICY "Users can view their own submissions" ON public.assignment_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can submit assignments" ON public.assignment_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Assignment creators can view submissions" ON public.assignment_submissions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.assignments WHERE id = assignment_id AND created_by = auth.uid())
);

-- Create RLS policies for certificates
CREATE POLICY "Users can view their own certificates" ON public.certificates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public certificate verification" ON public.certificates FOR SELECT USING (TRUE);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, user_type, category)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'category', 'university')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data for courses
INSERT INTO public.courses (title, description, instructor, duration, level, category, price, rating, students_enrolled, image_url, is_featured) VALUES
('Web Development Fundamentals', 'Learn HTML, CSS, and JavaScript from scratch', 'Dr. Priya Sharma', '8 weeks', 'Beginner', 'Programming', 0, 4.8, 2500, '/placeholder.svg', true),
('Digital Marketing Mastery', 'Complete guide to digital marketing strategies', 'Rajesh Kumar', '6 weeks', 'Intermediate', 'Marketing', 0, 4.6, 1800, '/placeholder.svg', true),
('Data Science with Python', 'Comprehensive data science course using Python', 'Dr. Anjali Gupta', '12 weeks', 'Advanced', 'Data Science', 0, 4.9, 1200, '/placeholder.svg', false),
('Mobile App Development', 'Build mobile apps with React Native', 'Vikram Singh', '10 weeks', 'Intermediate', 'Programming', 0, 4.7, 950, '/placeholder.svg', false),
('Traditional Handicrafts', 'Learn traditional Indian handicraft techniques', 'Meera Devi', '4 weeks', 'Beginner', 'Handicrafts', 0, 4.5, 650, '/placeholder.svg', true),
('Financial Literacy', 'Essential financial planning and management', 'CA Suresh Agarwal', '3 weeks', 'Beginner', 'Finance', 0, 4.4, 1500, '/placeholder.svg', false);

-- Insert sample data for jobs
INSERT INTO public.jobs (title, company, location, job_type, salary_range, description, requirements, skills_required, is_active) VALUES
('Frontend Developer', 'TechCorp India', 'Bangalore, Karnataka', 'Full-time', '₹4-8 LPA', 'Join our dynamic team as a Frontend Developer', ARRAY['Bachelor''s degree in Computer Science', '2+ years experience'], ARRAY['React', 'JavaScript', 'CSS'], true),
('Digital Marketing Specialist', 'StartupHub', 'Mumbai, Maharashtra', 'Full-time', '₹3-6 LPA', 'Drive digital marketing campaigns', ARRAY['Marketing degree preferred', '1+ years experience'], ARRAY['SEO', 'Social Media', 'Content Marketing'], true),
('Data Analyst', 'DataTech Solutions', 'Hyderabad, Telangana', 'Full-time', '₹5-9 LPA', 'Analyze data to drive business decisions', ARRAY['Statistics or related field', 'Strong analytical skills'], ARRAY['Python', 'SQL', 'Excel'], true),
('UI/UX Designer', 'DesignStudio', 'Delhi, Delhi', 'Contract', '₹40,000-60,000/month', 'Create beautiful user interfaces', ARRAY['Design portfolio required', 'Creative mindset'], ARRAY['Figma', 'Adobe Creative Suite', 'Prototyping'], true);

-- Insert sample data for labs
INSERT INTO public.labs (title, description, category, difficulty, duration, participants, icon_name, gradient_colors, is_active) VALUES
('3D Web Development Lab', 'Interactive 3D environment to learn HTML, CSS, and JavaScript', 'Programming', 'Beginner', '45 min', 2500, 'Box', 'from-blue-600 to-purple-600', true),
('Virtual Chemistry Lab', 'Conduct chemical experiments in a safe virtual environment', 'Science', 'Intermediate', '60 min', 1800, 'Beaker', 'from-green-600 to-teal-600', true),
('Digital Tailoring Studio', 'Learn pattern making and garment construction in 3D', 'Handicrafts', 'Beginner', '30 min', 1200, 'Palette', 'from-pink-600 to-rose-600', true),
('Medical Simulation Lab', 'Practice medical procedures and diagnostics safely', 'Healthcare', 'Advanced', '90 min', 950, 'Heart', 'from-red-600 to-orange-600', true),
('IoT Electronics Lab', 'Build and test IoT devices in virtual environment', 'Technology', 'Intermediate', '75 min', 1650, 'Cpu', 'from-indigo-600 to-blue-600', true),
('Microscopy Lab', 'Explore microscopic world with virtual microscopes', 'Biology', 'Beginner', '40 min', 2100, 'Microscope', 'from-purple-600 to-pink-600', true);
