import React, { useState, useEffect } from 'react';
import './App.css';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { BaseProvider, DarkTheme, styled, LightTheme } from 'baseui';
import { lightThemeLocal, darkThemeLocal } from './utils/theme'
import { GlobalStyles } from './utils/global'
import { Spinner } from 'baseui/spinner';
import firebase from './firebase'
import Auth from './auth/Auth'
import { Button } from 'baseui/button';
import { ThemeProvider } from 'styled-components';
import { StatefulTooltip } from "baseui/tooltip";

const engine = new Styletron();
const Centered = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  width: '100'
});


const VerticalCentre = styled('div', {
  marginTop: "15%"
})

export default function App() {

  const loading = (<VerticalCentre> <Spinner /> </VerticalCentre>)
  const authenticate = (<VerticalCentre><Auth /></VerticalCentre>)
  const [state, setState] = useState(loading)
  const [nightMode, setNightMode] = useState({
    globalTheme: LightTheme,
    localTheme: lightThemeLocal
  })


  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (!user)
        setState(authenticate)
    })
  }, [])

  return (<StyletronProvider value={engine}>
    <BaseProvider theme={nightMode.globalTheme}>
      <ThemeProvider theme={nightMode.localTheme}>
        <GlobalStyles />
        <header style={{ textAlign: "right" }}>
          <StatefulTooltip content={() => "Hello, there! 👋 Click me to toggle Night Mode on or off"}>
            <Button onClick={() => {
              if (nightMode.globalTheme == LightTheme)
                setNightMode({
                  globalTheme: DarkTheme,
                  localTheme: darkThemeLocal
                })
              else
                setNightMode({
                  globalTheme: LightTheme,
                  localTheme: lightThemeLocal
                })
            }}>

              <img src="https://img.icons8.com/officel/16/000000/reflector-bulb.png" />
            </Button>
          </StatefulTooltip>
        </header>
        <Centered>
          {state}
        </Centered>
      </ThemeProvider>
    </BaseProvider>
  </StyletronProvider>)
};
