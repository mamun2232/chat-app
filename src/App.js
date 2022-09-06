import logo from './logo.svg';
import './App.css';
import { Route, Routes} from 'react-router-dom';
import LandingPage from './component/LandingPage';
import Inbox from './component/Inbox';
import { ToastContainer, toast } from 'react-toastify';

function App() {
  return (
    <div className="bg-[#B1D4E0]">
      <Routes>
        <Route path='/' element={<LandingPage/>}></Route>
        <Route path='/inbox/:RoomName' element={<Inbox/>}></Route>
      </Routes>
      <ToastContainer></ToastContainer>
     
    </div>
  );
}

export default App;
