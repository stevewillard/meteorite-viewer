/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react'
import ReactEcharts from 'echarts-for-react'
import { Box, useTheme } from '@material-ui/core'
import { useQueryParam, NumberParam } from 'use-query-params'

import { useData } from '../useData'

/**
 * Renders a histogram of the years
 */
export const YearHistogram = ({ onClickBar = () => {} }) => {
  const chartRef = useRef()
  const theme = useTheme()

  /**
   * Query params
   */
  const [year, setYear] = useQueryParam('year', NumberParam)

  /**
   * Get filtered data rows
   */
  const { data } = useData()

  /**
   * Year -> count
   */
  const yearBuckets = {}

  data?.forEach((row) => {
    const year = parseInt(row.year?.slice(0, 4))

    if (!year) {
      return
    }

    if (yearBuckets[year]) {
      yearBuckets[year] += 1
    } else {
      yearBuckets[year] = 1
    }
  })

  /**
   * Order buckets by year
   */
  const yearBucketsOrdered = Object.keys(yearBuckets)
    .sort()
    .reduce((obj, key) => {
      obj[key] = yearBuckets[key]
      return obj
    }, {})

  /**
   * Year change
   */
  useEffect(() => {
    const chartInstance = chartRef?.current?.getEchartsInstance()

    /**
     * Handle clicking on a bar
     */
    chartInstance.off('click')
    chartInstance.on('click', (params) => {
      const newYear = parseInt(Object.keys(yearBucketsOrdered)[params.dataIndex])

      if (year === newYear) {
        setYear(undefined)
      } else {
        setYear(newYear)
      }
    })
  }, [year])

  return (
    <Box height="140px" width="100%" px={2}>
      <ReactEcharts
        ref={chartRef}
        option={{
          animationDuration: 200,
          grid: {
            top: '16',
            right: '8',
            bottom: '24',
            left: '48',
          },
          tooltip: {
            hideDelay: 0,
            transitionDuration: 0,
            borderRadius: 0,
            backgroundColor: 'black',
            color: 'white',
            borderWidth: 0,
            position: function (mousePosition) {
              return [mousePosition[0], mousePosition[1] - 65]
            },
          },
          xAxis: {
            axisLine: {
              lineStyle: {
                color: '#fff',
              },
            },
            type: 'category',
            data: Object.keys(yearBucketsOrdered),
          },
          yAxis: {
            type: 'value',
            splitLine: {
              lineStyle: {
                color: 'transparent',
              },
            },
            axisLine: {
              lineStyle: {
                color: 'transparent',
              },
            },
            axisLabel: {
              fontSize: 12,
              color: '#9e9e9e',
              fontFamily: 'Helvetica',
              fontWeight: 'bold',
            },
          },
          series: [
            {
              data: Object.values(yearBucketsOrdered),
              type: 'bar',
              itemStyle: {
                color: theme.palette.secondary.light,
                borderRadius: [3, 3, 0, 0],
              },
            },
          ],
        }}
        style={{ width: '100%', height: '100%' }}
      />
    </Box>
  )
}
