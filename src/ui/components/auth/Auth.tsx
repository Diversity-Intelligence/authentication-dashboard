import { useState } from 'react';
import { getImageUrl } from 'utils';
import { Footer, LOGO_ICON_LIGHT } from '../footer/footer';
import SafeAreaView from '../safeAreaView/SafeAreaView';
import SignInContentWrapper from './SignInContentWrapper';
import SignUpOrResetPassword from './SignUpOrResetPasswordContent';
import { type ContentMode } from './types';
import './Auth.css';

const INITIAL_CONTENT_TO_SHOW: ContentMode = 'sign-in';

const Auth: React.FC<{
  onSuccess: () => void;
}> = (props) => {
  const [contentMode, setContentMode] = useState<ContentMode>(
    INITIAL_CONTENT_TO_SHOW,
  );

  const getContentToRender = () => {
    switch (contentMode) {
      case 'sign-in':
        return (
          <SignInContentWrapper
            onCreateNewUserClick={() => setContentMode('sign-up')}
            onForgotPasswordBtnClick={() => setContentMode('forgot-password')}
            onSuccess={props.onSuccess}
          />
        );
      case 'forgot-password':
      case 'sign-up':
        return (
          <SignUpOrResetPassword
            onBack={() => setContentMode(INITIAL_CONTENT_TO_SHOW)}
            contentMode={contentMode}
          />
        );
      default:
        return null;
    }
  };

  const backgroundUrlVars = {
    '--auth-background': `url("${getImageUrl('auth-background.png')}")`,
    '--auth-background-portrait': `url("${getImageUrl(
      'auth-background-portrait.png',
    )}")`,
  } as React.CSSProperties;

  return (
    <>
      <SafeAreaView backgroundColor='#EFEDEC' />
      <div
        className='page-container auth-container'
        style={backgroundUrlVars}
      >
        <div className={'block-container block-large ' + contentMode}>
          <img
            className='title-image-smaller'
            src={LOGO_ICON_LIGHT}
            alt='Auth Page'
          />
          {getContentToRender()}
        </div>
      </div>
      <Footer
        horizontalAlignment='center'
        size='normal'
        verticalAlignment='center'
        colorMode='dark'
      ></Footer>
    </>
  );
};

export default Auth;
