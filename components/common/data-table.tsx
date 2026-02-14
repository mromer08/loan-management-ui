"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type ServerPagination = {
  pageIndex: number
  pageSize: number
  pageCount: number
  totalRows: number
  onPageChange: (pageIndex: number) => void
  onPageSizeChange: (pageSize: number) => void
}

interface DataTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData, unknown>[]
  pageSize?: number
  emptyMessage?: string
  isLoading?: boolean
  serverPagination?: ServerPagination
}

export function DataTable<TData>({
  data,
  columns,
  pageSize = 10,
  emptyMessage = "No hay registros",
  isLoading = false,
  serverPagination,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [rowSelection, setRowSelection] = React.useState({})
  const [clientPagination, setClientPagination] = React.useState({
    pageIndex: 0,
    pageSize,
  })

  React.useEffect(() => {
    setClientPagination((previous) => ({
      ...previous,
      pageSize,
    }))
  }, [pageSize])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
      pagination: {
        pageIndex: serverPagination?.pageIndex ?? clientPagination.pageIndex,
        pageSize: serverPagination?.pageSize ?? clientPagination.pageSize,
      },
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: serverPagination ? undefined : setClientPagination,
    manualPagination: Boolean(serverPagination),
    pageCount: serverPagination?.pageCount,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...(serverPagination ? {} : { getPaginationRowModel: getPaginationRowModel() }),
  })

  const currentPageIndex =
    serverPagination?.pageIndex ?? table.getState().pagination.pageIndex
  const currentPageSize =
    serverPagination?.pageSize ?? table.getState().pagination.pageSize
  const currentPageCount = serverPagination?.pageCount ?? table.getPageCount()
  const totalRows =
    serverPagination?.totalRows ?? table.getPrePaginationRowModel().rows.length

  const canPreviousPage =
    serverPagination ? currentPageIndex > 0 : table.getCanPreviousPage()
  const canNextPage = serverPagination
    ? currentPageIndex + 1 < currentPageCount
    : table.getCanNextPage()

  const handlePageSizeChange = (value: string) => {
    const nextPageSize = Number(value)

    if (serverPagination) {
      serverPagination.onPageSizeChange(nextPageSize)
      return
    }

    setClientPagination({
      pageIndex: 0,
      pageSize: nextPageSize,
    })
  }

  const goToFirstPage = () => {
    if (serverPagination) {
      serverPagination.onPageChange(0)
      return
    }

    table.setPageIndex(0)
  }

  const goToPreviousPage = () => {
    if (serverPagination) {
      serverPagination.onPageChange(Math.max(0, currentPageIndex - 1))
      return
    }

    table.previousPage()
  }

  const goToNextPage = () => {
    if (serverPagination) {
      serverPagination.onPageChange(
        Math.min(currentPageCount - 1, currentPageIndex + 1)
      )
      return
    }

    table.nextPage()
  }

  const goToLastPage = () => {
    if (serverPagination) {
      serverPagination.onPageChange(Math.max(0, currentPageCount - 1))
      return
    }

    table.setPageIndex(Math.max(0, table.getPageCount() - 1))
  }

  return (
    <>
      <div className="flex items-center justify-between px-4">
        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
          {`Registros totales: ${totalRows}`}
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Registros por pagina:
            </Label>
            <Select value={`${currentPageSize}`} onValueChange={handlePageSizeChange}>
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue placeholder={currentPageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((sizeOption) => (
                  <SelectItem key={sizeOption} value={`${sizeOption}`}>
                    {sizeOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Pagina {currentPageCount > 0 ? currentPageIndex + 1 : 0} de {currentPageCount}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={goToFirstPage}
              disabled={!canPreviousPage}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={goToPreviousPage}
              disabled={!canPreviousPage}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={goToNextPage}
              disabled={!canNextPage}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={goToLastPage}
              disabled={!canNextPage}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table className="rounded-lg border">
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-4 text-center">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-4 text-center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
