import React from 'react'
import { FaSearch } from "react-icons/fa";
import classes from './NoData.module.css'
const NoData = ({text="No data found"}) => {
  return (
    <div className={classes.no_data}>
        <FaSearch /> 
        <h6>{text}</h6>
    </div>
  )
}

export default NoData