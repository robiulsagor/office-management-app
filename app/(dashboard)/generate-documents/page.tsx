import PrintableChallanPage from '@/components/challan/printable-challan'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const Generate = () => {
  return (
    <div>
      <Link href="/generate-documents/challan">
        <Button>Generate Challan</Button>
      </Link>

      <PrintableChallanPage />
    </div>
  )
}

export default Generate
