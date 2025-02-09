import React, { Fragment } from 'react'
import SectionGeneral from './Sections/SectionGeneral'
import SectionPhone from './Sections/SectionPhone'
import SectionAddress from './Sections/SectionAddress'
import SectionContacts from './Sections/SectionContacts'
import SectionDocuments from './Sections/SectionDocuments'

function Sections() {
  return (
    <Fragment>
      <SectionGeneral />
      <SectionPhone />
      <SectionAddress />
      <SectionContacts />
      <SectionDocuments />
    </Fragment>
  )
}

export default Sections