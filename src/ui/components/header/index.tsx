/* Copyright (c) 2022, VRAI Labs and/or its affiliates. All rights reserved.
 *
 * This software is licensed under the Apache License, Version 2.0 (the
 * "License") as published by the Apache Software Foundation.
 *
 * You may not use this file except in compliance with the License. You may
 * obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */
import { useState } from 'react';
import { close as CloseIcon } from 'assets';
import { hamburgerMenu as HamburgerMenuIcon } from 'assets';
import { getImageUrl } from 'utils';
import SignOutBtn from '../auth/SignOutBtn';
import '../sidebar';
import { SideBarContent } from '../sidebar';
import './header.scss';

export const LOGO_LIGHT = getImageUrl('ST_icon_light_theme.svg');

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function openMenu() {
    setIsMenuOpen(true);
  }

  return (
    <>
      <header className='st-header-desktop'>
        <img
          className='logo'
          src={LOGO_LIGHT}
          alt='Supertokens'
        />
        <SignOutBtn />
      </header>
      <header className='st-header-mobile'>
        {isMenuOpen ? (
          <button
            className='close-btn'
            onClick={closeMenu}
          >
            <CloseIcon />
          </button>
        ) : (
          <HamburgerMenuIcon onClick={openMenu} />
        )}
        <img
          className='logo'
          src={LOGO_LIGHT}
          alt='Supertokens'
        />
        {isMenuOpen ? (
          <>
            <div
              className='overlay'
              onClick={closeMenu}
            ></div>

            <div className='menu-container'>
              <div className='menu-content'>
                <div onClick={closeMenu}>
                  <SideBarContent />
                </div>
              </div>
              <div className='divider' />
              <SignOutBtn />
            </div>
          </>
        ) : null}
      </header>
    </>
  );
}
