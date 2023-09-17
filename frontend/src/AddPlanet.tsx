import {Button} from "@mui/material"
import React from 'react'

const AddPlanet = (props: { onClick: React.MouseEventHandler<HTMLButtonElement> }) => {
  return (
    <div>
      <Button variant="contained" onClick={props.onClick}>One planet, please!</Button>
    </div>
  )
}

export default AddPlanet