interface TableProps<T extends { [key in string]: string | boolean | number }> {
  titleHeader: string[]
  items: T[] | null
}

export const BasicTable = <T extends { [key in string]: string | boolean | number }>(
  props: TableProps<T>
) => {
  return props.items === null ? (
    <p>{'データがありません。'}</p>
  ) : (
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full text-left text-sm font-light">
              <thead className="border-b font-medium dark:border-neutral-500">
                <tr>
                  {props.titleHeader.map((title, index) => {
                    return (
                      <th key={index} scope="col" className="px-6 py-4">
                        {title}
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {props.items?.map((item, index) => {
                  return <Row key={index} titleHeader={props.titleHeader} item={item} />
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

interface RowProps<T extends { [key in string]: string | boolean | number }> {
  titleHeader: string[]
  item: T
}

const Row = <T extends { [key in string]: string | boolean | number }>(props: RowProps<T>) => {
  return (
    <tr className="border-b dark:border-neutral-500">
      {props.titleHeader.map((element, index) => {
        return <td key={index} className="whitespace-nowrap px-6 py-4 font-medium">{typeof props.item[element] === 'boolean' ? convertBooleanToString(props.item[element]) : props.item[element] }</td>
      })}
    </tr>
  )
}

const convertBooleanToString = (value: boolean) => {
  return value ? '有効' : '無効'
}