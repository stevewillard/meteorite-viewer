import React from 'react'
import { Switch as MuiSwitch, withStyles } from '@material-ui/core'

/**
 * Style the MUI switch a bit nicer
 */
export const Switch = withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.grey[700],
      '& + $track': {
        backgroundColor: theme.palette.secondary.main,
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: theme.palette.primary.main,
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 24,
    height: 24,
    backgroundColor: theme.palette.grey[600],
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[300]}`,
    backgroundColor: theme.palette.grey[300],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <MuiSwitch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  )
})
