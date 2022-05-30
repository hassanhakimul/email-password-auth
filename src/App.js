import './App.css';
import Form from 'react-bootstrap/Form'
import app from "./firebase.init"
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from "firebase/auth"
import { useState } from 'react';
const auth = getAuth(app);
function App() {
  const [success, setSuccess]=useState('');
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState('');
  const [name,setName]=useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);

const handleNameBlur =event=>{
  setName(event.target.value);
}
  const handleEmailBlur = e => {
    setEmail(e.target.value)
  }
  const handlePasswordBlur = e => {
    setPassword(e.target.value)
  }
  const handleRegister = event => {
    setRegistered(event.target.checked)
  }
  //submit-section
  const handleSubmit = event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }
//regular-expression: if user don't give a special character in password and give error message
    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      setError('password should contain at least one special character')
      return;
    }
    setValidated(true);
    setError('');
//if user registered then we will allow the user to Sign in
    if (registered) {
      signInWithEmailAndPassword(auth, email, password)
        .then((result) => {
          // Signed in 
          const user = result.user;
          setSuccess(user);
        })
        .catch((error) => {
          console.error(error);
          setError(error.message);
        });
    }
    //if the user is a new user then email verification msg debo
    else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(res => {
          const user = res.user;
          console.log(user);
          setEmail('');
          setPassword('');
          verifyEmail();
          setUserName();

        })
        .catch(error => {
          console.error(error);
          setError(error.message);
        })
    }


    event.preventDefault();
  }
  const setUserName=()=>{
    updateProfile(auth.currentUser,{
      displayName:name
    })
    .then(()=>{
     console.log('updating name') 
    })
    .catch(error=>{
      setError(error.message);
    })
  }
//if new user we wil send a verification email
  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        // Email verification sent!
        console.log('email verification sent')
      });

  }
  //email reset-section
  const handlePassReset = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('email reset send')
      })
  }
  return (
    <div className=' mx-auto align-items-center
    w-50 mt-3' >
      <h2 className='text-primary'>Please {registered ? 'Log In' : 'Register'}</h2>
      <Form noValidate validated={validated} onSubmit={handleSubmit}/>
     {  !registered && <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control onBlur={handleEmailBlur} type="email" placeholder="Enter email" required />
          <Form.Control.Feedback type="invalid">
            Please provide a valid email.
          </Form.Control.Feedback>
        </Form.Group>
}
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Your Name</Form.Label>
          <Form.Control onBlur={handleNameBlur} type="text" placeholder="Your name" required />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
          <Form.Control.Feedback type="invalid">
            Please provide a valid email.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control onBlur={handlePasswordBlur} type="password" placeholder="Password"
            required />
          <Form.Control.Feedback type="invalid">
            Please provide a valid password.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" onChange={handleRegister} label="Already registered ?" />
        </Form.Group>
        <p className='text-success'>{success}</p>
        <p className='text-danger'>{error}</p>
        <button onClick={handlePassReset} type="button" className="btn btn-link">forget Password?</button><br />
        <button className="btn btn-primary rounded text-white p-2" type="submit">

          {registered ? 'Log In' : 'Register'}

        </button>
      </Form>
    </div>
  );
}

export default App;
