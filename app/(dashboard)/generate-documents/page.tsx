import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const Generate = () => {
  return (
      <Link href="/generate-documents/challan">
        <Button>Generate Challan</Button>
      </Link>
  )
}

export default Generate
