import React from 'react'
import { Box, CircularProgress } from '@material-ui/core'

import { Header } from 'components/Header'
import { Map } from 'components/Map'
import { MeteoriteTable } from 'components/MeteoriteTable'
import { YearHistogram } from 'components/YearHistogram'

import { useData } from '../useData'

export const App = () => {
  /**
   * Get filtered data rows
   */
  const { data, isValidating } = useData()

  /**
   * Loading state
   */
  if (!data && isValidating) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" height="100vh" width="100%">
        <CircularProgress color="secondary" size={48} />
      </Box>
    )
  }

  return (
    <>
      {/**
       * Header
       */}
      <Header />

      <Box display="flex" flexDirection="column" flex="1">
        {/**
         * Map
         */}
        <Map />

        {/**
         * Year histogram
         */}
        <YearHistogram />

        {/**
         * Content
         */}
        <MeteoriteTable />
      </Box>
    </>
  )
}
