# SMIT Connect Portal - Implementation TODO

## Status: [5/28] Complete ✅

### 1. Setup & Config (4/4 ✅)
- [✅] Create `.env.example` with Supabase vars
- [✅] Create `src/utils/supabaseClient.js`
- [✅] Create `src/store/configureStore.js`
- [✅] Create Redux slices: `src/features/auth/`, `courses/`, `leaves/`, `students/`

### 2. Components & Pages (20/28 ✅)
- All components ✅
- Core pages (Home, Courses, Login/Signup/Dashboard, AdminLogin/Panel) ✅

## Status: [24/28] Complete ✅ Ready for Supabase + test!



**Next: Create `src/hooks/useAuth.js`, UI components, update App.jsx w/ Provider/Router.**

### 2. Components (8 steps)
- [ ] `src/components/ui/Button.jsx`, `Modal.jsx`, `Input.jsx`, `Card.jsx`
- [ ] `src/components/Header.jsx` (nav w/ auth)
- [ ] `src/components/LeaveForm.jsx`
- [ ] `src/components/CourseCard.jsx`
- [ ] `src/components/ExcelUploader.jsx` (admin students)
- [ ] `src/pages/Home.jsx`
- [ ] `src/pages/Courses.jsx`
- [ ] Student pages: `Signup.jsx`, `Login.jsx`, `Dashboard.jsx`

### 3. Pages & Routing (8 steps)
- [ ] Admin pages: `AdminLogin.jsx`, `AdminPanel.jsx` (w/ tabs)
- [ ] `AdminStudentMgmt.jsx`, `AdminCourseMgmt.jsx`, `AdminLeaveMgmt.jsx`
- [ ] Edit `src/App.jsx`: Router + Providers + Routes + AuthGuard
- [ ] Update `tailwind.config.js` if needed

### 4. Hooks & Utils (2 steps)
- [ ] `src/hooks/useAuth.js`

### 5. Integration & Testing (6 steps)
- [ ] User provides Supabase keys → `.env`
- [ ] Test auth flows (signup/login roles)
- [ ] Test courses CRUD, apply
- [ ] Test leaves submit/approve (w/ upload)
- [ ] Test Excel student upload
- [ ] `npm run dev` → full test/demo

**Next: After this file, create store + supabaseClient + first slices + App.jsx updates.**

