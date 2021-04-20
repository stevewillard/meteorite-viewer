import React from 'react'
import { render } from 'react-dom'
import { ThemeProvider, CssBaseline } from '@material-ui/core'
import { QueryParamProvider } from 'use-query-params'
import { BrowserRouter, Route } from 'react-router-dom'

import { App } from 'components/App'
import { theme } from 'theme'

render(
  <BrowserRouter>
    <QueryParamProvider ReactRouterRoute={Route}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </QueryParamProvider>
  </BrowserRouter>,
  document.getElementById('root')
)
