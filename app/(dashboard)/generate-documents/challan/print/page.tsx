import PrintableChallan from "@/components/challan/printable-challan"
import { ChallanTypes } from "@/types"

const PrintChallanPage = ({data}: {data: ChallanTypes[]}) => {
  return (
      <PrintableChallan data={data}/>
  )
}

export default PrintChallanPage
