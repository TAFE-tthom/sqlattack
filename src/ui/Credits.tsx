import '../styles/Credits.css';


/**
 * CreditTuple, name and reasons are able to listed
 */
export type CreditTuple = {
  name: string
  reasons: Array<string>
}

/**
 * CreditsData, will contain names and reason
 */
export type CreditsData = {
  credits: Array<CreditTuple>,
}


/**
 * CreditEntry, used to render an entry
 */
export const CreditEntry = (props: CreditTuple) => {
  const { name, reasons } = props;
  
    const reasonsRender = reasons.map((r) => {
      return (
        <li className={'reasonEntry'}>
          {r}
        </li>
      )
    })

  return (<li className={'creditEntry'}>
      <div className={'creditName'}>
        {name}
      </div>
      <ul className={'reasonList'}>
      {reasonsRender}
      </ul>
    </li>)
}


/**
 * CreditsComponent, allows to list anyone who
 * wants to be listed as helping and finding issues
 * with this software.
 */
export const CreditsComponent = (props: CreditsData) => {
  const entries = props.credits;

  const creditEntries = entries.map((e) => {
    const { name, reasons } = e;
    return (<CreditEntry name={name} reasons={reasons} />)
  })

  return (
    <div className={'creditsList'}>
      <ul className={'entryList'}>
        {creditEntries}
      </ul>
    </div>
  )
}
