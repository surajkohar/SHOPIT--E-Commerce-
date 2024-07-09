import React from 'react'
import {Helmet} from 'react-helmet'

const MetaData = (props) => {
  return (
    <div>
        <Helmet>
            <title>{`${props.title} - shopIT`}</title>
        </Helmet>
    </div>
  )
}

export default MetaData