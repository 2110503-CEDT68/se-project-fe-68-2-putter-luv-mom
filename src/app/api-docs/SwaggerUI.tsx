'use client'

import SwaggerUIReact from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'
import spec from './openapi'

export default function SwaggerUI() {
  return (
    <SwaggerUIReact
      spec={spec}
      docExpansion="list"
      defaultModelsExpandDepth={-1}
    />
  )
}
