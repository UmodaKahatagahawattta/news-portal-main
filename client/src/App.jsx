import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './dashboard/layout/MainLayout';
import AdminIndex from './dashboard/pages/AdminIndex';
import Login from './dashboard/pages/Login';
import ProtectDashboatd from './middleware/ProtectDashboatd';
import ProtectRole from './middleware/ProtectRole';
import Unable from './dashboard/pages/Unable';
import AddWriter from './dashboard/pages/AddWriter';
import Writers from './dashboard/pages/Writers';
import News from './dashboard/pages/News';  // Ensure the News import is correct
import Profile from './dashboard/pages/Profile';
import WriterIndex from './dashboard/pages/WriterIndex';
import CreateNews from './dashboard/pages/CreateNews';
import storeContext from './context/storeContext';
import Edit_news from './dashboard/pages/Edit_news';

function App() {
  const { store } = useContext(storeContext);

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to dashboard */}
        <Route path='/' element={<Navigate to='/dashboard' />} />

        {/* Login Page */}
        <Route path='/login' element={<Login />} />

        {/* ✅ Public News Submission Route */}
        <Route path='/submit-news' element={<CreateNews />} />

        {/* Main Layout */}
        <Route path='/dashboard' element={<MainLayout />}>
          <Route index element={<Navigate to='/dashboard/admin' />} />
          <Route path='news/create' element={<CreateNews />} />
          <Route path='news' element={<News />} /> {/* This will render the News page */}
          <Route path='profile' element={<Profile />} />

          {/* Admin-specific routes */}
          <Route path='' element={<ProtectRole role='admin' />}>
            <Route path='admin' element={<AdminIndex />} />
            <Route path='writer/add' element={<AddWriter />} />
            <Route path='writers' element={<Writers />} />
          </Route>

          {/* Writer-specific routes */}
          <Route path='' element={<ProtectRole role='writer' />}>
            <Route path='writer' element={<WriterIndex />} />
            <Route path='news/create' element={<CreateNews />} />
            <Route path='news/edit/:news_id' element={<Edit_news />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
