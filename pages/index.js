import { useRouter } from 'next/router';
import { useState } from 'react';
import Button from '../components/Button';
import Field from '../components/Field';
import CustomInput from '../components/CustomInput';
import HomePage from '../components/HomePage';
import { useSignIn } from '../hooks/user';

function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signInError, signInLoading } = useSignIn();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const valid = await signIn(email, password);
    if (valid) {
      router.push('/nui-generator');
    }
  };

  return (
    <HomePage title="Sign In">
      <div className="flex flex-row justify-center">
        <form onSubmit={handleSubmit} className="basis-1/4">
          <Field label="Email">
            <CustomInput type="email" required value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Field>
          <Field label="Password">
            <CustomInput type="password" required value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Field>
          <div className="flex items-center justify-between">
            {signInError && (
              <p className="text-red-700">
                Invalid credentials
              </p>
            )}
            {signInLoading ? (
              <p>Loading...</p>
            ) : (
              <Button type="submit">
                Sign In
              </Button>
            )}
            <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
    </HomePage>
  );
}

export default SignInPage;
