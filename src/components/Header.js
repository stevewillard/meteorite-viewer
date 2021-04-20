import React from 'react'
import { AppBar, Box, Typography, InputBase, fade, makeStyles } from '@material-ui/core'
import { Search } from '@material-ui/icons'
import {
  useQueryParam,
  StringParam,
  BooleanParam,
  withDefault,
  NumberParam,
} from 'use-query-params'

import { Switch } from 'components/Switch'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}))

export const Header = () => {
  const classes = useStyles()

  const [query, setQuery] = useQueryParam('q', StringParam)
  const [showFavorites, setShowFavorites] = useQueryParam(
    'starred',
    withDefault(BooleanParam, false)
  )
  const [, setYear] = useQueryParam('year', NumberParam)

  return (
    <AppBar position="static">
      <Box display="flex" py={1} px={2} alignItems="center">
        <Typography className={classes.title} variant="h6" noWrap>
          Meteorite Viewer
        </Typography>

        <Box display="flex" alignItems="center" mr={4}>
          <Box mr={1} fontSize="14px" fontWeight="bold">
            Show favorites
          </Box>
          <Switch
            checked={showFavorites}
            onChange={(event) => {
              if (event.target.checked) {
                setShowFavorites(true)
                setQuery(undefined)
                setYear(undefined)
              } else {
                setShowFavorites(undefined)
              }
            }}
          />
        </Box>

        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <Search />
          </div>
          <InputBase
            placeholder="Name, ID..."
            type="search"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            value={query || ''}
            onChange={(event) => {
              const value = event.target.value

              if (value === '') {
                setQuery(undefined)
              } else {
                setQuery(event.target.value)
              }
            }}
          />
        </div>
      </Box>
    </AppBar>
  )
}
