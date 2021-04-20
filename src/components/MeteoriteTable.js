import React, { useState } from 'react'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  IconButton,
  makeStyles,
} from '@material-ui/core'
import { Star, StarBorder } from '@material-ui/icons'
import { mutate } from 'swr'
import Highlighter from 'react-highlight-words'
import { useQueryParam, StringParam } from 'use-query-params'

import { useData } from '../useData'
import { useFavorites, LOCAL_STORAGE_KEY } from '../useFavorites'

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

const headCells = [
  { id: 'id', numeric: false, disablePadding: true, label: 'ID' },
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'recclass', numeric: true, disablePadding: false, label: 'Recclass' },
  { id: 'mass', numeric: true, disablePadding: false, label: 'Mass (g)' },
  { id: 'year', numeric: true, disablePadding: false, label: 'Year' },
  { id: 'fall', numeric: true, disablePadding: false, label: 'Fall' },
  { id: 'nametype', numeric: true, disablePadding: false, label: 'Name Type' },
  { id: 'geo', numeric: true, disablePadding: false, label: 'Geolocation' },
]

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>

        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}

              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

const useStyles = makeStyles((theme) => ({
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}))

/**
 * Page size
 */
const ROWS_PER_PAGE = 20

export const MeteoriteTable = () => {
  const classes = useStyles()

  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('calories')

  const [page, setPage] = useState(0)

  /**
   * Get saved meteorites from local storage
   */
  const favoriteMeteorites = useFavorites()

  /**
   * Query params
   */
  const [query] = useQueryParam('q', StringParam)

  /**
   * Get filtered data rows
   */
  const { data } = useData()

  /**
   * Empty state
   */
  if (data?.length === 0) {
    return (
      <Box
        flex="1"
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontWeight="bold"
        fontSize="28px"
        color="grey.800"
      >
        no results
      </Box>
    )
  }

  return (
    <Box py={2} px={2} flex="1">
      <Table className={classes.table} size="small">
        <EnhancedTableHead
          classes={classes}
          order={order}
          orderBy={orderBy}
          onRequestSort={(event, property) => {
            const isAsc = orderBy === property && order === 'asc'
            setOrder(isAsc ? 'desc' : 'asc')
            setOrderBy(property)
          }}
        />
        <TableBody>
          {stableSort(data || [], getComparator(order, orderBy))
            .slice(page * ROWS_PER_PAGE, page * ROWS_PER_PAGE + ROWS_PER_PAGE)
            .map((row) => {
              const isFavorite = favoriteMeteorites.includes(row.id)

              return (
                <TableRow key={row.id}>
                  <TableCell padding="checkbox">
                    <IconButton
                      onClick={async () => {
                        let newFavorites = favoriteMeteorites

                        /**
                         * Add or remove the favorite
                         */
                        if (isFavorite) {
                          newFavorites = favoriteMeteorites.filter((id) => id !== row.id)
                        } else {
                          newFavorites = [...favoriteMeteorites, row.id]
                        }

                        /**
                         * Set local storage, and invalidate state
                         */
                        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newFavorites))
                        await mutate('favorites')
                      }}
                    >
                      {isFavorite ? <Star color="secondary" /> : <StarBorder />}
                    </IconButton>
                  </TableCell>

                  <TableCell component="th" scope="row" padding="none">
                    <Highlighter
                      searchWords={[query]}
                      textToHighlight={row.id}
                      highlightClassName="filter-highlight"
                    />
                  </TableCell>
                  <TableCell component="th" scope="row" padding="none">
                    <Highlighter
                      searchWords={[query]}
                      textToHighlight={row.name}
                      highlightClassName="filter-highlight"
                    />
                  </TableCell>
                  <TableCell align="right">{row.recclass}</TableCell>
                  <TableCell align="right">{row.mass}</TableCell>
                  <TableCell align="right">{row.year?.slice(0, 4) || null} </TableCell>
                  <TableCell align="right">{row.fall}</TableCell>
                  <TableCell align="right">{row.nametype}</TableCell>
                  <TableCell align="right">
                    ({row.reclong}, {row.reclat})
                  </TableCell>
                </TableRow>
              )
            })}

          {data?.length > 0 && (
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[ROWS_PER_PAGE]}
                count={data.length}
                rowsPerPage={ROWS_PER_PAGE}
                page={page}
                onChangePage={(event, newPage) => setPage(newPage)}
              />
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  )
}
