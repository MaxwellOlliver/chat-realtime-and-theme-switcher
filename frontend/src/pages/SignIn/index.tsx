import React, { useState, useRef, useContext } from 'react';
import * as Yup from 'yup';

import { Container, Form } from './styles';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { ThemeContext } from '../../context/ThemeContext';
import { UserContext } from '../../context/UserContext';

const SignIn: React.FC<{ history: any }> = ({ history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  const titleRef: any = useRef(null);
  const sectionRef: any = useRef(null);

  const { selectedTheme } = useContext<any>(ThemeContext);
  const { handleSignIn } = useContext(UserContext);

  let timeout: any;

  async function handleSubmit(e: Event) {
    e.preventDefault();

    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().min(8).required(),
    });

    if (!(await schema.isValid({ email, password }))) {
      if (email.length === 0 && password.length === 0) {
        setError('You forgot to fill in all the fields, sir!');
        setShowError(true);
      } else if (email.length === 0) {
        setError("Don't forget your email!");
        setShowError(true);
      } else if (password.length === 0) {
        setError('Hey, dummy, you forgot to type your password.');
        setShowError(true);
      } else if (password.length < 8) {
        setError('Password too short...');
        setShowError(true);
      }

      clearTimeout(timeout);
      timeout = setTimeout(() => setShowError(false), 5000);

      return;
    }

    titleRef.current.classList.remove('slideup');
    sectionRef.current.classList.remove('fadeOut');
    titleRef.current.classList.add('slide');
    sectionRef.current.classList.add('fade');

    try {
      if (handleSignIn) await handleSignIn(email, password, history);
    } catch (error) {
      titleRef.current.classList.remove('slide');
      sectionRef.current.classList.remove('fade');
      titleRef.current.classList.add('slideup');
      sectionRef.current.classList.add('fadeOut');
      setError('I think you typed something wrong.');
      setShowError(true);

      setTimeout(() => setShowError(false), 5000);
    }
  }
  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <h1 ref={titleRef}>Sign In</h1>
        <div ref={sectionRef}>
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span style={{ opacity: showError ? 100 : 0 }}>{error}</span>

          <button type="submit">Sign In</button>
          <Link to="/signup">I don't have a account...</Link>
        </div>
      </Form>
    </Container>
  );
};

export default SignIn;
