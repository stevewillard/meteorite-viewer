import { createMuiTheme } from '@material-ui/core'
import { grey, yellow } from '@material-ui/core/colors'

/**
 * Use system fonts
 */
export const fontFamily = [
  '-apple-system',
  'BlinkMacSystemFont',
  'Segoe UI',
  'Roboto',
  'Oxygen',
  'Ubuntu',
  'Cantarell',
  'Fira Sans',
  'Droid Sans',
  'Helvetica Neue',
].join(',')

export const theme = createMuiTheme({
  palette: {
    /**
     * Dark mode
     */
    type: 'dark',

    primary: {
      main: grey[900],
    },
    secondary: {
      main: yellow['A200'],
    },
  },

  typography: {
    fontFamily,
    fontSize: 16,
  },

  props: {
    MuiButtonBase: {
      disableRipple: true,
      disableTouchRipple: true,
      focusRipple: false,
    },
  },

  overrides: {
    /**
     * Global styles
     */
    MuiCssBaseline: {
      '@global': {
        html: {
          fontSize: 14,
          textRendering: 'optimizeLegibility',
          mozOsxFontSmoothing: 'grayscale',
          webkitFontSmoothing: 'antialiased',
        },

        /**
         * Make input type="search" 'x' button black
         */
        '::-webkit-search-cancel-button': {
          filter: 'grayscale(1)',
        },

        '::selection': {
          background: yellow['A200'],
          color: 'black',
        },

        'body, #root': {
          height: '100%',
          minHeight: '100vh',
          fontSize: 14,
          backgroundColor: '#121212;',
          fontFamily,
        },

        '#root': {
          display: 'flex',
          flexDirection: 'column',
        },

        '.filter-highlight': {
          color: 'black',
          backgroundColor: yellow['A200'],
        },

        '.ellipsis': {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },

        '.mapboxgl-ctrl': {
          display: 'none !important',
        },

        'canvas:focus': {
          outline: 'none',
        },

        '.map-tooltip': {
          '& > div': {
            borderBottomColor: 'rgba(0,0,0,0.85) !important',
          },
        },
      },
    },

    MuiTableCell: {
      body: {
        color: grey[500],
      },
    },

    MuiTooltip: {
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.85)',
        fontSize: 13,
        padding: '8px 16px',
        fontWeight: 'bold',
      },
      arrow: {
        color: 'rgba(0,0,0,0.8)',
      },
    },
  },
})
