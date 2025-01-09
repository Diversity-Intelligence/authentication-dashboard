import React, { useEffect, useState } from 'react';
import { HTTPStatusCodes, StorageKeys } from 'consts';
import { localStorageHandler } from 'services';
import { getImageUrl } from 'utils';
import { validateEmail } from 'utils/form';
import useAuthService from 'api';
import InputField from '../inputField/InputField';

interface SignInContentProps {
  onSuccess: () => void;
  onCreateNewUserClick: () => void;
  onForgotPasswordBtnClick: () => void;
}

interface IErrorObject {
  email: string;
  password: string;
}

const SignInContent: React.FC<SignInContentProps> = ({
  onSuccess,
  onCreateNewUserClick,
  onForgotPasswordBtnClick,
}): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userTriedToSubmit, setUserTriedToSubmit] = useState(false);
  const { signIn } = useAuthService();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState<IErrorObject>({
    email: '',
    password: '',
  });
  const [serverValidationError, setServerValidationError] = useState('');

  const validateCredentials = async () => {
    const response = await signIn({ email, password });
    const body = await response.json();
    if (response.status === HTTPStatusCodes.OK) {
      switch (body.status) {
        case 'OK':
          localStorageHandler.setItem(StorageKeys.AUTH_KEY, body.sessionId);
          localStorageHandler.setItem(StorageKeys.EMAIL, email);
          onSuccess();
          break;
        case 'USER_LIMIT_REACHED_ERROR':
          setServerValidationError(body.message);
          break;
        case 'USER_SUSPENDED_ERROR':
          setServerValidationError(
            'User is currently suspended. Please sign in with another account, or reactivate the SuperTokens core license key.',
          );
          break;
        default:
          setServerValidationError('Incorrect email and password combination');
          break;
      }
    } else {
      setServerValidationError('Something went wrong');
    }
  };

  const checkValuesForErrors = () => {
    const _errors: IErrorObject = {
      email: '',
      password: '',
    };
    if (!email) _errors.email = 'Email cannot be empty';
    if (!password) _errors.password = 'Password cannot be empty';
    if (!validateEmail(email)) _errors.email = 'Email is invalid';
    setErrors(_errors);
    return Object.values(_errors).some((error) => error);
  };

  const clearErrors = (key: keyof IErrorObject) => {
    setErrors({ ...errors, [key]: '' });
    setServerValidationError('');
  };

  useEffect(() => {
    if (email && errors.email) clearErrors('email');
  }, [email]);

  useEffect(() => {
    if (password && errors.password) clearErrors('password');
  }, [password]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setServerValidationError('');
    setUserTriedToSubmit(true);
    const hasErrors = checkValuesForErrors();
    if (hasErrors) {
      setIsLoading(false);
      return;
    }
    await validateCredentials();
    setIsLoading(false);
  };

  const handleEmailFieldChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setEmail(e.target.value);
  };

  const handlePasswordFieldChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setPassword(e.target.value);
  };

  return (
    <div>
      <h2 className='api-key-form-title text-title'>
        User Management Dashboard
      </h2>
      <p className='text-small text-label'>
        Not registered yet?{' '}
        <span
          role={'button'}
          onClick={onCreateNewUserClick}
          className='add-new-user link'
        >
          Add a new user
        </span>
      </p>

      {serverValidationError && (
        <div className='input-field-error block-small block-error error-response-container'>
          {serverValidationError}
        </div>
      )}

      <hr />

      <form
        noValidate
        className='api-key-form'
        onSubmit={handleSubmit}
      >
        <label>Email</label>
        <InputField
          handleChange={handleEmailFieldChange}
          name='email'
          type='email'
          error={errors.email}
          value={email}
          placeholder=''
          forceShowError={userTriedToSubmit}
        />

        <label className='margin-top-16'>Password</label>
        <InputField
          handleChange={handlePasswordFieldChange}
          name='password'
          type='password'
          error={errors.password}
          forceShowError={userTriedToSubmit}
          value={password}
          placeholder=''
        />

        <div className='cta-container margin-top-16'>
          <button
            className='button'
            type='submit'
            disabled={isLoading}
          >
            <span>Sign In</span>{' '}
            <img
              src={getImageUrl('right_arrow_icon.svg')}
              alt='Auth Page'
            />
          </button>

          <button
            disabled={isLoading}
            onClick={onForgotPasswordBtnClick}
            className='flat secondary-cta-btn forgot-btn bold-400'
            role='button'
          >
            Forgot Password?
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignInContent;
