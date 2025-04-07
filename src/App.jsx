import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import Home from './Pages/Home'
import Error from './Pages/Error404'
import Register from './Pages/Register'
import Courses from './Pages/Courses'
import CourseDetail from './components/CourseDetail';
import Login from './Pages/Login'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import store from './redux/store'

function App() {

  return (

    <BrowserRouter>
      <Provider store={store}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Error />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Footer />
      </Provider>
    </BrowserRouter>

  )
}

export default App;
