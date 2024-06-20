export interface PaginatedResult<T> {
    data: T[]
    total: number
    page: number
    perPage: number
  }
  
  export function paginate<T>(data: T[], page: number, perPage: number): PaginatedResult<T> {
    if (perPage <= 0) {
      throw new Error('perPage argument must be greater than 0.')
    }
  
    // handle perPage being greater than data length
    perPage = Math.min(perPage, data.length)
  
    // handle page being greater than total pages
    const total = Math.ceil(data.length / perPage) || 0
    page = Math.min(page, total)
  
    // calculate the start and end indices of the current page.
    const startIndex = (page - 1) * perPage
    const endIndex = Math.min(startIndex + perPage, data.length)
  
    // slice the data array to get the current page of data.
    const currentPageData = data.slice(startIndex, endIndex)
  
    return {
      data: currentPageData,
      total,
      page,
      perPage,
    }
  }
  